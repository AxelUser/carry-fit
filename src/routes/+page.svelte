<script lang="ts">
	import Alert from '$lib/components/icons/alert.svelte';
	import Tested from '$lib/components/icons/tested.svelte';
	import * as Tooltip from "$lib/components/ui/tooltip";
	import DimensionsInput from '$lib/components/main/dimensions-input.svelte';
	import RegionFilter from '$lib/components/main/region-filter.svelte';
	import { checkCompliance, getAirlineAllowances } from '$lib/allowances';
	import type { Airline, UserDimensions } from '$lib/types';

	const airlineData = getAirlineAllowances();

	const SORT_OPTIONS = ['airline', 'region'] as const;
	const SORT_DIRECTIONS = ['asc', 'desc'] as const;
	type SortOption = typeof SORT_OPTIONS[number];
	type SortDirection = typeof SORT_DIRECTIONS[number];

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

	const regions = [...new Set(airlineData.map(airline => airline.region))].sort();
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
				const compliance = checkCompliance(airline, userDimensions);
				return compliance && compliance.length && compliance.width && compliance.height;
			});
			compliancePercentage = filteredAirlines.length === 0 ? 0 
				: (compliantAirlines.length / filteredAirlines.length) * 100;
		}
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="text-center mb-8 py-2">
		<h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3 py-1">
			CarryFit
		</h1>
		<p class="text-xl text-gray-600 font-medium">
			Carry-on Luggage Compliance Checker
		</p>
	</div>
	
	<div class="lg:flex lg:gap-8 lg:items-start mb-8">
		<div class="lg:flex-1 max-w-2xl mx-auto lg:mx-0 mb-8 lg:mb-0">
			<div class="bg-white rounded-lg shadow-md p-5 mb-4">
				<p class="text-gray-700 leading-relaxed mb-4">
					This tool helps you check if your carry-on luggage meets the size requirements for different airlines worldwide. 
					Enter your bag's dimensions, and we'll show you which airlines will accept it as cabin baggage.
				</p>
				<div class="text-sm text-gray-600 pt-3 border-t">
					<p class="mb-2">
						Created by <a href="https://www.maltsev.space/" class="text-blue-600 hover:text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">Aleksey Maltsev</a>
					</p>
					<div class="mb-2">
						Found an error? You can:
						<ul class="list-disc list-inside ml-2">
							<li>Email me at <a href="mailto:alexey.maltsev.work@gmail.com" class="text-blue-600 hover:text-blue-800 hover:underline">alexey.maltsev.work@gmail.com</a></li>
							<li>Contact me on <a href="https://x.com/axel_user" class="text-blue-600 hover:text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">X (Twitter)</a></li>
							<li>Submit a pull request on <a href="https://github.com/AxelUser/carry-fit" class="text-blue-600 hover:text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a></li>
						</ul>
					</div>
				</div>
			</div>

			<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
				<div class="flex items-start">
					<div class="flex-shrink-0 mt-0.5">
						<Alert class="h-5 w-5 text-yellow-400" />
					</div>

					<div class="ml-3 text-sm text-yellow-700 leading-relaxed">
						<p>
							Airlines marked with <Tested class="w-4 h-4 text-green-600 inline" /> are automatically tested for updates, but the allowances may still not be accurate due to bugs. Especially airlines that are not covered by tests. Always verify the requirements yourself.
						</p>
					</div>
				</div>
			</div>
		</div>

		<div class="lg:flex-1 max-w-2xl mx-auto lg:mx-0">
			<div class="bg-white rounded-lg shadow-md p-6">
				<DimensionsInput bind:userDimensions />
				
				{#if userDimensions.length && userDimensions.width && userDimensions.height}
					<div class="text-center text-lg font-medium">
						Compliance: <span class={compliancePercentage <= 60 
							? 'text-red-600'
							: compliancePercentage <= 80 
								? 'text-yellow-600'
								: 'text-green-600'
						}>{compliancePercentage.toFixed(1)}%</span> of airlines
						<div class="text-sm text-gray-600">
							({compliantAirlines.length} out of {filteredAirlines.length} selected airlines)
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="bg-white rounded-lg shadow-md p-6">
		<RegionFilter {regions} bind:selectedRegions />
		
		<div class="flex flex-wrap gap-2 items-center">
			<select bind:value={sortBy} class="rounded border-gray-300">
				{#each SORT_OPTIONS as option}
					<option value={option}>Sort by {option}</option>
				{/each}
			</select>

			<button
				on:click={() => (sortDirection = sortDirection === SORT_DIRECTIONS[0] ? SORT_DIRECTIONS[1] : SORT_DIRECTIONS[0])}
				class="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
			>
				{sortDirection === SORT_DIRECTIONS[0] ? '↑' : '↓'}
			</button>
		</div>

		<div class="overflow-x-auto">
			{#if selectedRegions.size === 0}
				<div class="text-center py-8 text-gray-500">
					Please select a region
				</div>
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
							{@const compliance = checkCompliance(airline, userDimensions)}
							{@const isCompliant = compliance && compliance.length && compliance.width && compliance.height}

							<tr class="border-t {isCompliant ? 'bg-green-50' : ''}">
								<td class="p-3">
									<div class="flex items-center gap-2">
										{airline.airline}
										{#if airline.lastTestPass}
											<Tooltip.Root>
												<Tooltip.Trigger>
													<Tested class="w-4 h-4 text-green-600" />
												</Tooltip.Trigger>
												<Tooltip.Content>
													<p>
														Last Test Passed: {airline.lastTestPass.toLocaleDateString()}
													</p>
												</Tooltip.Content>
											</Tooltip.Root>
										{/if}
									</div>
								</td>
								<td class="p-3">{airline.region}</td>
								<td class="p-3">
									{#if compliance && !isCompliant}
										{@const dimensions = userDimensions.unit === 'in' 
											? airline.inches
											: airline.centimeters}
										<span class={compliance.length ? '' : 'text-red-600'}>{dimensions[0]}</span>
										x
										<span class={compliance.width ? '' : 'text-red-600'}>{dimensions[1]}</span>
										x
										<span class={compliance.height ? '' : 'text-red-600'}>{dimensions[2]}</span>
									{:else}
										{@const dimensions = userDimensions.unit === 'in' 
											? airline.inches
											: airline.centimeters}
										{`${dimensions[0]} x ${dimensions[1]} x ${dimensions[2]}`}
									{/if}
								</td>
								<td class="p-3">
									{#if airline.kilograms}
										{userDimensions.unit === 'in' 
											? `${airline.pounds} lb`
											: `${airline.kilograms} kg`}
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
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	</div>
</div>
