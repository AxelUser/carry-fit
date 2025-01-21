<script lang="ts">
	import { base } from '$app/paths';
	import { ArrowLeft } from 'lucide-svelte';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<div class="min-h-screen px-2 py-8 sm:px-4">
	<div class="mx-auto max-w-3xl">
		<div class="mb-8">
			<a
				href="{base}/"
				class="inline-flex items-center gap-2 rounded-lg bg-white/95 px-4 py-2 text-sky-700 shadow-md ring-1 ring-sky-100 transition-colors hover:bg-sky-50"
			>
				<ArrowLeft class="h-4 w-4" />
				<span>Back to CarryFit</span>
			</a>
		</div>

		<div class="rounded-xl bg-white/95 p-6 shadow-xl ring-1 ring-sky-100">
			<h1
				class="mb-8 bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text pb-1 text-3xl font-bold text-transparent sm:text-4xl"
			>
				{page.data.title}
			</h1>

			<div class="prose prose-sky max-w-none space-y-8">
				{#if page.data.lastUpdated}
					<p class="text-sm text-sky-600">
						Last updated: {page.data.lastUpdated.toLocaleDateString()}
					</p>
				{/if}
				{@render children()}
			</div>
		</div>
	</div>
</div>
