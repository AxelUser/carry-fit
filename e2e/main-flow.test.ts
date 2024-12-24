import { test, expect } from '@playwright/test';

test.describe('CarryFit Main Flow', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });
	});

	test('should display airline allowances table by default', async ({ page }) => {
		// Check table headers
		const headers = ['Airline', 'Region', 'Dimensions (cm)', 'Weight Limit', 'Policy'];
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
		await expect(page.getByText(/Compliance:/)).toBeVisible();
		await expect(page.getByText(/%/)).toBeVisible();
		await expect(page.getByText(/of airlines/)).toBeVisible();
	});

	test('should update units in table when input unit changes', async ({ page }) => {
		// Check initial CM units
		await expect(page.getByRole('columnheader', { name: 'Dimensions (cm)' })).toBeVisible();

		// Switch to inches
		await page.getByLabel('Unit').selectOption('in');

		// Verify units changed in table
		await expect(page.getByRole('columnheader', { name: 'Dimensions (in)' })).toBeVisible();

		// Check weight units changed (find a cell with both kg and lb values)
		for (const weightCell of await page.getByRole('row').getByTestId('weight-limit').all()) {
			await expect(weightCell.getByText(/lb|N\/A/)).toBeVisible();
		}

		// Switch back to CM and verify kg is shown
		await page.getByLabel('Unit').selectOption('cm');

		for (const weightCell of await page.getByRole('row').getByTestId('weight-limit').all()) {
			await expect(weightCell.getByText(/kg|N\/A/)).toBeVisible();
		}
	});

	test('should filter airlines by region', async ({ page }) => {
		// Get initial number of rows
		const initialRows = await page.getByRole('row').count();

		// Deselect all regions except one
		const europeCheckbox = page.getByRole('button', { name: 'Europe' });
		await page.getByText('Unselect All').click();
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
		const sortByButton = page.getByRole('combobox').filter({ hasText: /Sort by/ });
		await sortByButton.selectOption('airline');

		// Get airlines in ascending order
		const ascAirlines = await page.$$eval('tbody tr td:first-child', (cells) =>
			cells.map((cell) => cell.textContent?.trim())
		);

		// Click sort button to change to descending
		await page.getByRole('button', { name: '↑' }).click();

		// Get airlines in descending order
		const descAirlines = await page.$$eval('tbody tr td:first-child', (cells) =>
			cells.map((cell) => cell.textContent?.trim())
		);

		// Verify orders are opposite
		expect(ascAirlines).not.toEqual(descAirlines);
		expect(ascAirlines).toEqual([...descAirlines].reverse());

		// Test sorting by region
		await sortByButton.selectOption('region');

		// Get regions in ascending order
		const descRegions = await page.$$eval('tbody tr td:nth-child(2)', (cells) =>
			cells.map((cell) => cell.textContent?.trim())
		);

		// Verify regions are sorted
		const sortedRegions = [...descRegions].sort().reverse();
		expect(descRegions).toEqual(sortedRegions);
	});
});
