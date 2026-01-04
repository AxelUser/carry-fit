<script lang="ts">
	import Header from './header.svelte';
	import Footer from './footer.svelte';
	import type { Snippet } from 'svelte';
	import ErrorDetails from './error-details.svelte';

	interface Props {
		children: Snippet;
		errorMessage?: string;
	}

	let { children, errorMessage }: Props = $props();
</script>

<div class="flex min-h-screen flex-col">
	<Header />
	<main class="flex-1">
		{#if errorMessage}
			<ErrorDetails {errorMessage} />
		{:else}
			{@render children()}
		{/if}
	</main>
	<Footer />
</div>
