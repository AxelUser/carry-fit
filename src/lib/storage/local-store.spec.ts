import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createLocalStore } from './local-store.svelte';

vi.mock('$app/environment', () => ({
	browser: true
}));

describe('createLocalStore', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('should create store with initial value when localStorage is empty', () => {
		const store = createLocalStore('testKey', 'initial');

		expect(store.value).toBe('initial');
		expect(store.isLoaded).toBe(true);
	});

	it('should load existing value from localStorage', () => {
		localStorage.setItem('testKey', JSON.stringify('stored value'));

		const store = createLocalStore('testKey', 'initial');

		expect(store.value).toBe('stored value');
		expect(store.isLoaded).toBe(true);
	});

	it('should update localStorage when value changes', () => {
		const store = createLocalStore('testKey', 'initial');

		store.value = 'new value';

		expect(localStorage.getItem('testKey')).toBe(JSON.stringify('new value'));
		expect(store.value).toBe('new value');
	});

	it('should handle invalid JSON in localStorage', () => {
		localStorage.setItem('testKey', 'invalid json');

		const store = createLocalStore('testKey', 'initial');

		expect(store.value).toBe('initial');
	});

	it('should reset to initial value', () => {
		const store = createLocalStore('testKey', 'initial');
		store.value = 'changed';

		store.reset();

		expect(store.value).toBe('initial');
		expect(localStorage.getItem('testKey')).toBe(JSON.stringify('initial'));
	});

	it('should work with complex objects', () => {
		const initialValue = { foo: 'bar', num: 42 };
		const store = createLocalStore('testKey', initialValue);

		const newValue = { foo: 'baz', num: 43 };
		store.value = newValue;

		expect(store.value).toEqual(newValue);
		expect(JSON.parse(localStorage.getItem('testKey') || '')).toEqual(newValue);
	});
});
