import { test, expect } from '@playwright/test';

test.describe('Allowance table interaction', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });
		await expect(page.getByText('CarryFit', { exact: true })).toBeVisible();
		await page.getByTestId('accept-all-cookies').click();
		await expect(page.getByTestId('accept-all-cookies')).not.toBeVisible();
	});

	test('should display airline allowances table by default', async ({ page }) => {
		// Check table headers
		const headers = ['Airline', 'Region', 'Carry-On (cm)', 'Weight', 'Policy'];
		for (const header of headers) {
			await expect(page.getByRole('columnheader', { name: header })).toBeVisible();
		}

		// Verify some airlines are visible
		await expect(page.getByRole('cell', { name: /Finnair/i })).toBeVisible();
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

test.describe('Bag compliance scoring calculation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });
		await expect(page.getByText('CarryFit', { exact: true })).toBeVisible();
		await page.getByTestId('accept-all-cookies').click();
		await expect(page.getByTestId('accept-all-cookies')).not.toBeVisible();
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

test.describe('Bag dimensions conversion', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });
		await expect(page.getByText('CarryFit', { exact: true })).toBeVisible();
		await page.getByTestId('accept-all-cookies').click();
		await expect(page.getByTestId('accept-all-cookies')).not.toBeVisible();
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
		await expect(page.getByTestId('metric-button')).toHaveAttribute('data-active', 'true');

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
});

