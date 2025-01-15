import { browser } from '$app/environment';

export interface LocalStore<T> {
	value: T;
	readonly isLoaded: boolean;
	reset(): void;
}

/**
 * Creates a reactive local storage store with automatic persistence
 * @param key The localStorage key
 * @param initialValue The initial value if nothing is in localStorage
 * @param patchLoadedValue Optional function to patch loaded values with missing properties
 * @returns A store object
 */
export function createLocalStore<T>(
	key: string,
	initialValue: T,
	patchLoadedValue?: (loaded: T, initial: T) => T
): LocalStore<T> {
	let value = $state<T>(initialValue);
	let isLoaded = $state(false);

	if (browser) {
		const stored = localStorage.getItem(key);
		if (stored) {
			try {
				const parsedValue = JSON.parse(stored);
				value = patchLoadedValue ? patchLoadedValue(parsedValue, initialValue) : parsedValue;
			} catch {
				value = initialValue;
			}
		}
		isLoaded = true;
	}

	const store = {
		get value() {
			return value;
		},
		set value(newValue: T) {
			value = newValue;
			if (browser) {
				localStorage.setItem(key, JSON.stringify(newValue));
			}
		},
		get isLoaded() {
			return isLoaded;
		},
		reset() {
			this.value = initialValue;
		}
	};

	return store;
}
