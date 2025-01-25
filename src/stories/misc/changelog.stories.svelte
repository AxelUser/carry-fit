<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Changelog } from '$lib/components/misc';
	import type { Change } from '$lib/types';
	import { AbsoluteLayoutDecorator } from '../decorators';

	const { Story } = defineMeta({
		title: 'Misc/Changelog',
		component: Changelog,
		tags: ['autodocs'],
		parameters: {
			layout: 'fullscreen',
			docs: {
				description: {
					component:
						'Changelog component that shows latest updates and notifies users of new versions. The component appears as a floating button that opens a modal with change details.'
				},
				story: {
					inline: false,
					iframeHeight: 400
				}
			}
		},
		argTypes: {
			changes: {
				description: 'Array of changes to display',
				control: 'object'
			},
			lastSeenVersion: {
				description: 'Date of the last seen version',
				control: 'date'
			},
			onOpen: {
				description: 'Callback function when changelog is opened',
				action: 'onOpen'
			}
		},

		// @ts-expect-error - Decorator type mismatch
		decorators: [() => AbsoluteLayoutDecorator]
	});

	const mockChanges: Change[] = [
		{
			date: new Date('2024-03-20'),
			changes: ['Added new feature X', 'Fixed bug in component Y', 'Improved performance of Z']
		}
	];

	const mockData = {
		changes: mockChanges,
		lastSeenVersion: null
	};

	const withNewVersionData = {
		...mockData,
		lastSeenVersion: new Date('2024-01-01')
	};
</script>

<Story name="Default" args={mockData} />

<Story
	name="With New Version"
	args={withNewVersionData}
	parameters={{
		docs: {
			description: {
				story: 'Shows the changelog with the new version indicator active.'
			}
		}
	}}
/>