test.describe('Favorites functionality', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });
		await expect(page.getByText('CarryFit', { exact: true })).toBeVisible();
		await page.getByTestId('accept-all-cookies').click();
		await expect(page.getByTestId('accept-all-cookies')).not.toBeVisible();
	});

	test('should add and remove airlines from favorites', async ({ page }) => {
		// Get the first airline row
		const firstAirlineRow = page.getByRole('row').nth(1);

		// Initial state should show not favorited
		await expect(firstAirlineRow.getByTestId('favorite-button')).toHaveAttribute(
			'data-favorite',
			'false'
		);

		// Add to favorites
		await firstAirlineRow.getByTestId('favorite-button').click();

		// Should be marked as favorite
		await expect(firstAirlineRow.getByTestId('favorite-button')).toHaveAttribute(
			'data-favorite',
			'true'
		);

		// Remove from favorites
		await firstAirlineRow.getByTestId('favorite-button').click();

		// Should not be favorite again
		await expect(firstAirlineRow.getByTestId('favorite-button')).toHaveAttribute(
			'data-favorite',
			'false'
		);
	});

	test('should filter airlines by favorites', async ({ page }) => {
		// Get initial number of airlines
		const initialAirlineCount = (await page.getByRole('row').count()) - 1; // Subtract header row

		// Add first two airlines to favorites
		await page.getByRole('row').nth(1).getByTestId('favorite-button').click();
		await page.getByRole('row').nth(2).getByTestId('favorite-button').click();

		// Enable favorites filter
		await page.getByLabel('Favorites only').check();

		// Should show only favorited airlines
		const filteredAirlineCount = (await page.getByRole('row').count()) - 1;
		expect(filteredAirlineCount).toBe(2);
		expect(filteredAirlineCount).toBeLessThan(initialAirlineCount);

		// All visible airlines should be favorites
		const visibleButtons = await page.getByTestId('favorite-button').all();
		for (const button of visibleButtons) {
			await expect(button).toHaveAttribute('data-favorite', 'true');
		}
	});

	test('should persist favorites across page reloads', async ({ page }) => {
		// Add first airline to favorites
		const firstAirlineRow = page.getByRole('row').nth(1);
		await firstAirlineRow.getByTestId('favorite-button').click();

		// Reload page
		await page.reload();
		await expect(page.getByText('CarryFit', { exact: true })).toBeVisible();

		// First airline should still be favorited
		await expect(page.getByRole('row').nth(1).getByTestId('favorite-button')).toHaveAttribute(
			'data-favorite',
			'true'
		);
	});

	test('should update favorites count in filter section', async ({ page }) => {
		// Initially should show no favorites
		await expect(page.getByTestId('favorites-count')).not.toBeVisible();

		// Add two airlines to favorites
		await page.getByRole('row').nth(1).getByTestId('favorite-button').click();
		await page.getByRole('row').nth(2).getByTestId('favorite-button').click();

		// Should show correct count
		await expect(page.getByTestId('favorites-count')).toHaveText('2 airlines');

		// Remove one favorite
		await page.getByRole('row').nth(1).getByTestId('favorite-button').click();

		// Should update count
		await expect(page.getByTestId('favorites-count')).toHaveText('1 airline');
	});

	test('should disable region filters that have no favorites when favorites filter is active', async ({
		page
	}) => {
		// Add one airline to favorites
		const firstAirlineRow = page.getByRole('row').nth(1);
		const region = await firstAirlineRow.getByTestId('region').textContent();
		await firstAirlineRow.getByTestId('favorite-button').click();

		// Enable favorites filter
		await page.getByLabel('Favorites only').check();

		// Region buttons for regions without favorites should be disabled
		const regionButtons = page
			.getByTestId('regions-filter-list')
			.getByRole('button')
			.filter({ hasText: new RegExp(`^${region}$`) });
		for (const button of await regionButtons.all()) {
			await expect(button).toBeDisabled();
		}

		// Region with favorite should still be enabled
		const favoriteRegionButton = page
			.getByTestId('regions-filter-list')
			.getByRole('button', { name: region! });
		await expect(favoriteRegionButton).not.toBeDisabled();
	});

	test('should persist entire favorites list across page reloads', async ({ page }) => {
		// Add multiple airlines to favorites
		const airlineRows = [1, 2, 3]; // Get first three airlines
		const favoriteAirlineNames: string[] = [];

		// Add airlines to favorites and collect their names
		for (const rowIndex of airlineRows) {
			const row = page.getByRole('row').nth(rowIndex);
			const airlineName = await row.getByTestId('airline').textContent();
			favoriteAirlineNames.push(airlineName!);
			await row.getByTestId('favorite-button').click();
		}

		// Verify initial state
		await expect(page.getByTestId('favorites-count')).toHaveText('3 airlines');

		// Reload page
		await page.reload();
		await expect(page.getByText('CarryFit', { exact: true })).toBeVisible();

		// Verify favorites count persisted
		await expect(page.getByTestId('favorites-count')).toHaveText('3 airlines');

		// Enable favorites filter to see only favorited airlines
		await page.getByLabel('Favorites only').check();

		// Verify all previously favorited airlines are still present
		for (const airlineName of favoriteAirlineNames) {
			await expect(
				page.getByTestId('airline').filter({ hasText: new RegExp(`^${airlineName}$`) })
			).toBeVisible();
		}

		// Verify all visible airlines are marked as favorites
		const visibleButtons = await page.getByTestId('favorite-button').all();
		expect(visibleButtons).toHaveLength(favoriteAirlineNames.length);
		for (const button of visibleButtons) {
			await expect(button).toHaveAttribute('data-favorite', 'true');
		}
	});
});

test.describe('Measurement system updates', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });
		await expect(page.getByText('CarryFit', { exact: true })).toBeVisible();
		await page.getByTestId('accept-all-cookies').click();
		await expect(page.getByTestId('accept-all-cookies')).not.toBeVisible();
	});

	test('should update units in table when measurement system changes', async ({ page }) => {
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

	test('should persist measurement system preference across page reloads', async ({ page }) => {
		// Verify initial state is metric
		await expect(page.getByTestId('metric-button')).toHaveAttribute('data-active', 'true');
		await expect(page.getByRole('columnheader', { name: 'Carry-On (cm)' })).toBeVisible();

		// Switch to imperial
		await page.getByRole('button', { name: /Imperial/i }).click();
		await expect(page.getByTestId('imperial-button')).toHaveAttribute('data-active', 'true');
		await expect(page.getByRole('columnheader', { name: 'Carry-On (in)' })).toBeVisible();

		// Reload page
		await page.reload();
		await expect(page.getByText('CarryFit', { exact: true })).toBeVisible();

		// Verify imperial system is still selected
		await expect(page.getByTestId('imperial-button')).toHaveAttribute('data-active', 'true');
		await expect(page.getByRole('columnheader', { name: 'Carry-On (in)' })).toBeVisible();

		// Switch back to metric
		await page.getByRole('button', { name: /Metric/i }).click();
		await expect(page.getByTestId('metric-button')).toHaveAttribute('data-active', 'true');
		await expect(page.getByRole('columnheader', { name: 'Carry-On (cm)' })).toBeVisible();

		// Reload page again
		await page.reload();
		await expect(page.getByText('CarryFit', { exact: true })).toBeVisible();

		// Verify metric system persisted
		await expect(page.getByTestId('metric-button')).toHaveAttribute('data-active', 'true');
		await expect(page.getByRole('columnheader', { name: 'Carry-On (cm)' })).toBeVisible();
	});
});

