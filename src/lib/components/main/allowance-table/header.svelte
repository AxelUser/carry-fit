<script lang="ts">
	import {
		MeasurementSystems,
		SortDirections,
		type MeasurementSystem,
		type SortDirection
	} from '$lib/types';
	import { ArrowDownAZ, ArrowUpAZ } from 'lucide-svelte';

	interface Props {
		measurementSystem: MeasurementSystem;
		sortDirection: SortDirection;
	}

	let { measurementSystem, sortDirection = $bindable() }: Props = $props();

	function toggleSortDirection() {
		sortDirection =
			sortDirection === SortDirections.Ascending
				? SortDirections.Descending
				: SortDirections.Ascending;
	}
</script>

<th role="columnheader"></th>
<th class="p-2 text-left text-sm text-sky-900 sm:p-3 sm:text-base" role="columnheader">
	<button class="flex items-center gap-2 hover:text-sky-700" onclick={toggleSortDirection}>
		Airline
		{#if sortDirection === SortDirections.Ascending}
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
