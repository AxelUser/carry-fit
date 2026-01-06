export interface ScoreRange {
	min: number;
	max: number;
}

export interface ScoringResult {
	message: string;
	image: string;
	angle: number;
}

export interface FeedbackRuleDefinition {
	carryOnRange: ScoreRange;
	personalItemRange: ScoreRange;
	result: ScoringResult;
}

export interface FeedbackRuleWithCoverage {
	definition: FeedbackRuleDefinition;
	coverage: number;
}

export function calculateCoverage(definition: FeedbackRuleDefinition): number {
	const carryOnWidth = definition.carryOnRange.max - definition.carryOnRange.min;
	const personalItemWidth = definition.personalItemRange.max - definition.personalItemRange.min;
	return carryOnWidth * personalItemWidth;
}

export function isInRange(score: number, range: ScoreRange): boolean {
	return score >= range.min && score <= range.max;
}

export function mergeRanges(ranges: ScoreRange[]): ScoreRange {
	return {
		min: Math.min(...ranges.map((range) => range.min)),
		max: Math.max(...ranges.map((range) => range.max))
	};
}

export function rangesOverlap(range1: ScoreRange, range2: ScoreRange): boolean {
	return !(range1.max < range2.min || range2.max < range1.min);
}

export function ruleCompletelyCovers(
	coveringRule: FeedbackRuleWithCoverage,
	coveredRule: FeedbackRuleWithCoverage
): boolean {
	const { carryOnRange: coverCarryOn, personalItemRange: coverPersonal } = coveringRule.definition;
	const { carryOnRange: coveredCarryOn, personalItemRange: coveredPersonal } =
		coveredRule.definition;

	const containsCarryOn =
		coverCarryOn.min <= coveredCarryOn.min && coverCarryOn.max >= coveredCarryOn.max;
	const containsPersonal =
		coverPersonal.min <= coveredPersonal.min && coverPersonal.max >= coveredPersonal.max;

	return containsCarryOn && containsPersonal && coveringRule.coverage <= coveredRule.coverage;
}

export function rulesHaveAmbiguousOverlap(
	rule1: FeedbackRuleWithCoverage,
	rule2: FeedbackRuleWithCoverage
): boolean {
	if (rule1.coverage !== rule2.coverage) {
		return false;
	}

	const { carryOnRange: co1, personalItemRange: pi1 } = rule1.definition;
	const { carryOnRange: co2, personalItemRange: pi2 } = rule2.definition;

	const carryOnOverlaps = rangesOverlap(co1, co2);
	const personalItemOverlaps = rangesOverlap(pi1, pi2);

	return carryOnOverlaps && personalItemOverlaps;
}
