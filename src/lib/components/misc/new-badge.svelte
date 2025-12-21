<script lang="ts">
	interface Props {
		show: boolean;
	}

	let { show }: Props = $props();
</script>

{#if show}
	<span
		class="animate-gradient inline-flex items-center justify-center rounded-full bg-linear-to-r from-pink-500 via-fuchsia-600 to-pink-500 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white shadow-xs sm:text-xs"
	>
		NEW
	</span>
{/if}

<style>
	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.animate-gradient {
		background-size: 300% auto;
		animation: gradient 2s linear infinite;
	}
</style>
