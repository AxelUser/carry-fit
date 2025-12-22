<script lang="ts">
	import { CarryFitIcon } from '$lib/components/icons';
	import {
		loadData,
		computeAirlinesCompliance,
		calculateComplianceScore,
		findNearestOptimalFillLevel
	} from '$lib/allowances';
	import { calculateFlexibility } from '$lib/allowances/flexibility';
	import { type UserDimensions, type MeasurementSystem, MeasurementSystems } from '$lib/types';
	import { metrics, disposeAnalytics } from '$lib/analytics';
	import { onDestroy, untrack } from 'svelte';
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
	import { BuyMeCoffeeButton, GithubStarButton } from '$lib/components/social';
	import * as Card from '$lib/components/ui/card';
	import { cookieConsent } from '$lib/stores/cookie-consent.svelte';
	import { runPendingTours } from '$lib/tours';

	const allAirlines = loadData();

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

	let fillPercentage = $state(100);
	let showFlexibility = $state(false);
	let hasAppliedSuggestion = $state(false);

	$effect(() => {
		if (!showFlexibility) {
			fillPercentage = 100;
		}
	});

	const flexibilityBudgets = $derived(
		showFlexibility ? calculateFlexibility(userDimensions, fillPercentage) : undefined
	);

	let filteredAirlines = $state(allAirlines);

	const airlinesWithCompliance = $derived(
		computeAirlinesCompliance(
			filteredAirlines,
			userDimensions,
			preferences.measurementSystem,
			flexibilityBudgets
		)
	);

	const carryOnScore = $derived(calculateComplianceScore(airlinesWithCompliance, 'carryOn'));

	const personalItemScore = $derived(
		calculateComplianceScore(airlinesWithCompliance, 'personalItem')
	);

	const suggestion = $derived.by(() => {
		if (airlinesWithCompliance.length === 0 || hasAppliedSuggestion) {
			return null;
		}

		return findNearestOptimalFillLevel(
			airlinesWithCompliance,
			userDimensions,
			preferences.measurementSystem,
			fillPercentage
		);
	});

	function handleApplySuggestion(suggestedFillPercentage: number) {
		showFlexibility = true;
		fillPercentage = suggestedFillPercentage;
		hasAppliedSuggestion = true;
	}

	// Effect for user bag dimensions change
	$effect(() => {
		if (userDimensions.depth > 0 && userDimensions.width > 0 && userDimensions.height > 0) {
			hasAppliedSuggestion = false;
			untrack(() => {
				const totalFlexibility = flexibilityBudgets?.reduce((acc, curr) => acc + curr, 0) ?? 0;
				metrics.userBagValidated(
					userDimensions.depth,
					userDimensions.width,
					userDimensions.height,
					preferences.measurementSystem,
					showFlexibility,
					totalFlexibility,
					fillPercentage
				);
			});
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

<div class="min-h-screen px-3 py-8 sm:px-4">
	<div class="mx-auto max-w-4xl space-y-6">
		<div class="text-center">
			<h1 class="mb-2 font-extrabold">
				<span
					class="bg-linear-to-r from-blue-700 to-sky-500 bg-clip-text text-4xl text-transparent sm:text-6xl"
				>
					CarryFit
				</span>
				<span class="ml-2 inline-flex translate-y-1">
					<CarryFitIcon class="h-10 w-10 sm:h-14 sm:w-14" />
				</span>
			</h1>
			<p class="text-muted-foreground text-base sm:text-lg">
				Check carry-on and personal item dimensions for <span class="text-primary font-semibold"
					>{allAirlines.length}</span
				>
				airlines worldwide.
			</p>
			<div class="mt-4 flex flex-wrap justify-center gap-2">
				<GithubStarButton />
				<BuyMeCoffeeButton />
			</div>
		</div>

		<Card.Root>
			<Card.Content class="space-y-4">
				<BagInput
					bind:userDimensions
					bind:measurementSystem={preferences.measurementSystem}
					bind:showFlexibility
					bind:fillPercentage
					onChanged={() => {
						clearSharedBagInfo();
					}}
				/>

				{#if allDimensionsSet}
					<div class="pt-2">
						<ComplianceScore
							{carryOnScore}
							{personalItemScore}
							airlinesCount={airlinesWithCompliance.length}
							{userDimensions}
							measurementSystem={preferences.measurementSystem}
							{suggestion}
							onApplySuggestion={handleApplySuggestion}
						/>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>

		<AllowanceFilter
			airlines={allAirlines}
			bind:filteredAirlines
			bind:filterRegions={preferences.filterRegions}
		/>

		<AllowanceTable
			measurementSystem={preferences.measurementSystem}
			airlines={filteredAirlines}
			complianceAirlines={airlinesWithCompliance}
		/>

		<Info airlinesCount={allAirlines.length} />
	</div>
</div>
