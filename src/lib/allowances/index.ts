export { checkCompliance, computeAirlinesCompliance } from './bag-validation';
export { loadData } from './loader';
export { getScoreVisual } from './scoring-messages';
import { type BagAllowanceDimensions } from '$lib/types';
import { descDimensions } from '$lib/utils/dimensions';

export const DEFAULT_PERSONAL_ITEM: BagAllowanceDimensions = {
	centimeters: descDimensions([40, 30, 15]),
	inches: descDimensions([15.75, 11.81, 5.91])
};
