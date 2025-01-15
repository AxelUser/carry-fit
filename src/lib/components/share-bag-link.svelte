
<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import type { UserDimensions } from '$lib/types';
	import { Link } from 'lucide-svelte';

	const POPOVER_OPEN_TIME = 3000

	const { userDimensions } = $props<{ userDimensions: UserDimensions }>();

	let popoverOpen = $state(false);

	async function copyShareLink() {
		try {
			popoverOpen = true

			const url = new URL(window.location.origin);

			url.searchParams.set('length', userDimensions.length.toString());
			url.searchParams.set('width', userDimensions.width.toString());
			url.searchParams.set('height', userDimensions.height.toString());
			url.searchParams.set('unit', userDimensions.unit);

			await navigator.clipboard.writeText(url.toString());
		} catch (err) {
			console.error('Failed to copy: ', err);
		} finally {
			closeAfterDelay();
		}
	}

	function closeAfterDelay() {
		const timer = setInterval(() => {
			popoverOpen = false

			clearInterval(timer);
		}, POPOVER_OPEN_TIME);
	}
</script>

<Popover.Root open={popoverOpen} closeOnOutsideClick={false}>
	<Popover.Trigger
		class="flex items-center justify-center gap-1.5 rounded-lg bg-sky-100 px-2 py-1.5 text-xs font-medium text-sky-700 transition-colors hover:bg-sky-200 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
		onclick={copyShareLink}
	>
		<Link class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
		<span>Share My Bag Dimensions</span>
	</Popover.Trigger>
	<Popover.Content side='top'>
		<span>Link copied to clipboard!</span>
	</Popover.Content>
</Popover.Root>
