<script lang="ts">
	import { CarryFitIcon } from '$lib/components/icons';
	import { loadData, groupAirlinesByCompliance } from '$lib/allowances';
	import {
		type UserDimensions,
		type MeasurementSystem,
		MeasurementSystems,
		type CookieConsent
	} from '$lib/types';
	import { metrics, disposeAnalytics } from '$lib/analytics';
	import { GithubStarButton, BuyMeCoffeeButton } from '$lib/components/social';
	import { onDestroy } from 'svelte';
	import preferences from '$lib/stores/preferences';
	import versionStore from '$lib/stores/versionStore.svelte';
	import { changes } from '$lib/changes';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { links } from '$lib/utils/navigation';
	import {
		AllowanceFilter,
		AllowanceTable,
		BagInput,
		ComplianceScore,
		Info,
		MeasurementSystemSelect,
		SupportSection
	} from '$lib/components/main';
	import { Card } from '$lib/components/ui/card';
	import { CookieBanner, Changelog } from '$lib/components/misc';
	import { cookieConsent } from '$lib/stores/cookie-consent.svelte';
	import { updateConsent } from '$lib/analytics';

	let innerWidth = $state(0);
	// Taken from tailwind.config.ts
	let isLargeScreen = $derived(innerWidth > 1280);

	const FLEXIBILITY_CONFIG = {
		metric: {
			max: 8,
			step: 0.5
		},
		imperial: {
			max: 3,
			step: 0.25
		}
	};

	const { meta, allowances: allAirlines } = loadData();

	let sharedBagInfo = $state.raw(
		(() => {
			if (!browser) {
				return undefined;
			}

			const urlHeight = Number(page.url.searchParams.get('height'));
			const urlWidth = Number(page.url.searchParams.get('width'));
			const urlDepth = Number(page.url.searchParams.get('depth'));
			const urlMeasurementSystem = page.url.searchParams.get('units');

			if (
				urlDepth &&
				urlWidth &&
				urlHeight &&
				urlMeasurementSystem &&
				Object.values(MeasurementSystems).includes(urlMeasurementSystem as MeasurementSystem)
			) {
				return {
					depth: urlDepth,
					width: urlWidth,
					height: urlHeight,
					measurementSystem: urlMeasurementSystem as MeasurementSystem
				};
			}
		})()
	);

	function clearSharedBagInfo() {
		if (sharedBagInfo || page.url.searchParams.size > 0) {
			sharedBagInfo = undefined;
			goto(page.url.pathname);
		}
	}

	let userDimensions = $state<UserDimensions>(
		sharedBagInfo || {
			depth: 0,
			width: 0,
			height: 0
		}
	);

	let allDimensionsSet = $derived(
		userDimensions.depth > 0 && userDimensions.width > 0 && userDimensions.height > 0
	);

	if (sharedBagInfo?.measurementSystem) {
		preferences.measurementSystem = sharedBagInfo.measurementSystem;
	}

	let flexibility = $state(0);
	let showFlexibility = $state(false);

	$effect(() => {
		if (!showFlexibility) {
			flexibility = 0;
		}
	});

	let showFavoritesOnly = $state(false);
	let filteredAirlines = $state(allAirlines);

	const airlinesByCompliance = $derived(
		groupAirlinesByCompliance(
			filteredAirlines,
			userDimensions,
			preferences.measurementSystem,
			flexibility
		)
	);

	$effect(() => {
		if (userDimensions.depth > 0 && userDimensions.width > 0 && userDimensions.height > 0) {
			metrics.userBagValidated(
				userDimensions.depth,
				userDimensions.width,
				userDimensions.height,
				preferences.measurementSystem,
				showFlexibility,
				flexibility
			);
		}
	});

	$effect(() => {
		if (showFavoritesOnly) {
			metrics.favoritesFilterEnabled(preferences.favoriteAirlines.length);
		}
	});

	onDestroy(() => {
		disposeAnalytics();
	});

	function handleConsent(consent: CookieConsent) {
		cookieConsent.value = consent;
		updateConsent(consent.analytics);
	}
</script>

<svelte:window bind:innerWidth />

<Changelog
	{changes}
	lastSeenVersion={versionStore.lastSeenVersion}
	onOpen={(seenVersion, isNewVersion) => {
		versionStore.lastSeenVersion = seenVersion;
		metrics.changelogOpened(seenVersion, isNewVersion);
	}}
/>
<CookieBanner
	onAccept={handleConsent}
	showBanner={cookieConsent.isLoaded && cookieConsent.value.timestamp === null}
/>

<div class="min-h-screen px-2 py-8 sm:px-4">
	<div class="min-h-screen bg-white/90">
		<div class="mx-auto md:container">
			<div class="mb-8 py-2 text-center">
				<h1 class="mb-3 font-extrabold">
					<span
						class="bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-4xl text-transparent sm:text-6xl"
					>
						CarryFit
					</span>
					<span class="ml-0 inline-flex translate-y-2">
						<CarryFitIcon class="h-12 w-12 sm:h-16 sm:w-16" />
					</span>
				</h1>
				<p class="text-lg font-medium text-sky-900 sm:text-xl">
					Instantly validate your carry-on bag dimensions for <span class="text-blue-600"
						>{allAirlines.length}</span
					> airlines worldwide
				</p>
				<p class="mt-2 text-xs text-sky-600">
					<a href={links.legal.privacy} class="hover:text-sky-800 hover:underline">Privacy Policy</a
					>
					<span class="mx-1">·</span>
					<a href={links.legal.terms} class="hover:text-sky-800 hover:underline">Terms of Use</a>
				</p>
			</div>

			<div class="mb-8 lg:flex lg:items-start lg:gap-8">
				<Info coveredByTest={meta.coveredByTest} lastTestRun={meta.lastTestRun} />

				<div class="mx-auto max-w-2xl lg:mx-0 lg:flex-1">
					<MeasurementSystemSelect
						bind:value={preferences.measurementSystem}
						onChanged={clearSharedBagInfo}
					/>

					<Card>
						<BagInput
							bind:userDimensions
							measurementSystem={preferences.measurementSystem}
							bind:showFlexibility
							bind:flexibility
							flexibilityMaxValue={FLEXIBILITY_CONFIG[preferences.measurementSystem].max}
							flexibilityStep={FLEXIBILITY_CONFIG[preferences.measurementSystem].step}
							onChanged={() => {
								clearSharedBagInfo();
							}}
						/>

						{#if allDimensionsSet}
							<div class="mt-6">
								<ComplianceScore
									allAirlinesCount={filteredAirlines.length}
									compliantAirlinesCount={airlinesByCompliance.compliant.length}
								/>
							</div>
						{/if}

						<SupportSection class="mt-8" />
					</Card>
				</div>
			</div>

			<Card>
				<AllowanceFilter
					airlines={allAirlines}
					favoriteAirlines={preferences.favoriteAirlines}
					bind:filteredAirlines
				/>

				<AllowanceTable
					measurementSystem={preferences.measurementSystem}
					bind:favoriteAirlines={preferences.favoriteAirlines}
					airlines={filteredAirlines}
					compliantAirlines={airlinesByCompliance.compliant}
					nonCompliantAirlines={airlinesByCompliance.nonCompliant}
					variant={isLargeScreen ? 'two-column' : 'single-column'}
				/>
			</Card>
		</div>
	</div>
</div>
