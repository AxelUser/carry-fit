<script lang="ts">
	import {
		Check,
		X,
		ChevronsUpDown,
		ChevronsDownUp,
		MonitorCheck,
		MonitorX,
		MonitorOff,
		ArrowDownAZ,
		ArrowUpAZ,
		Star,
		StarOff,
		SearchX
	} from 'lucide-svelte';
	import {
		CarryOnBagCheckedIcon,
		CarryOnBagInactiveIcon,
		CarryFitIcon
	} from '$lib/components/icons';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { checkCompliance, loadData, groupAirlinesByCompliance } from '$lib/allowances';
	import {
		type AirlineInfo,
		type UserDimensions,
		type MeasurementSystem,
		type SortDirection,
		MeasurementSystems,
		SortDirections
	} from '$lib/types';
	import { metrics, disposeAnalytics } from '$lib/analytics';
	import { GithubStarButton, BuyMeCoffeeButton } from '$lib/components/social';
	import { onDestroy } from 'svelte';
	import { Changelog } from '$lib/components/changelog';
	import { preferencesStore } from '$lib/stores/preferences';
	import NewBadge from '$lib/components/new-badge.svelte';
	import { favoritesUsageStore } from '$lib/stores/feature-usage.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { getAirlineDimensions, getUserDimensionsIfFilled } from '$lib/utils/mapping';
	import CookieBanner from '$lib/components/cookie-banner.svelte';
	import { links } from '$lib/utils/navigation';
	import {
		AllowanceFilter,
		BagInput,
		ComplianceScore,
		Info,
		MeasurementSystemSelect
	} from '$lib/components/main';

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

	const { meta, allowances } = loadData();

	const regions = [...new Set(allowances.map((airline) => airline.region))].sort();

	let selectedRegions = $state(new Set(regions));

	let sortDirection = $state<SortDirection>(SortDirections.Ascending);

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

	// System that was set when the user entered bag dimensions (used to determine if conversion is needed)
	let measurementSystem = $derived(
		sharedBagInfo?.measurementSystem || preferencesStore.value.measurementSystem
	);

	let flexibility = $state(0);
	let showFlexibility = $state(false);

	const favoritesUsage = favoritesUsageStore();

	$effect(() => {
		if (!showFlexibility) {
			flexibility = 0;
		}
	});

	let showFavoritesOnly = $state(false);

	function toggleFavorite(airlineName: string) {
		const isFavorite = preferencesStore.value.favoriteAirlines.includes(airlineName);
		const newFavorites = isFavorite
			? preferencesStore.value.favoriteAirlines.filter((name) => name !== airlineName)
			: [...preferencesStore.value.favoriteAirlines, airlineName];

		metrics.favoriteAirlineToggled();
		favoritesUsage.markAsUsed();

		preferencesStore.value = {
			...preferencesStore.value,
			favoriteAirlines: newFavorites
		};
	}

	let filteredAirlines = $state(allowances);
	const displayedAirlines = $derived(
		filteredAirlines.toSorted((a, b) => {
			const direction = sortDirection === SortDirections.Ascending ? 1 : -1;
			return a.airline.localeCompare(b.airline) * direction;
		})
	);

	const airlinesByCompliance = $derived(
		groupAirlinesByCompliance(displayedAirlines, userDimensions, measurementSystem, flexibility)
	);

	let isNonCompliantOpen = $state(false);
	let isCompliantOpen = $state(false);

	let hasCompliantAirlines = $derived(airlinesByCompliance.compliant.length > 0);
	let hasNonCompliantAirlines = $derived(airlinesByCompliance.nonCompliant.length > 0);

	let onlyCompliantSection = $derived(hasCompliantAirlines && !hasNonCompliantAirlines);
	let onlyNonCompliantSection = $derived(!hasCompliantAirlines && hasNonCompliantAirlines);

	let complianceDetailsFoldable = $derived(
		!isLargeScreen && hasCompliantAirlines && hasNonCompliantAirlines
	);

	let singleScoringDetailsTableLayout = $derived(onlyCompliantSection || onlyNonCompliantSection);

	// Mutual exclusivity of compliance and non-compliance sections
	$effect(() => {
		// Always open compliance and non-compliance sections on large screens
		if (isLargeScreen) {
			isNonCompliantOpen = true;
			isCompliantOpen = true;
			return;
		}

		// If only one section is available, open it
		if (onlyCompliantSection) {
			isNonCompliantOpen = false;
			isCompliantOpen = true;
			return;
		}

		if (onlyNonCompliantSection) {
			isNonCompliantOpen = true;
			isCompliantOpen = false;
			return;
		}

		// If both sections available and this is small screen device, open non-compliant
		isNonCompliantOpen = true;
		isCompliantOpen = false;
	});

	let lastToggledSection = $state<'compliant' | 'non-compliant'>('non-compliant');

	function toggleSection(section: 'compliant' | 'non-compliant') {
		if (complianceDetailsFoldable) {
			lastToggledSection = section;
			if (section === 'compliant') {
				isCompliantOpen = !isCompliantOpen;
				if (isCompliantOpen) {
					isNonCompliantOpen = false;
					setTimeout(() => {
						document.getElementById('compliant-airlines')?.scrollIntoView({
							behavior: 'instant',
							block: 'start'
						});
					}, 0);
				}
			} else {
				isNonCompliantOpen = !isNonCompliantOpen;
				if (isNonCompliantOpen) {
					isCompliantOpen = false;
					setTimeout(() => {
						document.getElementById('non-compliant-airlines')?.scrollIntoView({
							behavior: 'instant',
							block: 'start'
						});
					}, 0);
				}
			}
		}
	}

	function toggleSortDirection() {
		sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
	}

	$effect(() => {
		if (userDimensions.depth > 0 && userDimensions.width > 0 && userDimensions.height > 0) {
			metrics.userBagValidated(
				userDimensions.depth,
				userDimensions.width,
				userDimensions.height,
				measurementSystem,
				showFlexibility,
				flexibility
			);
		}
	});

	$effect(() => {
		if (showFavoritesOnly) {
			metrics.favoritesFilterEnabled(preferencesStore.value.favoriteAirlines.length);
		}
	});

	onDestroy(() => {
		disposeAnalytics();
	});

	function setMeasurementSystem(system: MeasurementSystem) {
		clearSharedBagInfo();
		preferencesStore.value = {
			...preferencesStore.value,
			measurementSystem: system
		};
	}
