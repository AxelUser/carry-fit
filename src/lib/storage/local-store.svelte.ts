import { browser } from '$app/environment';

export class LocalStore<T> {
	value = $state<T>();
	key = '';

	constructor(key: string, value: T) {
		this.key = key;
		this.value = value;

		if (browser) {
			const item = localStorage.getItem(key);
			if (item) {
				const deserialized = this.deserializeSafe(item);
				if (deserialized !== null) this.value = deserialized;
			}
		}

		$effect(() => {
			if (this.value !== undefined) {
				localStorage.setItem(this.key, this.serialize(this.value));
			}
		});
	}

	serialize(value: T): string {
		return JSON.stringify(value);
	}

	deserializeSafe(item: string): T | null {
		try {
			return JSON.parse(item);
		} catch (error) {
			return null;
		}
	}
}

export function localStore<T>(key: string, value: T) {
	return new LocalStore(key, value);
}
