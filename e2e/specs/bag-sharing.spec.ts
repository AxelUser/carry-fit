import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures/test';
import { setBagDimensions, switchUnits } from '../helpers/ui';

const heightInput = (page: Page) => page.getByLabel('Height');
const widthInput = (page: Page) => page.getByLabel('Width');
const depthInput = (page: Page) => page.getByLabel('Depth');
const metricButton = (page: Page) => page.getByTestId('metric-button');
const imperialButton = (page: Page) => page.getByTestId('imperial-button');
const copyShareLinkButton = (page: Page) => page.getByRole('button', { name: 'Copy', exact: true });

test.describe('Bag sharing functionality', () => {
	test.beforeEach(async ({ app }) => {
		await app.gotoHome();
	});

	test('should copy bag dimensions link to clipboard', async ({ page, context }) => {
		await context.grantPermissions(['clipboard-read', 'clipboard-write']);

		await setBagDimensions(page, { height: '50', width: '40', depth: '25' });

		await copyShareLinkButton(page).click();

		const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
		const url = new URL(clipboardText);
		expect(url.searchParams.get('height')).toBe('50');
		expect(url.searchParams.get('width')).toBe('40');
		expect(url.searchParams.get('depth')).toBe('25');
		expect(url.searchParams.get('units')).toBe('metric');
	});

	test('should load bag dimensions from URL parameters', async ({ app, page }) => {
		await page.goto('/?height=45&width=35&depth=20&units=imperial', { waitUntil: 'networkidle' });
		await app.expectReady();

		await expect(heightInput(page)).toHaveValue('45');
		await expect(widthInput(page)).toHaveValue('35');
		await expect(depthInput(page)).toHaveValue('20');

		await expect(imperialButton(page)).toHaveAttribute('data-active', 'true');
	});

	test('should start with empty values if URL parameters are incomplete', async ({ app, page }) => {
		await page.goto('/?height=45&width=35', { waitUntil: 'networkidle' });
		await app.expectReady();

		await expect(heightInput(page)).toHaveValue('');
		await expect(widthInput(page)).toHaveValue('');
		await expect(depthInput(page)).toHaveValue('');
		await expect(metricButton(page)).toHaveAttribute('data-active', 'true');
	});

	test('should clear URL parameters when dimensions are changed', async ({ app, page }) => {
		await page.goto('/?height=45&width=35&depth=20&units=metric', { waitUntil: 'networkidle' });
		await app.expectReady();

		await expect(page).toHaveURL(/\?height=45&width=35&depth=20&units=metric$/);

		await heightInput(page).fill('50');

		await expect.poll(() => new URL(page.url()).searchParams.size).toBe(0);
	});

	test('should clear URL parameters when measurement system is changed', async ({ app, page }) => {
		await page.goto('/?height=45&width=35&depth=20&units=metric', { waitUntil: 'networkidle' });
		await app.expectReady();

		await switchUnits(page, 'imperial');

		await expect.poll(() => new URL(page.url()).searchParams.size).toBe(0);
	});

	test('should handle invalid measurement system in URL', async ({ app, page }) => {
		await page.goto('/?height=45&width=35&depth=20&units=invalid', { waitUntil: 'networkidle' });
		await app.expectReady();

		await expect(heightInput(page)).toHaveValue('');
		await expect(widthInput(page)).toHaveValue('');
		await expect(depthInput(page)).toHaveValue('');

		await expect(metricButton(page)).toHaveAttribute('data-active', 'true');
	});

	test('should handle non-numeric dimensions in URL', async ({ app, page }) => {
		await page.goto('/?height=abc&width=35&depth=20&units=metric', { waitUntil: 'networkidle' });
		await app.expectReady();

		await expect(heightInput(page)).toHaveValue('');
		await expect(widthInput(page)).toHaveValue('');
		await expect(depthInput(page)).toHaveValue('');
		await expect(metricButton(page)).toHaveAttribute('data-active', 'true');
	});
});
