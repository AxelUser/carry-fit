<script lang="ts">
	import airlineJsonData from '$lib/allowances/carry-on-limits.json';
	import Alert from '$lib/components/alert.svelte';
	import Tested from '$lib/components/tested.svelte';
	import * as Tooltip from "$lib/components/ui/tooltip";

    interface Airline {
        airline: string;
        region: string;
        link?: string;
        inches: number[];
        centimeters: number[];
        pounds?: number;
        kilograms?: number;
		lastTestPass?: Date;
    }

    const airlineData = airlineJsonData.map((airline) => {
		const parsedCentimeters = airline.centimeters.split(' x ').map(Number).sort((a, b) => b - a);
		let parsedInches = airline.inches?.split(' x ').map(Number).sort((a, b) => b - a);

		if (!parsedCentimeters && !parsedInches) {
			throw new Error(`No dimensions for ${airline.airline}`);
		}
		if (!parsedInches) {
			parsedInches = parsedCentimeters.map((value) => Math.round(value / 2.54));
		}

		let pounds = airline.pounds;
		let kilograms = airline.kilograms;

		if (!kilograms && typeof pounds == "number") {
			kilograms = Math.round(pounds / 2.205);
		}

		if (!pounds && typeof kilograms == "number") {
			pounds = Math.round(kilograms * 2.205);
		}

        return {
            airline: airline.airline,
            region: airline.region,
            link: airline.link,
            inches: parsedInches,
            centimeters: parsedCentimeters,
            pounds: pounds,
            kilograms: kilograms,
			lastTestPass: airline.test?.lastTestPass ? new Date(airline.test.lastTestPass) : undefined
		} as Airline;
	});

    const SORT_OPTIONS = ['airline', 'region'];
    const SORT_DIRECTIONS = ['asc', 'desc'];

	let userDimensions = {
		length: 0,
		width: 0,
		height: 0,
		unit: 'cm' // or 'in'
	};

	let sortBy = SORT_OPTIONS[0];
	let sortDirection = SORT_DIRECTIONS[0];

	let filteredAirlines = airlineData;
	let compliancePercentage = 0;
	let compliantAirlines = [];

	// Get unique regions from the data
	const regions = [...new Set(airlineData.map(airline => airline.region))].sort();

	// Track selected regions in a Set
	let selectedRegions = new Set(regions); // Start with all regions selected

	function selectAllRegions() {
		selectedRegions = new Set(regions);
	}

	function unselectAllRegions() {
		selectedRegions = new Set();
	}

	function toggleRegion(region: string) {
		if (selectedRegions.has(region)) {
			selectedRegions.delete(region);
		} else {
			selectedRegions.add(region);
		}
		selectedRegions = selectedRegions;
	}

	function checkCompliance(airline: Airline) {
		if (!userDimensions.length || !userDimensions.width || !userDimensions.height) return null;

		const airlineDimensions = userDimensions.unit === 'cm'
			? airline.centimeters
			: airline.inches;
		
		const bagDims = [
			userDimensions.length,
			userDimensions.width,
			userDimensions.height
		].sort((a, b) => b - a);

		return {
			length: bagDims[0] <= airlineDimensions[0],
			width: bagDims[1] <= airlineDimensions[1],
			height: bagDims[2] <= airlineDimensions[2]
		};
	}

	$: {
		filteredAirlines = airlineData
			.filter((airline) => selectedRegions.has(airline.region))
			.sort((a, b) => {
				const direction = sortDirection === SORT_DIRECTIONS[0] ? 1 : -1;
				return (a[sortBy as keyof typeof a] as string).localeCompare((b[sortBy as keyof typeof b] as string)) * direction;
			});

		if (userDimensions.length && userDimensions.width && userDimensions.height) {
			compliantAirlines = filteredAirlines.filter((airline) => {
				const compliance = checkCompliance(airline);
				return compliance && compliance.length && compliance.width && compliance.height;
			});
			if (filteredAirlines.length === 0 || compliantAirlines.length === 0) {
				compliancePercentage = 0;
			} else {
				compliancePercentage = (compliantAirlines.length / filteredAirlines.length) * 100;
			}
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
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
					<div>
						<label for="length" class="block text-sm font-medium text-gray-700 mb-1">Length</label>
						<input
							type="number"
							id="length"
							bind:value={userDimensions.length}
							class="w-full rounded border-gray-300 text-sm"
							min="0"
						/>
					</div>
					<div>
						<label for="width" class="block text-sm font-medium text-gray-700 mb-1">Width</label>
						<input
							type="number"
							id="width"
							bind:value={userDimensions.width}
							class="w-full rounded border-gray-300 text-sm"
							min="0"
						/>
					</div>
					<div>
						<label for="height" class="block text-sm font-medium text-gray-700 mb-1">Height</label>
						<input
							type="number"
							id="height"
							bind:value={userDimensions.height}
							class="w-full rounded border-gray-300 text-sm"
							min="0"
						/>
					</div>
					<div>
						<label for="unit" class="block text-sm font-medium text-gray-700 mb-1">Unit</label>
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
		<div class="flex flex-col gap-4 mb-4">
			<div class="flex gap-2 text-sm">
				<button
					class="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
					on:click={selectAllRegions}
				>
					Select All
				</button>
				<button
					class="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
					on:click={unselectAllRegions}
				>
					Unselect All
				</button>
			</div>

			<div class="flex flex-wrap gap-2">
				{#each regions as region}
					<button
						class="px-4 py-2 rounded-full text-sm font-medium transition-colors
							{selectedRegions.has(region)
								? 'bg-blue-600 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
						on:click={() => toggleRegion(region)}
					>
						{region}
					</button>
				{/each}
			</div>

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
							{@const compliance = checkCompliance(airline)}

							<tr class="border-t">
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
									{#if compliance}
										{@const dimensions = userDimensions.unit === 'in' 
											? airline.inches
											: airline.centimeters}
										<span class={compliance.length ? 'text-green-600' : 'text-red-600'}
											>{dimensions[0]}</span
										>
										x
										<span class={compliance.width ? 'text-green-600' : 'text-red-600'}
											>{dimensions[1]}</span
										>
										x
										<span class={compliance.height ? 'text-green-600' : 'text-red-600'}
											>{dimensions[2]}</span
										>
									{:else}
										{@const dimensions = userDimensions.unit === 'in' 
											? airline.inches
											: airline.centimeters}
										{ `${dimensions[0]} x ${dimensions[1]} x ${dimensions[2]}` }
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
