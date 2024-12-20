import type { Airline } from "$lib/types";
import rawAirlinesJson from "$lib/allowances/carry-on-limits.json";
type AirlineData = typeof rawAirlinesJson[number];

export function getAirlineAllowances(): Airline[] {
    return rawAirlinesJson.map(parseAirlineData);
}

function parseAirlineData(rawAirline: AirlineData): Airline {
    const parsedCentimeters = rawAirline.centimeters.split(' x ').map(Number).sort((a, b) => b - a);
    let parsedInches = rawAirline.inches?.split(' x ').map(Number).sort((a, b) => b - a);

    if (!parsedCentimeters && !parsedInches) {
        throw new Error(`No dimensions for ${rawAirline.airline}`);
    }
    if (!parsedInches) {
        parsedInches = convertDimensions(parsedCentimeters);
    }

    let pounds = rawAirline.pounds ?? undefined;
    let kilograms = rawAirline.kilograms ?? undefined;

    if (!kilograms && typeof pounds === "number") {
        kilograms = convertWeight(pounds, false);
    }

    if (!pounds && typeof kilograms === "number") {
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

function convertDimensions(dimensions: number[]): number[] {
    return dimensions.map(value => Math.round(value / 2.54));
}

function convertWeight(value: number, fromKg: boolean): number {
    return fromKg 
        ? Math.round(value * 2.205)  // kg to lbs
        : Math.round(value / 2.205); // lbs to kg
}