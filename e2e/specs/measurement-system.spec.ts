import { test, expect } from '../fixtures/test';

test.describe('Measurement system updates', () => {
	test.beforeEach(async ({ app }) => {
		await app.gotoHome();
	});

	test('should update units in table when measurement system changes', async ({ page }) => {
		await expect(page.getByRole('columnheader', { name: 'Carry-On (cm)' })).toBeVisible();

		await page.getByRole('button', { name: /Imperial/i }).click();

		await expect(page.getByRole('columnheader', { name: 'Carry-On (in)' })).toBeVisible();

		for (const weightCell of await page
			.getByTestId('airline-card')
			.getByTestId('weight-limit')
			.all()) {
			await expect(weightCell.getByText(/lb|N\/A/)).toBeVisible();
		}

		await page.getByRole('button', { name: /Metric/i }).click();

		for (const weightCell of await page
			.getByTestId('airline-card')
			.getByTestId('weight-limit')
			.all()) {
			await expect(weightCell.getByText(/kg|N\/A/)).toBeVisible();
		}
	});

	test('should persist measurement system preference across page reloads', async ({
		app,
		page
	}) => {
		await expect(page.getByTestId('metric-button')).toHaveAttribute('data-active', 'true');
		await expect(page.getByRole('columnheader', { name: 'Carry-On (cm)' })).toBeVisible();

		await page.getByRole('button', { name: /Imperial/i }).click();
		await expect(page.getByTestId('imperial-button')).toHaveAttribute('data-active', 'true');
		await expect(page.getByRole('columnheader', { name: 'Carry-On (in)' })).toBeVisible();

		await page.reload();
		await expect(page.getByText('CarryFit', { exact: true })).toBeVisible();

		await expect(page.getByTestId('imperial-button')).toHaveAttribute('data-active', 'true');
		await expect(page.getByRole('columnheader', { name: 'Carry-On (in)' })).toBeVisible();

		await page.getByRole('button', { name: /Metric/i }).click();
		await expect(page.getByTestId('metric-button')).toHaveAttribute('data-active', 'true');
		await expect(page.getByRole('columnheader', { name: 'Carry-On (cm)' })).toBeVisible();

		await page.reload();
		await expect(page.getByText('CarryFit', { exact: true })).toBeVisible();

		await expect(page.getByTestId('metric-button')).toHaveAttribute('data-active', 'true');
		await expect(page.getByRole('columnheader', { name: 'Carry-On (cm)' })).toBeVisible();
	});
});
