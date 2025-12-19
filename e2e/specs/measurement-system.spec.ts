import { test, expect } from '../fixtures/test';
import { getAirlineAllowances, switchUnits } from '../helpers/ui';

test.describe('Measurement system updates', () => {
	test.beforeEach(async ({ app }) => {
		await app.gotoHome();
	});

	test('should update units in table when measurement system changes', async ({ page }) => {
		test.slow();

		const allowances = getAirlineAllowances(page);
		const firstDimension = allowances
			.locator('[data-testid="length"],[data-testid="total-dimensions"]')
			.first();

		await expect(firstDimension).toContainText('cm');

		const [weightLimitsMetric, lengthsMetric, widthsMetric, depthsMetric] = await Promise.all([
			allowances.getByTestId('weight-limit').allTextContents(),
			allowances.getByTestId('length').allTextContents(),
			allowances.getByTestId('width').allTextContents(),
			allowances.getByTestId('depth').allTextContents()
		]);

		expect(weightLimitsMetric.length).toBeGreaterThan(0);
		expect(lengthsMetric.length).toBeGreaterThan(0);
		expect(widthsMetric.length).toBeGreaterThan(0);
		expect(depthsMetric.length).toBeGreaterThan(0);

		for (const text of weightLimitsMetric) {
			if (text === 'N/A') {
				continue;
			}
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

		await switchUnits(page, 'imperial');
		await expect(firstDimension).toContainText('in');

		const [weightLimitsImperial, lengthsImperial, widthsImperial, depthsImperial] =
			await Promise.all([
				allowances.getByTestId('weight-limit').allTextContents(),
				allowances.getByTestId('length').allTextContents(),
				allowances.getByTestId('width').allTextContents(),
				allowances.getByTestId('depth').allTextContents()
			]);

		expect(weightLimitsImperial.length).toBeGreaterThan(0);
		expect(lengthsImperial.length).toBeGreaterThan(0);
		expect(widthsImperial.length).toBeGreaterThan(0);
		expect(depthsImperial.length).toBeGreaterThan(0);

		for (const text of weightLimitsImperial) {
			if (text === 'N/A') {
				continue;
			}
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
	});

	test('should persist measurement system preference across page reloads', async ({ page }) => {
		await expect(page.getByTestId('metric-button')).toHaveAttribute('data-active', 'true');
		await expect(page.getByTestId('imperial-button')).toHaveAttribute('data-active', 'false');

		await page.reload();

		await expect(page.getByTestId('metric-button')).toHaveAttribute('data-active', 'true');
		await expect(page.getByTestId('imperial-button')).toHaveAttribute('data-active', 'false');
	});
});
