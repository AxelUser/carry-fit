export interface Airline {
	airline: string;
	region: string;
	link?: string;
	inches: number | number[];
	centimeters: number | number[];
	pounds?: number;
	kilograms?: number;
	testResult?: {
		lastTest: Date;
		success: boolean;
	};
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
	[airline: string]: {
		lastTestPass?: string;
		lastTestFail?: string;
	};
};
