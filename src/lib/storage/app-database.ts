import Dexie, { type Table } from 'dexie';

export class AppDatabase extends Dexie {
	private tablesMap: { [key: string]: Table<any, string> } = {};
	private currentVersion: number = 0;
	private schema: { [key: string]: string } = {
		migration: 'key' // Initial table for migration tracking
	};

	constructor() {
		super('AppDatabase');

		// Initial version
		this.version(1).stores(this.schema);
	}

	// Register a new table based on key
	registerTable<T>(key: string, initialSchema: string = 'id'): Table<T, string> {
		if (!this.tablesMap[key]) {
			this.currentVersion++;
			this.schema[key] = initialSchema;

			// Define new version with updated schema
			this.version(this.currentVersion).stores(this.schema);

			this.close();
			this.open().catch((e) => console.error('Error reopening database:', e));

			this.tablesMap[key] = this.table(key);
		}

		return this.tablesMap[key];
	}

	getTable(key: string): Table<any, string> {
		return this.tablesMap[key];
	}
}
