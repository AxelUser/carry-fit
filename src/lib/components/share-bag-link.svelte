
<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import type { UserDimensions } from '$lib/types';
	import { Link } from 'lucide-svelte';

	const POPOVER_OPEN_TIME = 1_500;

	const { userDimensions } = $props<{ userDimensions: UserDimensions }>();

	let popoverOpen = $state(false);

	async function copyShareLink() {
		try {
			popoverOpen = true;

			const url = new URL(window.location.origin);

			url.searchParams.set('length', userDimensions.length.toString());
			url.searchParams.set('width', userDimensions.width.toString());
			url.searchParams.set('height', userDimensions.height.toString());

			await navigator.clipboard.writeText(url.toString());
		} catch (err) {
			console.error('Failed to copy: ', err);
		} finally {
			closeAfterDelay();
		}
	}

	function closeAfterDelay() {
		const timer = setInterval(() => {
			popoverOpen = false;

			clearInterval(timer);
		}, POPOVER_OPEN_TIME);
	}
</script>

<Popover.Root open={popoverOpen} closeOnOutsideClick={false}>
	<Popover.Trigger
		class="flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
		onclick={copyShareLink}
	>
		<Link class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
		<span>Copy</span>
	</Popover.Trigger>
	<Popover.Content side="top">
		<span>Link copied!</span>
	</Popover.Content>
</Popover.Root>
