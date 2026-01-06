import { mergeRanges } from './helpers';
import type { FeedbackRuleDefinition, ScoreRange, ScoringResult } from './matcher';

export type { ScoringResult };

const images = {
	thinking: '/emoji/thinking-face.png',
	melting: '/emoji/melting-face.png',
	smirking: '/emoji/smirking-face.png',
	starStruck: '/emoji/star-struck.png',
	winking: '/emoji/winking-face.png',
	downcastFaceWithSweat: '/emoji/downcast-face-with-sweat.png'
};

export const RANGES: Record<
	'VERY_BAD' | 'BAD' | 'MEDIUM' | 'GOOD' | 'EXCELLENT' | 'ANY',
	ScoreRange
> = {
	VERY_BAD: { min: 0, max: 20 },
	BAD: { min: 21, max: 40 },
	MEDIUM: { min: 41, max: 70 },
	GOOD: { min: 71, max: 90 },
	EXCELLENT: { min: 91, max: 100 },
	ANY: { min: 0, max: 100 }
};

export const SCORE_FEEDBACK_RULES: FeedbackRuleDefinition[] = [
	{
		carryOnRange: RANGES.EXCELLENT,
		personalItemRange: mergeRanges([RANGES.EXCELLENT, RANGES.GOOD]),
		result: { message: 'Validators fear this bag!', image: images.starStruck, angle: 315 }
	},
	{
		carryOnRange: mergeRanges([RANGES.GOOD, RANGES.EXCELLENT]),
		personalItemRange: RANGES.ANY,
		result: { message: 'Solid travel companion.', image: images.smirking, angle: 315 }
	},
	{
		carryOnRange: mergeRanges([RANGES.GOOD, RANGES.EXCELLENT]),
		personalItemRange: mergeRanges([RANGES.BAD, RANGES.VERY_BAD]),
		result: { message: 'Overhead bin hero, underseat zero.', image: images.winking, angle: 315 }
	},
	{
		carryOnRange: RANGES.MEDIUM,
		personalItemRange: RANGES.ANY,
		result: {
			message: 'Check the sizer carefully.',
			image: images.thinking,
			angle: 45
		}
	},
	{
		carryOnRange: RANGES.BAD,
		personalItemRange: RANGES.ANY,
		result: { message: "It's gonna be a tight squeeze.", image: images.melting, angle: 45 }
	},
	{
		carryOnRange: RANGES.VERY_BAD,
		personalItemRange: RANGES.ANY,
		result: {
			message: 'Living dangerously, I see.',
			image: images.downcastFaceWithSweat,
			angle: 45
		}
	}
];
