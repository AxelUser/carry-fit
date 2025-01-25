<script lang="ts">
	import { BuyMeCoffeeButton, GithubStarButton } from '$lib/components/social';
	import { cn } from '$lib/utils/styling';

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();
</script>

<div class={cn('rounded-lg bg-sky-50/80 p-4 text-center', className)}>
	<p class="mb-3 text-sm text-sky-700">If you find this tool helpful and want to support it:</p>
	<div
		class="flex flex-col items-center gap-1 2xs:flex-row 2xs:items-center 2xs:justify-center 2xs:gap-2"
	>
		<GithubStarButton />
		<span class="text-sm text-sky-500 2xs:inline">or</span>
		<BuyMeCoffeeButton />
	</div>
</div>
