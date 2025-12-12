import { test as base, expect, Page } from '@playwright/test';

async function pageIsReady(page: Page) {
	await page.waitForLoadState('networkidle');
	await expect(page.getByRole('heading', { name: 'CarryFit', exact: true })).toBeVisible();
}

async function preparePage(page: Page, waitForAllowances = false) {
	await page.goto('/', { waitUntil: 'networkidle' });
	await expect(page.getByRole('heading', { name: 'CarryFit', exact: true })).toBeVisible();
	await page.getByTestId('accept-all-cookies').click();
	await expect(page.getByTestId('accept-all-cookies')).not.toBeVisible();
	if (waitForAllowances) {
		await expect(page.getByTestId('empty-state')).not.toBeVisible();
		await expect(page.getByTestId('allowances-grid')).toBeVisible();
	}
}

type AppFixtures = {
	app: {
		gotoHome: (options?: { waitForAllowances?: boolean }) => Promise<void>;
		expectReady: () => Promise<void>;
	};
};

export const test = base.extend<AppFixtures>({
	page: async ({ page }, use) => {
		await page.addInitScript(() => {
			window.localStorage.setItem(
				'tours',
				JSON.stringify({
					disabled: true
				})
			);
		});
		await use(page);
	},
	app: async ({ page }, use) => {
		await use({
			gotoHome: async (options?: { waitForAllowances?: boolean }) => {
				await preparePage(page, options?.waitForAllowances);
			},
			expectReady: async () => {
				await pageIsReady(page);
			}
		});
	}
});

export { expect };
