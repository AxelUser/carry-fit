export interface Data {
	meta: {
		lastTestRun: Date;
		coveredByTest: number;
	};
	allowances: AirlineInfo[];
}

export type Region =
	| 'Europe'
	| 'Russia'
	| 'North America'
	| 'South America'
	| 'Asia'
	| 'Oceania'
	| 'Africa';

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
}

export interface Weight {
	kilograms?: number;
	pounds?: number;
}

export interface BagAllowanceDimensions {
	inches: number | number[];
	centimeters: number | number[];
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
