<script lang="ts">
	import { getScoreMessage } from '$lib/allowances';
	import { cn } from '$lib/utils/styling';

	interface Props {
		carryOnScore: number;
		personalItemScore: number;
	}

	let { carryOnScore, personalItemScore }: Props = $props();

	const message = $derived(getScoreMessage(carryOnScore, personalItemScore));

	function getScoreClasses(score: number) {
		if (score < 60) {
			return {
				text: 'text-red-600',
				bar: 'bg-red-500'
			};
		}
		if (score <= 80) {
			return {
				text: 'text-amber-600',
				bar: 'bg-amber-500'
			};
		}
		return {
			text: 'text-emerald-600',
			bar: 'bg-emerald-500'
		};
	}

	const carryOnClasses = $derived(getScoreClasses(carryOnScore));
	const personalItemClasses = $derived(getScoreClasses(personalItemScore));
</script>

<div class="rounded-xl border-2 border-border bg-card p-6 text-center shadow-sm">
	<div class="mb-4 text-lg font-semibold text-foreground">{message}</div>

	<div class="grid grid-cols-2 gap-4">
		{@render complianceScoreResults('Carry-on', carryOnScore, carryOnClasses)}

		{@render complianceScoreResults('Personal Item', personalItemScore, personalItemClasses)}
	</div>
</div>

{#snippet complianceScoreResults(
	label: string,
	percentage: number,
	classes: { text: string; bar: string }
)}
	<div class="flex flex-col items-center">
		<div class="mb-2 text-sm font-medium text-muted-foreground">{label}</div>
		<div class="relative mb-2 h-3 w-full overflow-hidden rounded-full bg-muted">
			<div
				class={cn('h-full transition-all duration-500 ease-out', classes.bar)}
				style="width: {percentage}%"
			></div>
		</div>
		<div class={cn('text-xl font-bold', classes.text)}>
			{percentage.toFixed(0)}%
		</div>
	</div>
{/snippet}
