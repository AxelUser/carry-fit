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
		date: new Date('2025-01-12T00:00:00Z'),
		changes: [
			'Added favorites feature: now you can star your go-to airlines. Your favorites will be saved in your browser for quick filtering in future visits.'
		]
	},
	{
		date: new Date('2025-01-15T00:00:00Z'),
		changes: [
			'Measurement system now has its own cozy little home up top! Your choice will be automatically remembered in your browser, no more switching! 🔄'
		]
	},
	{
		date: new Date('2025-01-18T00:00:00Z'),
		changes: [
			'New responsive layout: compliant and non-compliant airlines side by side on desktop, toggleable sections on mobile! 📱💻'
		]
	}
];
