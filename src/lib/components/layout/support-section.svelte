<script lang="ts">
	import { BuyMeCoffeeButton, GithubStarButton } from '$lib/components/social';
	import { cn } from '$lib/utils/ui';

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();
</script>

<div class={cn('bg-muted rounded-lg p-4 text-center', className)}>
	<p class="text-muted-foreground mb-3 text-sm">
		If you find this tool helpful and want to support it:
	</p>
	<div
		class="2xs:flex-row 2xs:items-center 2xs:justify-center 2xs:gap-2 flex flex-col items-center gap-1"
	>
		<GithubStarButton />
		<span class="text-muted-foreground 2xs:inline text-sm">or</span>
		<BuyMeCoffeeButton />
	</div>
</div>
