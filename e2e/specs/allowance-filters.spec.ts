import { Locator, Page } from '@playwright/test';
import { test, expect } from '../fixtures/test';
import { getAirlineAllowances } from '../helpers/ui';
import { allowances } from '../../src/lib/allowances/cabin-luggage-allowances';

const MAX_VISIBLE_FILTERS = 16;

test.describe('Allowance Filters', () => {
	async function scrollComboboxIntoView(comboboxButton: Locator) {
		await comboboxButton.evaluate((el) => {
			const rect = el.getBoundingClientRect();
			const viewportHeight = window.innerHeight;
			const popoverHeight = 300;
			const requiredSpace = rect.bottom + popoverHeight + 20;

			if (requiredSpace > viewportHeight) {
				const scrollOffset = requiredSpace - viewportHeight;
				window.scrollBy({ top: scrollOffset, behavior: 'instant' });
			} else if (rect.top < 0) {
				el.scrollIntoView({ block: 'start', behavior: 'instant' });
			}
		});
	}

	async function openFilter(page: Page, filterType: 'airlines' | 'regions') {
		const cardName = filterType === 'airlines' ? /By Airlines/i : /By Regions/i;
		const filterCard = page.getByRole('button', { name: cardName });
		await filterCard.click();
		return filterCard.getByRole('combobox');
	}

	async function openCombobox(comboboxButton: Locator) {
		await scrollComboboxIntoView(comboboxButton);
		await comboboxButton.click();
		const comboboxContent = comboboxButton.page().getByTestId('combobox-content');
		await expect(comboboxContent).toBeVisible();
		return comboboxContent;
	}

	async function selectComboboxOption(comboboxContent: Locator, optionName: string) {
		const option = comboboxContent.getByRole('option', { name: optionName, exact: true });
		await expect(option).toBeVisible();
		await option.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
		await comboboxContent.page().waitForTimeout(100);
		await option.click();
	}

	async function searchInCombobox(
		comboboxContent: Locator,
		searchTerm: string,
		placeholder: string = 'Search airlines...'
	) {
		const searchInput = comboboxContent.getByPlaceholder(placeholder);
		await searchInput.fill(searchTerm);
		return searchInput;
	}

	test.beforeEach(async ({ app }) => {
		await app.gotoHome();
	});

	test('should filter by region', async ({ page }) => {
		const initialCount = await getAirlineAllowances(page).count();
		expect(initialCount).toBeGreaterThan(0);

		const comboboxButton = await openFilter(page, 'regions');
		const comboboxContent = await openCombobox(comboboxButton);

		await selectComboboxOption(comboboxContent, 'Europe');

		await page.keyboard.press('Escape');
		await expect(comboboxContent).not.toBeVisible();

		const filteredAllowances = getAirlineAllowances(page);
		const filteredCount = await filteredAllowances.count();

		expect(filteredCount).toBeGreaterThan(0);

		for (const regionCell of await filteredAllowances.getByTestId('region').all()) {
			await expect(regionCell).toHaveText('Europe');
		}
	});

	test('should filter by airline', async ({ page }) => {
		const initialCount = await getAirlineAllowances(page).count();
		expect(initialCount).toBeGreaterThan(0);

		const comboboxButton = await openFilter(page, 'airlines');
		const comboboxContent = await openCombobox(comboboxButton);

		await searchInCombobox(comboboxContent, 'Finnair');
		await selectComboboxOption(comboboxContent, 'Finnair');

		await page.keyboard.press('Escape');

		const filteredAllowances = getAirlineAllowances(page);
		const filteredCount = await filteredAllowances.count();

		expect(filteredCount).toBe(1);
		await expect(filteredAllowances.getByTestId('airline-name')).toHaveText('Finnair');
	});

	test('should search in combobox', async ({ page }) => {
		const comboboxButton = await openFilter(page, 'airlines');
		const comboboxContent = await openCombobox(comboboxButton);

		await searchInCombobox(comboboxContent, 'Finnair');

		const finnairOption = comboboxContent.getByRole('option', { name: 'Finnair' });
		await expect(finnairOption).toBeVisible();

		await searchInCombobox(comboboxContent, 'xyz123');
		await expect(comboboxContent.getByText('No items found')).toBeVisible();
	});

	test('should show and remove filter chips', async ({ page }) => {
		const comboboxButton = await openFilter(page, 'regions');
		const comboboxContent = await openCombobox(comboboxButton);

		await selectComboboxOption(comboboxContent, 'Europe');

		await page.keyboard.press('Escape');

		const currentFilters = page.getByTestId('current-filters');
		await expect(currentFilters).toBeVisible();

		const filterChip = currentFilters.getByTestId('filter-chip').filter({ hasText: 'Europe' });
		await expect(filterChip).toBeVisible();

		const removeButton = filterChip.getByTestId('filter-chip-remove');
		await expect(removeButton).toBeVisible();
		await removeButton.click();

		await expect(filterChip).not.toBeVisible();
	});

	test('should clear all filters', async ({ page }) => {
		const comboboxButton = await openFilter(page, 'regions');
		const comboboxContent = await openCombobox(comboboxButton);

		await selectComboboxOption(comboboxContent, 'Europe');

		const asiaOption = comboboxContent.getByRole('option', { name: 'Asia' });
		if (await asiaOption.isVisible()) {
			await selectComboboxOption(comboboxContent, 'Asia');
		}

		await page.keyboard.press('Escape');

		const clearAllButton = page.getByRole('button', { name: 'Clear all' });
		await expect(clearAllButton).toBeVisible();
		await clearAllButton.click();

		await expect(page.getByTestId('current-filters')).not.toBeVisible();
	});

	test('should switch between region and airline filter modes', async ({ page }) => {
		const regionsCard = page.getByRole('button', { name: /By Regions/i });
		const airlinesCard = page.getByRole('button', { name: /By Airlines/i });

		await expect(regionsCard).toBeVisible();
		await expect(airlinesCard).toBeVisible();

		await airlinesCard.click();

		const airlinesCombobox = airlinesCard.getByRole('combobox');
		await expect(airlinesCombobox).toBeEnabled();

		const regionsCombobox = regionsCard.getByRole('combobox');
		await expect(regionsCombobox).toBeDisabled();

		const comboboxButton = await openFilter(page, 'airlines');
		const comboboxContent = await openCombobox(comboboxButton);

		await searchInCombobox(comboboxContent, 'Finnair');
		await selectComboboxOption(comboboxContent, 'Finnair');

		await page.keyboard.press('Escape');

		const currentFilters = page.getByTestId('current-filters');
		const filterChip = currentFilters.getByTestId('filter-chip').filter({ hasText: 'Finnair' });
		await expect(filterChip).toBeVisible();

		await regionsCard.click();

		await expect(page.getByTestId('current-filters')).not.toBeVisible();
	});

	test('should show "Show all" dialog when many filters are selected', async ({ page }) => {
		const comboboxButton = await openFilter(page, 'airlines');
		const comboboxContent = await openCombobox(comboboxButton);

		const uniqueAirlines = [...new Set(allowances.map((a) => a.airline))].sort();
		const airlinesToSelect = uniqueAirlines.slice(0, MAX_VISIBLE_FILTERS + 1);

		for (const airline of airlinesToSelect) {
			await searchInCombobox(comboboxContent, airline);
			await selectComboboxOption(comboboxContent, airline);
		}

		await page.keyboard.press('Escape');

		const showAllLink = page.getByRole('button', { name: /\d+ more\.\.\./i });
		await showAllLink.click();

		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();
		await expect(dialog.getByText(/Selected Airlines/i)).toBeVisible();

		const clearAllButton = dialog.getByRole('button', { name: 'Clear all' });
		await clearAllButton.click();

		await expect(dialog).not.toBeVisible();
	});
});
