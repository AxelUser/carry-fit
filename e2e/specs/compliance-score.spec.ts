import { test, expect } from '../fixtures/test';
import { setBagDimensions } from '../helpers/ui';

test.describe('Bag compliance scoring calculation', () => {
	test.beforeEach(async ({ app, page }) => {
		await app.gotoHome();
	});

	test('should only show compliance score when dimensions are entered', async ({ page }) => {
		await expect(page.getByText(/Compliance:/)).not.toBeVisible();

		await setBagDimensions(page, { height: '50', width: '40', depth: '25' });

		await expect(page.getByText(/Compliance Score/)).toBeVisible();
		await expect(page.getByText(/%/)).toBeVisible();
		await expect(page.getByText(/\d+ out of \d+ selected airlines/)).toBeVisible();
	});

	test('should recalculate compliance score when bag dimensions change', async ({ page }) => {
		await setBagDimensions(page, { height: '40', width: '30', depth: '20' });

		const initialScoreText = await page.getByText(/\d+%/).textContent();
		const initialScore = parseInt(initialScoreText?.replace('%', '') ?? '0');

		await setBagDimensions(page, { height: '80', width: '60', depth: '40' });

		const updatedScoreText = await page.getByText(/\d+%/).textContent();
		const updatedScore = parseInt(updatedScoreText?.replace('%', '') ?? '0');

		expect(updatedScore).toBeLessThan(initialScore);
		expect(updatedScore).toBeGreaterThanOrEqual(0);

		const countText = await page.getByText(/\d+ out of \d+ selected airlines/).textContent();
		const [compliant, total] = countText?.match(/\d+/g) ?? [];

		expect(parseInt(compliant!)).toBeLessThan(parseInt(total));
		expect(parseInt(compliant!)).toBeGreaterThanOrEqual(0);
	});
});

test.describe('Large screen table layout', () => {
	test.beforeEach(async ({ app, page }) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await app.gotoHome();
	});

	test('should display compliant and non-compliant tables side by side when dimensions are set', async ({
		page
	}) => {
		await setBagDimensions(page, { height: '50', width: '40', depth: '25' });

		await expect(page.getByRole('button', { name: /^Non-Compliant Airlines/ })).toBeVisible();
		await expect(page.getByRole('button', { name: /^Compliant Airlines/ })).toBeVisible();

		const tablesContainer = page.getByTestId('compliance-sections');
		await expect(tablesContainer).toBeVisible();

		await expect(page.getByTestId('non-compliant-section')).toHaveClass(/xl:max-w-\[50%\]/);
		await expect(page.getByTestId('compliant-section')).toHaveClass(/xl:max-w-\[50%\]/);
	});

	test('should keep both sections expanded on large screens', async ({ page }) => {
		await setBagDimensions(page, { height: '50', width: '40', depth: '25' });

		await expect(page.getByTestId('non-compliant-table')).toBeVisible();
		await expect(page.getByTestId('compliant-table')).toBeVisible();

		await page.getByRole('button', { name: /^Non-Compliant Airlines/ }).click();
		await page.getByRole('button', { name: /^Compliant Airlines/ }).click();

		await expect(page.getByTestId('non-compliant-table')).toBeVisible();
		await expect(page.getByTestId('compliant-table')).toBeVisible();
	});

	test('should show single table layout when only one category exists', async ({ page }) => {
		await setBagDimensions(page, { height: '1', width: '1', depth: '1' });

		await expect(page.getByTestId('compliant-table')).toBeVisible();
		await expect(page.getByTestId('non-compliant-table')).not.toBeVisible();

		await setBagDimensions(page, { height: '100', width: '100', depth: '100' });

		await expect(page.getByTestId('non-compliant-table')).toBeVisible();
		await expect(page.getByTestId('compliant-table')).not.toBeVisible();
	});
});

test.describe('Mobile screen table layout', () => {
	test.beforeEach(async ({ app, page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await app.gotoHome();
	});

	test('should display sections in single column and allow toggling', async ({ page }) => {
		await setBagDimensions(page, { height: '50', width: '40', depth: '25' });

		await expect(page.getByTestId('compliance-sections')).toHaveClass(/flex flex-col/);

		await expect(page.getByTestId('non-compliant-table')).toBeVisible();
		await expect(page.getByTestId('compliant-table')).not.toBeVisible();

		const compliantButton = page.getByRole('button', { name: /^Compliant Airlines/ });
		await compliantButton.click();

		await expect(page.getByTestId('non-compliant-table')).not.toBeVisible();
		await expect(page.getByTestId('compliant-table')).toBeVisible();

		const nonCompliantButton = page.getByRole('button', { name: /^Non-Compliant Airlines/ });
		await nonCompliantButton.click();

		await expect(page.getByTestId('non-compliant-table')).toBeVisible();
		await expect(page.getByTestId('compliant-table')).not.toBeVisible();
	});

	test('should scroll to opened section', async ({ page }) => {
		await setBagDimensions(page, { height: '50', width: '40', depth: '25' });

		await expect(page.getByTestId('non-compliant-table')).toBeVisible();
		await expect(page.getByTestId('compliant-table')).not.toBeVisible();

		const initialScrollY = await page.evaluate(() => window.scrollY);

		const compliantButton = page.getByRole('button', { name: /^Compliant Airlines/ });
		await compliantButton.click();

		await page.waitForTimeout(100);

		const newScrollY = await page.evaluate(() => window.scrollY);

		expect(newScrollY).toBeGreaterThan(initialScrollY);

		await expect(page.getByTestId('compliant-table')).toBeVisible();
		await expect(page.getByTestId('non-compliant-table')).not.toBeVisible();

		const nonCompliantButton = page.getByRole('button', { name: /^Non-Compliant Airlines/ });
		await nonCompliantButton.click();

		await page.waitForTimeout(100);

		const finalScrollY = await page.evaluate(() => window.scrollY);

		expect(finalScrollY).toBeLessThan(newScrollY);

		await expect(page.getByTestId('non-compliant-table')).toBeVisible();
		await expect(page.getByTestId('compliant-table')).not.toBeVisible();
	});
});
