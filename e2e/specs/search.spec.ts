import { test, expect } from '../fixtures/test';
import { getAirlineAllowances } from '../helpers/ui';

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
