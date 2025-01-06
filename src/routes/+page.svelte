<script lang="ts">
	import Alert from '$lib/components/icons/alert.svelte';
	import Tested from '$lib/components/icons/tested.svelte';
	import Check from '$lib/components/icons/check.svelte';
	import Cross from '$lib/components/icons/cross.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { checkCompliance, loadData } from '$lib/allowances';
	import type { AirlineInfo, BagAllowanceDimensions, UserDimensions } from '$lib/types';
	import LogoIcon from '$lib/components/icons/logo.svelte';
	import SortTextAsc from '$lib/components/icons/sort-text-asc.svelte';
	import SortTextDesc from '$lib/components/icons/sort-text-desc.svelte';
	import CarryOnBagChecked from '$lib/components/icons/carry-on-bag-checked-outline.svelte';
	import CarryOnBagInactive from '$lib/components/icons/carry-on-bag-inactive-outline.svelte';
	import ChevronsDownUp from '$lib/components/icons/chevrons-down-up.svelte';
	import ChevronsUpDown from '$lib/components/icons/chevrons-up-down.svelte';
	import Suitcase from '$lib/components/suitcase.svelte';
	import { analyticsService } from '$lib/analytics';
	import GithubStar from '$lib/components/github-star.svelte';
	import GithubFork from '$lib/components/github-fork.svelte';
	import GithubIssue from '$lib/components/github-issue.svelte';
	import { onDestroy } from 'svelte';

	const FLEXIBILITY_CONFIG = {
		cm: {
			default: 0,
			max: 8,
			step: 0.5
		},
		in: {
			default: 0,
			max: 3,
			step: 0.25
		}
	};

	const SORT_DIRECTIONS = ['asc', 'desc'] as const;

	const { meta, allowances } = loadData();

	const regions = [...new Set(allowances.map((airline) => airline.region))].sort();

	let selectedRegions = $state(new Set(regions));

	type SortDirection = (typeof SORT_DIRECTIONS)[number];
	let sortDirection = $state<SortDirection>(SORT_DIRECTIONS[0]);

	const userDimensions = $state<UserDimensions>({
		length: 0,
		width: 0,
		height: 0,
		unit: 'cm'
	});

	let flexibility = $state(FLEXIBILITY_CONFIG[userDimensions.unit].default);
	let showFlexibility = $state(false);

	$effect(() => {
		if (showFlexibility) {
			flexibility = FLEXIBILITY_CONFIG[userDimensions.unit].default;
		} else {
			flexibility = 0;
		}
	});

	let innerWidth = $state(0);
	let isLargeScreen = $derived(innerWidth >= 640);

	let isCompliantOpen = $state(false);
	let isNonCompliantOpen = $state(false);

	/**
	 * Initially open the compliance and non-compliance sections on large screens (and hide on small screens).
	 * Made this with $effect because user should be able to close or open sections, thus $derived would not work.
	 */
	$effect(() => {
		isCompliantOpen = isLargeScreen;
		isNonCompliantOpen = isLargeScreen;
	});

	const filteredAirlines = $derived(
		allowances
			.filter((airline) => selectedRegions.has(airline.region))
			.sort((a, b) => {
				const direction = sortDirection === SORT_DIRECTIONS[0] ? 1 : -1;
				return a.airline.localeCompare(b.airline) * direction;
			})
	);

	const compliantAirlines = $derived(
		userDimensions.length && userDimensions.width && userDimensions.height
			? filteredAirlines.filter((airline) => {
					const compliance = checkCompliance(
						getAirlineDimensions(airline.carryon),
						[userDimensions.length, userDimensions.width, userDimensions.height],
						flexibility
					);
					return !!compliance?.every(Boolean);
				})
			: []
	);

	const nonCompliantAirlines = $derived(
		userDimensions.length && userDimensions.width && userDimensions.height
			? filteredAirlines.filter((airline) => {
					const compliance = checkCompliance(
						getAirlineDimensions(airline.carryon),
						[userDimensions.length, userDimensions.width, userDimensions.height],
						flexibility
					);
					return !compliance?.every(Boolean);
				})
			: []
	);

	const compliancePercentage = $derived(
		filteredAirlines.length === 0 ? 0 : (compliantAirlines.length / filteredAirlines.length) * 100
	);

	function getAirlineDimensions(allowanceDims: BagAllowanceDimensions): number[] {
		const dims = userDimensions.unit === 'cm' ? allowanceDims.centimeters : allowanceDims.inches;
		return Array.isArray(dims) ? dims : [dims];
	}

	function getUserDimensionsIfFilled(bagDimensions: UserDimensions): number[] {
		if (bagDimensions.length && bagDimensions.width && bagDimensions.height) {
			return [bagDimensions.length, bagDimensions.width, bagDimensions.height];
		}
		return [];
	}

	function toggleSortDirection() {
		sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
	}

	function selectAllRegions() {
		selectedRegions = new Set(regions);
	}

	function clearAllRegions() {
		selectedRegions = new Set();
	}

	function toggleRegion(region: string) {
		const newSet = new Set(selectedRegions);
		if (newSet.has(region)) {
			newSet.delete(region);
		} else {
			newSet.add(region);
		}
		selectedRegions = newSet;
	}

	function resetDimensions() {
		userDimensions.length = 0;
		userDimensions.width = 0;
		userDimensions.height = 0;
		showFlexibility = false;
		flexibility = 0;
	}

	$effect(() => {
		if (userDimensions.length > 0 && userDimensions.width > 0 && userDimensions.height > 0) {
			const eventProps: Record<string, string | number> = {
				user_bag_dimensions: `${userDimensions.length}x${userDimensions.width}x${userDimensions.height} ${userDimensions.unit}`
			};

			if (showFlexibility) {
				eventProps.user_bag_flexibility = flexibility;
			}

			analyticsService.trackEventDebounced('user_bag_validated', eventProps, 3000);
		}
	});

	onDestroy(() => {
		analyticsService.cancelDebouncedEvents();
	});
