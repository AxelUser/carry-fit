export { checkCompliance, groupAirlinesByCompliance } from './bag-validation';
export { loadData } from './loader';
export { getScoreMessage } from './scoring-messages';
import { type BagAllowanceDimensions } from '$lib/types';

export const DEFAULT_PERSONAL_ITEM: BagAllowanceDimensions = {
	centimeters: [40, 30, 15],
	inches: [15.75, 11.81, 5.91]
};
