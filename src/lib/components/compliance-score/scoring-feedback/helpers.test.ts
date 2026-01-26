import { describe, test, expect } from 'vitest';
import {
	calculateCoverage,
	isInRange,
	rangesOverlap,
	ruleCompletelyCovers,
	rulesHaveAmbiguousOverlap,
	type FeedbackRuleDefinition,
	type FeedbackRuleWithCoverage,
	type ScoreRange
} from './helpers';

describe('calculateCoverage', () => {
	test('calculates coverage for square range', () => {
		const rule: FeedbackRuleDefinition = {
			carryOnRange: { min: 90, max: 100 },
			personalItemRange: { min: 90, max: 100 },
			result: { message: 'Test', image: '/test.png', angle: 0 }
		};
		expect(calculateCoverage(rule)).toBe(100);
	});

	test('calculates coverage for rectangular range', () => {
		const rule: FeedbackRuleDefinition = {
			carryOnRange: { min: 60, max: 100 },
			personalItemRange: { min: 60, max: 100 },
			result: { message: 'Test', image: '/test.png', angle: 0 }
		};
		expect(calculateCoverage(rule)).toBe(1600);
	});

	test('calculates coverage for asymmetric range', () => {
		const rule: FeedbackRuleDefinition = {
			carryOnRange: { min: 90, max: 100 },
			personalItemRange: { min: 0, max: 60 },
			result: { message: 'Test', image: '/test.png', angle: 0 }
		};
		expect(calculateCoverage(rule)).toBe(600);
	});

	test('calculates coverage for full range', () => {
		const rule: FeedbackRuleDefinition = {
			carryOnRange: { min: 0, max: 100 },
			personalItemRange: { min: 0, max: 100 },
			result: { message: 'Test', image: '/test.png', angle: 0 }
		};
		expect(calculateCoverage(rule)).toBe(10000);
	});
});

describe('isInRange', () => {
	test('returns true for score within range', () => {
		const range: ScoreRange = { min: 90, max: 100 };
		expect(isInRange(95, range)).toBe(true);
	});

	test('returns true for score at min boundary', () => {
		const range: ScoreRange = { min: 90, max: 100 };
		expect(isInRange(90, range)).toBe(true);
	});

	test('returns true for score at max boundary', () => {
		const range: ScoreRange = { min: 90, max: 100 };
		expect(isInRange(100, range)).toBe(true);
	});

	test('returns false for score below min', () => {
		const range: ScoreRange = { min: 90, max: 100 };
		expect(isInRange(89, range)).toBe(false);
	});

	test('returns false for score above max', () => {
		const range: ScoreRange = { min: 90, max: 100 };
		expect(isInRange(101, range)).toBe(false);
	});

	test('rounds score to nearest integer', () => {
		const range: ScoreRange = { min: 91, max: 100 };
		expect(isInRange(90.5, range)).toBe(true);
	});
});

describe('rangesOverlap', () => {
	test('returns true for overlapping ranges', () => {
		const range1: ScoreRange = { min: 0, max: 50 };
		const range2: ScoreRange = { min: 25, max: 75 };
		expect(rangesOverlap(range1, range2)).toBe(true);
	});

	test('returns true for boundary-touching ranges', () => {
		const range1: ScoreRange = { min: 0, max: 50 };
		const range2: ScoreRange = { min: 50, max: 100 };
		expect(rangesOverlap(range1, range2)).toBe(true);
	});

	test('returns true for identical ranges', () => {
		const range1: ScoreRange = { min: 0, max: 100 };
		const range2: ScoreRange = { min: 0, max: 100 };
		expect(rangesOverlap(range1, range2)).toBe(true);
	});

	test('returns true when one range contains the other', () => {
		const range1: ScoreRange = { min: 0, max: 100 };
		const range2: ScoreRange = { min: 25, max: 75 };
		expect(rangesOverlap(range1, range2)).toBe(true);
	});

	test('returns false for non-overlapping ranges', () => {
		const range1: ScoreRange = { min: 0, max: 40 };
		const range2: ScoreRange = { min: 60, max: 100 };
		expect(rangesOverlap(range1, range2)).toBe(false);
	});

	test('returns false for adjacent non-touching ranges', () => {
		const range1: ScoreRange = { min: 0, max: 49 };
		const range2: ScoreRange = { min: 50, max: 100 };
		expect(rangesOverlap(range1, range2)).toBe(false);
	});
});

