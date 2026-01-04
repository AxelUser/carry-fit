interface ScoringResult {
	message: string;
	image: string;
}

const images = {
	thinking: '/emoji/thinking-face.png',
	melting: '/emoji/melting-face.png',
	smirking: '/emoji/smirking-face.png',
	starStruck: '/emoji/star-struck.png',
	winking: '/emoji/winking-face.png',
	downcastFaceWithSweat: '/emoji/downcast-face-with-sweat.png'
};

type ScoringRule = (carryOnScore: number, personalItemScore: number) => ScoringResult | null;

// Default image used for the compliance score background.
export const SCORE_BACKGROUND_IMAGE = '/emoji/thinking-face_1f914.png';

const scoringRules: ScoringRule[] = [
	// Both scores > 90%
	(carryOnScore, personalItemScore) =>
		carryOnScore > 90 && personalItemScore > 90
			? { message: 'Validators fear this bag!', image: images.starStruck }
			: null,

	// Both scores > 70%
	(carryOnScore, personalItemScore) =>
		carryOnScore > 70 && personalItemScore > 70
			? { message: 'Solid travel companion.', image: images.smirking }
			: null,

	// Carry-on > 90% AND Personal Item < 50%
	(carryOnScore, personalItemScore) =>
		carryOnScore > 90 && personalItemScore < 50
			? { message: 'Overhead bin hero, underseat zero.', image: images.winking }
			: null,

	// Carry-on between 50% and 70%
	(carryOnScore) =>
		carryOnScore >= 50 && carryOnScore <= 70
			? { message: "It's gonna be a tight squeeze.", image: images.melting }
			: null,

	// Both scores < 50%
	(carryOnScore, personalItemScore) =>
		carryOnScore < 50 && personalItemScore < 50
			? { message: 'Living dangerously, I see.', image: images.downcastFaceWithSweat }
			: null,

	// "Check the sizer carefully." - Fallback
	() => ({ message: 'Check the sizer carefully.', image: images.thinking })
];

export function getScoreVisual(carryOnScore: number, personalItemScore: number): ScoringResult {
	for (const rule of scoringRules) {
		const result = rule(carryOnScore, personalItemScore);
		if (result !== null) {
			return result;
		}
	}
	return { message: 'Check the sizer carefully.', image: images.thinking };
}
