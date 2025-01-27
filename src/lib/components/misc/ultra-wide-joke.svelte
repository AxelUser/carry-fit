<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { Button } from '../ui/button';
	import easterEggs from '$lib/stores/easterEggs.svelte';
	import { metrics } from '$lib/analytics';

	const positions = {
		left: 'left-8',
		right: 'right-8'
	};

	let innerWidth = $state(0);

	function close() {
		easterEggs.ultraWide = false;
	}

	$effect(() => {
		if (innerWidth > 3440) {
			metrics.easterEggShown('ultra-wide');
		}
	});
</script>

<svelte:window bind:innerWidth />

{#if easterEggs.ultraWide}
	<div class="fixed hidden 3xl:block">
		{@render card('left')}
		{@render card('right')}
	</div>
{/if}

{#snippet card(side: 'left' | 'right')}
	<div
		class="fixed top-1/2 -translate-y-1/2 {positions[side]} max-w-[250px]"
		style="min-width: 180px"
	>
		<Card variant="default">
			<div class="text-sm font-medium text-sky-700">
				{#if side === 'left'}
					👉 Hey, psst... look at the other side of your fancy monitor!
				{:else}
					<div class="flex flex-col gap-2">
						<span>Nice ultrawide you got there! 👀 Worth every pixel, right?</span>
						<span>PS: I would show you more but my markup skills only cover half the screen...</span
						>
						<Button onclick={close} variant="default">Don't bother me anymore!</Button>
					</div>
				{/if}
			</div>
		</Card>
	</div>
{/snippet}
