export interface Data {
	meta: {
		lastTestRun: Date;
		coveredByTest: number;
	};
	allowances: AirlineInfo[];
}

export interface AirlineInfo {
	airline: string;
	region: string;
	link?: string;
	carryon: BagAllowanceDimensions;
	pounds?: number;
	kilograms?: number;
	testResult?: {
		lastTest: Date;
		success: boolean;
	};
}

export interface BagAllowanceDimensions {
	inches: number | number[];
	centimeters: number | number[];
}

export interface UserDimensions {
	length: number;
	width: number;
	height: number;
	unit: 'cm' | 'in';
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
