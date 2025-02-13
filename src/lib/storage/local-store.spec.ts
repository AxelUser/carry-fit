import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createLocalStore } from './local-store.svelte';

vi.mock('$app/environment', () => ({
	browser: true
}));

describe('createLocalStore', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('should create store with initial value when localStorage is empty', async () => {
		const store = createLocalStore('testKey', 'initial');

		await new Promise((r) => setTimeout(r, 50)); // Wait for async operations

		expect(store.value).toBe('initial');
		expect(store.isLoaded).toBe(true);
	});

	it('should load existing value from localStorage', async () => {
		localStorage.setItem('testKey', JSON.stringify('stored value'));

		const store = createLocalStore('testKey', 'initial');

		await new Promise((r) => setTimeout(r, 50)); // Wait for async operations

		expect(store.value).toBe('stored value');
		expect(store.isLoaded).toBe(true);
	});

	it('should update IndexedDB when value changes', async () => {
		const store = createLocalStore('testKey', 'initial');

		await new Promise((r) => setTimeout(r, 50));

		store.value = 'new value';

		expect(store.value).toBe('new value');
		expect(await store.db.data.get('testKey')).toStrictEqual({
			key: 'testKey',
			value: 'new value'
		});
	});

	it('should reset to initial value', async () => {
		const store = createLocalStore('testKey', 'initial');

		await new Promise((r) => setTimeout(r, 50)); // Wait for async operations

		store.value = 'changed';

		store.reset();

		expect(store.value).toBe('initial');
		expect(await store.db.data.get('testKey')).toStrictEqual({
			key: 'testKey',
			value: 'initial'
		});
	});

	it('should work with complex objects', async () => {
		const initialValue = { foo: 'bar', num: 42 };
		const store = createLocalStore('testKey', initialValue);

		await new Promise((r) => setTimeout(r, 50)); // Wait for async operations

		const newValue = { foo: 'baz', num: 43 };
		store.value = newValue;

		expect(store.value).toEqual(newValue);
		expect(await store.db.data.get('testKey')).toStrictEqual({
			key: 'testKey',
			value: {
				foo: 'baz',
				num: 43
			}
		});
	});
});
