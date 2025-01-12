<script lang="ts">
	export let show = true;
</script>

{#if show}
	<span
		class="animate-pulse-subtle inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white shadow-sm sm:text-xs"
	>
		NEW
	</span>
{/if}

<style>
	@keyframes pulse-subtle {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.8;
		}
	}

	.animate-pulse-subtle {
		animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>
