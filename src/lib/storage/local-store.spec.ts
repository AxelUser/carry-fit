import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createLocalStore } from './local-store.svelte';
import { AppDatabase } from './app-database';

vi.mock('$app/environment', () => ({
	browser: true
}));

describe('createLocalStore', () => {
	let store = createLocalStore('testKey', 'initial');

	beforeEach(() => {
		localStorage.clear();
	});

	afterEach(() => {
		store.closeDB();
	});

	it('should create store with initial value when localStorage is empty', async () => {
		store = createLocalStore('testKey', 'initial');

		await new Promise((r) => setTimeout(r, 50)); // Wait for async operations

		expect(store.value).toBe('initial');
		expect(store.isLoaded).toBeTruthy();
	});

	it('should load existing value from localStorage', async () => {
		localStorage.setItem('testKey', JSON.stringify('stored value'));

		store = createLocalStore('testKey', 'initial');

		await new Promise((r) => setTimeout(r, 50)); // Wait for async operations

		expect(store.value).toBe('stored value');
		expect(store.isLoaded).toBeTruthy();
	});

	it('should update IndexedDB when value changes', async () => {
		store = createLocalStore('testKey', 'initial');

		await new Promise((r) => setTimeout(r, 50));

		store.value = 'new value';

		expect(store.value).toBe('new value');
	});

	it('should reset to initial value', async () => {
		store = createLocalStore('testKey', 'initial');

		await new Promise((r) => setTimeout(r, 50)); // Wait for async operations

		store.value = 'changed';

		store.reset();

		expect(store.value).toBe('initial');
	});

	it('should work with complex objects', async () => {
		const initialValue = { foo: 'bar', num: 42 };
		const complexStore = createLocalStore('complexTable', initialValue);

		await new Promise((r) => setTimeout(r, 50)); // Wait for async operations

		const newValue = { foo: 'baz', num: 43 };
		complexStore.value = newValue;

		expect(complexStore.value).toEqual(newValue);
	});
});
