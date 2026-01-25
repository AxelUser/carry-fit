<script lang="ts">
	import { baseUrl } from '$lib/utils/navigation';

	interface Props {
		title?: string;
		airlinesCount?: number;
		url?: string;
		noindex?: boolean;
	}

	let {
		airlinesCount = 170,
		title = 'CarryFit - Carry-on & Personal Item Size Checker',
		url = `${baseUrl}/`,
		noindex = false
	}: Props = $props();

	const fullTitle = $derived(title.includes('CarryFit') ? title : `${title} | CarryFit`);
	const description = $derived(
		`Check if your bag fits as a carry-on or personal item for ${airlinesCount} airlines. Instantly validate luggage dimensions against strict airline policies.`
	);
	const image = 'https://carryon.fit/og-image.png';
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="title" content={fullTitle} />
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="carry-on luggage, airline baggage policy, travel tools, suitcase size checker, cabin baggage compliance"
	/>
	<meta name="author" content="Aleksey Maltsev" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />

	<!-- Additional SEO -->
	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
		<meta name="googlebot" content="noindex, nofollow" />
	{:else}
		<meta name="robots" content="index, follow" />
		<meta name="googlebot" content="index, follow" />
	{/if}
	<link rel="canonical" href={url} />
</svelte:head>
