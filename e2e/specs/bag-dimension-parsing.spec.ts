import { test, expect } from '../fixtures/test';
import { openParseDialog, setBagDimensions, switchUnits } from '../helpers/ui';

test.describe('Bag dimension parsing', () => {
	test.beforeEach(async ({ app }) => {
		await app.gotoHome();
	});

	test('should parse valid dimensions string and set bag dimensions', async ({ page }) => {
		await openParseDialog(page);

		await page.getByRole('dialog').getByRole('textbox').fill('34.0 x 53.0 x 19.0 cm');
		await page.getByRole('dialog').getByRole('button', { name: 'Parse Dimensions' }).click();

		await expect(page.getByRole('dialog')).not.toBeVisible();

		await expect(page.getByLabel('Height')).toHaveValue('34');
		await expect(page.getByLabel('Width')).toHaveValue('53');
		await expect(page.getByLabel('Depth')).toHaveValue('19');

		await expect(page.getByText(/Compliance Score/)).toBeVisible();
	});

	test('should show error for invalid dimensions string', async ({ page }) => {
		const initialHeight = await page.getByLabel('Height').inputValue();
		const initialWidth = await page.getByLabel('Width').inputValue();
		const initialDepth = await page.getByLabel('Depth').inputValue();

		await openParseDialog(page);

		await page.getByRole('dialog').getByRole('textbox').fill('This is not a dimension string');
		await page.getByRole('dialog').getByRole('button', { name: 'Parse Dimensions' }).click();

		await expect(page.getByText(/No dimensions found/)).toBeVisible();

		await expect(page.getByRole('dialog')).toBeVisible();

		await expect(page.getByLabel('Height')).toHaveValue(initialHeight);
		await expect(page.getByLabel('Width')).toHaveValue(initialWidth);
		await expect(page.getByLabel('Depth')).toHaveValue(initialDepth);
	});

	test('should not affect dimensions when dialog is cancelled', async ({ page }) => {
		await setBagDimensions(page, { height: '50', width: '40', depth: '25' });

		await openParseDialog(page);

		await page.getByRole('dialog').getByRole('textbox').fill('34.0 x 53.0 x 19.0 cm');
		await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();

		await expect(page.getByRole('dialog')).not.toBeVisible();

		await expect(page.getByLabel('Height')).toHaveValue('50');
		await expect(page.getByLabel('Width')).toHaveValue('40');
		await expect(page.getByLabel('Depth')).toHaveValue('25');
	});

	test('should parse dimensions according to selected measurement system', async ({ page }) => {
		await switchUnits(page, 'imperial');

		await openParseDialog(page);

		await page
			.getByRole('dialog')
			.getByRole('textbox')
			.fill('34.0 x 53.0 x 19.0 cm / 13.39 x 20.87 x 7.48in');
		await page.getByRole('dialog').getByRole('button', { name: 'Parse Dimensions' }).click();

		await expect(page.getByRole('dialog')).not.toBeVisible();

		await expect(page.getByLabel('Height')).toHaveValue('13.39');
		await expect(page.getByLabel('Width')).toHaveValue('20.87');
		await expect(page.getByLabel('Depth')).toHaveValue('7.48');

		await switchUnits(page, 'metric');
		await openParseDialog(page);
		await page
			.getByRole('dialog')
			.getByRole('textbox')
			.fill('34.0 x 53.0 x 19.0 cm / 13.39 x 20.87 x 7.48in');
		await page.getByRole('dialog').getByRole('button', { name: 'Parse Dimensions' }).click();

		await expect(page.getByLabel('Height')).toHaveValue('34');
		await expect(page.getByLabel('Width')).toHaveValue('53');
		await expect(page.getByLabel('Depth')).toHaveValue('19');
	});
});
