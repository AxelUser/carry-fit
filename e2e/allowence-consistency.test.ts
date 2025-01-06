import { chromium, test, Browser, Page, BrowserContext } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';
import airlinesJsonData from '../src/lib/allowances/carry-on-limits.json' assert { type: 'json' };
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

	for (const data of airlinesJsonData) {
		if (!data.test?.text) {
			continue;
		}

		const expectedText = data.test.text;

		test(`${data.airline} allowances should be up-to-date`, async () => {
			currentAirlineId = data.id;
			const { browser, page } = await setupTestPage(data.link!);

			try {
				await page.waitForFunction(
					(text: string | string[]) => {
						try {
							if (typeof text === 'string') {
								return document.body?.textContent?.includes(text);
							} else {
								return text.every((textPart) => document.body?.textContent?.includes(textPart));
							}
						} catch (error) {
							console.error(error);
							return false;
						}
					},
					expectedText,
					{ timeout: 30000 }
				);
			} finally {
				await browser.close();
			}
		});
	}
});
