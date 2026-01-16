import type { UserDimensions } from '$lib/types';
import { IsDocumentVisible, PersistedState, watch } from 'runed';

export class ParsingDialogSuggestion {
	private disabled = new PersistedState('suggestion_dimensionParsing_disabled', false);

	private inputBeforeHidden = $state(false);
	private wasHidden = $state(false);
	private detected = $state(false);

	constructor(bagDimensionsGetter: () => UserDimensions) {
		const visible = new IsDocumentVisible();
		let lastDimensions = { ...bagDimensionsGetter() };

		watch(
			() => ({ ...bagDimensionsGetter() }),
			(dims) => {
				if (this.disabled.current || this.detected) return;

				const hasChanged =
					dims.height !== lastDimensions.height ||
					dims.width !== lastDimensions.width ||
					dims.depth !== lastDimensions.depth;

				if (hasChanged) {
					if (visible.current) {
						if (this.wasHidden && this.inputBeforeHidden) {
							this.detected = true;
						} else {
							this.inputBeforeHidden = true;
						}
					}
					lastDimensions = { ...dims };
				}
			}
		);

		watch(
			() => visible.current,
			(isVisible) => {
				if (this.disabled.current || this.detected) return;

				if (!isVisible && this.inputBeforeHidden) {
					this.wasHidden = true;
				}
			}
		);
	}

	public disable() {
		this.disabled.current = true;
	}

	public shouldShow(): boolean {
		return !this.disabled.current && this.detected;
	}
}
