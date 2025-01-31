<script lang="ts">
	interface Props {
		size?: number;
		class?: string;
	}

	let { size = 16, ...restProps }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	{...restProps}
>
	<g
		fill="none"
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="2"
	>
		<path d="m9 10l2 2l4-4" />
		<rect width="20" height="14" x="2" y="3" rx="2" />
		<path d="M12 17v4m-4 0h8" />
	</g>
</svg>
