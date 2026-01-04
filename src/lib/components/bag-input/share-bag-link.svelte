<script lang="ts">
	import { ClickSplash } from '$ui/click-splash';
	import { Link } from '@lucide/svelte';
	import type { MeasurementSystem, UserDimensions } from '$lib/types';
	import { Button } from '$ui/button';

	interface Props {
		userDimensions: UserDimensions;
		measurementSystem: MeasurementSystem;
	}

	const { userDimensions, measurementSystem }: Props = $props();

	async function copyShareLink() {
		const url = new URL(window.location.origin);

		url.searchParams.set('height', userDimensions.height.toString());
		url.searchParams.set('width', userDimensions.width.toString());
		url.searchParams.set('depth', userDimensions.depth.toString());
		url.searchParams.set('units', measurementSystem.toString());

		await navigator.clipboard.writeText(url.toString());
	}
</script>

<ClickSplash onTrigger={copyShareLink} content="Copied!">
	{#snippet trigger()}
		<Button variant="ghost" size="sm" onclick={copyShareLink} class="gap-1">
			<Link class="size-4" />
			<span>Copy</span>
		</Button>
	{/snippet}
</ClickSplash>
