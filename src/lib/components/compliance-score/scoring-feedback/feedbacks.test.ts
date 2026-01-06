import { describe, test, expect } from 'vitest';
import { ScoringFeedbackMatcher } from './matcher';
import { SCORE_FEEDBACK_RULES } from './feedbacks';

describe('Production scoring feedback rules validation', () => {
	test('all production rules can be added without shadowing or overlap errors', () => {
		const matcher = new ScoringFeedbackMatcher();

		expect(() => {
			SCORE_FEEDBACK_RULES.forEach((rule) => matcher.addRule(rule));
		}).not.toThrow();
	});

	test('all scoring ranges covered by at least one rule', () => {
		const matcher = new ScoringFeedbackMatcher();
		SCORE_FEEDBACK_RULES.forEach((rule) => matcher.addRule(rule));

		for (let carryOn = 0; carryOn <= 100; carryOn++) {
			for (let personal = 0; personal <= 100; personal++) {
				const result = matcher.findBestMatch(carryOn, personal);
				expect(
					result,
					`No result found for carryOn: ${carryOn}, personal: ${personal}`
				).not.toBeNull();
			}
		}
	});

	test('all feedback rules can be matched', () => {
		const matcher = new ScoringFeedbackMatcher();
		SCORE_FEEDBACK_RULES.forEach((rule) => matcher.addRule(rule));
		const remainingRules = new Set([...SCORE_FEEDBACK_RULES.map((rule) => rule.result.message)]);
		for (let carryOn = 0; carryOn <= 100; carryOn++) {
			for (let personal = 0; personal <= 100; personal++) {
				const result = matcher.findBestMatch(carryOn, personal);
				if (result) {
					remainingRules.delete(result.message);
				}
			}
		}
		expect(remainingRules.size, `Remaining rules: ${Array.from(remainingRules).join(', ')}`).toBe(
			0
		);
	});
});
