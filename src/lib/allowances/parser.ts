import type { Airline, BagAllowanceDimensions, Data, TestResult } from '$lib/types';
import rawAirlinesJson from '$lib/allowances/carry-on-limits.json';
import allowanceConsistencyResults from '$lib/allowances/allowance-consistency-results.json' assert { type: 'json' };
type AirlineData = (typeof rawAirlinesJson)[number];

export function parseData(): Data {
	const allowances = rawAirlinesJson.map(parseAirlineData);
	return {
		meta: {
			lastTestRun: new Date(allowanceConsistencyResults.meta.lastTestRun),
			coveredByTest: allowances.filter((airline) => airline.testResult).length
		},
		allowances
	};
}

function parseAirlineData(rawAirline: AirlineData): Airline {
	const carryOnDimensions = getCarryOnDimensions(rawAirline.airline, rawAirline.carryon);

	let pounds = rawAirline.pounds ?? undefined;
	let kilograms = rawAirline.kilograms ?? undefined;

	if (!kilograms && typeof pounds === 'number') {
		kilograms = convertWeight(pounds, false);
	}

	if (!pounds && typeof kilograms === 'number') {
		pounds = convertWeight(kilograms, true);
	}

	const parsedTestResult = getLastTestOfAirline(
		allowanceConsistencyResults.results[
			rawAirline.id as keyof typeof allowanceConsistencyResults.results
		]
	);

	return {
		airline: rawAirline.airline,
		region: rawAirline.region,
		link: rawAirline.link,
		carryon: carryOnDimensions,
		pounds,
		kilograms,
		testResult: parsedTestResult
	};
}

function getLastTestOfAirline(
	result?: TestResult
): { lastTest: Date; success: boolean } | undefined {
	if (!result?.lastTestPass && !result?.lastTestFail) {
		return undefined;
	}

	const lastTestPass = result?.lastTestPass ? new Date(result.lastTestPass) : undefined;
	const lastTestFail = result?.lastTestFail ? new Date(result.lastTestFail) : undefined;

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

function getCarryOnDimensions(
	airlineName: string,
	dims: {
		centimeters?: number | number[];
		inches?: number | number[];
	}
): BagAllowanceDimensions {
	let parsedCentimeters = dims.centimeters ? getDimensions(dims.centimeters) : undefined;
	let parsedInches = dims.inches ? getDimensions(dims.inches) : undefined;

	if (!parsedCentimeters && !parsedInches) {
		throw new Error(`No dimensions for ${airlineName}`);
	}
	if (!parsedInches) {
		parsedInches = convertDimensions(parsedCentimeters!, (value) => value / 2.54);
	}

	if (!parsedCentimeters) {
		parsedCentimeters = convertDimensions(parsedInches!, (value) => value * 2.54);
	}

	return {
		centimeters: parsedCentimeters,
		inches: parsedInches
	};
}

function convertDimensions(
	dimensions: number | number[],
	func: (value: number) => number
): number | number[] {
	if (typeof dimensions === 'number') {
		return Math.round(func(dimensions));
	}
	return dimensions.map((value) => Math.round(func(value)));
}

function convertWeight(value: number, fromKg: boolean): number {
	return fromKg
		? Math.round(value * 2.205) // kg to lbs
		: Math.round(value / 2.205); // lbs to kg
}