describe('ruleCompletelyCovers', () => {
	test('returns true when ranges are identical with equal coverage', () => {
		const rule1: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 90, max: 100 },
				personalItemRange: { min: 90, max: 100 },
				result: { message: 'Rule 1', image: '/test.png', angle: 0 }
			},
			coverage: 100
		};
		const rule2: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 90, max: 100 },
				personalItemRange: { min: 90, max: 100 },
				result: { message: 'Rule 2', image: '/test.png', angle: 0 }
			},
			coverage: 100
		};
		expect(ruleCompletelyCovers(rule1, rule2)).toBe(true);
	});

	test('returns false when covering rule contains covered rule with smaller or equal coverage', () => {
		const covering: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 80, max: 100 },
				personalItemRange: { min: 80, max: 100 },
				result: { message: 'Broad', image: '/test.png', angle: 0 }
			},
			coverage: 400
		};
		const covered: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 90, max: 100 },
				personalItemRange: { min: 90, max: 100 },
				result: { message: 'Narrow', image: '/test.png', angle: 0 }
			},
			coverage: 100
		};
		expect(ruleCompletelyCovers(covering, covered)).toBe(false);
	});

	test('returns false when covering rule has larger coverage than covered rule', () => {
		const covering: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 50, max: 100 },
				personalItemRange: { min: 50, max: 100 },
				result: { message: 'Broad', image: '/test.png', angle: 0 }
			},
			coverage: 2500
		};
		const covered: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 60, max: 80 },
				personalItemRange: { min: 60, max: 80 },
				result: { message: 'Narrow', image: '/test.png', angle: 0 }
			},
			coverage: 400
		};
		expect(ruleCompletelyCovers(covering, covered)).toBe(false);
	});

	test('returns false when ranges only partially overlap', () => {
		const rule1: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 80, max: 95 },
				personalItemRange: { min: 80, max: 95 },
				result: { message: 'Rule 1', image: '/test.png', angle: 0 }
			},
			coverage: 225
		};
		const rule2: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 85, max: 100 },
				personalItemRange: { min: 85, max: 100 },
				result: { message: 'Rule 2', image: '/test.png', angle: 0 }
			},
			coverage: 225
		};
		expect(ruleCompletelyCovers(rule1, rule2)).toBe(false);
	});

	test('returns false when ranges do not overlap', () => {
		const rule1: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 0, max: 40 },
				personalItemRange: { min: 0, max: 40 },
				result: { message: 'Rule 1', image: '/test.png', angle: 0 }
			},
			coverage: 1600
		};
		const rule2: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 60, max: 100 },
				personalItemRange: { min: 60, max: 100 },
				result: { message: 'Rule 2', image: '/test.png', angle: 0 }
			},
			coverage: 1600
		};
		expect(ruleCompletelyCovers(rule1, rule2)).toBe(false);
	});
});

describe('rulesHaveAmbiguousOverlap', () => {
	test('returns true for boundary-touching ranges with equal coverage', () => {
		const rule1: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 0, max: 50 },
				personalItemRange: { min: 0, max: 50 },
				result: { message: 'Lower half', image: '/test.png', angle: 0 }
			},
			coverage: 2500
		};
		const rule2: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 50, max: 100 },
				personalItemRange: { min: 50, max: 100 },
				result: { message: 'Upper half', image: '/test.png', angle: 0 }
			},
			coverage: 2500
		};
		expect(rulesHaveAmbiguousOverlap(rule1, rule2)).toBe(true);
	});

	test('returns true for partial overlap with equal coverage', () => {
		const rule1: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 80, max: 95 },
				personalItemRange: { min: 80, max: 95 },
				result: { message: 'Rule 1', image: '/test.png', angle: 0 }
			},
			coverage: 225
		};
		const rule2: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 85, max: 100 },
				personalItemRange: { min: 85, max: 100 },
				result: { message: 'Rule 2', image: '/test.png', angle: 0 }
			},
			coverage: 225
		};
		expect(rulesHaveAmbiguousOverlap(rule1, rule2)).toBe(true);
	});

	test('returns true for different shapes with same coverage that overlap', () => {
		const rule1: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 0, max: 100 },
				personalItemRange: { min: 0, max: 50 },
				result: { message: 'Wide and short', image: '/test.png', angle: 0 }
			},
			coverage: 5000
		};
		const rule2: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 0, max: 50 },
				personalItemRange: { min: 0, max: 100 },
				result: { message: 'Narrow and tall', image: '/test.png', angle: 0 }
			},
			coverage: 5000
		};
		expect(rulesHaveAmbiguousOverlap(rule1, rule2)).toBe(true);
	});

	test('returns false for non-overlapping ranges with equal coverage', () => {
		const rule1: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 0, max: 40 },
				personalItemRange: { min: 0, max: 40 },
				result: { message: 'Lower range', image: '/test.png', angle: 0 }
			},
			coverage: 1600
		};
		const rule2: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 60, max: 100 },
				personalItemRange: { min: 60, max: 100 },
				result: { message: 'Upper range', image: '/test.png', angle: 0 }
			},
			coverage: 1600
		};
		expect(rulesHaveAmbiguousOverlap(rule1, rule2)).toBe(false);
	});

	test('returns false for overlapping ranges with different coverage', () => {
		const rule1: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 80, max: 95 },
				personalItemRange: { min: 80, max: 95 },
				result: { message: 'Rule 1', image: '/test.png', angle: 0 }
			},
			coverage: 225
		};
		const rule2: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 85, max: 110 },
				personalItemRange: { min: 85, max: 110 },
				result: { message: 'Rule 2', image: '/test.png', angle: 0 }
			},
			coverage: 625
		};
		expect(rulesHaveAmbiguousOverlap(rule1, rule2)).toBe(false);
	});

	test('returns false for identical ranges with different coverage', () => {
		const rule1: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 0, max: 100 },
				personalItemRange: { min: 0, max: 100 },
				result: { message: 'Rule 1', image: '/test.png', angle: 0 }
			},
			coverage: 10000
		};
		const rule2: FeedbackRuleWithCoverage = {
			definition: {
				carryOnRange: { min: 0, max: 100 },
				personalItemRange: { min: 0, max: 100 },
				result: { message: 'Rule 2', image: '/test.png', angle: 0 }
			},
			coverage: 5000
		};
		expect(rulesHaveAmbiguousOverlap(rule1, rule2)).toBe(false);
	});
});
