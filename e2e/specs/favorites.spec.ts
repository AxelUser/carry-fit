import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures/test';
import { getAirlineAllowances } from '../helpers/ui';

const favoritesOnlyToggle = (page: Page) => page.getByLabel('Favorites only');
const favoritesCount = (page: Page) => page.getByTestId('favorites-count');
const favoriteButtonAt = (page: Page, index: number) =>
	getAirlineAllowances(page).nth(index).getByTestId('favorite-button');
const airlineNameAt = (page: Page, index: number) =>
	getAirlineAllowances(page).nth(index).getByTestId('airline-name');
const regionsFilterList = (page: Page) => page.getByTestId('regions-filter-list');

test.describe('Favorites functionality', () => {
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
