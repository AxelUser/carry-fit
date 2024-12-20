import type { Airline, ComplianceCheck, UserDimensions } from "$lib/types";

export function checkCompliance(airline: Airline, userDimensions: UserDimensions): ComplianceCheck | null {
    if (!userDimensions.length || !userDimensions.width || !userDimensions.height) return null;

    const airlineDimensions = userDimensions.unit === 'cm'
        ? airline.centimeters
        : airline.inches;
    
    const bagDims = [
        userDimensions.length,
        userDimensions.width,
        userDimensions.height
    ].sort((a, b) => b - a);

    return {
        length: bagDims[0] <= airlineDimensions[0],
        width: bagDims[1] <= airlineDimensions[1],
        height: bagDims[2] <= airlineDimensions[2]
    };
}