import type { AirlineInfo, BagAllowanceDimensions, Data, TestResult } from '$lib/types';
import { allowances, type AirlineAllowance } from '$lib/allowances/cabin-luggage-allowances';
import allowanceConsistencyResults from '$lib/allowances/allowance-consistency-results.json' assert { type: 'json' };

export function loadData(): Data {
	const parsedAllowances = allowances.map(mapAirlineData);
	return {
		meta: {
			lastTestRun: new Date(allowanceConsistencyResults.meta.lastTestRun),
			coveredByTest: parsedAllowances.filter((airline) => airline.testResult).length
		},
		allowances: parsedAllowances
	};
}

function mapAirlineData(allowance: AirlineAllowance): AirlineInfo {
	const carryOnDimensions = getCarryOnDimensions(allowance.airline, allowance.carryOn);

	let pounds = allowance.pounds ?? undefined;
	let kilograms = allowance.kilograms ?? undefined;

	if (!kilograms && typeof pounds === 'number') {
		kilograms = convertWeight(pounds, false);
	}

	if (!pounds && typeof kilograms === 'number') {
		pounds = convertWeight(kilograms, true);
	}

	const parsedTestResult = getLastTestOfAirline(
		allowanceConsistencyResults.results[
			allowance.id as keyof typeof allowanceConsistencyResults.results
		]
	);

	return {
		airline: allowance.airline,
		region: allowance.region,
		link: allowance.link,
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
