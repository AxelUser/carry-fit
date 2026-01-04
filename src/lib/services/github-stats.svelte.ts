import { dev } from '$app/environment';

interface Contributor {
	login: string;
	avatar_url: string;
	html_url: string;
	contributions: number;
}

interface RepoStats {
	stargazers_count: number;
}

const DUMMY_CONTRIBUTORS: Contributor[] = [
	{
		login: 'AxelUser',
		avatar_url: 'https://avatars.githubusercontent.com/u/7935489?v=4',
		html_url: 'https://github.com/AxelUser',
		contributions: 150
	}
];

const DUMMY_STARS = 100;

class GithubStatsCache {
	private readonly REPO = 'AxelUser/carry-fit';
	private readonly CACHE_DURATION = 10 * 60 * 1000;

	contributors = $state<Contributor[]>([]);
	stars = $state<number>(0);
	contributorsLoading = $state(false);
	starsLoading = $state(false);

	private contributorsTimestamp = 0;
	private starsTimestamp = 0;
	private contributorsFetchPromise: Promise<Contributor[]> | null = null;
	private starsFetchPromise: Promise<number> | null = null;

	async getContributors(): Promise<Contributor[]> {
		if (dev) {
			this.contributors = DUMMY_CONTRIBUTORS;
			return DUMMY_CONTRIBUTORS;
		}

		if (this.isCacheValid(this.contributorsTimestamp)) {
			return this.contributors;
		}

		if (this.contributorsFetchPromise) {
			return this.contributorsFetchPromise;
		}

		this.contributorsLoading = true;
		this.contributorsFetchPromise = this.fetchContributors();

		try {
			const data = await this.contributorsFetchPromise;
			this.contributors = data;
			this.contributorsTimestamp = Date.now();
			return data;
		} finally {
			this.contributorsLoading = false;
			this.contributorsFetchPromise = null;
		}
	}

	async getStars(): Promise<number> {
		if (dev) {
			this.stars = DUMMY_STARS;
			return DUMMY_STARS;
		}

		if (this.isCacheValid(this.starsTimestamp)) {
			return this.stars;
		}

		if (this.starsFetchPromise) {
			return this.starsFetchPromise;
		}

		this.starsLoading = true;
		this.starsFetchPromise = this.fetchStars();

		try {
			const data = await this.starsFetchPromise;
			this.stars = data;
			this.starsTimestamp = Date.now();
			return data;
		} finally {
			this.starsLoading = false;
			this.starsFetchPromise = null;
		}
	}

	private isCacheValid(timestamp: number): boolean {
		return timestamp > 0 && Date.now() - timestamp < this.CACHE_DURATION;
	}

	private async fetchContributors(): Promise<Contributor[]> {
		try {
			const response = await fetch(`https://api.github.com/repos/${this.REPO}/contributors`);
			if (!response.ok) throw new Error('Failed to fetch contributors');
			return await response.json();
		} catch (error) {
			console.error('Error fetching contributors:', error);
			return [];
		}
	}

	private async fetchStars(): Promise<number> {
		try {
			const response = await fetch(`https://api.github.com/repos/${this.REPO}`);
			if (!response.ok) throw new Error('Failed to fetch repo stats');
			const data: RepoStats = await response.json();
			return data.stargazers_count;
		} catch (error) {
			console.error('Failed to fetch GitHub stars:', error);
			return 0;
		}
	}
}

export const githubStats = new GithubStatsCache();
