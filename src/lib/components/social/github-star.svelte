<script lang="ts">
	import { GithubIcon } from '$components/icons';
	import { githubStats } from '$lib/services/github-stats.svelte';
	import { Separator } from '$ui/separator';

	$effect(() => {
		githubStats.getStars();
	});
</script>

<a
	href="https://github.com/AxelUser/carry-fit"
	target="_blank"
	rel="noopener noreferrer"
	class="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-sky-600 to-blue-700 px-4 py-2 text-sm font-medium text-white shadow-md hover:from-blue-700 hover:to-sky-900"
>
	<GithubIcon class="h-4 w-4" />
	<span>Star</span>
	{#if !githubStats.starsLoading}
		<Separator class="h-[16px]! bg-white/40" orientation="vertical" />
		<span class="min-w-[2.5ch] text-center tabular-nums">
			{githubStats.stars}
		</span>
	{/if}
</a>
