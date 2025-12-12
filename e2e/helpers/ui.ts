import { Locator, Page, expect } from '@playwright/test';

export async function setBagDimensions(
	page: Page,
	dimensions: { height: string; width: string; depth: string }
) {
	await page.getByLabel('Height').fill(dimensions.height);
	await page.getByLabel('Width').fill(dimensions.width);
	await page.getByLabel('Depth').fill(dimensions.depth);
}

export async function switchUnits(page: Page, units: 'metric' | 'imperial') {
	const button = page.getByTestId(`${units}-button`);
	await button.click();
	await expect(button).toHaveAttribute('data-active', 'true');
}

export async function openParseDialog(page: Page) {
	await page.getByRole('button', { name: /Parse/i }).click();
	await expect(page.getByRole('dialog')).toBeVisible();
}

export async function openFavoritesDialog(page: Page) {
	await page.getByRole('button', { name: /Manage favorite airlines/i }).click();
	await expect(page.getByTestId('favorite-airlines-dialog')).toBeVisible();
}

export function getAirlineAllowances(page: Page): Locator {
	return page.getByTestId('allowances-grid').getByTestId('airline-card');
}