</script>

<svelte:window bind:innerWidth />

<Changelog />
<CookieBanner />

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
						>{allowances.length}</span
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
					<MeasurementSystemSelect value={measurementSystem} changed={setMeasurementSystem} />

					<div class="rounded-xl bg-white/95 p-6 shadow-xl ring-1 ring-sky-100">
						<BagInput
							{userDimensions}
							{measurementSystem}
							bind:showFlexibility
							bind:flexibility
							flexibilityMaxValue={FLEXIBILITY_CONFIG[measurementSystem].max}
							flexibilityStep={FLEXIBILITY_CONFIG[measurementSystem].step}
							onChanged={() => {
								clearSharedBagInfo();
							}}
						/>

						{#if allDimensionsSet}
							<div class="mt-6">
								<ComplianceScore
									allAirlinesCount={displayedAirlines.length}
									compliantAirlinesCount={airlinesByCompliance.compliant.length}
								/>
							</div>
						{/if}

						<div class="mt-8 rounded-lg bg-sky-50/80 p-4 text-center">
							<p class="mb-3 text-sm text-sky-700">
								If you find this tool helpful and want to support it:
							</p>
							<div
								class="flex flex-col items-center gap-1 2xs:flex-row 2xs:items-center 2xs:justify-center 2xs:gap-2"
							>
								<GithubStarButton />
								<span class="text-sm text-sky-500 2xs:inline">or</span>
								<BuyMeCoffeeButton />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="rounded-xl bg-white/95 p-6 shadow-xl ring-1 ring-sky-100">
				<AllowanceFilter
					{allowances}
					favoriteAirlines={preferencesStore.value.favoriteAirlines}
					bind:filteredAirlines
				/>

				<div class="overflow-x-auto rounded-lg">
					{#if displayedAirlines.length === 0}
						<div class="flex min-h-[300px] flex-col items-center justify-center gap-3 py-12">
							<div class="rounded-full bg-sky-50 p-4">
								<div class="rounded-full bg-sky-100 p-3">
									<SearchX class="h-8 w-8 text-sky-600" />
								</div>
							</div>
							<p class="text-xl font-medium text-sky-600 sm:text-2xl">
								No carry-on allowances to display
							</p>
							<p class="text-base text-sky-500 sm:text-lg">
								Try adjusting your filters to see available allowances
							</p>
						</div>
					{:else}
						{@render airlinesTable()}
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

{#snippet airlinesTable()}
	{#if allDimensionsSet}
		<div class="flex flex-col gap-6 xl:flex-row xl:items-start" data-testid="compliance-sections">
			{#if hasNonCompliantAirlines}
				<div
					class="flex-1 {!singleScoringDetailsTableLayout ? 'xl:max-w-[50%]' : ''}"
					data-testid="non-compliant-section"
					id="non-compliant-airlines"
				>
					<details
						class="group h-full"
						open={isNonCompliantOpen}
						role="none"
						onclick={(e) => {
							e.preventDefault();
						}}
					>
						<summary class="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
							<button
								class="flex items-center gap-2 font-semibold text-red-700"
								onclick={() => toggleSection('non-compliant')}
							>
								{#if complianceDetailsFoldable}
									<div class="translate-y-[1px] xl:hidden">
										{#if isNonCompliantOpen}
											<ChevronsDownUp class="h-5 w-5" />
										{:else}
											<ChevronsUpDown class="h-5 w-5" />
										{/if}
									</div>
								{/if}
								<h3 class="text-md inline-flex items-center gap-2 sm:text-lg">
									<CarryOnBagInactiveIcon class="h-6 w-6" />
									Non-Compliant Airlines ({airlinesByCompliance.nonCompliant.length})
								</h3>
							</button>
						</summary>
						<div class="mt-3 rounded-lg border border-red-200">
							<div class="overflow-x-auto">
								<table class="w-full" data-testid="non-compliant-table">
									<thead>
										<tr class="bg-red-50">
											{@render tableHeader()}
										</tr>
									</thead>
									<tbody>
										{#each airlinesByCompliance.nonCompliant as airline}
											{@render airlineAllowanceRow(airline)}
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					</details>
				</div>
			{/if}

			{#if hasCompliantAirlines}
				<div
					class="flex-1 {!singleScoringDetailsTableLayout ? 'xl:max-w-[50%]' : ''}"
					data-testid="compliant-section"
					id="compliant-airlines"
				>
					<details
						class="group h-full"
						open={isCompliantOpen}
						role="none"
						onclick={(e) => {
							e.preventDefault();
						}}
					>
						<summary
							class="cursor-pointer list-none [&::-webkit-details-marker]:hidden
							{complianceDetailsFoldable ? 'xl:hidden' : ''}
							"
						>
							<button
								class="flex items-center gap-2 font-semibold text-emerald-700"
								onclick={() => toggleSection('compliant')}
							>
								{#if complianceDetailsFoldable}
									<div class="translate-y-[1px] xl:hidden">
										{#if isCompliantOpen}
											<ChevronsDownUp class="h-5 w-5" />
										{:else}
											<ChevronsUpDown class="h-5 w-5" />
										{/if}
									</div>
								{/if}
								<h3 class="text-md inline-flex items-center gap-2 sm:text-lg">
									<CarryOnBagCheckedIcon class="h-6 w-6" />
									Compliant Airlines ({airlinesByCompliance.compliant.length})
								</h3>
							</button>
						</summary>
						<div class="mt-3 rounded-lg border border-emerald-200">
							<div class="overflow-x-auto">
								<table class="w-full" data-testid="compliant-table">
									<thead>
										<tr class="bg-emerald-50">
											{@render tableHeader()}
										</tr>
									</thead>
									<tbody>
										{#each airlinesByCompliance.compliant as airline}
											{@render airlineAllowanceRow(airline)}
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					</details>
				</div>
			{/if}
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="bg-sky-50">
						{@render tableHeader()}
					</tr>
				</thead>
				<tbody>
					{#each displayedAirlines as airline}
						{@render airlineAllowanceRow(airline)}
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
{/snippet}

{#snippet tableHeader()}
	<th role="columnheader"></th>
	<th class="p-2 text-left text-sm text-sky-900 sm:p-3 sm:text-base" role="columnheader">
		<button class="flex items-center gap-2 hover:text-sky-700" onclick={toggleSortDirection}>
			Airline
			{#if sortDirection === 'asc'}
				<ArrowDownAZ class="h-5 w-5" />
			{:else}
				<ArrowUpAZ class="h-5 w-5" />
			{/if}
		</button>
	</th>
	<th class="p-2 text-left text-sm text-sky-900 sm:p-3 sm:text-base" role="columnheader">Region</th>
	<th class="p-2 text-left text-sm text-sky-900 sm:p-3 sm:text-base" role="columnheader">
		Carry-On ({measurementSystem === MeasurementSystems.Metric ? 'cm' : 'in'})
	</th>
	<th class="p-2 text-left text-sm text-sky-900 sm:p-3 sm:text-base" role="columnheader">Weight</th>
	<th class="p-2 text-left text-sm text-sky-900 sm:p-3 sm:text-base" role="columnheader">Policy</th>
{/snippet}

{#snippet airlineAllowanceRow(airline: AirlineInfo)}
	{@const carryOnDimensions = getAirlineDimensions(airline.carryon, measurementSystem)}
	{@const compliance = checkCompliance(
		carryOnDimensions,
		getUserDimensionsIfFilled(userDimensions),
		flexibility
	)}
	{@const isCompliant = compliance?.every(Boolean) ?? false}

	<tr class="border-t border-sky-100 {isCompliant ? 'bg-emerald-50' : ''} hover:bg-sky-50">
		<td class="px-2 pb-2 pt-3 text-sm sm:text-base">
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#if airline?.testResult?.success}
						<MonitorCheck size={16} class="text-green-600" />
					{:else if airline?.testResult?.success === false}
						<MonitorX size={16} class="text-red-600" />
					{:else}
						<MonitorOff size={16} class="text-gray-600" />
					{/if}
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>
						{#if airline?.testResult?.success}
							Passing since {airline?.testResult?.lastTest?.toLocaleDateString()}
						{:else if airline?.testResult?.success === false}
							Failing since {airline?.testResult?.lastTest?.toLocaleDateString()}
						{:else}
							No tests yet
						{/if}
					</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</td>
		<td class="p-2 text-sm sm:p-3 sm:text-base" data-testid="airline">
			<div class="flex items-center gap-2">
				<button
					class="group flex items-center"
					onclick={() => toggleFavorite(airline.airline)}
					title={preferencesStore.value.favoriteAirlines.includes(airline.airline)
						? 'Remove from favorites'
						: 'Add to favorites'}
					data-testid="favorite-button"
					data-favorite={preferencesStore.value.favoriteAirlines.includes(airline.airline)}
				>
					{#if preferencesStore.value.favoriteAirlines.includes(airline.airline)}
						<Star class="h-4 w-4 text-amber-400 transition-colors group-hover:text-amber-500" />
					{:else}
						<StarOff class="h-4 w-4 text-sky-300 transition-colors group-hover:text-sky-400" />
					{/if}
				</button>
				{airline.airline}
			</div>
		</td>
		<td class="p-2 text-sm sm:p-3 sm:text-base" data-testid="region">{airline.region}</td>
		<td class="whitespace-nowrap p-2 text-sm sm:p-3 sm:text-base" data-testid="dimensions">
			{#if carryOnDimensions.length === 1}
				<span class={compliance?.[0] === false ? 'text-red-600' : ''}>
					{`Total ${carryOnDimensions[0]}`}</span
				>
			{:else}
				<span class={compliance?.[0] === false ? 'text-red-600' : ''}>{carryOnDimensions[0]}</span>
				x
				<span class={compliance?.[1] === false ? 'text-red-600' : ''}>{carryOnDimensions[1]}</span>
				x
				<span class={compliance?.[2] === false ? 'text-red-600' : ''}>{carryOnDimensions[2]}</span>
			{/if}
		</td>
		<td class="p-2 text-sm sm:p-3 sm:text-base" data-testid="weight-limit">
			{#if airline.kilograms}
				{measurementSystem === MeasurementSystems.Metric
					? `${airline.kilograms} kg`
					: `${airline.pounds} lb`}
			{:else}
				N/A
			{/if}
		</td>
		<td class="p-2 text-sm sm:p-3 sm:text-base" data-testid="policy-link">
			{#if airline.link}
				<a
					href={airline.link}
					target="_blank"
					rel="noopener noreferrer"
					class="text-blue-600 hover:text-blue-800 hover:underline"
				>
					View
				</a>
			{:else}
				N/A
			{/if}
		</td>
	</tr>
{/snippet}
