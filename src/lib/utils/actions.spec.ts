import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from './actions';

describe('debounce', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should delay function execution', () => {
		const mockFn = vi.fn();
		const debouncedFn = debounce(mockFn, 100);

		debouncedFn();
		expect(mockFn).not.toBeCalled();

		vi.advanceTimersByTime(50);
		expect(mockFn).not.toBeCalled();

		vi.advanceTimersByTime(50);
		expect(mockFn).toBeCalledTimes(1);
	});

	it('should only execute once for multiple rapid calls', () => {
		const mockFn = vi.fn();
		const debouncedFn = debounce(mockFn, 100);

		debouncedFn();
		debouncedFn();
		debouncedFn();

		expect(mockFn).not.toBeCalled();
		vi.advanceTimersByTime(100);
		expect(mockFn).toBeCalledTimes(1);
	});

	it('should pass arguments correctly', () => {
		const mockFn = vi.fn();
		const debouncedFn = debounce(mockFn, 100);

		debouncedFn('test', 123);
		vi.advanceTimersByTime(100);

		expect(mockFn).toBeCalledWith('test', 123);
	});

	it('should cancel pending execution when cancel is called', () => {
		const mockFn = vi.fn();
		const debouncedFn = debounce(mockFn, 100);

		debouncedFn();
		debouncedFn.cancel();

		vi.advanceTimersByTime(100);
		expect(mockFn).not.toBeCalled();
	});

	it('should reset timer on subsequent calls', () => {
		const mockFn = vi.fn();
		const debouncedFn = debounce(mockFn, 100);

		debouncedFn();
		vi.advanceTimersByTime(50);

		debouncedFn(); // Reset timer
		vi.advanceTimersByTime(50); // Total 100ms, but timer was advanced to 50ms
		expect(mockFn).not.toBeCalled();

		vi.advanceTimersByTime(50); // Now it should fire
		expect(mockFn).toBeCalledTimes(1);
	});

	it('should handle multiple independent debounced functions', () => {
		const mockFn1 = vi.fn();
		const mockFn2 = vi.fn();
		const debouncedFn1 = debounce(mockFn1, 100);
		const debouncedFn2 = debounce(mockFn2, 200);

		debouncedFn1();
		debouncedFn2();

		vi.advanceTimersByTime(100);
		expect(mockFn1).toBeCalledTimes(1);
		expect(mockFn2).not.toBeCalled();

		vi.advanceTimersByTime(100);
		expect(mockFn1).toBeCalledTimes(1);
		expect(mockFn2).toBeCalledTimes(1);
	});
});
