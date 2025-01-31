<script lang="ts">
	import { ClickSplash } from '$lib/components/ui/click-splash';
	import { Link } from 'lucide-svelte';
	import type { MeasurementSystem, UserDimensions } from '$lib/types';
	import { badgeVariants } from '../ui/badge';
	import { cn } from '$lib/utils/styling';

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
	<button
		slot="trigger"
		class={cn(badgeVariants({ variant: 'secondary' }), 'focus:ring-0 focus:ring-offset-0')}
		onclick={copyShareLink}
	>
		<Link class="mr-1 size-3" />
		<span>Copy</span>
	</button>
</ClickSplash>
