import {
	ScoringFeedbackMatcher,
	SCORE_FEEDBACK_RULES,
	type ScoringResult
} from './scoring-feedback';

const matcher = new ScoringFeedbackMatcher();
SCORE_FEEDBACK_RULES.forEach((rule) => matcher.addRule(rule));

export class ScoreVisualizer {
	current = $state<ScoringResult | null>(null);

	constructor(carryOnScoreGetter: () => number, personalItemScoreGetter: () => number) {
		$effect(() => {
			const carryOnScore = carryOnScoreGetter();
			const personalItemScore = personalItemScoreGetter();
			this.current = matcher.findBestMatch(carryOnScore, personalItemScore);
		});
	}
}
