import { test, expect } from '../fixtures/test';
import { getAirlineAllowances, switchUnits } from '../helpers/ui';

test.describe('Measurement system updates', () => {
	test.beforeEach(async ({ app, page }) => {
		await app.gotoHome();
		await expect(page.getByTestId('allowances-grid')).toBeVisible();
		await expect(getAirlineAllowances(page).first()).toBeVisible();
	});

	test('should update units in table when measurement system changes', async ({ page }) => {
		test.slow();

		const allowances = getAirlineAllowances(page);
		const firstDimension = allowances
			.locator('[data-testid="length"],[data-testid="total-dimensions"]')
			.first();

		await expect(firstDimension).toContainText('cm');

		const [weightLimitsMetric, lengthsMetric, widthsMetric, depthsMetric, totalDimensionsMetric] =
			await Promise.all([
				allowances.getByTestId('weight-limit').allTextContents(),
				allowances.getByTestId('length').allTextContents(),
				allowances.getByTestId('width').allTextContents(),
				allowances.getByTestId('depth').allTextContents(),
				allowances.getByTestId('total-dimensions').allTextContents()
			]);

		expect(weightLimitsMetric.length).toBeGreaterThan(0);
		expect(lengthsMetric.length).toBeGreaterThan(0);
		expect(widthsMetric.length).toBeGreaterThan(0);
		expect(depthsMetric.length).toBeGreaterThan(0);
		expect(totalDimensionsMetric.length).toBeGreaterThan(0);

		for (const text of weightLimitsMetric) {
			expect(text).toContain('kg');
		}
		for (const text of lengthsMetric) {
			expect(text).toContain('cm');
		}
		for (const text of widthsMetric) {
			expect(text).toContain('cm');
		}
		for (const text of depthsMetric) {
			expect(text).toContain('cm');
		}
		for (const text of totalDimensionsMetric) {
			expect(text).toContain('cm');
		}

		await switchUnits(page, 'imperial');
		await expect(firstDimension).toContainText('in');

		const [
			weightLimitsImperial,
			lengthsImperial,
			widthsImperial,
			depthsImperial,
			totalDimensionsImperial
		] = await Promise.all([
			allowances.getByTestId('weight-limit').allTextContents(),
			allowances.getByTestId('length').allTextContents(),
			allowances.getByTestId('width').allTextContents(),
			allowances.getByTestId('depth').allTextContents(),
			allowances.getByTestId('total-dimensions').allTextContents()
		]);

		expect(weightLimitsImperial.length).toBeGreaterThan(0);
		expect(lengthsImperial.length).toBeGreaterThan(0);
		expect(widthsImperial.length).toBeGreaterThan(0);
		expect(depthsImperial.length).toBeGreaterThan(0);
		expect(totalDimensionsImperial.length).toBeGreaterThan(0);

		for (const text of weightLimitsImperial) {
			expect(text).toContain('lb');
		}
		for (const text of lengthsImperial) {
			expect(text).toContain('in');
		}
		for (const text of widthsImperial) {
			expect(text).toContain('in');
		}
		for (const text of depthsImperial) {
			expect(text).toContain('in');
		}
		for (const text of totalDimensionsImperial) {
			expect(text).toContain('in');
		}
	});

	test('should persist measurement system preference across page reloads', async ({
		app,
		page
	}) => {
		await expect(page.getByTestId('metric-button')).toHaveAttribute('data-active', 'true');
		await expect(page.getByTestId('imperial-button')).toHaveAttribute('data-active', 'false');

		await page.reload();

		await expect(page.getByTestId('metric-button')).toHaveAttribute('data-active', 'true');
		await expect(page.getByTestId('imperial-button')).toHaveAttribute('data-active', 'false');
	});
});
