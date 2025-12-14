import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures/test';
import { getAirlineAllowances } from '../helpers/ui';

test.describe('Favorites functionality', () => {
	const favoritesOnlyToggle = (page: Page) => page.getByLabel('Favorites only');
	const favoritesCount = (page: Page) => page.getByTestId('favorites-count');
	const favoriteButtonAt = (page: Page, index: number) =>
		getAirlineAllowances(page).nth(index).getByTestId('favorite-button');
	const airlineNameAt = (page: Page, index: number) =>
		getAirlineAllowances(page).nth(index).getByTestId('airline-name');
	const regionsFilterList = (page: Page) => page.getByTestId('regions-filter-list');

	test.beforeEach(async ({ app }) => {
		await app.gotoHome();
	});

	test('should add and remove airlines from favorites', async ({ page }) => {
		const favoriteButton = favoriteButtonAt(page, 0);

		await expect(favoriteButton).toHaveAttribute('data-favorite', 'false');

		await favoriteButton.click();
		await expect(favoriteButton).toHaveAttribute('data-favorite', 'true');

		await favoriteButton.click();
		await expect(favoriteButton).toHaveAttribute('data-favorite', 'false');
	});

	test('should filter airlines by favorites', async ({ page }) => {
		const initialAirlineCount = await getAirlineAllowances(page).count();

		await favoriteButtonAt(page, 0).click();
		await favoriteButtonAt(page, 1).click();

		await favoritesOnlyToggle(page).check();

		await expect(page.getByTestId('allowances-grid')).toBeVisible();

		const filteredAirlineCount = await getAirlineAllowances(page).count();
		expect(filteredAirlineCount).toBe(2);
		expect(filteredAirlineCount).toBeLessThan(initialAirlineCount);

		const visibleButtons = await getAirlineAllowances(page).getByTestId('favorite-button').all();
		for (const button of visibleButtons) {
			await expect(button).toHaveAttribute('data-favorite', 'true');
		}
	});

	test('should persist favorites across page reloads', async ({ page }) => {
		await favoriteButtonAt(page, 0).click();

		await page.reload();
		await expect(page.getByTestId('allowances-grid')).toBeVisible();

		await expect(favoriteButtonAt(page, 0)).toHaveAttribute('data-favorite', 'true');
	});

	test('should update favorites count in filter section', async ({ page }) => {
		await expect(favoritesCount(page)).not.toBeVisible();

		await favoriteButtonAt(page, 0).click();
		await favoriteButtonAt(page, 1).click();

		await expect(favoritesCount(page)).toHaveText('2 airlines');

		await favoriteButtonAt(page, 0).click();

		await expect(favoritesCount(page)).toHaveText('1 airline');
	});

	test('should disable region filters that have no favorites when favorites filter is active', async ({
		page
	}) => {
		const firstAirlineCard = getAirlineAllowances(page).first();
		const region = await firstAirlineCard.getByTestId('region').textContent();
		await favoriteButtonAt(page, 0).click();

		await favoritesOnlyToggle(page).check();

		const regionButtons = regionsFilterList(page)
			.getByRole('button')
			.filter({ hasText: new RegExp(`^${region}$`) });
		for (const button of await regionButtons.all()) {
			await expect(button).toBeDisabled();
		}

		const favoriteRegionButton = regionsFilterList(page).getByRole('button', { name: region! });
		await expect(favoriteRegionButton).not.toBeDisabled();
	});

	test('should persist entire favorites list across page reloads', async ({ page }) => {
		const airlineCards = [0, 1, 2];
		const favoriteAirlineNames: string[] = [];

		for (const rowIndex of airlineCards) {
			const airlineName = await airlineNameAt(page, rowIndex).textContent();
			favoriteAirlineNames.push(airlineName!);
			await favoriteButtonAt(page, rowIndex).click();
		}

		await expect(favoritesCount(page)).toHaveText('3 airlines');

		await page.reload();
		await expect(page.getByTestId('allowances-grid')).toBeVisible();

		await expect(favoritesCount(page)).toHaveText('3 airlines');

		await favoritesOnlyToggle(page).check();

		for (const airlineName of favoriteAirlineNames) {
			await expect(
				getAirlineAllowances(page)
					.getByTestId('airline-name')
					.filter({ hasText: new RegExp(`^${airlineName}$`) })
			).toBeVisible();
		}

		const visibleButtons = await getAirlineAllowances(page).getByTestId('favorite-button').all();
		expect(visibleButtons).toHaveLength(favoriteAirlineNames.length);
		for (const button of visibleButtons) {
			await expect(button).toHaveAttribute('data-favorite', 'true');
		}
	});
});

