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
	<Table.Row>
		<Table.Head></Table.Head>
		<Table.Head>
			<button class="ml-4 flex items-center gap-2" onclick={toggleSortDirection}>
				Airline
				{#if sortDirection === SortDirections.Ascending}
					<ArrowDownAZ class="size-5" />
				{:else}
					<ArrowUpAZ class="size-5" />
				{/if}
			</button>
		</Table.Head>
		<Table.Head>Region</Table.Head>
		<Table.Head
			>Carry-On ({measurementSystem === MeasurementSystems.Metric ? 'cm' : 'in'})</Table.Head
		>
		<Table.Head>Weight</Table.Head>
		<Table.Head>Policy</Table.Head>
	</Table.Row>
</Table.Header>
