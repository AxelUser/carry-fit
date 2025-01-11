interface Change {
	version: string;
	changes: string[];
}

// Newest version first
export const changes: Change[] = [];
