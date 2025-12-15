import { chromium } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateOgImage() {
	const browser = await chromium.launch();
	const context = await browser.newContext({
		viewport: { width: 1200, height: 630 }
	});
	const page = await context.newPage();

	// Read the HTML template
	const htmlContent = await fs.readFile(join(__dirname, 'og-image.html'), 'utf-8');

	// Create a temporary HTML file with necessary styles
	const tempHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          /* Ensure proper rendering */
          body {
            margin: 0;
            background: white;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

	await page.setContent(tempHtml, { waitUntil: 'networkidle' });

	// Ensure static directory exists
	const staticDir = join(__dirname, '../static');
	await fs.mkdir(staticDir, { recursive: true });

	// Take screenshot with better quality
	await page.screenshot({
		path: join(staticDir, 'og-image.png'),
		type: 'png',
		scale: 'device'
	});

	await browser.close();
}

generateOgImage().catch(console.error);
