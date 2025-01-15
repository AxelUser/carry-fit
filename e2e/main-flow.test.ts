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

	test('should handle dimension unit conversion correctly', async ({ page }) => {
		// Enter dimensions in metric
		await page.getByLabel('Height').fill('50');
		await page.getByLabel('Width').fill('40');
		await page.getByLabel('Depth').fill('25');

		// Switch to imperial - should show conversion prompt
		await page.getByRole('button', { name: /Imperial/i }).click();
		await expect(
			page.getByText('Would you like to convert your dimensions to inches?')
		).toBeVisible();

		// Click "Apply conversion" and verify converted values (rounded to 1 decimal)
		await page.getByRole('button', { name: 'Apply conversion' }).click();
		await expect(page.getByLabel('Height')).toHaveValue('19.7');
		await expect(page.getByLabel('Width')).toHaveValue('15.7');
		await expect(page.getByLabel('Depth')).toHaveValue('9.8');

		// Enter new values in imperial
		await page.getByLabel('Height').fill('20');
		await page.getByLabel('Width').fill('16');
		await page.getByLabel('Depth').fill('10');

		// Switch back to metric - should show conversion prompt again
		await page.getByRole('button', { name: /Metric/i }).click();
		await expect(
			page.getByText('Would you like to convert your dimensions to centimeters?')
		).toBeVisible();

		// Click "Keep as is" this time
		await page.getByRole('button', { name: 'Keep as is' }).click();

		// Values should remain unchanged
		await expect(page.getByLabel('Height')).toHaveValue('20');
		await expect(page.getByLabel('Width')).toHaveValue('16');
		await expect(page.getByLabel('Depth')).toHaveValue('10');

		// Verify prompt is dismissed
		await expect(page.getByText('Would you like to convert your dimensions')).not.toBeVisible();
	});

	test('should not show conversion prompt when no dimensions are entered', async ({ page }) => {
		// Switch between units without entering dimensions
		await page.getByRole('button', { name: /Imperial/i }).click();
		await expect(page.getByText('Would you like to convert your dimensions')).not.toBeVisible();

		await page.getByRole('button', { name: /Metric/i }).click();
		await expect(page.getByText('Would you like to convert your dimensions')).not.toBeVisible();
	});

	test('should not show conversion prompt after dimensions reset', async ({ page }) => {
		// Enter initial dimensions in metric
		await page.getByLabel('Height').fill('50');
		await page.getByLabel('Width').fill('40');
		await page.getByLabel('Depth').fill('25');

		// Reset dimensions using the reset button
		await page.getByRole('button', { name: 'Reset' }).click();

		// Switch to imperial
		await page.getByRole('button', { name: /Imperial/i }).click();

		// Enter new dimensions - should not show conversion prompt
		await page.getByLabel('Height').fill('20');
		await page.getByLabel('Width').fill('16');
		await page.getByLabel('Depth').fill('10');

		// Expect that the conversion prompt is not shown
		await expect(page.getByText('Would you like to convert your dimensions')).not.toBeVisible();
	});

	test('should not show conversion prompt when starting dimensions input after system change', async ({
		page
	}) => {
		// Start with metric system
		await expect(page.getByRole('button', { name: /Metric/i })).toHaveClass(/bg-sky-100/);

		// Switch to imperial before entering any dimensions
		await page.getByRole('button', { name: /Imperial/i }).click();

		// Enter dimensions one by one - no prompt should appear at any point
		await page.getByLabel('Height').fill('20');
		await expect(page.getByText('Would you like to convert your dimensions')).not.toBeVisible();

		// Switch back to metric
		await page.getByRole('button', { name: /Metric/i }).click();

		// Start entering new dimensions - no prompt should appear
		await page.getByLabel('Width').fill('40');
		await expect(page.getByText('Would you like to convert your dimensions')).not.toBeVisible();

		// Complete filling all dimensions - still no prompt
		await page.getByLabel('Height').fill('50');
		await page.getByLabel('Depth').fill('25');
		await expect(page.getByText('Would you like to convert your dimensions')).not.toBeVisible();
	});

	test('should hide conversion prompt when user starts editing dimensions', async ({ page }) => {
		// Enter initial dimensions in metric
		await page.getByLabel('Height').fill('50');
		await page.getByLabel('Width').fill('40');
		await page.getByLabel('Depth').fill('25');

		// Switch to imperial - should show conversion prompt
		await page.getByRole('button', { name: /Imperial/i }).click();
		await expect(
			page.getByText('Would you like to convert your dimensions to inches?')
		).toBeVisible();

		// Start editing dimensions - prompt should disappear
		await page.getByLabel('Height').fill('20');
		await expect(page.getByText('Would you like to convert your dimensions')).not.toBeVisible();

		// Edit another dimension - prompt should stay hidden
		await page.getByLabel('Width').fill('16');
		await expect(page.getByText('Would you like to convert your dimensions')).not.toBeVisible();
	});

	test('should recalculate compliance score when bag dimensions change', async ({ page }) => {
		// Enter initial dimensions that would result in high compliance
		await page.getByLabel('Height').fill('40');
		await page.getByLabel('Width').fill('30');
		await page.getByLabel('Depth').fill('20');

		// Get initial compliance score
		const initialScoreText = await page.getByText(/\d+%/).textContent();
		const initialScore = parseInt(initialScoreText?.replace('%', '') ?? '0');

		// Enter larger dimensions that would result in lower compliance
		await page.getByLabel('Height').fill('80');
		await page.getByLabel('Width').fill('60');
		await page.getByLabel('Depth').fill('40');

		// Get updated compliance score
		const updatedScoreText = await page.getByText(/\d+%/).textContent();
		const updatedScore = parseInt(updatedScoreText?.replace('%', '') ?? '0');

		// Verify that the score changed and is lower
		expect(updatedScore).toBeLessThan(initialScore);
		expect(updatedScore).toBeGreaterThanOrEqual(0);

		// Verify the airlines count text is also updated
		const countText = await page.getByText(/\d+ out of \d+ selected airlines/).textContent();
		const [compliant, total] = countText?.match(/\d+/g) ?? [];

		expect(parseInt(compliant!)).toBeLessThan(parseInt(total));
		expect(parseInt(compliant!)).toBeGreaterThanOrEqual(0);
	});
});
