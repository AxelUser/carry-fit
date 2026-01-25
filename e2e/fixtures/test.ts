import { test as base, expect, Page } from '@playwright/test';

async function pageIsReady(page: Page) {
	await page.waitForLoadState('networkidle');
	await expect(page.getByRole('heading', { name: 'CarryFit', level: 1 })).toBeVisible();
}

async function preparePage(page: Page) {
	await page.goto('/', { waitUntil: 'networkidle' });
	await expect(page.getByRole('heading', { name: 'CarryFit', level: 1 })).toBeVisible();
	await page.getByTestId('accept-all-cookies').click();
	await expect(page.getByTestId('accept-all-cookies')).not.toBeVisible();
}

type AppFixtures = {
	app: {
		gotoHome: () => Promise<void>;
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
			gotoHome: async () => {
				await preparePage(page);
			},
			expectReady: async () => {
				await pageIsReady(page);
			}
		});
	}
});

export { expect };
