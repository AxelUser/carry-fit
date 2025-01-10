<script lang="ts">
	import { GithubIcon } from '$lib/components/icons';
	import { onMount } from 'svelte';

	let stars = $state(0);

	onMount(async () => {
		try {
			const response = await fetch('https://api.github.com/repos/AxelUser/carry-fit');
			const data = await response.json();
			stars = data.stargazers_count;
		} catch (error) {
			console.error('Failed to fetch GitHub stars:', error);
			stars = 0;
		}
	});
</script>

<a
	href="https://github.com/AxelUser/carry-fit"
	target="_blank"
	rel="noopener noreferrer"
	class="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-2 text-sm font-medium text-white shadow-md hover:from-blue-700 hover:to-sky-900"
>
	<GithubIcon class="h-4 w-4" />
	<span>Star</span>
	<div class="flex items-center">
		<div class="mx-1.5 h-3 w-[1px] bg-white/40"></div>
		<span class="min-w-[2.5ch] text-center tabular-nums">
			{stars}
		</span>
	</div>
</a>
