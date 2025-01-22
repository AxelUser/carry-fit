<script lang="ts">
	import {
		MeasurementSystems,
		SortDirections,
		type AirlineCompliance,
		type AirlineInfo,
		type MeasurementSystem,
		type SortDirection
	} from '$lib/types';
	import {
		ArrowDownAZ,
		ArrowUpAZ,
		ChevronsDownUp,
		ChevronsUpDown,
		MonitorCheck,
		MonitorOff,
		MonitorX,
		SearchX,
		Star,
		StarOff
	} from 'lucide-svelte';
	import { CarryOnBagCheckedIcon, CarryOnBagInactiveIcon } from '../icons';
	import { getAirlineDimensions } from '$lib/utils/mapping';
	import * as Tooltip from '../ui/tooltip';
	import { metrics } from '$lib/analytics';

	interface Props {
		measurementSystem: MeasurementSystem;
		favoriteAirlines: string[];
		airlines: AirlineInfo[];
		compliantAirlines: AirlineCompliance[];
		nonCompliantAirlines: AirlineCompliance[];
		variant: 'two-column' | 'single-column';
	}

	let {
		measurementSystem,
		favoriteAirlines = $bindable(),
		airlines,
		compliantAirlines,
		nonCompliantAirlines,
		variant
	}: Props = $props();

	let favoriteAirlinesSet = $derived(new Set(favoriteAirlines));

	let showComplianceResult = $derived(
		compliantAirlines.length > 0 || nonCompliantAirlines.length > 0
	);

	let sortDirection = $state<SortDirection>(SortDirections.Ascending);

	let sortedAirlines = $derived(sortAirlines(airlines));
	let sortedCompliantAirlines = $derived(sortAirlines(compliantAirlines));
	let sortedNonCompliantAirlines = $derived(sortAirlines(nonCompliantAirlines));

	let isNonCompliantOpen = $state(false);
	let isCompliantOpen = $state(false);

	let hasCompliantAirlines = $derived(sortedCompliantAirlines.length > 0);
	let hasNonCompliantAirlines = $derived(sortedNonCompliantAirlines.length > 0);

	let onlyCompliantSection = $derived(hasCompliantAirlines && !hasNonCompliantAirlines);
	let onlyNonCompliantSection = $derived(!hasCompliantAirlines && hasNonCompliantAirlines);

	let complianceDetailsFoldable = $derived(
		variant === 'single-column' && hasCompliantAirlines && hasNonCompliantAirlines
	);

	let singleScoringDetailsTableLayout = $derived(onlyCompliantSection || onlyNonCompliantSection);

	function sortAirlines(airlines: AirlineInfo[]) {
		return airlines.toSorted((a, b) => {
			const direction = sortDirection === SortDirections.Ascending ? 1 : -1;
			return a.airline.localeCompare(b.airline) * direction;
		});
	}

	// Mutual exclusivity of compliance and non-compliance sections
	$effect(() => {
		// Always open compliance and non-compliance in two-column layout
		if (variant === 'two-column') {
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

		// If both sections available and this is single-column layout, open non-compliant
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

	function toggleFavorite(airlineName: string) {
		const isFavorite = favoriteAirlinesSet.has(airlineName);
		favoriteAirlines = isFavorite
			? favoriteAirlines.filter((name) => name !== airlineName)
			: [...favoriteAirlines, airlineName];

		metrics.favoriteAirlineToggled();
	}
</script>

<div class="overflow-x-auto rounded-lg">
	{#if airlines.length === 0}
		<div class="flex min-h-[300px] flex-col items-center justify-center gap-3 py-12">
			<div class="rounded-full bg-sky-50 p-4">
				<div class="rounded-full bg-sky-100 p-3">
					<SearchX class="h-8 w-8 text-sky-600" />
				</div>
			</div>
			<p class="text-xl font-medium text-sky-600 sm:text-2xl">No carry-on allowances to display</p>
			<p class="text-base text-sky-500 sm:text-lg">
				Try adjusting your filters to see available allowances
			</p>
		</div>
	{:else}
		{@render airlinesTable()}
	{/if}
</div>

{#snippet airlinesTable()}
	{#if showComplianceResult}
		<div class="flex flex-col gap-6 xl:flex-row xl:items-start" data-testid="compliance-sections">
			{#if nonCompliantAirlines.length > 0}
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
									Non-Compliant Airlines ({sortedNonCompliantAirlines.length})
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
										{#each sortedNonCompliantAirlines as airline}
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
									Compliant Airlines ({sortedCompliantAirlines.length})
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
										{#each sortedCompliantAirlines as airline}
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
					{#each sortedAirlines as airline}
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

{#snippet airlineAllowanceRow(airline: AirlineInfo, complianceResults?: boolean[])}
	{@const carryOnDimensions = getAirlineDimensions(airline.carryon, measurementSystem)}
	{@const isCompliant = complianceResults?.every(Boolean) ?? false}

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
					data-testid="favorite-button"
					data-favorite={favoriteAirlinesSet.has(airline.airline)}
				>
					{#if favoriteAirlinesSet.has(airline.airline)}
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
				<span class={complianceResults?.[0] === false ? 'text-red-600' : ''}>
					{`Total ${carryOnDimensions[0]}`}</span
				>
			{:else}
				<span class={complianceResults?.[0] === false ? 'text-red-600' : ''}
					>{carryOnDimensions[0]}</span
				>
				x
				<span class={complianceResults?.[1] === false ? 'text-red-600' : ''}
					>{carryOnDimensions[1]}</span
				>
				x
				<span class={complianceResults?.[2] === false ? 'text-red-600' : ''}
					>{carryOnDimensions[2]}</span
				>
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