test.describe('Bag sharing functionality', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/', { waitUntil: 'networkidle' });
		await expect(page.getByText('CarryFit', { exact: true })).toBeVisible();
		await page.getByTestId('accept-all-cookies').click();
		await expect(page.getByTestId('accept-all-cookies')).not.toBeVisible();
	});

	test('should copy bag dimensions link to clipboard', async ({ page, context }) => {
		// Grant clipboard permissions
		await context.grantPermissions(['clipboard-read', 'clipboard-write']);

		// Enter bag dimensions
		await page.getByLabel('Height').fill('50');
		await page.getByLabel('Width').fill('40');
		await page.getByLabel('Depth').fill('25');

		// Click share button and verify clipboard content
		const shareButton = page.getByRole('button', { name: /Copy/i });
		await shareButton.click();

		const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
		expect(clipboardText).toMatch(/\?height=50&width=40&depth=25&units=metric$/);
	});

	test('should load bag dimensions from URL parameters', async ({ page }) => {
		// Navigate to page with dimensions in URL
		await page.goto('/?height=45&width=35&depth=20&units=imperial', { waitUntil: 'networkidle' });

		// Verify input values are set correctly
		await expect(page.getByLabel('Height')).toHaveValue('45');
		await expect(page.getByLabel('Width')).toHaveValue('35');
		await expect(page.getByLabel('Depth')).toHaveValue('20');

		// Verify measurement system is set to imperial
		await expect(page.getByTestId('imperial-button')).toHaveAttribute('data-active', 'true');
	});

	test('should start with empty values if URL parameters are incomplete', async ({ page }) => {
		// Test with missing parameters
		await page.goto('/?height=45&width=35', { waitUntil: 'networkidle' });

		// Verify all inputs are empty/zero
		await expect(page.getByLabel('Height')).toHaveValue('0');
		await expect(page.getByLabel('Width')).toHaveValue('0');
		await expect(page.getByLabel('Depth')).toHaveValue('0');
	});

	test('should clear URL parameters when dimensions are changed', async ({ page }) => {
		// Start with shared dimensions
		await page.goto('/?height=45&width=35&depth=20&units=metric', { waitUntil: 'networkidle' });

		// Verify initial URL has parameters
		expect(page.url()).toMatch(/\?height=45&width=35&depth=20&units=metric$/);

		// Change a dimension
		await page.getByLabel('Height').fill('50');

		// Verify URL parameters are cleared
		expect(page.url()).not.toContain('height=');
		expect(page.url()).not.toContain('width=');
		expect(page.url()).not.toContain('depth=');
		expect(page.url()).not.toContain('units=');
	});

	test('should clear URL parameters when measurement system is changed', async ({ page }) => {
		// Start with shared dimensions
		await page.goto('/?height=45&width=35&depth=20&units=metric', { waitUntil: 'networkidle' });

		// Change measurement system
		await page.getByRole('button', { name: /Imperial/i }).click();

		// Verify URL parameters are cleared
		expect(page.url()).not.toContain('height=');
		expect(page.url()).not.toContain('width=');
		expect(page.url()).not.toContain('depth=');
		expect(page.url()).not.toContain('units=');
	});

	test('should respect persisted measurement system preference over shared link', async ({
		page
	}) => {
		// First visit to set metric preference
		await page.getByRole('button', { name: /Metric/i }).click();

		// Visit page with imperial units in URL
		await page.goto('/?height=45&width=35&depth=20&units=imperial', { waitUntil: 'networkidle' });

		// Change any dimension
		await page.getByLabel('Height').fill('50');

		// Verify system reverts to metric (persisted preference)
		await expect(page.getByTestId('metric-button')).toHaveAttribute('data-active', 'true');
		// FIXME: Selected first element in locator, because of false positive strictness error: first vs nth(1)
		await expect(page.getByRole('columnheader', { name: 'Carry-On (cm)' }).first()).toBeVisible();
	});

	test('should handle invalid measurement system in URL', async ({ page }) => {
		// Navigate with invalid measurement system
		await page.goto('/?height=45&width=35&depth=20&units=invalid', { waitUntil: 'networkidle' });

		// Verify dimensions are not set
		await expect(page.getByLabel('Height')).toHaveValue('0');
		await expect(page.getByLabel('Width')).toHaveValue('0');
		await expect(page.getByLabel('Depth')).toHaveValue('0');

		// Should use default measurement system
		await expect(page.getByTestId('metric-button')).toHaveAttribute('data-active', 'true');
	});

	test('should handle non-numeric dimensions in URL', async ({ page }) => {
		// Navigate with invalid dimension values
		await page.goto('/?height=abc&width=35&depth=20&units=metric', { waitUntil: 'networkidle' });

		// Verify dimensions are not set
		await expect(page.getByLabel('Height')).toHaveValue('0');
		await expect(page.getByLabel('Width')).toHaveValue('0');
		await expect(page.getByLabel('Depth')).toHaveValue('0');
	});
});

