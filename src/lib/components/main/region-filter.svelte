<script lang="ts">
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
</div> 