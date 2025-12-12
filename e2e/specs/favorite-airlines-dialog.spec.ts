import { test, expect } from '../fixtures/test';
import { Page } from '@playwright/test';

function getPopover(page: Page) {
	return page.getByTestId('favorite-airlines-search-popover');
}

function getOptions(page: Page) {
	return getPopover(page).getByRole('option');
}

function getAirlineOption(page: Page, airline: string) {
	return getOptions(page).filter({ hasText: airline });
}

function getRemoveButton(page: Page, airline: string) {
	return page.getByRole('button').filter({ hasText: `Remove ${airline}` });
}

async function openSearchPopover(page: Page) {
	await page.getByTestId('favorite-airlines-search-button').click();
	await expect(getPopover(page)).toBeVisible();
}

async function closeSearchPopover(page: Page) {
	await page.getByTestId('favorite-airlines-search-button').click();
	await expect(getPopover(page)).not.toBeVisible();
}

async function openFavoriteAirlinesDialog(page: Page) {
	await page.getByRole('button', { name: /Manage favorite airlines/i }).click();
	await expect(page.getByTestId('favorite-airlines-dialog')).toBeVisible();
}

async function closeFavoriteAirlinesDialog(page: Page) {
	await page.getByTestId('favorite-airlines-dialog-close-button').click();
	await expect(page.getByTestId('favorite-airlines-dialog')).not.toBeVisible();
}

async function fillSearchQuery(page: Page, query: string) {
	const input = getPopover(page).getByPlaceholder('Search airlines...');
	await input.fill('', { timeout: 5000 });
	await expect(input).toHaveValue('');
	await input.fill(query, { timeout: 5000 });
	await expect(input).toHaveValue(query);
}

test.describe('Favorite Airlines Dialog', () => {
	test.beforeEach(async ({ app, page }) => {
		await app.gotoHome({ waitForAllowances: true });
		await openFavoriteAirlinesDialog(page);
	});

	test('should search and filter airlines in dialog', async ({ page }) => {
		await openSearchPopover(page);

		await expect(getOptions(page).first()).toBeVisible();
		const initialAirlines = await getOptions(page).count();
		expect(initialAirlines).toBeGreaterThan(0);

		await fillSearchQuery(page, 'Finnair');

		const filteredAirlines = await getOptions(page).count();
		expect(filteredAirlines).toBe(1);

		await expect(getOptions(page)).toContainText('Finnair');

		await fillSearchQuery(page, '');

		const finalAirlines = await getOptions(page).count();
		expect(finalAirlines).toBe(initialAirlines);
	});

	test('should add and remove airlines from favorites in dialog', async ({ page }) => {
		await expect(page.getByText('No favorite airlines selected')).toBeVisible();

		await openSearchPopover(page);
		await fillSearchQuery(page, 'Finnair');
		await getAirlineOption(page, 'Finnair').click();
		await closeSearchPopover(page);

		await expect(page.getByText('Selected Airlines (1)')).toBeVisible();
		await expect(getRemoveButton(page, 'Finnair')).toBeVisible();

		await openSearchPopover(page);
		await fillSearchQuery(page, 'Lufthansa');
		await getAirlineOption(page, 'Lufthansa').click();
		await closeSearchPopover(page);

		await expect(page.getByText('Selected Airlines (2)')).toBeVisible();
		await expect(getRemoveButton(page, 'Finnair')).toBeVisible();
		await expect(getRemoveButton(page, 'Lufthansa')).toBeVisible();

		await getRemoveButton(page, 'Finnair').click();

		await expect(page.getByText('Selected Airlines (1)')).toBeVisible();
		await expect(getRemoveButton(page, 'Finnair')).not.toBeVisible();
		await expect(getRemoveButton(page, 'Lufthansa')).toBeVisible();
	});

	test('should persist favorites after dialog is closed and reopened', async ({ page }) => {
		await openSearchPopover(page);
		await fillSearchQuery(page, 'Finnair');
		await getAirlineOption(page, 'Finnair').click();
		await fillSearchQuery(page, 'Lufthansa');
		await getAirlineOption(page, 'Lufthansa').click();
		await closeSearchPopover(page);

		await closeFavoriteAirlinesDialog(page);

		await openFavoriteAirlinesDialog(page);

		await expect(page.getByText('Selected Airlines (2)')).toBeVisible();
		await expect(getRemoveButton(page, 'Finnair')).toBeVisible();
		await expect(getRemoveButton(page, 'Lufthansa')).toBeVisible();
	});

	test('should persist favorites after page refresh', async ({ app, page }) => {
		await openSearchPopover(page);
		await fillSearchQuery(page, 'Finnair');
		await getAirlineOption(page, 'Finnair').click();
		await fillSearchQuery(page, 'Lufthansa');
		await getAirlineOption(page, 'Lufthansa').click();
		await closeSearchPopover(page);

		await closeFavoriteAirlinesDialog(page);

		await page.reload();
		await app.expectReady();

		await openFavoriteAirlinesDialog(page);

		await expect(page.getByText('Selected Airlines (2)')).toBeVisible();
		await expect(getRemoveButton(page, 'Finnair')).toBeVisible();
		await expect(getRemoveButton(page, 'Lufthansa')).toBeVisible();
	});

	test('should show checkmarks next to selected airlines in search list', async ({ page }) => {
		await openSearchPopover(page);
		await fillSearchQuery(page, 'Finnair');
		await getAirlineOption(page, 'Finnair').click();

		const option = getAirlineOption(page, 'Finnair');
		await expect(option.getByTestId('favorite-airline-check-icon')).toHaveClass(/opacity-100/);

		await fillSearchQuery(page, 'Lufthansa');
		const otherOption = getAirlineOption(page, 'Lufthansa');
		await expect(otherOption.getByTestId('favorite-airline-check-icon')).toHaveClass(/opacity-0/);
	});

	test('should handle fuzzy search matching', async ({ page }) => {
		const searchTerms = ['fin', 'fn', 'fair'];
		await openSearchPopover(page);

		for (const term of searchTerms) {
			await fillSearchQuery(page, term);

			await expect(getAirlineOption(page, 'Finnair')).toBeVisible();
		}

		await fillSearchQuery(page, 'xyz123');
		await expect(page.getByText('No airlines found.')).toBeVisible();
	});
});
