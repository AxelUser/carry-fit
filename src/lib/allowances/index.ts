export {
	checkCompliance,
	computeAirlinesCompliance,
	calculateComplianceScore
} from './bag-validation';
export { loadData } from './loader';
export { getScoreVisual } from './scoring-messages';
export { findNearestOptimalFillLevel, type FillSuggestion } from './suggestions';
export {
	FLEXIBILITY_MIN_FILL_PERCENTAGE,
	FLEXIBILITY_MAX_FILL_PERCENTAGE,
	FLEXIBILITY_STEP_PERCENTAGE
} from './flexibility';
import { type BagAllowanceDimensions } from '$lib/types';
import { descDimensions } from '$lib/utils/dimensions';

export const DEFAULT_PERSONAL_ITEM: BagAllowanceDimensions = {
	centimeters: descDimensions([40, 30, 15]),
	inches: descDimensions([15.75, 11.81, 5.91])
};
