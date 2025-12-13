import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures/test';
import { openParseDialog, setBagDimensions, switchUnits } from '../helpers/ui';

const heightInput = (page: Page) => page.getByLabel('Height');
const widthInput = (page: Page) => page.getByLabel('Width');
const depthInput = (page: Page) => page.getByLabel('Depth');
const parseDialog = (page: Page) => page.getByRole('dialog');
const parseTextbox = (page: Page) => parseDialog(page).getByRole('textbox');
const parseDimensionsButton = (page: Page) =>
	parseDialog(page).getByRole('button', { name: 'Parse Dimensions', exact: true });
const cancelParseButton = (page: Page) =>
	parseDialog(page).getByRole('button', { name: 'Cancel', exact: true });
const complianceSection = (page: Page) => page.getByTestId('compliance-score');

test.describe('Bag dimension parsing', () => {
	test.beforeEach(async ({ app }) => {
		await app.gotoHome();
	});

	test('should parse valid dimensions string and set bag dimensions', async ({ page }) => {
		await expect(complianceSection(page)).not.toBeVisible();

		await openParseDialog(page);

		await parseTextbox(page).fill('34.0 x 53.0 x 19.0 cm');
		await parseDimensionsButton(page).click();

		await expect(parseDialog(page)).not.toBeVisible();

		await expect(heightInput(page)).toHaveValue('34');
		await expect(widthInput(page)).toHaveValue('53');
		await expect(depthInput(page)).toHaveValue('19');

		await expect(complianceSection(page)).toBeVisible();
	});

	test('should show error for invalid dimensions string', async ({ page }) => {
		const initialHeight = await heightInput(page).inputValue();
		const initialWidth = await widthInput(page).inputValue();
		const initialDepth = await depthInput(page).inputValue();

		await openParseDialog(page);

		await parseTextbox(page).fill('This is not a dimension string');
		await parseDimensionsButton(page).click();

		await expect(page.getByText(/No dimensions found/)).toBeVisible();

		await expect(parseDialog(page)).toBeVisible();

		await expect(heightInput(page)).toHaveValue(initialHeight);
		await expect(widthInput(page)).toHaveValue(initialWidth);
		await expect(depthInput(page)).toHaveValue(initialDepth);
		await expect(complianceSection(page)).not.toBeVisible();
	});

	test('should not affect dimensions when dialog is cancelled', async ({ page }) => {
		await setBagDimensions(page, { height: '50', width: '40', depth: '25' });

		await openParseDialog(page);

		await parseTextbox(page).fill('34.0 x 53.0 x 19.0 cm');
		await cancelParseButton(page).click();

		await expect(parseDialog(page)).not.toBeVisible();

		await expect(heightInput(page)).toHaveValue('50');
		await expect(widthInput(page)).toHaveValue('40');
		await expect(depthInput(page)).toHaveValue('25');
		await expect(complianceSection(page)).toBeVisible();
	});

	test('should parse dimensions according to selected measurement system', async ({ page }) => {
		await switchUnits(page, 'imperial');

		await openParseDialog(page);

		await parseTextbox(page).fill('34.0 x 53.0 x 19.0 cm / 13.39 x 20.87 x 7.48in');
		await parseDimensionsButton(page).click();

		await expect(parseDialog(page)).not.toBeVisible();

		await expect(heightInput(page)).toHaveValue('13.39');
		await expect(widthInput(page)).toHaveValue('20.87');
		await expect(depthInput(page)).toHaveValue('7.48');

		await switchUnits(page, 'metric');
		await openParseDialog(page);
		await parseTextbox(page).fill('34.0 x 53.0 x 19.0 cm / 13.39 x 20.87 x 7.48in');
		await parseDimensionsButton(page).click();

		await expect(heightInput(page)).toHaveValue('34');
		await expect(widthInput(page)).toHaveValue('53');
		await expect(depthInput(page)).toHaveValue('19');
		await expect(complianceSection(page)).toBeVisible();
	});
});
