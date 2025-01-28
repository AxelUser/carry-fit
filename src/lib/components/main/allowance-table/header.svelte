<script lang="ts">
	import {
		MeasurementSystems,
		SortDirections,
		type MeasurementSystem,
		type SortDirection
	} from '$lib/types';
	import { ArrowDownAZ, ArrowUpAZ } from 'lucide-svelte';
	import { tv } from 'tailwind-variants';
	import * as Table from '$lib/components/ui/table';

	const header = tv({
		variants: {
			variant: {
				default: '',
				compliant: 'bg-emerald-50',
				nonCompliant: 'bg-destructive-50'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	interface Props {
		measurementSystem: MeasurementSystem;
		sortDirection: SortDirection;
		variant?: 'default' | 'compliant' | 'nonCompliant';
	}

	let { measurementSystem, sortDirection = $bindable(), variant }: Props = $props();

	function toggleSortDirection() {
		sortDirection =
			sortDirection === SortDirections.Ascending
				? SortDirections.Descending
				: SortDirections.Ascending;
	}
</script>

<Table.Header>
	<Table.Row class={header({ variant })}>
		<Table.Head></Table.Head>
		<Table.Head>
			<button class="flex items-center gap-2" onclick={toggleSortDirection}>
				Airline
				{#if sortDirection === SortDirections.Ascending}
					<ArrowDownAZ class="h-5 w-5" />
				{:else}
					<ArrowUpAZ class="h-5 w-5" />
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
