import { chromium, test } from '@playwright/test';
import airlineData from '../src/lib/carry-on-limits.json' assert { type: 'json' };

interface Airline {
    Airline: string;
    Link: string;
    Test: {
        Text: string | string[];
        Interact?: {
            ClickLinkWithName: string;
        };
    };
}

// Filter airlines that have Test field
const airlinesWithTests = airlineData.filter(airline => 
    airline.Test && airline.Link && airline.Test.Text
).map((airline) => ({
    Airline: airline.Airline,
    Link: airline.Link,
    Test: {
		Text: airline.Test!.Text,
		Interact: airline.Test?.Interact
	}
} as Airline));

for (const airline of airlinesWithTests) {
    test(`${airline.Airline} website contains expected text: "${airline.Test.Text}"`, async () => {
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
        await page.goto(airline.Link!, { waitUntil: 'domcontentloaded' });

        if (airline.Test.Interact) {
            await page.getByRole('link', { name: airline.Test.Interact.ClickLinkWithName }).click({force: true});
        }

        // Wait for the text to appear with a timeout of 30 seconds
        await page.waitForFunction(
            (expectedText: string | string[]) => {
                if (typeof expectedText === 'string') {
                    return document.body.textContent?.includes(expectedText);
                } else {
                    return expectedText.every(text => document.body.textContent?.includes(text));
                }
            },
            airline.Test.Text,
            { timeout: 30000 }
        );
        
        await browser.close();
    });
}
