import { test, expect } from '../fixtures/test';
import { getAirlineAllowances } from '../helpers/ui';

test.describe('Filter Regions', () => {
	test.beforeEach(async ({ app }) => {
		await app.gotoHome();
	});

	test('should filter airlines by region', async ({ page }) => {
		const initialCount = await getAirlineAllowances(page).count();
		expect(initialCount).toBeGreaterThan(0);

		const europeCheckbox = page
			.getByTestId('regions-filter-list')
			.getByRole('button', { name: 'Europe' });
		await page.getByText('Clear All').click();
		await europeCheckbox.click();

		const filteredAllowances = getAirlineAllowances(page);
		const filteredCount = await filteredAllowances.count();

		expect(filteredCount).toBeGreaterThan(0);

		for (const regionCell of await filteredAllowances.getByTestId('region').all()) {
			await expect(regionCell).toHaveText('Europe');
		}
	});

	test('should persist selected regions across page reloads', async ({ app, page }) => {
		const europeButton = page.getByRole('button', { name: 'Europe' });
		await page.getByText('Clear All').click();
		await europeButton.click();

		await page.reload();
		await app.expectReady();

		await expect(europeButton).toHaveAttribute('data-selected', 'true');
		const otherRegionButtons = await page
			.getByTestId('regions-filter-list')
			.getByRole('button')
			.filter({ hasNotText: 'Europe' })
			.all();
		for (const button of otherRegionButtons) {
			await expect(button).not.toHaveAttribute('data-selected', 'true');
		}
	});
});
