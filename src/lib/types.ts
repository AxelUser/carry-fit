export interface Airline {
    airline: string;
    region: string;
    link?: string;
    inches: number[];
    centimeters: number[];
    pounds?: number;
    kilograms?: number;
    lastTestPass?: Date;
}

export interface UserDimensions {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
}

export interface ComplianceCheck {
    length: boolean;
    width: boolean;
    height: boolean;
} 