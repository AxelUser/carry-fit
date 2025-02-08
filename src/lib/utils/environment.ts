import { dev } from '$app/environment';

export function isLocalhost() {
	return (
		dev &&
		typeof window !== 'undefined' &&
		(window.location.hostname.includes('localhost') ||
			window.location.hostname.includes('127.0.0.1'))
	);
}
