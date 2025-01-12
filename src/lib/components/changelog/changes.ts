interface Change {
	date: Date;
	changes: string[];
}

export const changes: Change[] = [
	{
		date: new Date('2025-01-11T00:00:00Z'),
		changes: [
			"Our suitcase visualizer for flexible dimensions now comes with tiny hands that give it a squeeze! 👐 It's like a stress ball, but actually your luggage!"
		]
	},
	{
		date: new Date('2024-03-21T00:00:00Z'),
		changes: [
			'Added favorites feature: now you can star your go-to airlines. Your favorites will be saved in your browser for quick filtering in future visits.'
		]
	}
];
