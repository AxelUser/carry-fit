import type { AirlinesByCompliance } from '$lib/types';

export function getComplianceTableState(
	airlinesByCompliance: AirlinesByCompliance,
	isLargeScreen: boolean
) {
	let isNonCompliantOpen = $state(false);
	let isCompliantOpen = $state(false);

	let hasCompliantAirlines = $derived(airlinesByCompliance.compliant.length > 0);
	let hasNonCompliantAirlines = $derived(airlinesByCompliance.nonCompliant.length > 0);

	let onlyCompliantSection = $derived(hasCompliantAirlines && !hasNonCompliantAirlines);
	let onlyNonCompliantSection = $derived(!hasCompliantAirlines && hasNonCompliantAirlines);

	let complianceDetailsFoldable = $derived(
		!isLargeScreen && hasCompliantAirlines && hasNonCompliantAirlines
	);

	let singleScoringDetailsTableLayout = $derived(onlyCompliantSection || onlyNonCompliantSection);

	// Mutual exclusivity of compliance and non-compliance sections
	$effect(() => {
		if (onlyCompliantSection || onlyNonCompliantSection) {
			isNonCompliantOpen = onlyNonCompliantSection;
			isCompliantOpen = onlyCompliantSection;
		} else if (hasNonCompliantAirlines) {
			isNonCompliantOpen = true;
			isCompliantOpen = false;
		}
	});

	return {
		isNonCompliantOpen,
		isCompliantOpen,
		complianceDetailsFoldable,
		singleScoringDetailsTableLayout
	};
}
