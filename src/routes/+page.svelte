<script lang="ts">
	import Alert from '$lib/components/icons/alert.svelte';
	import Tested from '$lib/components/icons/tested.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import RegionFilter from '$lib/components/main/region-filter.svelte';
	import { checkCompliance, getAirlineAllowances } from '$lib/allowances';
	import type { Airline, UserDimensions } from '$lib/types';
	import CarryOnChecked from '$lib/components/icons/carry-on-checked.svelte';
	import SortTextAsc from '$lib/components/icons/sort-text-asc.svelte';
	import SortTextDesc from '$lib/components/icons/sort-text-desc.svelte';

	const airlineData = getAirlineAllowances();

	const SORT_OPTIONS = ['airline', 'region'] as const;
	const SORT_DIRECTIONS = ['asc', 'desc'] as const;
	type SortOption = (typeof SORT_OPTIONS)[number];
	type SortDirection = (typeof SORT_DIRECTIONS)[number];

	let userDimensions: UserDimensions = {
		length: 0,
		width: 0,
		height: 0,
		unit: 'cm'
	};

	let sortBy: SortOption = SORT_OPTIONS[0];
	let sortDirection: SortDirection = SORT_DIRECTIONS[0];

	let filteredAirlines = airlineData;
	let compliancePercentage = 0;
	let compliantAirlines: Airline[] = [];

	const regions = [...new Set(airlineData.map((airline) => airline.region))].sort();
	let selectedRegions = new Set(regions);

	$: {
		filteredAirlines = airlineData
			.filter((airline) => selectedRegions.has(airline.region))
			.sort((a, b) => {
				const direction = sortDirection === SORT_DIRECTIONS[0] ? 1 : -1;
				return (a[sortBy] as string).localeCompare(b[sortBy] as string) * direction;
			});

		if (userDimensions.length && userDimensions.width && userDimensions.height) {
			compliantAirlines = filteredAirlines.filter((airline) => {
				const compliance = checkCompliance(getAirlineDimensions(airline), [
					userDimensions.length,
					userDimensions.width,
					userDimensions.height
				]);

				if (!compliance) {
					return false;
				}

				return compliance.every(Boolean);
			});

			compliancePercentage =
				filteredAirlines.length === 0
					? 0
					: (compliantAirlines.length / filteredAirlines.length) * 100;
		}
	}

	function getAirlineDimensions(airline: Airline): number[] {
		const dims = userDimensions.unit === 'cm' ? airline.centimeters : airline.inches;
		return Array.isArray(dims) ? dims : [dims];
	}

	function getUserDimensionsIfFilled(bagDimensions: UserDimensions): number[] {
		if (bagDimensions.length && bagDimensions.width && bagDimensions.height) {
			return [bagDimensions.length, bagDimensions.width, bagDimensions.height];
		}
		return [];
	}
</script>

