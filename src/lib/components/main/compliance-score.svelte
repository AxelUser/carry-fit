<script lang="ts">
	interface Props {
		allAirlinesCount: number;
		compliantAirlinesCount: number;
	}

	let { allAirlinesCount, compliantAirlinesCount }: Props = $props();

	const percentage = $derived(
		allAirlinesCount === 0 ? 0 : (compliantAirlinesCount / allAirlinesCount) * 100
	);
</script>

<div
	class="rounded-xl border-2 p-6 text-center shadow-sm
    {percentage <= 60
		? 'border-red-200 bg-red-50'
		: percentage <= 80
			? 'border-amber-200 bg-amber-50'
			: 'border-emerald-200 bg-emerald-50'}"
>
	<div class="mb-3 text-sm font-medium text-sky-700 sm:text-base">Compliance Score</div>
	<div
		class="mb-2 text-3xl font-bold tracking-tight sm:text-4xl
    {percentage <= 60 ? 'text-red-600' : percentage <= 80 ? 'text-amber-600' : 'text-emerald-600'}"
	>
		{percentage.toFixed(0)}%
	</div>
	<div class="text-xs text-sky-600 sm:text-sm">
		({compliantAirlinesCount} out of {allAirlinesCount} selected airlines)
	</div>
</div>