</script>

<svelte:window bind:innerWidth />

<div class="min-h-screen px-2 py-8 sm:px-4">
	<div class="min-h-screen bg-white/90">
		<div class="mx-auto md:container">
			<div class="mb-12 py-2 text-center">
				<h1 class="mb-3 font-extrabold">
					<span
						class="bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-4xl text-transparent sm:text-6xl"
					>
						CarryFit
					</span>
					<span class="ml-0 inline-flex translate-y-2">
						<LogoIcon class="h-12 w-12 sm:h-16 sm:w-16" />
					</span>
				</h1>
				<p class="text-lg font-medium text-sky-900 sm:text-xl">
					Instantly validate your carry-on bag dimensions for <span class="text-blue-600"
						>{allowances.length}</span
					> airlines worldwide
				</p>
				<div class="mt-6 flex items-center justify-center gap-2">
					<GithubStar />
					<GithubFork />
					<GithubIssue />
				</div>
			</div>

			<div class="mb-8 lg:flex lg:items-start lg:gap-8">
				<div class="mx-auto mb-8 max-w-2xl lg:mx-0 lg:mb-0 lg:flex-1">
					<details
						class="group mb-4 overflow-hidden rounded-xl bg-white/95 shadow-xl ring-1 ring-sky-100 lg:hidden"
					>
						<summary class="cursor-pointer p-4 font-medium text-sky-900 hover:bg-sky-50">
							About CarryFit
						</summary>
						<div class="border-t border-sky-100 p-6 pt-4">
							{@render aboutContent()}
						</div>
					</details>

					<div
						class="mb-4 hidden rounded-xl bg-white/95 p-6 shadow-xl ring-1 ring-sky-100 lg:block"
					>
						{@render aboutContent()}
					</div>

					<details
						class="group overflow-hidden rounded-xl bg-amber-50/90 shadow-md ring-1 ring-amber-200 lg:hidden"
					>
						<summary
							class="cursor-pointer border-l-4 border-amber-400 p-4 font-medium text-amber-700 hover:bg-amber-100/90"
						>
							Can I trust this tool?
						</summary>
						<div class="border-l-4 border-t border-amber-200 border-l-amber-400 p-5 pt-3">
							{@render warningContent()}
						</div>
					</details>

					<div
						class="hidden rounded-xl border-l-4 border-amber-400 bg-amber-50/90 p-5 shadow-md lg:block"
					>
						{@render warningContent()}
					</div>
				</div>

				<div class="mx-auto max-w-2xl lg:mx-0 lg:flex-1">
					<div class="rounded-xl bg-white/95 p-6 shadow-xl ring-1 ring-sky-100">
						{@render bagInput()}

						{#if userDimensions.length && userDimensions.width && userDimensions.height}
							<div class="mt-6">
								<div
									class="rounded-xl border-2 p-6 text-center shadow-sm
									{compliancePercentage <= 60
										? 'border-red-200 bg-red-50'
										: compliancePercentage <= 80
											? 'border-amber-200 bg-amber-50'
											: 'border-emerald-200 bg-emerald-50'}"
								>
									<div class="mb-3 text-sm font-medium text-sky-700 sm:text-base">
										Compliance Score
									</div>
									<div
										class="mb-2 text-3xl font-bold tracking-tight sm:text-4xl
										{compliancePercentage <= 60
											? 'text-red-600'
											: compliancePercentage <= 80
												? 'text-amber-600'
												: 'text-emerald-600'}"
									>
										{compliancePercentage.toFixed(1)}%
									</div>
									<div class="text-xs text-sky-600 sm:text-sm">
										({compliantAirlines.length} out of {filteredAirlines.length} selected airlines)
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<div class="rounded-xl bg-white/95 p-6 shadow-xl ring-1 ring-sky-100">
				{@render regionFilter(regions, selectedRegions)}

				<div class="overflow-x-auto rounded-lg">
					{#if selectedRegions.size === 0}
						<div class="w-full py-8 text-center">
							<p class="text-xl font-medium text-sky-600 sm:text-2xl">
								✈️ Ready to check your carry-on?
							</p>
							<p class="mt-2 text-base text-sky-500 sm:text-lg">
								Select regions to see which airlines will accept your bag
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

{#snippet bagInput()}
	<div class="mb-4">
		<div class="mb-6 flex items-baseline justify-between">
			<h2 class="text-xl font-semibold text-sky-900">Enter Your Bag Dimensions</h2>
			<button
				onclick={resetDimensions}
				class="flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
			>
				<Cross class="h-3 w-3 translate-y-[0.5px]" />
				<span>Reset</span>
			</button>
		</div>

		<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
			<div>
				<label for="height" class="mb-1 block text-sm font-medium text-sky-900">Height</label>
				<input
					type="number"
					id="height"
					value={userDimensions.height}
					oninput={(e) => (userDimensions.height = Number(e.currentTarget.value))}
					class="w-full rounded-lg border-sky-200 bg-sky-50 text-sm focus:border-sky-400 focus:ring-sky-400"
					min={0}
				/>
			</div>
			<div>
				<label for="width" class="mb-1 block text-sm font-medium text-sky-900">Width</label>
				<input
					type="number"
					id="width"
					value={userDimensions.width}
					oninput={(e) => (userDimensions.width = Number(e.currentTarget.value))}
					class="w-full rounded-lg border-sky-200 bg-sky-50 text-sm focus:border-sky-400 focus:ring-sky-400"
					min={0}
				/>
			</div>
			<div>
				<label for="depth" class="mb-1 block text-sm font-medium text-sky-900">Depth</label>
				<input
					type="number"
					id="depth"
					value={userDimensions.length}
					oninput={(e) => (userDimensions.length = Number(e.currentTarget.value))}
					class="w-full rounded-lg border-sky-200 bg-sky-50 text-sm focus:border-sky-400 focus:ring-sky-400"
					min={0}
				/>
			</div>
			<div>
				<label for="unit" class="mb-1 block text-sm font-medium text-sky-900">Unit</label>
				<select
					id="unit"
					bind:value={userDimensions.unit}
					class="w-full rounded-lg border-sky-200 bg-sky-50 text-sm focus:border-sky-400 focus:ring-sky-400"
				>
					<option value="cm">Centimeters</option>
					<option value="in">Inches</option>
				</select>
			</div>
		</div>

		<p class="mb-4 mt-4 text-center text-sm font-medium text-sky-700">
			Don't worry about the order - we'll find the best fit
		</p>

		<div class="border-b border-sky-100"></div>

		<div class="mt-4">
			<label class="inline-flex cursor-pointer items-center gap-2">
				<input
					type="checkbox"
					bind:checked={showFlexibility}
					class="form-checkbox rounded border-sky-300 text-sky-600 focus:ring-0 focus:ring-offset-0"
				/>
				<span class="text-sm font-medium text-sky-900">My Bag is Flexible</span>
			</label>

			{#if showFlexibility}
				<div class="mt-3">
					<div class="flex flex-col items-center gap-4">
						<Suitcase
							value={flexibility}
							unit={userDimensions.unit}
							max={FLEXIBILITY_CONFIG[userDimensions.unit].max}
						/>
						<div class="flex w-full items-center gap-4">
							<input
								id="flexibility"
								type="range"
								bind:value={flexibility}
								min="0"
								max={FLEXIBILITY_CONFIG[userDimensions.unit].max}
								step={FLEXIBILITY_CONFIG[userDimensions.unit].step}
								class="h-2 flex-1 rounded-lg bg-sky-200 accent-sky-600"
							/>
						</div>
					</div>
					<p class="mt-2 text-xs text-sky-600">
						Adjust for how much your bag can be squeezed to fit
					</p>
				</div>
			{/if}
		</div>
	</div>
{/snippet}

{#snippet airlinesTable()}
	{#if userDimensions.length && userDimensions.width && userDimensions.height}
		{#if compliantAirlines.length > 0}
			<details class="group mb-6" bind:open={isCompliantOpen}>
				<summary class="mb-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
					<div class="flex items-center gap-2">
						<div class="translate-y-[1px] text-emerald-700">
							{#if isCompliantOpen}
								<ChevronsDownUp class="h-5 w-5" />
							{:else}
								<ChevronsUpDown class="h-5 w-5" />
							{/if}
						</div>
						<h3
							class="text-md inline-flex items-center gap-2 font-semibold text-emerald-700 sm:text-lg"
						>
							<CarryOnBagChecked class="h-6 w-6" />
							Compliant Airlines ({compliantAirlines.length})
						</h3>
					</div>
				</summary>
				<div class="rounded-lg border border-emerald-200">
					<div class="overflow-x-auto">
						<table class="w-full">
							<thead>
								<tr class="bg-emerald-50">
									{@render tableHeader()}
								</tr>
							</thead>
							<tbody>
								{#each compliantAirlines as airline}
									{@render airlineAllowanceRow(airline)}
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</details>
		{/if}

		{#if nonCompliantAirlines.length > 0}
			<details class="group" bind:open={isNonCompliantOpen}>
				<summary class="mb-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
					<div class="flex items-center gap-2">
						<div class="translate-y-[1px] text-red-700">
							{#if isNonCompliantOpen}
								<ChevronsDownUp class="h-5 w-5" />
							{:else}
								<ChevronsUpDown class="h-5 w-5" />
							{/if}
						</div>
						<h3
							class="text-md inline-flex items-center gap-2 font-semibold text-red-700 sm:text-lg"
						>
							<CarryOnBagInactive class="h-6 w-6" />
							Non-Compliant Airlines ({nonCompliantAirlines.length})
						</h3>
					</div>
				</summary>
				<div class="rounded-lg border border-red-200">
					<div class="overflow-x-auto">
						<table class="w-full">
							<thead>
								<tr class="bg-red-50">
									{@render tableHeader()}
								</tr>
							</thead>
							<tbody>
								{#each nonCompliantAirlines as airline}
									{@render airlineAllowanceRow(airline)}
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</details>
		{/if}
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="bg-sky-50">
						{@render tableHeader()}
					</tr>
				</thead>
				<tbody>
					{#each filteredAirlines as airline}
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
				<SortTextAsc class="h-5 w-5" />
			{:else}
				<SortTextDesc class="h-5 w-5" />
			{/if}
		</button>
	</th>
	<th class="p-2 text-left text-sm text-sky-900 sm:p-3 sm:text-base" role="columnheader">Region</th>
	<th class="p-2 text-left text-sm text-sky-900 sm:p-3 sm:text-base" role="columnheader">
		Carry-On ({userDimensions.unit})
	</th>
	<th class="p-2 text-left text-sm text-sky-900 sm:p-3 sm:text-base" role="columnheader"
		>Weight Limit</th
	>
	<th class="p-2 text-left text-sm text-sky-900 sm:p-3 sm:text-base" role="columnheader">Policy</th>
{/snippet}

{#snippet airlineAllowanceRow(airline: AirlineInfo)}
	{@const carryOnDimensions = getAirlineDimensions(airline.carryon)}
	{@const compliance = checkCompliance(
		carryOnDimensions,
		getUserDimensionsIfFilled(userDimensions),
		flexibility
	)}
	{@const isCompliant = compliance?.every(Boolean) ?? false}

	<tr class="border-t border-sky-100 {isCompliant ? 'bg-emerald-50' : ''} hover:bg-sky-50">
		<td class="pl-2 pt-1.5 text-sm sm:text-base">
			{#if airline.testResult}
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Tested
							class="h-4 w-4 {airline.testResult.success ? 'text-green-600' : 'text-red-600'}"
						/>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>
							{`${airline.testResult.success ? 'Passing' : 'Failing'} since ${airline.testResult.lastTest.toLocaleDateString()}`}
						</p>
					</Tooltip.Content>
				</Tooltip.Root>
			{/if}
		</td>
		<td class="p-2 text-sm sm:p-3 sm:text-base" data-testid="airline">
			<div class="flex items-center gap-2">
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
				{userDimensions.unit === 'in' ? `${airline.pounds} lb` : `${airline.kilograms} kg`}
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
					View Policy
				</a>
			{:else}
				N/A
			{/if}
		</td>
	</tr>
{/snippet}

{#snippet aboutContent()}
	<p class="mb-4 leading-relaxed text-sky-900">
		This tool helps you check if your carry-on luggage meets the size requirements for different
		airlines worldwide. Enter your bag's dimensions, and we'll show you which airlines will accept
		it as cabin baggage.
	</p>
	<div class="border-t border-sky-100 pt-3 text-sm text-sky-800">
		<p class="mb-2">
			Created by <a
				href="https://www.maltsev.space/"
				class="text-blue-600 hover:text-blue-800 hover:underline"
				target="_blank"
				rel="noopener noreferrer">Aleksey Maltsev</a
			>
		</p>
		<div class="mb-2">
			Found an error or have a feature suggestion? You can:
			<ul class="ml-2 list-inside list-disc">
				<li>
					Create an issue or submit a pull request on <a
						href="https://github.com/AxelUser/carry-fit"
						class="text-blue-600 hover:text-blue-800 hover:underline"
						target="_blank"
						rel="noopener noreferrer">GitHub</a
					>
				</li>
				<li>
					Email me at <a
						href="mailto:alexey.maltsev.work@gmail.com"
						class="text-blue-600 hover:text-blue-800 hover:underline"
						>alexey.maltsev.work@gmail.com</a
					>
				</li>
				<li>
					Contact me on <a
						href="https://x.com/axel_user"
						class="text-blue-600 hover:text-blue-800 hover:underline"
						target="_blank"
						rel="noopener noreferrer">X (Twitter)</a
					>
				</li>
			</ul>
		</div>
	</div>
{/snippet}

{#snippet warningContent()}
	<div class="flex items-start">
		<div class="mt-0.5 flex-shrink-0">
			<Alert class="h-5 w-5 text-amber-400" />
		</div>

		<div class="ml-3 text-sm leading-relaxed text-amber-700">
			<p class="mb-2">
				Airlines marked with <Tested class="inline h-4 w-4 text-green-600" /> ({meta.coveredByTest} total)
				are semi-automatically monitored for policy changes. Last verification was on {meta.lastTestRun.toLocaleDateString()}.
			</p>
			<p>
				However, airline policies can change at any time. Always verify the current requirements on
				your airline's website before traveling, especially for unmarked airlines that aren't
				monitored.
			</p>
		</div>
	</div>
{/snippet}

{#snippet regionFilter(regions: string[], selectedRegions: Set<string>)}
	<div class="mb-6">
		<div class="mb-4">
			<h3 class="text-base font-semibold text-sky-900 sm:text-lg">Filter by Region</h3>
			<p class="text-xs text-sky-600 sm:text-sm">
				{#if selectedRegions.size === 0}
					Choose regions to start comparing
				{:else}
					Showing {selectedRegions.size} {selectedRegions.size === 1 ? 'region' : 'regions'}
				{/if}
			</p>
		</div>

		<div class="flex flex-wrap items-center gap-3">
			<button
				class="flex items-center gap-1.5 rounded-lg bg-sky-100 px-3 py-1.5 text-xs font-medium text-sky-700 transition-colors hover:bg-sky-200 sm:px-4 sm:py-2 sm:text-sm"
				onclick={selectAllRegions}
			>
				<Check class="h-3 w-3 sm:h-4 sm:w-4" />
				<span>Select All</span>
			</button>
			<button
				class="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 sm:px-4 sm:py-2 sm:text-sm"
				onclick={clearAllRegions}
			>
				<Cross class="h-3 w-3 sm:h-4 sm:w-4" />
				<span>Clear All</span>
			</button>
		</div>

		<div class="mt-4 flex flex-wrap gap-2">
			{#each regions as region}
				{@const isSelected = selectedRegions.has(region)}
				<button
					class="ease-elastic flex transform items-center rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 hover:scale-105 sm:px-4 sm:py-2 sm:text-sm
						{isSelected
						? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md'
						: 'bg-white text-sky-700 ring-1 ring-sky-200 hover:bg-sky-50'}"
					onclick={() => toggleRegion(region)}
				>
					<span>{region}</span>
					{#if isSelected}
						<div class="animate-slide-bounce ml-2">
							<Check class="h-3 w-3 sm:h-4 sm:w-4" />
						</div>
					{/if}
				</button>
			{/each}
		</div>
	</div>
{/snippet}

<style>
	@keyframes slideAndBounce {
		0% {
			transform: translateX(-100%) scale(1);
			opacity: 0;
		}
		50% {
			transform: translateX(0) scale(1.2);
			opacity: 1;
		}
		75% {
			transform: translateX(0) scale(0.8);
		}
		100% {
			transform: translateX(0) scale(1);
		}
	}

	.animate-slide-bounce {
		animation: slideAndBounce 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
	}

	.ease-elastic {
		transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}
</style>
