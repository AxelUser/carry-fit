<script lang="ts">
	import Alert from '$lib/components/icons/alert.svelte';
	import Tested from '$lib/components/icons/tested.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import RegionFilter from '$lib/components/main/region-filter.svelte';
	import { checkCompliance, getAirlineAllowances } from '$lib/allowances';
	import type { Airline, UserDimensions } from '$lib/types';

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

<div class="container mx-auto px-4 py-8">
	<div class="mb-8 py-2 text-center">
		<h1
			class="mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text py-1 text-4xl font-extrabold text-transparent"
		>
			CarryFit
		</h1>
		<p class="text-xl font-medium text-gray-600">Carry-on Luggage Compliance Checker</p>
	</div>

	<div class="mb-8 lg:flex lg:items-start lg:gap-8">
		<div class="mx-auto mb-8 max-w-2xl lg:mx-0 lg:mb-0 lg:flex-1">
			<div class="mb-4 rounded-lg bg-white p-5 shadow-md">
				<p class="mb-4 leading-relaxed text-gray-700">
					This tool helps you check if your carry-on luggage meets the size requirements for
					different airlines worldwide. Enter your bag's dimensions, and we'll show you which
					airlines will accept it as cabin baggage.
				</p>
				<div class="border-t pt-3 text-sm text-gray-600">
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

			<div class="border-l-4 border-yellow-400 bg-yellow-50 p-4">
				<div class="flex items-start">
					<div class="mt-0.5 flex-shrink-0">
						<Alert class="h-5 w-5 text-yellow-400" />
					</div>

					<div class="ml-3 text-sm leading-relaxed text-yellow-700">
						<p>
							Airlines marked with <Tested class="inline h-4 w-4 text-green-600" /> are automatically
							tested for policy updates, but not in real-time. Policies may change between checks, and
							unmarked airlines are not monitored. Always verify requirements on the airline's website
							before traveling.
						</p>
					</div>
				</div>
			</div>
		</div>

		<div class="mx-auto max-w-2xl lg:mx-0 lg:flex-1">
			<div class="rounded-lg bg-white p-6 shadow-md">
				{@render bagInput()}

				{#if userDimensions.length && userDimensions.width && userDimensions.height}
					<div class="text-center text-lg font-medium">
						Compliance: <span
							class={compliancePercentage <= 60
								? 'text-red-600'
								: compliancePercentage <= 80
									? 'text-yellow-600'
									: 'text-green-600'}>{compliancePercentage.toFixed(1)}%</span
						>
						of airlines
						<div class="text-sm text-gray-600">
							({compliantAirlines.length} out of {filteredAirlines.length} selected airlines)
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="rounded-lg bg-white p-6 shadow-md">
		<RegionFilter {regions} bind:selectedRegions />

		<div class="flex flex-wrap items-center gap-2">
			<select bind:value={sortBy} class="rounded border-gray-300">
				{#each SORT_OPTIONS as option}
					<option value={option}>Sort by {option}</option>
				{/each}
			</select>

			<button
				on:click={() =>
					(sortDirection =
						sortDirection === SORT_DIRECTIONS[0] ? SORT_DIRECTIONS[1] : SORT_DIRECTIONS[0])}
				class="rounded bg-gray-100 px-4 py-2 hover:bg-gray-200"
			>
				{sortDirection === SORT_DIRECTIONS[0] ? '↑' : '↓'}
			</button>
		</div>

		<div class="overflow-x-auto">
			{#if selectedRegions.size === 0}
				<div class="py-8 text-center text-gray-500">Please select a region</div>
			{:else}
				<table class="w-full">
					<thead>
						<tr class="bg-gray-50">
							<th class="p-3 text-left">Airline</th>
							<th class="p-3 text-left">Region</th>
							<th class="p-3 text-left">Dimensions ({userDimensions.unit})</th>
							<th class="p-3 text-left">Weight Limit</th>
							<th class="p-3 text-left">Policy</th>
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

{#snippet bagInput()}
	<div class="mb-4">
		<p class="mb-2 text-sm text-gray-600">
			Enter your bag's dimensions. The order doesn't matter - we'll automatically sort them to find
			the best fit.
		</p>
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
			<div>
				<label for="height" class="mb-1 block text-sm font-medium text-gray-700">Height</label>
				<input
					type="number"
					id="height"
					bind:value={userDimensions.height}
					class="w-full rounded border-gray-300 text-sm"
					min="0"
				/>
			</div>
			<div>
				<label for="width" class="mb-1 block text-sm font-medium text-gray-700">Width</label>
				<input
					type="number"
					id="width"
					bind:value={userDimensions.width}
					class="w-full rounded border-gray-300 text-sm"
					min="0"
				/>
			</div>
			<div>
				<label for="depth" class="mb-1 block text-sm font-medium text-gray-700">Depth</label>
				<input
					type="number"
					id="depth"
					bind:value={userDimensions.length}
					class="w-full rounded border-gray-300 text-sm"
					min="0"
				/>
			</div>
			<div>
				<label for="unit" class="mb-1 block text-sm font-medium text-gray-700">Unit</label>
				<select
					id="unit"
					bind:value={userDimensions.unit}
					class="w-full rounded border-gray-300 text-sm"
				>
					<option value="cm">Centimeters</option>
					<option value="in">Inches</option>
				</select>
			</div>
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

	<tr class="border-t {isCompliant ? 'bg-green-50' : ''}">
		<td class="p-3">
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
		<td class="p-3">{airline.region}</td>
		<td class="p-3">
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
		<td class="p-3">
			{#if airline.kilograms}
				{userDimensions.unit === 'in' ? `${airline.pounds} lb` : `${airline.kilograms} kg`}
			{:else}
				N/A
			{/if}
		</td>
		<td class="p-3">
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
