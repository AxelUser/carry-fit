import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowancesFilePath = path.join(
	__dirname,
	'..',
	'src',
	'lib',
	'allowances',
	'cabin-luggage-allowances.ts'
);

const fileContent = fs.readFileSync(allowancesFilePath, 'utf8');

const airlineRegex = /airline:\s*'([^']+)'/g;
const airlines = [];
let match;

while ((match = airlineRegex.exec(fileContent)) !== null) {
	airlines.push(match[1]);
}

airlines.sort();

const outputPath = path.join(__dirname, '..', 'airline-names.txt');

fs.writeFileSync(outputPath, airlines.join('\n'), 'utf8');

console.log(`Extracted ${airlines.length} airline names and saved to ${outputPath}`);
