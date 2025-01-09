import { chromium, test, Browser, Page, BrowserContext } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';
import { AirlineAllowance, allowances } from '../src/lib/allowances/cabin-luggage-allowances';
import type { TestResults } from '../src/lib/types';

let testResults: TestResults;

async function setupTestPage(
	url: string
): Promise<{ browser: Browser; context: BrowserContext; page: Page }> {
	const browser = await chromium.launch({
		headless: false,
		args: ['--disable-blink-features=AutomationControlled']
	});
	const context = await browser.newContext({
		userAgent:
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
		viewport: { width: 1280, height: 720 },
		deviceScaleFactor: 1,
		bypassCSP: true
	});
	const page = await context.newPage();
	await page.goto(url, { waitUntil: 'load' });
	return { browser, context, page };
}

async function loadTestReport(): Promise<void> {
	const resultsPath = path.join(
		process.cwd(),
		'src/lib/allowances/allowance-consistency-results.json'
	);
	try {
		const fileContent = await fs.readFile(resultsPath, 'utf-8');
		testResults = JSON.parse(fileContent);

		if (!testResults.results) {
			testResults.results = {};
		}

		if (!testResults.meta) {
			testResults.meta = { lastTestRun: new Date().toISOString() };
		}
	} catch {
		// If file doesn't exist or is empty, start with empty results
		testResults = { results: {}, meta: { lastTestRun: new Date().toISOString() } };
	}
}

async function saveTestReport(): Promise<void> {
	const resultsPath = path.join(
		process.cwd(),
		'src/lib/allowances/allowance-consistency-results.json'
	);
	await fs.writeFile(resultsPath, JSON.stringify(testResults, null, 4), 'utf-8');
}

function updateAirlineTestResult(airlineId: string, success: boolean): void {
	const currentTime = new Date().toISOString();
	if (!testResults.results[airlineId]) {
		testResults.results[airlineId] = {};
	}

	if (success) {
		testResults.results[airlineId].lastTestPass = currentTime;
	} else {
		testResults.results[airlineId].lastTestFail = currentTime;
	}

	testResults.meta.lastTestRun = currentTime;
}

async function waitForTexts(
	page: Page,
	textsToFind: (string | RegExp)[],
	timeout: number = 30000
): Promise<{ success: boolean; missingTexts: (string | RegExp)[] }> {
	const startTime = Date.now();
	const missingTexts: (string | RegExp)[] = [];

	while (Date.now() - startTime < timeout) {
		const pageText = (await page.textContent('body')) || '';
		missingTexts.length = 0;

		for (const text of textsToFind) {
			const isMatch = typeof text === 'string' ? pageText.includes(text) : text.test(pageText);

			if (!isMatch) {
				missingTexts.push(text);
			}
		}

		if (missingTexts.length === 0) {
			return { success: true, missingTexts: [] };
		}

		// Wait a bit before retrying
		await page.waitForTimeout(500);
	}

	return { success: false, missingTexts };
}

test.describe('Airline Allowance Consistency Tests', { tag: '@manual' }, () => {
	let currentAirlineId: string;

	test.beforeAll(async () => {
		await loadTestReport();
	});

	test.afterEach(async ({}, testInfo) => {
		updateAirlineTestResult(currentAirlineId, testInfo.status === testInfo.expectedStatus);
	});

	test.afterAll(async () => {
		await saveTestReport();
	});

	for (const data of allowances) {
		const textsToFind = data.test?.matchText;

		if (!textsToFind) {
			continue;
		}

		test(`${data.airline} allowances should be up-to-date`, async () => {
			test.setTimeout(40000);
			currentAirlineId = data.id;
			const { browser, page } = await setupTestPage(data.link!);

			try {
				const { success, missingTexts } = await waitForTexts(page, textsToFind, 30000);

				if (!success) {
					const pageText = await page.evaluate(() => document.body?.innerText || '');
					throw new Error(
						`Could not find all required texts on ${data.airline} page.\n` +
							`Missing texts: ${missingTexts.map((t) => `\n- ${t.toString()}`).join('')}\n` +
							`Current page text: ${pageText.substring(0, 500)}...`
					);
				}
			} finally {
				await browser.close();
			}
		});
	}
});
