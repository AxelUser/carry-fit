<script lang="ts">
	import airlineJsonData from '$lib/allowances/carry-on-limits.json';
	import Alert from '$lib/components/alert.svelte';

    interface Airline {
        Airline: string;
        Region: string;
        Link?: string;
        Inches: Dimensions;
        Centimeters: Dimensions;
        Pounds?: number;
        Kilograms?: number;
    }

    interface Dimensions {
        length: number;
        width: number;
        height: number;
    }

    const airlineData = airlineJsonData.map((airline) => ({
        Airline: airline.airline,
        Region: airline.region,
        Link: airline.link,
        Inches: {
            length: Number(airline.inches.split(' x ')[0]),
            width: Number(airline.inches.split(' x ')[1]),
            height: Number(airline.inches.split(' x ')[2])
        },
        Centimeters: {
            length: Number(airline.centimeters.split(' x ')[0]),
            width: Number(airline.centimeters.split(' x ')[1]),
            height: Number(airline.centimeters.split(' x ')[2])
        },
        Pounds: airline.pounds ?? undefined,
        Kilograms: airline.kilograms ?? undefined
    } as Airline));

    const SORT_OPTIONS = ['Airline', 'Region'];
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

	// Get unique regions from the data
	const regions = [...new Set(airlineData.map(airline => airline.Region))].sort();

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
			? airline.Centimeters
			: airline.Inches;

		return {
			length: userDimensions.length <= airlineDimensions.length,
			width: userDimensions.width <= airlineDimensions.width,
			height: userDimensions.height <= airlineDimensions.height
		};
	}

	$: {
		filteredAirlines = airlineData
			.filter((airline) => selectedRegions.has(airline.Region))
			.sort((a, b) => {
				const direction = sortDirection === SORT_DIRECTIONS[0] ? 1 : -1;
				return (a[sortBy as keyof typeof a] as string).localeCompare((b[sortBy as keyof typeof b] as string)) * direction;
			});

		if (userDimensions.length && userDimensions.width && userDimensions.height) {
			const compliantAirlines = filteredAirlines.filter((airline) => {
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

					<p class="ml-3 text-sm text-yellow-700 leading-relaxed">
						Warning: Baggage allowances may change over time. Please verify the dimensions and weight limits on the airline's official website before traveling.
					</p>
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
								<td class="p-3">{airline.Airline}</td>
								<td class="p-3">{airline.Region}</td>
								<td class="p-3">
									{#if compliance}
										{@const dimensions = userDimensions.unit === 'in' 
											? airline.Inches
											: airline.Centimeters}
										<span class={compliance.length ? 'text-green-600' : 'text-red-600'}
											>{dimensions.length}</span
										>
										x
										<span class={compliance.width ? 'text-green-600' : 'text-red-600'}
											>{dimensions.width}</span
										>
										x
										<span class={compliance.height ? 'text-green-600' : 'text-red-600'}
											>{dimensions.height}</span
										>
									{:else}
										{@const dimensions = userDimensions.unit === 'in' 
											? airline.Inches
											: airline.Centimeters}
										{ `${dimensions.length} x ${dimensions.width} x ${dimensions.height}` }
									{/if}
								</td>
								<td class="p-3">
									{#if airline.Kilograms}
										{userDimensions.unit === 'in' 
											? `${airline.Pounds} lb`
											: `${airline.Kilograms} kg`}
									{:else}
										N/A
									{/if}
								</td>
								<td class="p-3">
									{#if airline.Link}
										<a 
											href={airline.Link} 
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