test.describe('Favorite Airlines Dialog', () => {
	function getPopover(page: Page) {
		return page.getByTestId('favorite-airlines-search-popover');
	}

	function getOptions(page: Page) {
		return getPopover(page).getByRole('option');
	}

	function getAirlineOption(page: Page, airline: string) {
		return getOptions(page).filter({ hasText: airline });
	}

	function getRemoveButton(page: Page, airline: string) {
		return page.getByRole('button').filter({ hasText: `Remove ${airline}` });
	}

	async function openSearchPopover(page: Page) {
		await page.getByTestId('favorite-airlines-search-button').click();
		await expect(getPopover(page)).toBeVisible();
	}

	async function closeSearchPopover(page: Page) {
		await page.getByTestId('favorite-airlines-search-button').click();
		await expect(getPopover(page)).not.toBeVisible();
	}

	async function openFavoriteAirlinesDialog(page: Page) {
		await page.getByRole('button', { name: /Manage favorite airlines/i }).click();
		await expect(page.getByTestId('favorite-airlines-dialog')).toBeVisible();
	}

	async function closeFavoriteAirlinesDialog(page: Page) {
		await page.getByTestId('favorite-airlines-dialog-close-button').click();
		await expect(page.getByTestId('favorite-airlines-dialog')).not.toBeVisible();
	}

	async function fillSearchQuery(page: Page, query: string) {
		const input = getPopover(page).getByPlaceholder('Search airlines...');
		await input.fill('', { timeout: 5000 });
		await expect(input).toHaveValue('');
		await input.fill(query, { timeout: 5000 });
		await expect(input).toHaveValue(query);
	}

	test.beforeEach(async ({ app, page }) => {
		await app.gotoHome();
		await openFavoriteAirlinesDialog(page);
	});

	test('should search and filter airlines in dialog', async ({ page }) => {
		await openSearchPopover(page);

		await expect(getOptions(page).first()).toBeVisible();
		const initialAirlines = await getOptions(page).count();
		expect(initialAirlines).toBeGreaterThan(0);

		await fillSearchQuery(page, 'Finnair');

		const filteredAirlines = await getOptions(page).count();
		expect(filteredAirlines).toBe(1);

		await expect(getOptions(page)).toContainText('Finnair');

		await fillSearchQuery(page, '');

		const finalAirlines = await getOptions(page).count();
		expect(finalAirlines).toBe(initialAirlines);
	});

	test('should add and remove airlines from favorites in dialog', async ({ page }) => {
		await expect(page.getByText('No favorite airlines selected')).toBeVisible();

		await openSearchPopover(page);
		await fillSearchQuery(page, 'Finnair');
		await getAirlineOption(page, 'Finnair').click();
		await closeSearchPopover(page);

		await expect(page.getByText('Selected Airlines (1)')).toBeVisible();
		await expect(getRemoveButton(page, 'Finnair')).toBeVisible();

		await openSearchPopover(page);
		await fillSearchQuery(page, 'Lufthansa');
		await getAirlineOption(page, 'Lufthansa').click();
		await closeSearchPopover(page);

		await expect(page.getByText('Selected Airlines (2)')).toBeVisible();
		await expect(getRemoveButton(page, 'Finnair')).toBeVisible();
		await expect(getRemoveButton(page, 'Lufthansa')).toBeVisible();

		await getRemoveButton(page, 'Finnair').click();

		await expect(page.getByText('Selected Airlines (1)')).toBeVisible();
		await expect(getRemoveButton(page, 'Finnair')).not.toBeVisible();
		await expect(getRemoveButton(page, 'Lufthansa')).toBeVisible();
	});

	test('should persist favorites after dialog is closed and reopened', async ({ page }) => {
		await openSearchPopover(page);
		await fillSearchQuery(page, 'Finnair');
		await getAirlineOption(page, 'Finnair').click();
		await fillSearchQuery(page, 'Lufthansa');
		await getAirlineOption(page, 'Lufthansa').click();
		await closeSearchPopover(page);

		await closeFavoriteAirlinesDialog(page);

		await openFavoriteAirlinesDialog(page);

		await expect(page.getByText('Selected Airlines (2)')).toBeVisible();
		await expect(getRemoveButton(page, 'Finnair')).toBeVisible();
		await expect(getRemoveButton(page, 'Lufthansa')).toBeVisible();
	});

	test('should persist favorites after page refresh', async ({ app, page }) => {
		await openSearchPopover(page);
		await fillSearchQuery(page, 'Finnair');
		await getAirlineOption(page, 'Finnair').click();
		await fillSearchQuery(page, 'Lufthansa');
		await getAirlineOption(page, 'Lufthansa').click();
		await closeSearchPopover(page);

		await closeFavoriteAirlinesDialog(page);

		await page.reload();
		await app.expectReady();

		await openFavoriteAirlinesDialog(page);

		await expect(page.getByText('Selected Airlines (2)')).toBeVisible();
		await expect(getRemoveButton(page, 'Finnair')).toBeVisible();
		await expect(getRemoveButton(page, 'Lufthansa')).toBeVisible();
	});

	test('should show checkmarks next to selected airlines in search list', async ({ page }) => {
		await openSearchPopover(page);
		await fillSearchQuery(page, 'Finnair');
		await getAirlineOption(page, 'Finnair').click();

		const option = getAirlineOption(page, 'Finnair');
		await expect(option.getByTestId('favorite-airline-check-icon')).toHaveClass(/opacity-100/);

		await fillSearchQuery(page, 'Lufthansa');
		const otherOption = getAirlineOption(page, 'Lufthansa');
		await expect(otherOption.getByTestId('favorite-airline-check-icon')).toHaveClass(/opacity-0/);
	});

	test('should handle fuzzy search matching', async ({ page }) => {
		const searchTerms = ['fin', 'fn', 'fair'];
		await openSearchPopover(page);

		for (const term of searchTerms) {
			await fillSearchQuery(page, term);

			await expect(getAirlineOption(page, 'Finnair')).toBeVisible();
		}

		await fillSearchQuery(page, 'xyz123');
		await expect(page.getByText('No airlines found.')).toBeVisible();
	});
});
