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
	<path
		fill="none"
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="2"
		d="M8.34 8.34L2 9.27l5 4.87L5.82 21L12 17.77L18.18 21l-.59-3.43m.83-4.81L22 9.27l-6.91-1L12 2l-1.44 2.91M2 2l20 20"
	/>
</svg>
