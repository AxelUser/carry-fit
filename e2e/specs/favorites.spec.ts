import { test, expect } from '../fixtures/test';

test.describe('Favorites functionality', () => {
	test.beforeEach(async ({ app }) => {
		await app.gotoHome({ waitForAllowances: true });
	});

	test('should add and remove airlines from favorites', async ({ page }) => {
		const firstAirlineRow = page.getByTestId('airline-card').nth(1);

		await expect(firstAirlineRow.getByTestId('favorite-button')).toHaveAttribute(
			'data-favorite',
			'false'
		);

		await firstAirlineRow.getByTestId('favorite-button').click();

		await expect(firstAirlineRow.getByTestId('favorite-button')).toHaveAttribute(
			'data-favorite',
			'true'
		);

		await firstAirlineRow.getByTestId('favorite-button').click();

		await expect(firstAirlineRow.getByTestId('favorite-button')).toHaveAttribute(
			'data-favorite',
			'false'
		);
	});

	test('should filter airlines by favorites', async ({ page }) => {
		const initialAirlineCount = (await page.getByTestId('airline-card').count()) - 1;

		await page.getByTestId('airline-card').nth(1).getByTestId('favorite-button').click();
		await page.getByTestId('airline-card').nth(2).getByTestId('favorite-button').click();

		await page.getByLabel('Favorites only').check();

		await expect(page.getByTestId('allowances-grid')).toBeVisible();

		const filteredAirlineCount = (await page.getByRole('row').count()) - 1;
		expect(filteredAirlineCount).toBe(2);
		expect(filteredAirlineCount).toBeLessThan(initialAirlineCount);

		const visibleButtons = await page.getByTestId('favorite-button').all();
		for (const button of visibleButtons) {
			await expect(button).toHaveAttribute('data-favorite', 'true');
		}
	});

	test('should persist favorites across page reloads', async ({ page }) => {
		const firstAirlineRow = page.getByTestId('airline-card').nth(1);
		await firstAirlineRow.getByTestId('favorite-button').click();

		await page.reload();
		await expect(page.getByTestId('allowances-grid')).toBeVisible();

		await expect(
			page.getByTestId('airline-card').nth(1).getByTestId('favorite-button')
		).toHaveAttribute('data-favorite', 'true');
	});

	test('should update favorites count in filter section', async ({ page }) => {
		await expect(page.getByTestId('favorites-count')).not.toBeVisible();

		await page.getByTestId('airline-card').nth(1).getByTestId('favorite-button').click();
		await page.getByTestId('airline-card').nth(2).getByTestId('favorite-button').click();

		await expect(page.getByTestId('favorites-count')).toHaveText('2 airlines');

		await page.getByTestId('airline-card').nth(1).getByTestId('favorite-button').click();

		await expect(page.getByTestId('favorites-count')).toHaveText('1 airline');
	});

	test('should disable region filters that have no favorites when favorites filter is active', async ({
		page
	}) => {
		const firstAirlineRow = page.getByTestId('airline-card').nth(1);
		const region = await firstAirlineRow.getByTestId('region').textContent();
		await firstAirlineRow.getByTestId('favorite-button').click();

		await page.getByLabel('Favorites only').check();

		const regionButtons = page
			.getByTestId('regions-filter-list')
			.getByRole('button')
			.filter({ hasText: new RegExp(`^${region}$`) });
		for (const button of await regionButtons.all()) {
			await expect(button).toBeDisabled();
		}

		const favoriteRegionButton = page
			.getByTestId('regions-filter-list')
			.getByRole('button', { name: region! });
		await expect(favoriteRegionButton).not.toBeDisabled();
	});

	test('should persist entire favorites list across page reloads', async ({ page }) => {
		const airlineRows = [1, 2, 3];
		const favoriteAirlineNames: string[] = [];

		for (const rowIndex of airlineRows) {
			const row = page.getByTestId('airline-card').nth(rowIndex);
			const airlineName = await row.getByTestId('airline-name').textContent();
			favoriteAirlineNames.push(airlineName!);
			await row.getByTestId('favorite-button').click();
		}

		await expect(page.getByTestId('favorites-count')).toHaveText('3 airlines');

		await page.reload();
		await expect(page.getByTestId('allowances-grid')).toBeVisible();

		await expect(page.getByTestId('favorites-count')).toHaveText('3 airlines');

		await page.getByLabel('Favorites only').check();

		for (const airlineName of favoriteAirlineNames) {
			await expect(
				page.getByTestId('airline-name').filter({ hasText: new RegExp(`^${airlineName}$`) })
			).toBeVisible();
		}

		const visibleButtons = await page.getByTestId('favorite-button').all();
		expect(visibleButtons).toHaveLength(favoriteAirlineNames.length);
		for (const button of visibleButtons) {
			await expect(button).toHaveAttribute('data-favorite', 'true');
		}
	});
});
