type ScoringRule = (carryOnScore: number, personalItemScore: number) => string | null;

const scoringRules: ScoringRule[] = [
	// Both scores > 90%
	(carryOnScore, personalItemScore) =>
		carryOnScore > 90 && personalItemScore > 90 ? 'Validators fear this bag!' : null,

	// Both scores > 70%
	(carryOnScore, personalItemScore) =>
		carryOnScore > 70 && personalItemScore > 70 ? 'Solid travel companion.' : null,

	// Carry-on > 90% AND Personal Item < 50%
	(carryOnScore, personalItemScore) =>
		carryOnScore > 90 && personalItemScore < 50 ? 'Overhead bin hero, underseat zero.' : null,

	// Carry-on between 50% and 70%
	(carryOnScore) =>
		carryOnScore >= 50 && carryOnScore <= 70 ? "It's gonna be a tight squeeze." : null,

	// Both scores < 50%
	(carryOnScore, personalItemScore) =>
		carryOnScore < 50 && personalItemScore < 50 ? 'Living dangerously, I see.' : null,

	// "Check the sizer carefully." - Fallback
	() => 'Check the sizer carefully.'
];

export function getScoreMessage(carryOnScore: number, personalItemScore: number): string {
	for (const rule of scoringRules) {
		const message = rule(carryOnScore, personalItemScore);
		if (message !== null) {
			return message;
		}
	}
	return 'Check the sizer carefully.';
}
