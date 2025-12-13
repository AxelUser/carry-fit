export type Region =
	| 'Europe'
	| 'North America'
	| 'South America'
	| 'Asia'
	| 'Oceania'
	| 'Africa'
	| 'Middle East';

export interface AirlineInfo {
	airline: string;
	region: Region;
	link: string;
	carryon: BagAllowance;
	personalItem?: BagAllowance;
	totalWeight?: Weight;
	testResult?: {
		lastTest: Date;
		success: boolean;
	};
}

export interface DimensionCompliance {
	passed: boolean;
	diff: number;
}

export interface AirlineCompliance extends AirlineInfo {
	complianceResults: DimensionCompliance[];
	personalItemComplianceResults: DimensionCompliance[] | null;
}

export interface Weight {
	kilograms?: number;
	pounds?: number;
}

declare const sortedDescendingDimensionsBrand: unique symbol;

/**
 * A three-length tuple that has been pre-sorted from largest to smallest.
 */
export type SortedDimensions = [number, number, number] & {
	readonly [sortedDescendingDimensionsBrand]: true;
};

export type DimensionValue = number | SortedDimensions;

export interface BagAllowanceDimensions {
	inches: DimensionValue;
	centimeters: DimensionValue;
}

export interface BagAllowance extends Partial<BagAllowanceDimensions> {
	weight?: Weight;
}

export const MeasurementSystems = {
	Metric: 'metric',
	Imperial: 'imperial'
} as const;

export type MeasurementSystem = (typeof MeasurementSystems)[keyof typeof MeasurementSystems];

export interface UserDimensions {
	depth: number;
	width: number;
	height: number;
}

export interface DimensionsCheck {
	length: boolean;
	width: boolean;
	height: boolean;
}

export type TestResults = {
	results: {
		[airlineId: string]: TestResult;
	};
	meta: {
		lastTestRun: string;
	};
};

export type TestResult = {
	lastTestPass?: string;
	lastTestFail?: string;
};

export interface AirlinesByCompliance {
	compliant: AirlineCompliance[];
	nonCompliant: AirlineCompliance[];
}

export const SortDirections = {
	Ascending: 'asc',
	Descending: 'desc'
} as const;

export type SortDirection = (typeof SortDirections)[keyof typeof SortDirections];

export interface CookieConsent {
	analytics: boolean;
	necessary: boolean;
	timestamp: string | null;
}

export interface Change {
	date: Date;
	changes: string[];
}
