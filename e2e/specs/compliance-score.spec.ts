import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures/test';
import { getAirlineAllowances, setBagDimensions } from '../helpers/ui';

const complianceSection = (page: Page) => page.getByTestId('compliance-score');
const compliancePercentages = (page: Page) => page.getByTestId('compliance-score-percentage');
const complianceBars = (page: Page) => page.getByTestId('compliance-score-bar');

async function getComplianceScores(page: Page) {
	const percentages = compliancePercentages(page);
	const values = await percentages.allTextContents();
	return values.map((text) => parseInt(text.replace('%', ''), 10));
}

test.describe('Bag compliance scoring', () => {
	test.beforeEach(async ({ app }) => {
		await app.gotoHome();
	});

	test('shows compliance dashboard after entering bag dimensions', async ({ page }) => {
		await expect(complianceSection(page)).not.toBeVisible();

		await setBagDimensions(page, { height: '55', width: '40', depth: '23' });

		await expect(complianceSection(page)).toBeVisible();
		await expect(compliancePercentages(page)).toHaveCount(2);

		const bars = complianceBars(page);
		expect(await bars.count()).toBe(2);

		for (const bar of await bars.all()) {
			const widthStyle = await bar.evaluate((el) => el.getAttribute('style') ?? '');
			expect(widthStyle).toMatch(/width:\s*\d+(\.\d+)?%/);
		}
	});

	test('recalculates compliance scores when bag dimensions change', async ({ page }) => {
		await setBagDimensions(page, { height: '50', width: '35', depth: '22' });

		const [initialCarryOn, initialPersonalItem] = await getComplianceScores(page);

		await setBagDimensions(page, { height: '75', width: '55', depth: '35' });

		const [updatedCarryOn, updatedPersonalItem] = await getComplianceScores(page);

		expect(updatedCarryOn).toBeLessThan(initialCarryOn);
		expect(updatedPersonalItem).toBeLessThanOrEqual(initialPersonalItem);
		expect(updatedCarryOn).toBeGreaterThanOrEqual(0);
		expect(updatedPersonalItem).toBeGreaterThanOrEqual(0);
	});

	test('highlights non-compliant airlines in red', async ({ page }) => {
		await setBagDimensions(page, { height: '80', width: '60', depth: '40' });

		const firstAirlineCard = getAirlineAllowances(page).first();

		await expect(firstAirlineCard).toBeVisible();
		await expect(firstAirlineCard).toHaveAttribute('data-compliance', 'non-compliant');

		const nonCompliantValues = firstAirlineCard.locator('[data-dimension-status="fail"]');
		expect(await nonCompliantValues.count()).toBeGreaterThan(0);
	});

	test('compliance toggles reset when compliance results change', async ({ page }) => {
		// Enter dimensions that should result in no compliant airlines
		await setBagDimensions(page, { height: '80', width: '60', depth: '40' });

		// Wait for compliance results to load
		await page.waitForTimeout(1000);

		// Check that compliance toggles are not visible (since no airlines are compliant)
		const compliantButton = page.getByRole('button', {
			name: /Hide Compliant \(\d+\)/i
		});
		const nonCompliantButton = page.getByRole('button', {
			name: /Hide Non-compliant \(\d+\)/
		});

		await expect(compliantButton).not.toBeVisible();
		await expect(nonCompliantButton).not.toBeVisible();

		// Now enter dimensions that should make some airlines compliant
		await setBagDimensions(page, { height: '55', width: '40', depth: '23' });

		// Wait for compliance results to update
		await page.waitForTimeout(1000);

		// Check that both toggles are now visible
		await expect(compliantButton).toBeVisible();
		await expect(nonCompliantButton).toBeVisible();

		// Check that both toggles are enabled (have primary background color indicating active state)
		await expect(compliantButton).toHaveAttribute('data-state', 'on');
		await expect(nonCompliantButton).toHaveAttribute('data-state', 'on');
	});
});
