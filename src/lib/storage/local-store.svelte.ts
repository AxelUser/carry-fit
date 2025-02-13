import { browser } from '$app/environment';
import Dexie from 'dexie';

export interface LocalStore<T> {
	value: T;
	readonly isLoaded: boolean;
	readonly db: AppDatabase;
	reset(): void;
}

class AppDatabase extends Dexie {
	data: Dexie.Table<{ key: string; value: any }, string>;

	constructor() {
		super('AppDatabase');

		this.version(1).stores({
			data: '&key' // Unique key index
		});

		this.data = this.table('data');
	}
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

	async function loadDatabase() {
		if (!browser) return;

		try {
			// Step 1: Check for existing data in IndexedDB
			const stored = await db.data.get(key);

			if (stored && stored.value) {
				value = patchLoadedValue ? patchLoadedValue(stored.value, initialValue) : stored.value;
			} else {
				// Step 2: Check localStorage for migration
				const localStored = localStorage.getItem(key);

				if (localStored) {
					try {
						const parsedValue = JSON.parse(localStored);
						value = patchLoadedValue ? patchLoadedValue(parsedValue, initialValue) : parsedValue;

						// Migrate the data to IndexedDB
						await db.data.put({ key, value });

						// Remove from localStorage after migration
						localStorage.removeItem(key);
					} catch {
						value = initialValue;
					}
				}
			}
		} catch (error) {
			console.error('Error loading data:', error);
			value = initialValue;
		} finally {
			isLoaded = true;
		}
	}

	loadDatabase(); // Trigger the initial load asynchronously

	const store = {
		get value() {
			return value;
		},
		set value(newValue: T) {
			value = newValue;
			if (browser) {
				db.data.put({ key, value: newValue }).catch(console.error);
			}
		},
		get isLoaded() {
			return isLoaded;
		},
		get db() {
			return db;
		},
		reset() {
			this.value = initialValue;
		}
	};

	return store;
}
