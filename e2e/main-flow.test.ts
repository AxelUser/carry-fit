import { test, expect } from '@playwright/test';

test.describe('CarryFit Main Flow', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });
	});

	test('should display airline allowances table by default', async ({ page }) => {
		// Check table headers
		const headers = ['Airline', 'Region', 'Carry-On (cm)', 'Weight Limit', 'Policy'];
		for (const header of headers) {
			await expect(page.getByRole('columnheader', { name: header })).toBeVisible();
		}

		// Verify some airlines are visible
		await expect(page.getByRole('cell', { name: /Finnair/i })).toBeVisible();
	});

	test('should only show compliance score when dimensions are entered', async ({ page }) => {
		// Initially compliance score should not be visible
		await expect(page.getByText(/Compliance:/)).not.toBeVisible();

		// Enter bag dimensions
		await page.getByLabel('Height').fill('50');
		await page.getByLabel('Width').fill('40');
		await page.getByLabel('Depth').fill('25');

		// Compliance score should now be visible
		await expect(page.getByText(/Compliance Score/)).toBeVisible();
		await expect(page.getByText(/%/)).toBeVisible();
		await expect(page.getByText(/\d+ out of \d+ selected airlines/)).toBeVisible();
	});

	test('should update units in table when input unit changes', async ({ page }) => {
		// Check initial CM units (metric system)
		await expect(page.getByRole('columnheader', { name: 'Carry-On (cm)' })).toBeVisible();

		// Switch to imperial system
		await page.getByRole('button', { name: /Imperial/i }).click();

		// Verify units changed in table
		await expect(page.getByRole('columnheader', { name: 'Carry-On (in)' })).toBeVisible();

		// Check weight units changed (find a cell with both kg and lb values)
		for (const weightCell of await page.getByRole('row').getByTestId('weight-limit').all()) {
			await expect(weightCell.getByText(/lb|N\/A/)).toBeVisible();
		}

		// Switch back to metric and verify kg is shown
		await page.getByRole('button', { name: /Metric/i }).click();

		for (const weightCell of await page.getByRole('row').getByTestId('weight-limit').all()) {
			await expect(weightCell.getByText(/kg|N\/A/)).toBeVisible();
		}
	});

	test('should filter airlines by region', async ({ page }) => {
		// Get initial number of rows
		const initialRows = await page.getByRole('row').count();

		// Deselect all regions except one
		const europeCheckbox = page.getByRole('button', { name: 'Europe' });
		await page.getByText('Clear All').click();
		await europeCheckbox.click();

		// Get filtered number of rows and verify it's less than initial
		const filteredRows = await page.getByRole('row').count();
		expect(filteredRows).toBeLessThan(initialRows);

		// Verify all visible airlines are from Europe
		const regionCells = page.getByRole('cell', { name: 'Europe' });
		const regionCount = await regionCells.count();
		expect(regionCount).toBeGreaterThan(0);
		expect(regionCount).toBe(filteredRows - 1);
	});

	test('should sort airlines correctly', async ({ page }) => {
		// Test sorting by airline name
		const airlineSortButton = page.getByRole('button', { name: /^Airline/ });
		await airlineSortButton.click();

		// Get airlines in ascending order
		const ascAirlines = await page.$$eval('tbody tr td:nth-child(2)', (cells) =>
			cells.map((cell) => cell.textContent?.trim())
		);

		// Click again to change to descending
		await airlineSortButton.click();

		// Get airlines in descending order
		const descAirlines = await page.$$eval('tbody tr td:nth-child(2)', (cells) =>
			cells.map((cell) => cell.textContent?.trim())
		);

		// Verify orders are opposite
		expect(ascAirlines).not.toEqual(descAirlines);
		expect(ascAirlines).toEqual([...descAirlines].reverse());
	});
});
