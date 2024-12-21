import type { Airline } from '$lib/types';
import rawAirlinesJson from '$lib/allowances/carry-on-limits.json';
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

	return {
		airline: rawAirline.airline,
		region: rawAirline.region,
		link: rawAirline.link,
		inches: parsedInches,
		centimeters: parsedCentimeters,
		pounds,
		kilograms,
		lastTestPass: rawAirline.test?.lastTestPass ? new Date(rawAirline.test.lastTestPass) : undefined
	};
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