interface Change {
	date: Date;
	changes: string[];
}

// Newest version first
export const changes: Change[] = [
	{
		date: new Date('2025-01-11T00:00:00Z'),
		changes: [
			"Our suitcase visualizer for flexible dimensions now comes with tiny hands that give it a squeeze! 👐 It's like a stress ball, but actually your luggage!"
		]
	},
	{
		date: new Date('2024-03-21T00:00:00Z'),
		changes: ['Added ability to save favorite airlines for quick filtering']
	}
];
