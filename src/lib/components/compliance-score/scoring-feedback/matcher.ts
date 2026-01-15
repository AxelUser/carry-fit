import {
	calculateCoverage,
	isInRange,
	ruleCompletelyCovers,
	rulesHaveAmbiguousOverlap,
	type FeedbackRuleDefinition,
	type FeedbackRuleWithCoverage,
	type ScoringResult
} from './helpers';

export type { ScoreRange, FeedbackRuleDefinition, ScoringResult } from './helpers';

export class ScoringFeedbackMatcher {
	private rules: FeedbackRuleWithCoverage[] = [];

	addRule(definition: FeedbackRuleDefinition): void {
		const coverage = calculateCoverage(definition);
		const newRule = { definition, coverage };

		this.validateRuleConflicts(newRule);
		this.rules.push(newRule);
	}

	private validateRuleConflicts(newRule: FeedbackRuleWithCoverage): void {
		const shadowedRules = this.rules.filter((existingRule) =>
			ruleCompletelyCovers(newRule, existingRule)
		);

		if (shadowedRules.length > 0) {
			const shadowedMessages = shadowedRules
				.map((r) => `"${r.definition.result.message}"`)
				.join(', ');
			throw new Error(
				`New rule "${newRule.definition.result.message}" completely shadows existing rule(s): ${shadowedMessages}`
			);
		}

		const shadowingRules = this.rules.filter((existingRule) =>
			ruleCompletelyCovers(existingRule, newRule)
		);

		if (shadowingRules.length > 0) {
			const shadowingMessages = shadowingRules
				.map((r) => `"${r.definition.result.message}"`)
				.join(', ');
			throw new Error(
				`New rule "${newRule.definition.result.message}" is completely shadowed by existing rule(s): ${shadowingMessages}`
			);
		}

		const ambiguousRules = this.rules.filter((existingRule) =>
			rulesHaveAmbiguousOverlap(newRule, existingRule)
		);

		if (ambiguousRules.length > 0) {
			const ambiguousMessages = ambiguousRules
				.map((r) => `"${r.definition.result.message}"`)
				.join(', ');
			throw new Error(
				`New rule "${newRule.definition.result.message}" has ambiguous overlap with existing rule(s): ${ambiguousMessages}. ` +
					`Both rules have equal coverage (${newRule.coverage}) and overlapping ranges, making results order-dependent.`
			);
		}
	}

	findBestMatch(carryOnScore: number, personalItemScore: number): ScoringResult | null {
		const matchingRules = this.rules.filter(
			(rule) =>
				isInRange(carryOnScore, rule.definition.carryOnRange) &&
				isInRange(personalItemScore, rule.definition.personalItemRange)
		);

		if (matchingRules.length === 0) {
			return null;
		}

		matchingRules.sort((a, b) => a.coverage - b.coverage);
		return matchingRules[0].definition.result;
	}
}
