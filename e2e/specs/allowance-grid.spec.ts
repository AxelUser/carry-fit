import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures/test';
import { getAirlineAllowances } from '../helpers/ui';

const allowancesGrid = (page: Page) => page.getByTestId('allowances-grid');
const sortButton = (page: Page) => page.getByRole('button', { name: 'Sort airlines', exact: true });
const airlineNames = (page: Page) => getAirlineAllowances(page).getByTestId('airline-name');

test.describe('Allowance grid interaction', () => {
	test.beforeEach(async ({ app }) => {
		await app.gotoHome();
	});

	test('should display airline allowances grid by default', async ({ page }) => {
		await expect(allowancesGrid(page)).toBeVisible();

		const cards = getAirlineAllowances(page);
		await expect(cards.first()).toBeVisible();

		await expect(airlineNames(page).filter({ hasText: /^Finnair$/ })).toBeVisible();
	});

	test('should sort airlines correctly', async ({ page }) => {
		await expect(allowancesGrid(page)).toBeVisible();

		const initial = (await airlineNames(page).allTextContents()).map((name) => name.trim());
		expect(initial.length).toBeGreaterThan(1);

		await sortButton(page).click();

		const updated = (await airlineNames(page).allTextContents()).map((name) => name.trim());

		expect(updated).not.toEqual(initial);
		expect(updated[0]).toBe(initial[initial.length - 1]);
		expect(updated[updated.length - 1]).toBe(initial[0]);
		expect(updated).toEqual([...initial].reverse());
	});
});
