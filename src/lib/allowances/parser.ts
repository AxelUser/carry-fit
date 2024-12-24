import type { Airline, TestResults } from '$lib/types';
import rawAirlinesJson from '$lib/allowances/carry-on-limits.json';
import allowanceConsistencyResults from '$lib/allowances/allowance-consistency-results.json' assert { type: 'json' };
type AirlineData = (typeof rawAirlinesJson)[number];

export function getAirlineAllowances(): Airline[] {
	return rawAirlinesJson.map(parseAirlineData);
}

function parseAirlineData(rawAirline: AirlineData): Airline {
	let parsedCentimeters = rawAirline.centimeters
		? getDimensions(rawAirline.centimeters)
		: undefined;
	let parsedInches = rawAirline.inches ? getDimensions(rawAirline.inches) : undefined;

	if (!parsedCentimeters && !parsedInches) {
		throw new Error(`No dimensions for ${rawAirline.airline}`);
	}
	if (!parsedInches) {
		parsedInches = convertDimensions(parsedCentimeters!);
	}

	if (!parsedCentimeters) {
		parsedCentimeters = convertDimensions(parsedInches!);
	}

	let pounds = rawAirline.pounds ?? undefined;
	let kilograms = rawAirline.kilograms ?? undefined;

	if (!kilograms && typeof pounds === 'number') {
		kilograms = convertWeight(pounds, false);
	}

	if (!pounds && typeof kilograms === 'number') {
		pounds = convertWeight(kilograms, true);
	}

	const testResult =
		allowanceConsistencyResults[rawAirline.airline as keyof typeof allowanceConsistencyResults];
	const parsedTestResult = testResult ? getLastTest(testResult as TestResults) : undefined;

	return {
		airline: rawAirline.airline,
		region: rawAirline.region,
		link: rawAirline.link,
		inches: parsedInches,
		centimeters: parsedCentimeters,
		pounds,
		kilograms,
		testResult: parsedTestResult
	};
}

function getLastTest(result: TestResults): { lastTest: Date; success: boolean } | undefined {
	if (!result.lastTestPass && !result.lastTestFail) {
		return undefined;
	}

	const lastTestPass = result.testResult?.lastTestPass
		? new Date(result.testResult.lastTestPass)
		: undefined;
	const lastTestFail = result.testResult?.lastTestFail
		? new Date(result.testResult.lastTestFail)
		: undefined;

	const lastTest = [lastTestPass, lastTestFail]
		.filter(Boolean)
		.sort((a, b) => b!.getTime() - a!.getTime())[0];
	return { lastTest: lastTest!, success: lastTest === lastTestPass };
}

function getDimensions(dimensions: number | number[]): number | number[] {
	if (typeof dimensions === 'number') {
		return dimensions;
	}
	return dimensions.sort((a, b) => b - a);
}

function convertDimensions(dimensions: number | number[]): number | number[] {
	if (typeof dimensions === 'number') {
		return Math.round(dimensions / 2.54);
	}
	return dimensions.map((value) => Math.round(value / 2.54));
}

function convertWeight(value: number, fromKg: boolean): number {
	return fromKg
		? Math.round(value * 2.205) // kg to lbs
		: Math.round(value / 2.205); // lbs to kg
}
