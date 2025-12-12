import { test, expect } from '../fixtures/test';

test.describe('Filter Regions', () => {
	test.beforeEach(async ({ app }) => {
		await app.gotoHome({ waitForAllowances: true });
	});

	test('should filter airlines by region', async ({ page }) => {
		const initialRows = await page.getByRole('row').count();
		expect(initialRows).toBeGreaterThan(0);

		const europeCheckbox = page.getByRole('button', { name: 'Europe' });
		await page.getByText('Clear All').click();
		await europeCheckbox.click();

		await expect(page.getByRole('table')).toBeVisible();

		const filteredRows = await page.getByRole('row').count();
		expect(filteredRows).toBeLessThan(initialRows);

		const regionCells = page.getByRole('cell', { name: 'Europe' });
		const regionCount = await regionCells.count();
		expect(regionCount).toBeGreaterThan(0);
		expect(regionCount).toBe(filteredRows - 1);
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
