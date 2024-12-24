import { chromium, test, Browser, Page, BrowserContext } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';
import airlinesJsonData from '../src/lib/allowances/carry-on-limits.json' assert { type: 'json' };

type AirlineTestResult = {
	lastTestPass?: string;
	lastTestFail?: string;
};

type TestResults = {
	[airline: string]: AirlineTestResult;
};

let testResults: TestResults = {};

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
	} catch {
		// If file doesn't exist or is empty, start with empty results
		testResults = {};
	}
}

async function saveTestReport(): Promise<void> {
	const resultsPath = path.join(
		process.cwd(),
		'src/lib/allowances/allowance-consistency-results.json'
	);
	await fs.writeFile(resultsPath, JSON.stringify(testResults, null, 4), 'utf-8');
}

function updateAirlineTestResult(airline: string, success: boolean): void {
	const currentTime = new Date().toISOString();
	if (!testResults[airline]) {
		testResults[airline] = {};
	}

	if (success) {
		testResults[airline].lastTestPass = currentTime;
	} else {
		testResults[airline].lastTestFail = currentTime;
	}
}

test.describe('Airline Allowance Consistency', { tag: '@manual' }, () => {
	test.beforeAll(async () => {
		await loadTestReport();
	});

	test.afterAll(async () => {
		await saveTestReport();
	});

	for (const data of airlinesJsonData) {
		if (!data.test?.text) {
			continue;
		}

		const expectedText = data.test.text;

		test(`${data.airline} website contains expected text: "${expectedText}"`, async () => {
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

				updateAirlineTestResult(data.airline, true);
			} catch (error) {
				updateAirlineTestResult(data.airline, false);
				throw error; // Re-throw to make the test fail
			} finally {
				await browser.close();
			}
		});
	}
});
