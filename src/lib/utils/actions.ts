/**
 * Debounce a function to prevent it from being called too frequently.
 * @param fn - The function to debounce.
 * @param waitMs - The number of milliseconds to wait before calling the function.
 * @returns A function that, when called, will debounce the original function.
 */
export function debounce<Args extends unknown[], R>(
	fn: (...args: Args) => R,
	waitMs: number
): {
	(...args: Args): void;
	cancel: () => void;
} {
	let timeout: ReturnType<typeof setTimeout> | undefined;

	const cancel = () => {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
	};

	const debounced = (...args: Args): void => {
		cancel();
		timeout = setTimeout(() => {
			fn(...args);
			timeout = undefined;
		}, waitMs);
	};

	debounced.cancel = cancel;
	return debounced;
}