<div class="min-h-screen px-4 py-8">
	<div class="min-h-screen bg-white/90 backdrop-blur-sm">
		<div class="container mx-auto">
			<div class="mb-12 py-2 text-center">
				<h1 class="mb-3 font-extrabold">
					<span
						class="bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-6xl text-transparent"
					>
						CarryFit
					</span>
					<span class="ml-2 inline-flex translate-y-2">
						<CarryOnChecked class="h-16 w-16" />
					</span>
				</h1>
				<p class="text-xl font-medium text-sky-900">
					Instantly validate your carry-on bag dimensions for <span class="text-blue-600"
						>{airlineData.length}</span
					> airlines worldwide
				</p>
			</div>

			<div class="mb-8 lg:flex lg:items-start lg:gap-8">
				<div class="mx-auto mb-8 max-w-2xl lg:mx-0 lg:mb-0 lg:flex-1">
					<div
						class="mb-4 rounded-xl bg-white/95 p-6 shadow-xl ring-1 ring-sky-100 backdrop-blur-sm"
					>
						<p class="mb-4 leading-relaxed text-sky-900">
							This tool helps you check if your carry-on luggage meets the size requirements for
							different airlines worldwide. Enter your bag's dimensions, and we'll show you which
							airlines will accept it as cabin baggage.
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
					</div>

					<div
						class="rounded-xl border-l-4 border-amber-400 bg-amber-50/90 p-5 shadow-md backdrop-blur-sm"
					>
						<div class="flex items-start">
							<div class="mt-0.5 flex-shrink-0">
								<Alert class="h-5 w-5 text-amber-400" />
							</div>

							<div class="ml-3 text-sm leading-relaxed text-amber-700">
								<p>
									Airlines marked with <Tested class="inline h-4 w-4 text-green-600" /> are automatically
									tested for policy updates, but not in real-time. Policies may change between checks,
									and unmarked airlines are not monitored. Always verify requirements on the airline's
									website before traveling.
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="mx-auto max-w-2xl lg:mx-0 lg:flex-1">
					<div class="rounded-xl bg-white/95 p-6 shadow-xl ring-1 ring-sky-100 backdrop-blur-sm">
						{@render bagInput()}

						{#if userDimensions.length && userDimensions.width && userDimensions.height}
							<div class="mt-6 text-center">
								<div class="mb-2 text-sm font-medium text-sky-700">Compliance Score</div>
								<span
									class={compliancePercentage <= 60
										? 'text-red-600'
										: compliancePercentage <= 80
											? 'text-amber-600'
											: 'text-emerald-600'}
								>
									{compliancePercentage.toFixed(1)}%
								</span>
								<div class="mt-2 text-sm text-sky-600">
									({compliantAirlines.length} out of {filteredAirlines.length} selected airlines)
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<div class="rounded-xl bg-white/95 p-6 shadow-xl ring-1 ring-sky-100 backdrop-blur-sm">
				<RegionFilter {regions} bind:selectedRegions />

				<div class="overflow-x-auto rounded-lg">
					{#if selectedRegions.size === 0}
						<div class="w-full py-8 text-center">
							<p class="text-2xl font-medium text-sky-300">✈️ Ready to check your carry-on?</p>
							<p class="mt-2 text-lg text-sky-400">
								Select regions to see which airlines will accept your bag
							</p>
						</div>
					{:else}
						<table class="w-full">
							<thead>
								<tr class="bg-sky-50">
									<th class="p-3 text-left text-sky-900" role="columnheader">
										<button
											class="flex items-center gap-2 font-semibold hover:text-sky-700"
											on:click={() => {
												if (sortBy === 'airline') {
													sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
												} else {
													sortBy = 'airline';
													sortDirection = 'asc';
												}
											}}
										>
											Airline
											{#if sortBy === 'airline'}
												{#if sortDirection === 'asc'}
													<SortTextAsc class="h-5 w-5" />
												{:else}
													<SortTextDesc class="h-5 w-5" />
												{/if}
											{/if}
										</button>
									</th>
									<th class="p-3 text-left text-sky-900" role="columnheader">
										<button
											class="flex items-center gap-2 font-semibold hover:text-sky-700"
											on:click={() => {
												if (sortBy === 'region') {
													sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
												} else {
													sortBy = 'region';
													sortDirection = 'asc';
												}
											}}
										>
											Region
											{#if sortBy === 'region'}
												{#if sortDirection === 'asc'}
													<SortTextAsc class="h-5 w-5" />
												{:else}
													<SortTextDesc class="h-5 w-5" />
												{/if}
											{/if}
										</button>
									</th>
									<th class="p-3 text-left text-sky-900" role="columnheader">
										Dimensions ({userDimensions.unit})
									</th>
									<th class="p-3 text-left text-sky-900" role="columnheader">Weight Limit</th>
									<th class="p-3 text-left text-sky-900" role="columnheader">Policy</th>
								</tr>
							</thead>
							<tbody>
								{#each filteredAirlines as airline}
									{@render airlineAllowanceRow(airline)}
								{/each}
							</tbody>
						</table>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

{#snippet bagInput()}
	<div class="mb-4">
		<h2 class="mb-4 text-center text-xl font-semibold text-sky-900">Enter Your Bag Dimensions</h2>
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
			<div>
				<label for="height" class="mb-1 block text-sm font-medium text-sky-900">Height</label>
				<input
					type="number"
					id="height"
					bind:value={userDimensions.height}
					class="w-full rounded-lg border-sky-200 bg-sky-50 text-sm focus:border-sky-400 focus:ring-sky-400"
					min="0"
				/>
			</div>
			<div>
				<label for="width" class="mb-1 block text-sm font-medium text-sky-900">Width</label>
				<input
					type="number"
					id="width"
					bind:value={userDimensions.width}
					class="w-full rounded-lg border-sky-200 bg-sky-50 text-sm focus:border-sky-400 focus:ring-sky-400"
					min="0"
				/>
			</div>
			<div>
				<label for="depth" class="mb-1 block text-sm font-medium text-sky-900">Depth</label>
				<input
					type="number"
					id="depth"
					bind:value={userDimensions.length}
					class="w-full rounded-lg border-sky-200 bg-sky-50 text-sm focus:border-sky-400 focus:ring-sky-400"
					min="0"
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
		<div class="mx-auto mt-4 h-px w-32 bg-sky-100" />
		<div class="mt-4 text-center text-sm font-medium text-sky-700">
			Don't worry about the order - we'll find the best fit
		</div>
	</div>
{/snippet}

{#snippet airlineAllowanceRow(airline: Airline)}
	{@const compliance = checkCompliance(
		getAirlineDimensions(airline),
		getUserDimensionsIfFilled(userDimensions)
	)}
	{@const isCompliant = compliance?.every(Boolean) ?? false}
	{@const dimensions = getAirlineDimensions(airline)}

	<tr class="border-t border-sky-100 {isCompliant ? 'bg-emerald-50' : ''} hover:bg-sky-50">
		<td class="p-3" data-testid="airline">
			<div class="flex items-center gap-2">
				{airline.airline}
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
			</div>
		</td>
		<td class="p-3" data-testid="region">{airline.region}</td>
		<td class="p-3" data-testid="dimensions">
			{#if dimensions.length === 1}
				<span class={compliance?.[0] === false ? 'text-red-600' : ''}>
					{`Total ${dimensions[0]}`}</span
				>
			{:else}
				<span class={compliance?.[0] === false ? 'text-red-600' : ''}>{dimensions[0]}</span>
				x
				<span class={compliance?.[1] === false ? 'text-red-600' : ''}>{dimensions[1]}</span>
				x
				<span class={compliance?.[2] === false ? 'text-red-600' : ''}>{dimensions[2]}</span>
			{/if}
		</td>
		<td class="p-3" data-testid="weight-limit">
			{#if airline.kilograms}
				{userDimensions.unit === 'in' ? `${airline.pounds} lb` : `${airline.kilograms} kg`}
			{:else}
				N/A
			{/if}
		</td>
		<td class="p-3" data-testid="policy-link">
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
