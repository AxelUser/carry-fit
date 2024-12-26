<script lang="ts">
	import Check from '../icons/check.svelte';
	import Cross from '../icons/cross.svelte';

	export let regions: string[];
	export let selectedRegions: Set<string>;

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
</script>

<div class="mb-6">
	<div class="mb-4">
		<h3 class="text-lg font-semibold text-sky-900">Filter by Region</h3>
		<p class="text-sm text-sky-600">
			{#if selectedRegions.size === 0}
				Choose regions to start comparing
			{:else}
				Showing {selectedRegions.size} {selectedRegions.size === 1 ? 'region' : 'regions'}
			{/if}
		</p>
	</div>

	<div class="flex flex-wrap items-center gap-3">
		<button
			class="flex items-center gap-1.5 rounded-lg bg-sky-100 px-4 py-2 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-200"
			on:click={selectAllRegions}
		>
			<Check class="h-4 w-4" />
			<span>Select All</span>
		</button>
		<button
			class="flex items-center gap-1.5 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
			on:click={unselectAllRegions}
		>
			<Cross class="h-4 w-4" />
			<span>Clear All</span>
		</button>
	</div>

	<div class="mt-4 flex flex-wrap gap-2">
		{#each regions as region}
			{@const isSelected = selectedRegions.has(region)}
			<button
				class="transform rounded-full px-4 py-2 text-sm font-medium transition-transform duration-200 ease-out hover:scale-105
                    {isSelected
					? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md'
					: 'bg-white text-sky-700 ring-1 ring-sky-200 hover:bg-sky-50'}"
				on:click={() => toggleRegion(region)}
			>
				<div class="flex transform-none items-center gap-2">
					<span>{region}</span>
					{#if isSelected}
						<Check class="h-4 w-4" />
					{/if}
				</div>
			</button>
		{/each}
	</div>
</div>
