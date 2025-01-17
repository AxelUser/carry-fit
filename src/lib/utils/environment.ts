export function isLocalhost() {
	return (
		typeof window !== 'undefined' &&
		(window.location.hostname.includes('localhost') ||
			window.location.hostname.includes('127.0.0.1'))
	);
}
