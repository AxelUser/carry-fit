<script lang="ts">
	import {
		MeasurementSystems,
		SortDirections,
		type MeasurementSystem,
		type SortDirection
	} from '$lib/types';
	import { ArrowDownAZ, ArrowUpAZ } from 'lucide-svelte';
	import { tv } from 'tailwind-variants';

	const header = tv({
		variants: {
			variant: {
				default: 'bg-sky-50',
				compliant: 'bg-emerald-50',
				nonCompliant: 'bg-red-50'
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

<thead>
	<tr class={header({ variant })}>
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
		<th class="p-2 text-left text-sm text-sky-900 sm:p-3 sm:text-base" role="columnheader"
			>Region</th
		>
		<th class="p-2 text-left text-sm text-sky-900 sm:p-3 sm:text-base" role="columnheader">
			Carry-On ({measurementSystem === MeasurementSystems.Metric ? 'cm' : 'in'})
		</th>
		<th class="p-2 text-left text-sm text-sky-900 sm:p-3 sm:text-base" role="columnheader"
			>Weight</th
		>
		<th class="p-2 text-left text-sm text-sky-900 sm:p-3 sm:text-base" role="columnheader"
			>Policy</th
		>
	</tr>
</thead>