test.describe('Large screen table layout', () => {
	test.beforeEach(async ({ page }) => {
		// Set viewport to a large screen size (larger than xl breakpoint of 1280px)
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.goto('/', { waitUntil: 'networkidle' });
		await expect(page.getByText('CarryFit', { exact: true })).toBeVisible();
		await page.getByTestId('accept-all-cookies').click();
		await expect(page.getByTestId('accept-all-cookies')).not.toBeVisible();
	});

	test('should display compliant and non-compliant tables side by side when dimensions are set', async ({
		page
	}) => {
		// Enter bag dimensions
		await page.getByLabel('Height').fill('50');
		await page.getByLabel('Width').fill('40');
		await page.getByLabel('Depth').fill('25');

		// Verify both sections are visible simultaneously
		await expect(page.getByRole('button', { name: /^Non-Compliant Airlines/ })).toBeVisible();
		await expect(page.getByRole('button', { name: /^Compliant Airlines/ })).toBeVisible();

		// Verify sections are visible
		const tablesContainer = page.getByTestId('compliance-sections');
		await expect(tablesContainer).toBeVisible();

		// Verify both tables have max-width set for large screens
		await expect(page.getByTestId('non-compliant-section')).toHaveClass(/xl:max-w-\[50%\]/);
		await expect(page.getByTestId('compliant-section')).toHaveClass(/xl:max-w-\[50%\]/);
	});

	test('should keep both sections expanded on large screens', async ({ page }) => {
		// Enter bag dimensions
		await page.getByLabel('Height').fill('50');
		await page.getByLabel('Width').fill('40');
		await page.getByLabel('Depth').fill('25');

		// Verify both sections are expanded
		await expect(page.getByTestId('non-compliant-table')).toBeVisible();
		await expect(page.getByTestId('compliant-table')).toBeVisible();

		// Try clicking the headers - sections should stay expanded
		await page.getByRole('button', { name: /^Non-Compliant Airlines/ }).click();
		await page.getByRole('button', { name: /^Compliant Airlines/ }).click();

		// Verify sections are still expanded
		await expect(page.getByTestId('non-compliant-table')).toBeVisible();
		await expect(page.getByTestId('compliant-table')).toBeVisible();
	});

	test('should show single table layout when only one category exists', async ({ page }) => {
		// Enter dimensions that would make all airlines compliant
		await page.getByLabel('Height').fill('1');
		await page.getByLabel('Width').fill('1');
		await page.getByLabel('Depth').fill('1');

		// Verify only compliant section is visible
		await expect(page.getByTestId('compliant-table')).toBeVisible();
		await expect(page.getByTestId('non-compliant-table')).not.toBeVisible();

		// Enter dimensions that would make all airlines non-compliant
		await page.getByLabel('Height').fill('100');
		await page.getByLabel('Width').fill('100');
		await page.getByLabel('Depth').fill('100');

		// Verify only non-compliant section is visible
		await expect(page.getByTestId('non-compliant-table')).toBeVisible();
		await expect(page.getByTestId('compliant-table')).not.toBeVisible();
	});
});

