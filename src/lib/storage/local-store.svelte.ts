import { browser } from '$app/environment';
import { AppDatabase } from './app-database';

export interface LocalStore<T> {
	value: T;
	readonly isLoaded: boolean;
	closeDB(): void;
	dbVersion: number;
	reset(): void;
}

const db = new AppDatabase();

/**
 * Creates a reactive IndexedDB store with automatic persistence and migration from localStorage.
 * @param key The IndexedDB key
 * @param initialValue The initial value if nothing is stored
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

	async function loadInitialValue() {
		if (!browser) return;

		try {
			await db.open();

			const table = db.registerTable<T>(key);

			const localStorageValue = localStorage.getItem(key);

			if (localStorageValue !== null) {
				let parsedValue;
				try {
					parsedValue = JSON.parse(localStorageValue);
				} catch {
					parsedValue = localStorageValue;
				}

				value = patchLoadedValue
					? patchLoadedValue(parsedValue as T, initialValue)
					: (parsedValue as T);
			} else {
				const stored = await table.get('data');

				if (stored) {
					const loadedValue = { ...stored };

					if (loadedValue.hasOwnProperty('value')) {
						const finalValue = (loadedValue as unknown as { value: T }).value as T;
						value = patchLoadedValue ? patchLoadedValue(finalValue, initialValue) : finalValue;
					} else {
						value = patchLoadedValue
							? patchLoadedValue(loadedValue as T, initialValue)
							: (loadedValue as T);
					}
				}
			}

			isLoaded = true;
		} catch (e) {
			console.error(`Error loading ${key} from IndexedDB:`, e);
			value = initialValue;
			isLoaded = true;
		}
	}
	// Load initial value when in browser
	if (browser) {
		loadInitialValue();
	}

	const store = {
		get value() {
			return value;
		},
		set value(newValue: T) {
			value = newValue;

			if (browser) {
				value = newValue;
				if (browser && db.getTable(key)) {
					db.getTable(key)
						.put({ id: 'data', ...newValue })
						.catch((e) => {
							console.error(`Error saving ${key} to IndexedDB:`, e);
						});
				}
			}
		},
		get isLoaded() {
			return isLoaded;
		},
		closeDB() {
			db.close();
		},
		reset() {
			this.value = initialValue;
			if (browser && db.getTable(key)) {
				db.getTable(key)
					.put({ id: 'data', ...initialValue })
					.catch((e) => {
						console.error(`Error resetting ${key} in IndexedDB:`, e);
					});
			}
		},
		dbVersion: db.verno
	};

	return store;
}
