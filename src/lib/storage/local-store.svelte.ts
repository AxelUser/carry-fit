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
 * @returns A store object
 */
export function createLocalStore<T>(key: string, initialValue: T): LocalStore<T> {
	let value = $state<T>(initialValue);
	let isLoaded = $state(false);

	// Load initial value from localStorage if available
	if (browser) {
		const stored = localStorage.getItem(key);
		if (stored) {
			try {
				value = JSON.parse(stored);
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
