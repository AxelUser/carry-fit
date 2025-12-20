<script lang="ts">
	import { CarryFitIcon } from '$lib/components/icons';
	import { ToggleTheme } from '$lib/components/misc';
	import { Button } from '$lib/components/ui/button';
	import { links } from '$lib/utils/navigation';
	import { runMainTour } from '$lib/tours';
	import { cn } from '$lib/utils/ui';
	import { page } from '$app/state';

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();

	const isHome = $derived(page.url.pathname === '/');
</script>

<header
	class={cn(
		'bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-sm',
		className
	)}
>
	<div class="mx-auto max-w-[1700px] px-4">
		<div class="flex h-16 items-center justify-between">
			<a href={links.home} class="flex items-center gap-2 transition-opacity hover:opacity-80">
				<CarryFitIcon class="h-6 w-6 sm:h-8 sm:w-8" />
				<span
					class="bg-linear-to-r from-blue-700 to-sky-500 bg-clip-text text-xl font-extrabold text-transparent sm:text-2xl"
				>
					CarryFit
				</span>
			</a>

			<nav class="flex items-center gap-2 sm:gap-3">
				{#if isHome}
					<Button
						data-tour-id="take-tour-button"
						variant="ghost"
						size="sm"
						onclick={() => runMainTour()}
						class="hidden sm:inline-flex"
					>
						Take a Tour
					</Button>
				{/if}
				<Button href={links.legal.privacy} variant="ghost" size="sm" class="hidden sm:inline-flex">
					Privacy
				</Button>
				<Button href={links.legal.terms} variant="ghost" size="sm" class="hidden sm:inline-flex">
					Terms
				</Button>
				<ToggleTheme />
			</nav>
		</div>
	</div>
</header>
