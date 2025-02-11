import { test, expect, Locator, Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	// Set up local storage to skip tours before navigation
	await page.addInitScript(() => {
		window.localStorage.setItem(
			'tours',
			JSON.stringify({
				disabled: true
			})
		);
	});
});

async function pageIsReady(page: Page) {
	await page.waitForLoadState('networkidle');
	await expect(page.getByText('CarryFit', { exact: true })).toBeVisible();
}

async function preparePage(page: Page, showTable = false) {
	await page.goto('/', { waitUntil: 'networkidle' });
	await expect(page.getByText('CarryFit', { exact: true })).toBeVisible();
	await page.getByTestId('accept-all-cookies').click();
	await expect(page.getByTestId('accept-all-cookies')).not.toBeVisible();
	if (showTable) {
		await expect(page.getByRole('table')).toBeVisible();
	}
}

test.describe('Allowance table interaction', () => {
	test.beforeEach(async ({ page }) => {
		await preparePage(page, true);
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
		await preparePage(page);
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

test.describe('Favorites functionality', () => {
	test.beforeEach(async ({ page }) => {
		await preparePage(page, true);
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

		// Wait for the table to be shown after filtering
		await expect(page.getByRole('table')).toBeVisible();

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
		await expect(page.getByRole('table')).toBeVisible();

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
			const airlineName = await row.getByTestId('airline-name').textContent();
			favoriteAirlineNames.push(airlineName!);
			await row.getByTestId('favorite-button').click();
		}

		// Verify initial state
		await expect(page.getByTestId('favorites-count')).toHaveText('3 airlines');

		// Reload page
		await page.reload();
		await expect(page.getByRole('table')).toBeVisible();

		// Verify favorites count persisted
		await expect(page.getByTestId('favorites-count')).toHaveText('3 airlines');

		// Enable favorites filter to see only favorited airlines
		await page.getByLabel('Favorites only').check();

		// Verify all previously favorited airlines are still present
		for (const airlineName of favoriteAirlineNames) {
			await expect(
				page.getByTestId('airline-name').filter({ hasText: new RegExp(`^${airlineName}$`) })
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
		await preparePage(page);
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
		await preparePage(page);
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
		await pageIsReady(page);
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
		await pageIsReady(page);

		// Verify all inputs are empty/zero
		await expect(page.getByLabel('Height')).toHaveValue('0');
		await expect(page.getByLabel('Width')).toHaveValue('0');
		await expect(page.getByLabel('Depth')).toHaveValue('0');
	});

	test('should clear URL parameters when dimensions are changed', async ({ page }) => {
		// Start with shared dimensions
		await page.goto('/?height=45&width=35&depth=20&units=metric', { waitUntil: 'networkidle' });
		await pageIsReady(page);

		// Verify initial URL has parameters
		expect(page.url()).toMatch(/\?height=45&width=35&depth=20&units=metric$/);

		// Change a dimension
		await page.getByLabel('Height').fill('50', { timeout: 5000 });

		// Verify URL parameters are cleared
		expect(page.url()).not.toContain('height=');
		expect(page.url()).not.toContain('width=');
		expect(page.url()).not.toContain('depth=');
		expect(page.url()).not.toContain('units=');
	});

	test('should clear URL parameters when measurement system is changed', async ({ page }) => {
		// Start with shared dimensions
		await page.goto('/?height=45&width=35&depth=20&units=metric', { waitUntil: 'networkidle' });
		await pageIsReady(page);

		// Change measurement system
		await page.getByRole('button', { name: /Imperial/i }).click();

		// Verify URL parameters are cleared
		expect(page.url()).not.toContain('height=');
		expect(page.url()).not.toContain('width=');
		expect(page.url()).not.toContain('depth=');
		expect(page.url()).not.toContain('units=');
	});

	test('should handle invalid measurement system in URL', async ({ page }) => {
		// Navigate with invalid measurement system
		await page.goto('/?height=45&width=35&depth=20&units=invalid', { waitUntil: 'networkidle' });
		await pageIsReady(page);

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
		await preparePage(page);
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
		await preparePage(page);
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

test.describe('Bag dimension parsing', () => {
	test.beforeEach(async ({ page }) => {
		await preparePage(page);
	});

	test('should parse valid dimensions string and set bag dimensions', async ({ page }) => {
		// Open the paste dialog
		await page.getByRole('button', { name: /Parse/i }).click();
		await expect(page.getByRole('dialog')).toBeVisible();

		// Input valid dimensions string
		await page.getByRole('dialog').getByRole('textbox').fill('34.0 x 53.0 x 19.0 cm');
		await page.getByRole('dialog').getByRole('button', { name: 'Parse Dimensions' }).click();

		// Dialog should close
		await expect(page.getByRole('dialog')).not.toBeVisible();

		// Verify dimensions are set correctly
		await expect(page.getByLabel('Height')).toHaveValue('34');
		await expect(page.getByLabel('Width')).toHaveValue('53');
		await expect(page.getByLabel('Depth')).toHaveValue('19');

		// Verify compliance score is visible (indicating dimensions were processed)
		await expect(page.getByText(/Compliance Score/)).toBeVisible();
	});

	test('should show error for invalid dimensions string', async ({ page }) => {
		// Store initial dimensions
		const initialHeight = await page.getByLabel('Height').inputValue();
		const initialWidth = await page.getByLabel('Width').inputValue();
		const initialDepth = await page.getByLabel('Depth').inputValue();

		// Open the paste dialog
		await page.getByRole('button', { name: /Parse/i }).click();
		await expect(page.getByRole('dialog')).toBeVisible();

		// Input invalid text
		await page.getByRole('dialog').getByRole('textbox').fill('This is not a dimension string');
		await page.getByRole('dialog').getByRole('button', { name: 'Parse Dimensions' }).click();

		// Error should be visible
		await expect(page.getByText(/No dimensions found/)).toBeVisible();

		// Dialog should stay open
		await expect(page.getByRole('dialog')).toBeVisible();

		// Dimensions should remain unchanged
		await expect(page.getByLabel('Height')).toHaveValue(initialHeight);
		await expect(page.getByLabel('Width')).toHaveValue(initialWidth);
		await expect(page.getByLabel('Depth')).toHaveValue(initialDepth);
	});

	test('should not affect dimensions when dialog is cancelled', async ({ page }) => {
		// Set some initial dimensions
		await page.getByLabel('Height').fill('50');
		await page.getByLabel('Width').fill('40');
		await page.getByLabel('Depth').fill('25');

		// Open the paste dialog
		await page.getByRole('button', { name: /Parse/i }).click();
		await expect(page.getByRole('dialog')).toBeVisible();

		// Input valid dimensions string but cancel
		await page.getByRole('dialog').getByRole('textbox').fill('34.0 x 53.0 x 19.0 cm');
		await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();

		// Dialog should close
		await expect(page.getByRole('dialog')).not.toBeVisible();

		// Dimensions should remain unchanged
		await expect(page.getByLabel('Height')).toHaveValue('50');
		await expect(page.getByLabel('Width')).toHaveValue('40');
		await expect(page.getByLabel('Depth')).toHaveValue('25');
	});

	test('should parse dimensions according to selected measurement system', async ({ page }) => {
		// Switch to imperial system
		await page.getByRole('button', { name: /Imperial/i }).click();

		// Open the paste dialog
		await page.getByRole('button', { name: /Parse/i }).click();
		await expect(page.getByRole('dialog')).toBeVisible();

		// Input dimensions with both units
		await page
			.getByRole('dialog')
			.getByRole('textbox')
			.fill('34.0 x 53.0 x 19.0 cm / 13.39 x 20.87 x 7.48in');
		await page.getByRole('dialog').getByRole('button', { name: 'Parse Dimensions' }).click();

		// Dialog should close
		await expect(page.getByRole('dialog')).not.toBeVisible();

		// Verify imperial dimensions are set
		await expect(page.getByLabel('Height')).toHaveValue('13.39');
		await expect(page.getByLabel('Width')).toHaveValue('20.87');
		await expect(page.getByLabel('Depth')).toHaveValue('7.48');

		// Switch back to metric and try another parse
		await page.getByRole('button', { name: /Metric/i }).click();
		await page.getByRole('button', { name: /Parse/i }).click();
		await page
			.getByRole('dialog')
			.getByRole('textbox')
			.fill('34.0 x 53.0 x 19.0 cm / 13.39 x 20.87 x 7.48in');
		await page.getByRole('dialog').getByRole('button', { name: 'Parse Dimensions' }).click();

		// Verify metric dimensions are set
		await expect(page.getByLabel('Height')).toHaveValue('34');
		await expect(page.getByLabel('Width')).toHaveValue('53');
		await expect(page.getByLabel('Depth')).toHaveValue('19');
	});
});

test.describe('Allowance table search functionality', () => {
	const searchWaitTime = 300;

	test.beforeEach(async ({ page }) => {
		await preparePage(page, true);
	});

	test('should filter airlines by search term', async ({ page }) => {
		// Get initial number of rows
		const initialRows = await page.getByTestId('airline-name').count();
		expect(initialRows).toBeGreaterThan(1); // Account for header row

		// Enter search term
		await page.getByTestId('search-input').fill('Finnair');

		// Wait for search to complete
		await page.waitForTimeout(searchWaitTime);

		// Verify filtered results
		const filteredRows = await page.getByTestId('airline-name').count();
		expect(filteredRows).toBe(1); // Finnair row

		// Verify the visible airline is Finnair
		await expect(page.getByTestId('airline-name')).toHaveText('Finnair');
	});

	test('should show empty state when no airlines match search', async ({ page }) => {
		// Enter non-matching search term
		await page.getByTestId('search-input').fill('NonexistentAirline');

		// Wait for search to complete
		await page.waitForTimeout(searchWaitTime);

		// Verify empty state is shown
		await expect(page.getByText('No airlines found')).toBeVisible();
		await expect(
			page.getByText('No airlines match your search "NonexistentAirline"')
		).toBeVisible();
	});

	test('should clear search when X button is clicked', async ({ page }) => {
		// Get initial number of rows
		const initialRows = await page.getByTestId('airline-name').count();

		// Enter search term
		await page.getByTestId('search-input').fill('Finnair');

		// Wait for debounce
		await page.waitForTimeout(searchWaitTime);

		// Verify search filtered the results
		const filteredRows = await page.getByTestId('airline-name').count();
		expect(filteredRows).toBe(1);

		// Click clear button
		await page.getByTestId('search-clear-button').click();

		// Wait for search to complete
		await page.waitForTimeout(searchWaitTime);

		// Verify original number of rows is restored
		const finalRows = await page.getByTestId('airline-name').count();
		expect(finalRows).toBe(initialRows);
	});

	test('should search in compliance tables when dimensions are set', async ({ page }) => {
		// Enter bag dimensions to show compliance tables
		await page.getByLabel('Height').fill('50');
		await page.getByLabel('Width').fill('40');
		await page.getByLabel('Depth').fill('25');

		// Wait for tables to update
		await expect(page.getByTestId('compliance-sections')).toBeVisible();

		// Enter search term
		await page.getByTestId('search-input').fill('Finnair');

		// Wait for search to complete
		await page.waitForTimeout(searchWaitTime);

		// Verify search works in compliance tables
		expect(await page.getByTestId('airline-name').count()).toBe(1);
		await expect(page.getByTestId('airline-name')).toHaveText('Finnair');

		// Clear search
		await page.getByTestId('search-clear-button').click();

		// Wait for search to complete
		await page.waitForTimeout(searchWaitTime);

		// Verify more airlines are visible after clearing search
		expect(await page.getByTestId('airline-name').count()).toBeGreaterThan(1);
	});

	test('should handle case-insensitive search', async ({ page }) => {
		// Try different case variations
		const searchTerms = ['finnair', 'FINNAIR', 'FiNnAiR'];

		for (const term of searchTerms) {
			await page.getByTestId('search-input').fill(term);

			// Wait for search to complete
			await page.waitForTimeout(searchWaitTime);

			// Verify Finnair is found regardless of case
			expect(await page.getByTestId('airline-name').count()).toBe(1);
			await expect(page.getByTestId('airline-name')).toHaveText('Finnair');
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

	test.beforeEach(async ({ page }) => {
		await preparePage(page, true);
		await openFavoriteAirlinesDialog(page);
	});

	test('should search and filter airlines in dialog', async ({ page }) => {
		await openSearchPopover(page);

		// Get initial number of airlines
		await expect(getOptions(page).first()).toBeVisible();
		const initialAirlines = await getOptions(page).count();
		expect(initialAirlines).toBeGreaterThan(0);

		// Search for a specific airline
		await fillSearchQuery(page, 'Finnair');

		// Verify filtered results
		const filteredAirlines = await getOptions(page).count();
		expect(filteredAirlines).toBe(1);

		await expect(getOptions(page)).toContainText('Finnair');

		// Clear search
		await fillSearchQuery(page, '');

		// Verify original list is restored
		const finalAirlines = await getOptions(page).count();
		expect(finalAirlines).toBe(initialAirlines);
	});

	test('should add and remove airlines from favorites in dialog', async ({ page }) => {
		// Initially no airlines should be selected
		await expect(page.getByText('No favorite airlines selected')).toBeVisible();

		// Select an airline
		await openSearchPopover(page);
		await fillSearchQuery(page, 'Finnair');
		await getAirlineOption(page, 'Finnair').click();
		await closeSearchPopover(page);

		// Verify airline appears in selected list
		await expect(page.getByText('Selected Airlines (1)')).toBeVisible();
		await expect(getRemoveButton(page, 'Finnair')).toBeVisible();

		// Add another airline
		await openSearchPopover(page);
		await fillSearchQuery(page, 'Lufthansa');
		await getAirlineOption(page, 'Lufthansa').click();
		await closeSearchPopover(page);

		// Verify both airlines are in list
		await expect(page.getByText('Selected Airlines (2)')).toBeVisible();
		await expect(getRemoveButton(page, 'Finnair')).toBeVisible();
		await expect(getRemoveButton(page, 'Lufthansa')).toBeVisible();

		// Remove one airline
		await getRemoveButton(page, 'Finnair').click();

		// Verify count updated and airline removed
		await expect(page.getByText('Selected Airlines (1)')).toBeVisible();
		await expect(getRemoveButton(page, 'Finnair')).not.toBeVisible();
		await expect(getRemoveButton(page, 'Lufthansa')).toBeVisible();
	});

	test('should persist favorites after dialog is closed and reopened', async ({ page }) => {
		// Add some airlines to favorites
		await openSearchPopover(page);
		await fillSearchQuery(page, 'Finnair');
		await getAirlineOption(page, 'Finnair').click();
		await fillSearchQuery(page, 'Lufthansa');
		await getAirlineOption(page, 'Lufthansa').click();
		await closeSearchPopover(page);

		// Close dialog
		await closeFavoriteAirlinesDialog(page);

		// Reopen dialog
		await openFavoriteAirlinesDialog(page);

		// Verify favorites are still there
		await expect(page.getByText('Selected Airlines (2)')).toBeVisible();
		await expect(getRemoveButton(page, 'Finnair')).toBeVisible();
		await expect(getRemoveButton(page, 'Lufthansa')).toBeVisible();
	});

	test('should persist favorites after page refresh', async ({ page }) => {
		// Add airlines to favorites
		await openSearchPopover(page);
		await fillSearchQuery(page, 'Finnair');
		await getAirlineOption(page, 'Finnair').click();
		await fillSearchQuery(page, 'Lufthansa');
		await getAirlineOption(page, 'Lufthansa').click();
		await closeSearchPopover(page);

		// Close dialog
		await closeFavoriteAirlinesDialog(page);

		// Refresh page
		await page.reload();
		await pageIsReady(page);

		// Reopen dialog
		await openFavoriteAirlinesDialog(page);

		// Verify favorites persisted
		await expect(page.getByText('Selected Airlines (2)')).toBeVisible();
		await expect(getRemoveButton(page, 'Finnair')).toBeVisible();
		await expect(getRemoveButton(page, 'Lufthansa')).toBeVisible();
	});

	test('should show checkmarks next to selected airlines in search list', async ({ page }) => {
		// Add an airline to favorites
		await openSearchPopover(page);
		await fillSearchQuery(page, 'Finnair');
		await getAirlineOption(page, 'Finnair').click();

		// Verify checkmark is visible
		const option = getAirlineOption(page, 'Finnair');
		await expect(option.getByTestId('favorite-airline-check-icon')).toHaveClass(/opacity-100/);

		// Verify no checkmark is visible
		await fillSearchQuery(page, 'Lufthansa');
		const otherOption = getAirlineOption(page, 'Lufthansa');
		await expect(otherOption.getByTestId('favorite-airline-check-icon')).toHaveClass(/opacity-0/);
	});

	test('should handle fuzzy search matching', async ({ page }) => {
		// Try partial and fuzzy matches
		const searchTerms = ['fin', 'fn', 'fair'];
		await openSearchPopover(page);

		for (const term of searchTerms) {
			await fillSearchQuery(page, term);

			// Verify Finnair is found with fuzzy search
			await expect(getAirlineOption(page, 'Finnair')).toBeVisible();
		}

		// Try a non-matching term
		await fillSearchQuery(page, 'xyz123');
		await expect(page.getByText('No airlines found.')).toBeVisible();
	});
});

test.describe('Filter Regions', () => {
	test.beforeEach(async ({ page }) => {
		await preparePage(page, true);
	});

	test('should filter airlines by region', async ({ page }) => {
		// Get initial number of rows
		const initialRows = await page.getByRole('row').count();
		expect(initialRows).toBeGreaterThan(0);

		// Deselect all regions except one
		const europeCheckbox = page.getByRole('button', { name: 'Europe' });
		await page.getByText('Clear All').click();
		await europeCheckbox.click();

		// Wait for the table to be shown after filtering
		await expect(page.getByRole('table')).toBeVisible();

		// Get filtered number of rows and verify it's less than initial
		const filteredRows = await page.getByRole('row').count();
		expect(filteredRows).toBeLessThan(initialRows);

		// Verify all visible airlines are from Europe
		const regionCells = page.getByRole('cell', { name: 'Europe' });
		const regionCount = await regionCells.count();
		expect(regionCount).toBeGreaterThan(0);
		expect(regionCount).toBe(filteredRows - 1);
	});

	test('should persist selected regions across page reloads', async ({ page }) => {
		// Select Europe region
		const europeButton = page.getByRole('button', { name: 'Europe' });
		await page.getByText('Clear All').click();
		await europeButton.click();

		// Reload page
		await page.reload();
		await pageIsReady(page);

		// Verify Europe region is still selected
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
