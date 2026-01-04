<script lang="ts">
	import { SearchX } from '@lucide/svelte';
	import * as Empty from '$ui/empty';

	interface Props {
		title: string;
		description: string;
	}

	let { title, description }: Props = $props();
</script>

<Empty.Root>
	<Empty.Header>
		<Empty.Media>
			<SearchX class="text-primary-foreground size-8" />
		</Empty.Media>
		<Empty.Title>{title}</Empty.Title>
		<Empty.Description>{description}</Empty.Description>
	</Empty.Header>
</Empty.Root>
