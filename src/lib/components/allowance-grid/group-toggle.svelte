<script lang="ts">
	import { Label } from '$ui/label';
	import { Checkbox } from '$ui/checkbox';
	import { MediaQuery } from 'svelte/reactivity';

	interface Props {
		checked: boolean;
		count: number;
		groupLabel: 'compliant' | 'non-compliant';
	}

	let { checked = $bindable(), count, groupLabel }: Props = $props();

	const airlinesText = $derived.by(() => (count === 1 ? 'airline' : 'airlines'));

	const isMobile = new MediaQuery('(max-width: 640px)');
</script>

<Label
	class="hover:bg-accent/50 has-aria-checked:border-primary has-aria-checked:bg-primary/10 dark:has-aria-checked:bg-primary/20 flex items-start gap-3 rounded-lg border p-3"
>
	<Checkbox
		id={`show-${groupLabel}-airlines`}
		bind:checked
		class="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
	/>
	<div class="grid gap-1.5 font-normal">
		<p class="text-sm leading-none font-medium">
			{groupLabel.charAt(0).toUpperCase() + groupLabel.slice(1)}
			{airlinesText}
			{#if isMobile.current}
				({count})
			{/if}
		</p>
		{#if !isMobile.current}
			<p class="text-muted-foreground text-sm">
				Show {count}
				{groupLabel}
				{airlinesText} in the results.
			</p>
		{/if}
	</div>
</Label>
