import { chromium, test, Browser, Page, BrowserContext } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';
import airlinesJsonData from '../src/lib/allowances/carry-on-limits.json' assert { type: 'json' };
type AirlineData = typeof airlinesJsonData[number];

async function setupTestPage(url: string): Promise<{ browser: Browser; context: BrowserContext; page: Page }> {
    const browser = await chromium.launch({
        headless: false,
        args: ['--disable-blink-features=AutomationControlled']
    });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'load' });
    return { browser, context, page };
}

async function updateTestReport(airline: string): Promise<void> {
    const jsonPath = path.join(process.cwd(), 'src/lib/allowances/carry-on-limits.json');
    const jsonData = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    
    const airlineIndex = jsonData.findIndex((a: AirlineData) => a.airline === airline);
    if (airlineIndex !== -1) {
        jsonData[airlineIndex].test.lastTestPass = new Date().toISOString();
        
        await fs.writeFile(
            jsonPath, 
            JSON.stringify(jsonData, null, 4),
            'utf-8'
        );
    }
}

test.describe('Airline Allowance Consistency @manual', () => {
    for (const data of airlinesJsonData) {
        if (!data.test?.text) {
            continue;
        }

        test(`${data.airline} website contains expected text: "${data.test.text}"`, async () => {
            const { browser, page } = await setupTestPage(data.link!);

            await page.waitForFunction(
                (expectedText: string | string[]) => {
                    if (typeof expectedText === 'string') {
                        return document.body?.textContent?.includes(expectedText);
                    } else {
                        return expectedText.every(text => document.body?.textContent?.includes(text));
                    }
                },
                data.test.text,
                { timeout: 30000 }
            );
            
            await updateTestReport(data.airline);
            await browser.close();
        });
    }
});
