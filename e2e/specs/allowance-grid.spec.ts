import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures/test';
import { getAirlineAllowances } from '../helpers/ui';

const allowancesGrid = (page: Page) => page.getByTestId('allowances-grid');
const sortButton = (page: Page) => page.getByRole('button', { name: 'Sort airlines', exact: true });
const airlineNames = (page: Page) => getAirlineAllowances(page).getByTestId('airline-name');

test.describe('Allowance grid interaction', () => {
	test.beforeEach(async ({ app }) => {
		await app.gotoHome();
	});

	test('should display airline allowances grid by default', async ({ page }) => {
		await expect(allowancesGrid(page)).toBeVisible();

		const cards = getAirlineAllowances(page);
		await expect(cards.first()).toBeVisible();

		// Verify we have multiple cards visible (virtual grid should show several)
		const visibleCardCount = await cards.count();
		expect(visibleCardCount).toBeGreaterThanOrEqual(1);

		await expect(airlineNames(page).filter({ hasText: /^Aeroflot$/ })).toBeVisible();
	});

	test('should sort airlines correctly', async ({ page }) => {
		await expect(allowancesGrid(page)).toBeVisible();

		// Get first 3-5 visible airline names before sorting (should be in ascending order)
		const initialVisibleNames = (await airlineNames(page).allTextContents())
			.slice(0, 3)
			.map((name) => name.trim());
		expect(initialVisibleNames.length).toBeGreaterThan(1);

		// Verify initial order is ascending
		const initialSortedAsc = [...initialVisibleNames].sort((a, b) => a.localeCompare(b));
		expect(initialVisibleNames).toEqual(initialSortedAsc);

		await sortButton(page).click();

		// Get the new visible airline names after sorting (should be in descending order)
		const updatedVisibleNames = (await airlineNames(page).allTextContents())
			.slice(0, 3)
			.map((name) => name.trim());

		// Verify the order is now descending
		const updatedSortedDesc = [...updatedVisibleNames].sort((a, b) => b.localeCompare(a));
		expect(updatedVisibleNames).toEqual(updatedSortedDesc);

		// Click sort again to reverse back to ascending
		await sortButton(page).click();

		// Get names after second sort (should be back to ascending order)
		const finalVisibleNames = (await airlineNames(page).allTextContents())
			.slice(0, 3)
			.map((name) => name.trim());

		// Verify we're back to ascending order
		const finalSortedAsc = [...finalVisibleNames].sort((a, b) => a.localeCompare(b));
		expect(finalVisibleNames).toEqual(finalSortedAsc);
	});
});

test.describe('Allowance grid search functionality', () => {
	test.beforeEach(async ({ app }) => {
		await app.gotoHome();
	});

	test('should filter airlines by search term', async ({ page }) => {
		const initialRows = await getAirlineAllowances(page).count();
		expect(initialRows).toBeGreaterThan(1);

		await page.getByTestId('search-input').fill('Finnair');

		const filteredRows = await getAirlineAllowances(page).count();
		expect(filteredRows).toBe(1);

		await expect(getAirlineAllowances(page).getByTestId('airline-name')).toHaveText('Finnair');
	});

	test('should show empty state when no airlines match search', async ({ page }) => {
		await page.getByTestId('search-input').fill('NonexistentAirline');

		await expect(getAirlineAllowances(page)).toHaveCount(0);
		await expect(page.getByTestId('empty-state')).toBeVisible();
	});

	test('should clear search when X button is clicked', async ({ page }) => {
		const initialRows = await page.getByTestId('airline-name').count();

		await page.getByTestId('search-input').fill('Finnair');

		const filteredRows = await getAirlineAllowances(page).count();
		expect(filteredRows).toBe(1);

		await page.getByTestId('search-clear-button').click();

		const finalRows = await getAirlineAllowances(page).count();
		expect(finalRows).toBe(initialRows);
	});

	test('should handle case-insensitive search', async ({ page }) => {
		const searchTerms = ['finnair', 'FINNAIR', 'FiNnAiR'];

		for (const term of searchTerms) {
			await page.getByTestId('search-input').fill(term);

			expect(await page.getByTestId('airline-name').count()).toBe(1);
			await expect(page.getByTestId('airline-name')).toHaveText('Finnair');
		}
	});
});
