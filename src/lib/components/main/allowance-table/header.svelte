<script lang="ts">
	import {
		MeasurementSystems,
		SortDirections,
		type MeasurementSystem,
		type SortDirection
	} from '$lib/types';
	import { ArrowDownAZ, ArrowUpAZ } from 'lucide-svelte';
	import * as Table from '$lib/components/ui/table';

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

<Table.Header>
	<Table.Row role="row">
		<Table.Head></Table.Head>
		<Table.Head
			role="columnheader"
			scope="col"
			aria-sort={sortDirection === SortDirections.Ascending ? 'ascending' : 'descending'}
		>
			<button class="ml-4 flex items-center gap-2" onclick={toggleSortDirection}>
				Airline
				{#if sortDirection === SortDirections.Ascending}
					<ArrowDownAZ class="size-5" />
				{:else}
					<ArrowUpAZ class="size-5" />
				{/if}
			</button>
		</Table.Head>
		<Table.Head role="columnheader" scope="col">Region</Table.Head>
		<Table.Head role="columnheader" scope="col">
			Carry-On ({measurementSystem === MeasurementSystems.Metric ? 'cm' : 'in'})
		</Table.Head>
		<Table.Head role="columnheader" scope="col">Weight</Table.Head>
		<Table.Head role="columnheader" scope="col">Policy</Table.Head>
	</Table.Row>
</Table.Header>
