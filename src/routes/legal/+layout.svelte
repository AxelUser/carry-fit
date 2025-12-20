<script lang="ts">
	import { base } from '$app/paths';
	import { ArrowLeft } from '@lucide/svelte';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';

	let { children } = $props();
</script>

<div class="min-h-screen px-2 py-8 sm:px-4">
	<div class="mx-auto max-w-3xl">
		<Button href="{base}/" variant="default" class="mb-4">
			<ArrowLeft class="h-4 w-4" />
			<span>Back to CarryFit</span>
		</Button>

		<div class="rounded-xl p-6 shadow-xl ring-1 ring-primary">
			<h1 class="mb-8 bg-clip-text pb-1 text-3xl font-bold text-primary sm:text-4xl">
				{page.data.title}
			</h1>

			<div class="max-w-none space-y-8">
				{#if page.data.lastUpdated}
					<p class="text-sm text-foreground">
						Last updated: {page.data.lastUpdated.toLocaleDateString()}
					</p>
				{/if}
				{@render children()}
			</div>
		</div>
	</div>
</div>
