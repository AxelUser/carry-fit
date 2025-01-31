<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '../ui/button';
	import easterEggs from '$lib/stores/easter-eggs.svelte';
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
		class="fixed top-1/2 -translate-y-1/2 {positions[side]} max-w-[350px]"
		style="min-width: 180px"
	>
		<Card.Root>
			<Card.Content>
				<div class="text-sm font-medium">
					{#if side === 'left'}
						👉 Hey, psst... look at the other side of your fancy monitor!
					{:else}
						Nice ultrawide you got there! I would show you more but my markup skills only cover half
						the screen...
					{/if}
				</div>
			</Card.Content>
			{#if side === 'right'}
				<Card.Footer class="flex justify-center">
					<Button size="lg" onclick={close} variant="default">Don't bother me anymore!</Button>
				</Card.Footer>
			{/if}
		</Card.Root>
	</div>
{/snippet}
