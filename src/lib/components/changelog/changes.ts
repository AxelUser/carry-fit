interface Change {
	version: string;
	changes: string[];
}

// Newest version first
export const changes: Change[] = [
	{
		version: '1.0.0',
		changes: ['Initial release']
	}
];
