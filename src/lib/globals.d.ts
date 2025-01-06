declare const plausible: (
	eventName: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	options?: { props?: Record<string, any>; callback?: () => void; revenue?: number }
) => void;
