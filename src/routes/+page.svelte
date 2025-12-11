<script lang="ts">
	import { CarryFitIcon } from '$lib/components/icons';
	import { loadData, groupAirlinesByCompliance } from '$lib/allowances';
	import { type UserDimensions, type MeasurementSystem, MeasurementSystems } from '$lib/types';
	import { metrics, disposeAnalytics } from '$lib/analytics';
	import { onDestroy } from 'svelte';
	import preferences from '$lib/stores/preferences';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import {
		AllowanceFilter,
		AllowanceTable,
		BagInput,
		ComplianceScore,
		Info
	} from '$lib/components/main';
	import * as Card from '$lib/components/ui/card';
	import { cookieConsent } from '$lib/stores/cookie-consent.svelte';
	import { runPendingTours } from '$lib/tours';

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

	let sharedBagInfo = (() => {
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
	})();

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

	const carryOnScore = $derived.by(() => {
		if (filteredAirlines.length === 0) return 0;
		let carryOnCompliantCount = 0;
		for (const airline of airlinesByCompliance.compliant) {
			if (airline.complianceResults?.every((result) => result.passed)) {
				carryOnCompliantCount++;
			}
		}
		for (const airline of airlinesByCompliance.nonCompliant) {
			if (airline.complianceResults?.every((result) => result.passed)) {
				carryOnCompliantCount++;
			}
		}
		return (carryOnCompliantCount / filteredAirlines.length) * 100;
	});

	const personalItemScore = $derived.by(() => {
		if (filteredAirlines.length === 0) return 0;
		let personalItemCompliantCount = 0;
		for (const airline of airlinesByCompliance.compliant) {
			if (airline.personalItemComplianceResults?.every((result) => result.passed)) {
				personalItemCompliantCount++;
			}
		}
		for (const airline of airlinesByCompliance.nonCompliant) {
			if (airline.personalItemComplianceResults?.every((result) => result.passed)) {
				personalItemCompliantCount++;
			}
		}
		return (personalItemCompliantCount / filteredAirlines.length) * 100;
	});

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

	const isUserReadyForTour = $derived(
		cookieConsent.isLoaded && cookieConsent.value.timestamp !== null
	);

	$effect(() => {
		if (browser && isUserReadyForTour) {
			runPendingTours();
		}
	});

	onDestroy(() => {
		disposeAnalytics();
	});
</script>

<svelte:window bind:innerWidth />

<div class="min-h-screen px-3 py-8 sm:px-4">
	<div class="mx-auto max-w-4xl space-y-6">
		<div class="text-center">
			<h1 class="mb-2 font-extrabold">
				<span
					class="bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-4xl text-transparent sm:text-6xl"
				>
					CarryFit
				</span>
				<span class="ml-2 inline-flex translate-y-1">
					<CarryFitIcon class="h-10 w-10 sm:h-14 sm:w-14" />
				</span>
			</h1>
			<p class="text-base text-muted-foreground sm:text-lg">
				Validate your carry-on dimensions for <span class="font-semibold text-primary"
					>{allAirlines.length}</span
				>
				airlines worldwide
			</p>
		</div>

		<Card.Root>
			<Card.Content class="space-y-4">
				<BagInput
					bind:userDimensions
					bind:measurementSystem={preferences.measurementSystem}
					bind:showFlexibility
					bind:flexibility
					flexibilityMaxValue={FLEXIBILITY_CONFIG[preferences.measurementSystem].max}
					flexibilityStep={FLEXIBILITY_CONFIG[preferences.measurementSystem].step}
					onChanged={() => {
						clearSharedBagInfo();
					}}
				/>

				{#if allDimensionsSet}
					<div class="pt-2">
						<ComplianceScore {carryOnScore} {personalItemScore} />
					</div>
				{/if}
			</Card.Content>
		</Card.Root>

		<AllowanceFilter
			airlines={allAirlines}
			bind:favoriteAirlines={preferences.favoriteAirlines}
			bind:filteredAirlines
			bind:filterRegions={preferences.filterRegions}
		/>

		<AllowanceTable
			measurementSystem={preferences.measurementSystem}
			bind:favoriteAirlines={preferences.favoriteAirlines}
			airlines={filteredAirlines}
			compliantAirlines={airlinesByCompliance.compliant}
			nonCompliantAirlines={airlinesByCompliance.nonCompliant}
		/>

		<Info coveredByTest={meta.coveredByTest} lastTestRun={meta.lastTestRun} />
	</div>
</div>
