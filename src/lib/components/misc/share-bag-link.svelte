<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { ClickSplash } from '$lib/components/ui/click-splash';
	import { Link } from 'lucide-svelte';
	import type { MeasurementSystem, UserDimensions } from '$lib/types';

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
	<Button slot="trigger" variant="secondary" size="sm">
		<Link class="mr-1 h-3 w-3" />
		<span>Copy</span>
	</Button>
</ClickSplash>
