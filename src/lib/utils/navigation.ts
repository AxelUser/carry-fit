import { resolve } from '$app/paths';

const links = {
	legal: {
		privacy: resolve('/legal/privacy'),
		terms: resolve('/legal/terms'),
		optOut: resolve('/legal/opt-out')
	},
	home: resolve('/')
};

export { links };
