import { convertDimensions } from '$lib/utils/math';
import { MeasurementSystems, type MeasurementSystem, type UserDimensions } from '$lib/types';

interface NumberMatch {
	value: number;
	position: number;
}

export class DimensionParser {
	private findAllNumbers(text: string): NumberMatch[] {
		const matches: NumberMatch[] = [];
		const numberPattern = /\d+\.?\d*/g;

		let match;
		while ((match = numberPattern.exec(text)) !== null) {
			const value = Number(match[0]);
			if (!isNaN(value) && value > 0) {
				matches.push({
					value,
					position: match.index
				});
			}
		}

		return matches;
	}

	private isLikelyMetric(values: number[]): boolean {
		// Metric measurements tend to be larger numbers
		return values.some((v) => v > 30);
	}

	private groupDimensions(
		numbers: NumberMatch[],
		system: MeasurementSystem
	): UserDimensions | null {
		if (numbers.length === 0) return null;

		// If we have exactly 3 numbers, try using them directly
		if (numbers.length === 3) {
			const dims = {
				height: numbers[0].value,
				width: numbers[1].value,
				depth: numbers[2].value
			};
			if (this.validateDimensions(dims)) {
				const isMetric = this.isLikelyMetric(Object.values(dims));
				if (
					(isMetric && system === MeasurementSystems.Metric) ||
					(!isMetric && system === MeasurementSystems.Imperial)
				) {
					return dims;
				}
				return convertDimensions(dims, system);
			}
		}

		// If we have 6 numbers, try to find cm/inch pairs
		if (numbers.length === 6) {
			const values = numbers.map((n) => n.value);
			const maxValue = Math.max(...values);
			const maxIndex = values.indexOf(maxValue);
			const expectedInches = convertDimensions(maxValue, 'imperial');

			// Find closest match to expected inches
			let closestInchIndex = -1;
			let minDiff = Number.MAX_VALUE;

			values.forEach((num, index) => {
				if (index !== maxIndex) {
					const diff = Math.abs(num - expectedInches);
					if (diff < minDiff) {
						minDiff = diff;
						closestInchIndex = index;
					}
				}
			});

			if (minDiff < 5) {
				const pairDistance = Math.abs(maxIndex - closestInchIndex);

				const cmValues = [];
				const inValues = [];
				const visited = new Set<number>();

				// Group numbers into pairs
				for (let i = 0; i < values.length; i++) {
					if (visited.has(i)) continue;

					const value1 = values[i];
					const value2 = values[i + pairDistance];
					visited.add(i);
					visited.add(i + pairDistance);

					if (value1 > value2) {
						cmValues.push(value1);
						inValues.push(value2);
					} else {
						cmValues.push(value2);
						inValues.push(value1);
					}
				}

				if (cmValues.length === 3) {
					const dims = {
						height: cmValues[0],
						width: cmValues[1],
						depth: cmValues[2]
					};
					const inchDims = {
						height: inValues[0],
						width: inValues[1],
						depth: inValues[2]
					};

					if (this.validateDimensions(dims) && this.validateDimensions(inchDims)) {
						return system === MeasurementSystems.Metric ? dims : inchDims;
					}
				}
			}
		}

		// Try to find 3 consecutive numbers that make sense
		for (let i = 0; i <= numbers.length - 3; i++) {
			const dims = {
				height: numbers[i].value,
				width: numbers[i + 1].value,
				depth: numbers[i + 2].value
			};
			if (this.validateDimensions(dims)) {
				const isMetric = this.isLikelyMetric(Object.values(dims));
				if ((isMetric && system === 'metric') || (!isMetric && system === 'imperial')) {
					return dims;
				}
				return convertDimensions(dims, system);
			}
		}

		return null;
	}

	private validateDimensions(dims: UserDimensions): boolean {
		return (
			!isNaN(dims.height) &&
			!isNaN(dims.width) &&
			!isNaN(dims.depth) &&
			dims.height > 0 &&
			dims.width > 0 &&
			dims.depth > 0
		);
	}

	parse(text: string, system: MeasurementSystem): UserDimensions | null {
		// Clean up the input text
		const cleanText = text
			.replace(/[\n\r\t]/g, ' ') // Replace newlines and tabs with spaces
			.replace(/\s+/g, ' ') // Replace multiple spaces with single space
			.trim();

		const numbers = this.findAllNumbers(cleanText);
		return this.groupDimensions(numbers, system);
	}
}
