<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ShareBagLink from '$lib/components/share-bag-link.svelte';
	import { MeasurementSystems } from '$lib/types';

	const { Story } = defineMeta({
		title: 'Shared/ShareBagLink',
		component: ShareBagLink,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'ShareBagLink component allows users to generate and share a link containing bag dimensions. It supports both metric and imperial measurement systems and provides a copy-to-clipboard functionality.'
				}
			}
		},
		argTypes: {
			userDimensions: {
				description: 'User dimensions object containing height, width, and depth',
				control: 'object'
			},
			measurementSystem: {
				description: 'The measurement system',
				control: 'select',
				options: Object.values(MeasurementSystems)
			}
		}
	});

	const mockData = {
		userDimensions: {
			height: 55,
			width: 40,
			depth: 20
		},
		measurementSystem: MeasurementSystems.Metric
	};
</script>

<Story name="Default" args={mockData} />
