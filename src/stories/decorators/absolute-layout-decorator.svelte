<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="relative min-h-[400px] w-full">
	{@render children()}
</div>