test.describe('Mobile screen table layout', () => {
	test.beforeEach(async ({ page }) => {
		// Set viewport to a mobile screen size
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/', { waitUntil: 'networkidle' });
		await expect(page.getByText('CarryFit', { exact: true })).toBeVisible();
		await page.getByTestId('accept-all-cookies').click();
		await expect(page.getByTestId('accept-all-cookies')).not.toBeVisible();
	});

	test('should display sections in single column and allow toggling', async ({ page }) => {
		// Enter bag dimensions
		await page.getByLabel('Height').fill('50');
		await page.getByLabel('Width').fill('40');
		await page.getByLabel('Depth').fill('25');

		// Verify sections are in a column layout
		await expect(page.getByTestId('compliance-sections')).toHaveClass(/flex flex-col/);

		// Initially, non-compliant section should be open and compliant closed
		await expect(page.getByTestId('non-compliant-table')).toBeVisible();
		await expect(page.getByTestId('compliant-table')).not.toBeVisible();

		// Toggle sections by clicking the compliant section button
		const compliantButton = page.getByRole('button', { name: /^Compliant Airlines/ });
		await compliantButton.click();

		// Verify toggle state changed
		await expect(page.getByTestId('non-compliant-table')).not.toBeVisible();
		await expect(page.getByTestId('compliant-table')).toBeVisible();

		// Toggle back by clicking the non-compliant section button
		const nonCompliantButton = page.getByRole('button', { name: /^Non-Compliant Airlines/ });
		await nonCompliantButton.click();

		// Verify toggle state changed back
		await expect(page.getByTestId('non-compliant-table')).toBeVisible();
		await expect(page.getByTestId('compliant-table')).not.toBeVisible();
	});

	test('should scroll to opened section', async ({ page }) => {
		// Enter bag dimensions
		await page.getByLabel('Height').fill('50');
		await page.getByLabel('Width').fill('40');
		await page.getByLabel('Depth').fill('25');

		// Initially, non-compliant section should be open
		await expect(page.getByTestId('non-compliant-table')).toBeVisible();
		await expect(page.getByTestId('compliant-table')).not.toBeVisible();

		// Get initial scroll position
		const initialScrollY = await page.evaluate(() => window.scrollY);

		// Toggle to compliant section
		const compliantButton = page.getByRole('button', { name: /^Compliant Airlines/ });
		await compliantButton.click();

		// Wait for scroll to complete
		await page.waitForTimeout(100);

		// Get new scroll position
		const newScrollY = await page.evaluate(() => window.scrollY);

		// Verify scroll position changed
		expect(newScrollY).toBeGreaterThan(initialScrollY);

		// Verify correct section is visible
		await expect(page.getByTestId('compliant-table')).toBeVisible();
		await expect(page.getByTestId('non-compliant-table')).not.toBeVisible();

		// Toggle back to non-compliant section
		const nonCompliantButton = page.getByRole('button', { name: /^Non-Compliant Airlines/ });
		await nonCompliantButton.click();

		// Wait for scroll to complete
		await page.waitForTimeout(100);

		// Get final scroll position
		const finalScrollY = await page.evaluate(() => window.scrollY);

		// Verify scroll position changed back
		expect(finalScrollY).toBeLessThan(newScrollY);

		// Verify correct section is visible
		await expect(page.getByTestId('non-compliant-table')).toBeVisible();
		await expect(page.getByTestId('compliant-table')).not.toBeVisible();
	});
});
