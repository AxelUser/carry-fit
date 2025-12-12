import { test, expect } from '../fixtures/test';
import { setBagDimensions } from '../helpers/ui';

test.describe('Bag sharing functionality', () => {
	test.beforeEach(async ({ app }) => {
		await app.gotoHome();
	});

	test('should copy bag dimensions link to clipboard', async ({ page, context }) => {
		await context.grantPermissions(['clipboard-read', 'clipboard-write']);

		await setBagDimensions(page, { height: '50', width: '40', depth: '25' });

		const shareButton = page.getByRole('button', { name: /Copy/i });
		await shareButton.click();

		const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
		expect(clipboardText).toMatch(/\?height=50&width=40&depth=25&units=metric$/);
	});

	test('should load bag dimensions from URL parameters', async ({ app, page }) => {
		await page.goto('/?height=45&width=35&depth=20&units=imperial', { waitUntil: 'networkidle' });
		await app.expectReady();

		await expect(page.getByLabel('Height')).toHaveValue('45');
		await expect(page.getByLabel('Width')).toHaveValue('35');
		await expect(page.getByLabel('Depth')).toHaveValue('20');

		await expect(page.getByTestId('imperial-button')).toHaveAttribute('data-active', 'true');
	});

	test('should start with empty values if URL parameters are incomplete', async ({ app, page }) => {
		await page.goto('/?height=45&width=35', { waitUntil: 'networkidle' });
		await app.expectReady();

		await expect(page.getByLabel('Height')).toHaveValue('0');
		await expect(page.getByLabel('Width')).toHaveValue('0');
		await expect(page.getByLabel('Depth')).toHaveValue('0');
	});

	test('should clear URL parameters when dimensions are changed', async ({ app, page }) => {
		await page.goto('/?height=45&width=35&depth=20&units=metric', { waitUntil: 'networkidle' });
		await app.expectReady();

		expect(page.url()).toMatch(/\?height=45&width=35&depth=20&units=metric$/);

		await page.getByLabel('Height').fill('50', { timeout: 5000 });

		expect(page.url()).not.toContain('height=');
		expect(page.url()).not.toContain('width=');
		expect(page.url()).not.toContain('depth=');
		expect(page.url()).not.toContain('units=');
	});

	test('should clear URL parameters when measurement system is changed', async ({ app, page }) => {
		await page.goto('/?height=45&width=35&depth=20&units=metric', { waitUntil: 'networkidle' });
		await app.expectReady();

		await page.getByRole('button', { name: /Imperial/i }).click();

		expect(page.url()).not.toContain('height=');
		expect(page.url()).not.toContain('width=');
		expect(page.url()).not.toContain('depth=');
		expect(page.url()).not.toContain('units=');
	});

	test('should handle invalid measurement system in URL', async ({ app, page }) => {
		await page.goto('/?height=45&width=35&depth=20&units=invalid', { waitUntil: 'networkidle' });
		await app.expectReady();

		await expect(page.getByLabel('Height')).toHaveValue('0');
		await expect(page.getByLabel('Width')).toHaveValue('0');
		await expect(page.getByLabel('Depth')).toHaveValue('0');

		await expect(page.getByTestId('metric-button')).toHaveAttribute('data-active', 'true');
	});

	test('should handle non-numeric dimensions in URL', async ({ page }) => {
		await page.goto('/?height=abc&width=35&depth=20&units=metric', { waitUntil: 'networkidle' });

		await expect(page.getByLabel('Height')).toHaveValue('0');
		await expect(page.getByLabel('Width')).toHaveValue('0');
		await expect(page.getByLabel('Depth')).toHaveValue('0');
	});
});
