export interface Airline {
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
	[airline: string]: TestResult;
};

export type TestResult = {
	lastTestPass?: string;
	lastTestFail?: string;
};
