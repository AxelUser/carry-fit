<script lang="ts">
	import { links } from '$lib/utils/navigation';
	import { ArrowLeft } from '@lucide/svelte';
	import { page } from '$app/state';
	import { Button } from '$ui/button';
	import { Seo } from '$components/seo';

	let { children } = $props();
</script>

<Seo title={page.data.title} />

<div class="min-h-screen px-2 py-8 sm:px-4">
	<div class="mx-auto max-w-3xl">
		<Button href={links.home} variant="default" class="mb-4">
			<ArrowLeft class="h-4 w-4" />
			<span>Back to CarryFit</span>
		</Button>

		<div class="ring-primary rounded-xl p-6 shadow-xl ring-1">
			<h1 class="text-primary mb-8 bg-clip-text pb-1 text-3xl font-bold sm:text-4xl">
				{page.data.title}
			</h1>

			<div class="max-w-none space-y-8">
				{#if page.data.lastUpdated}
					<p class="text-foreground text-sm">
						Last updated: {page.data.lastUpdated.toLocaleDateString()}
					</p>
				{/if}
				{@render children()}
			</div>
		</div>
	</div>
</div>
