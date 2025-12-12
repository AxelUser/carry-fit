import { test, expect } from '../fixtures/test';

test.describe('Allowance table interaction', () => {
	test.beforeEach(async ({ app }) => {
		await app.gotoHome({ waitForAllowances: true });
	});

	test('should display airline allowances table by default', async ({ page }) => {
		const headers = ['Airline', 'Region', 'Carry-On (cm)', 'Weight', 'Policy'];
		for (const header of headers) {
			await expect(page.getByRole('columnheader', { name: header })).toBeVisible();
		}

		await expect(page.getByRole('cell', { name: /Finnair/i })).toBeVisible();
	});

	test('should sort airlines correctly', async ({ page }) => {
		const airlineSortButton = page.getByRole('button', { name: /^Airline/ });
		await airlineSortButton.click();

		const ascAirlines = await page.$$eval('tbody tr td:nth-child(2)', (cells) =>
			cells.map((cell) => cell.textContent?.trim())
		);

		await airlineSortButton.click();

		const descAirlines = await page.$$eval('tbody tr td:nth-child(2)', (cells) =>
			cells.map((cell) => cell.textContent?.trim())
		);

		expect(ascAirlines).not.toEqual(descAirlines);
		expect(ascAirlines).toEqual([...descAirlines].reverse());
	});
});
