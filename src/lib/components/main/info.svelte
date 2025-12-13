<script lang="ts">
	import { MonitorCheck } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Accordion from '$lib/components/ui/accordion';

	interface Props {
		coveredByTest: number;
		lastTestRun: Date;
	}

	let { coveredByTest, lastTestRun }: Props = $props();
</script>

<div class="mx-auto w-full max-w-4xl">
	<Card.Root>
		<Card.Header>
			<Card.Title>FAQ</Card.Title>
		</Card.Header>
		<Card.Content>
			<Accordion.Root type="single">
				<Accordion.Item value="about">
					<Accordion.Trigger>What is CarryFit?</Accordion.Trigger>
					<Accordion.Content>
						{@render aboutContent()}
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="dimensions">
					<Accordion.Trigger>What are the dimensions?</Accordion.Trigger>
					<Accordion.Content>
						{@render dimensionsNote()}
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="warning">
					<Accordion.Trigger>Can I trust this?</Accordion.Trigger>
					<Accordion.Content>
						{@render warningContent()}
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</Card.Content>
	</Card.Root>
</div>

{#snippet aboutContent()}
	<div class="flex flex-col gap-2">
		<p>
			CarryFit helps you check if your carry-on luggage meets the size requirements for different
			airlines worldwide. Enter your bag's dimensions, and we'll show you which airlines will accept
			it as cabin baggage.
		</p>
	</div>
{/snippet}

{#snippet dimensionsNote()}
	<p>
		The dimensions shown are for standard carry-on luggage (cabin bags), not personal items. Some
		airlines may not allow these sizes with basic/economy tickets or may require an additional fee.
		Personal item allowances will be
		<a
			href="https://github.com/AxelUser/carry-fit/issues/11"
			class="text-primary hover:underline"
			target="_blank"
			rel="noopener noreferrer">added in a future update</a
		>. If you'd like to see this feature, please vote for it on GitHub.
	</p>
{/snippet}

{#snippet warningContent()}
	<p>
		Airlines marked with <MonitorCheck size={16} class="mb-1 inline text-green-600" /> ({coveredByTest}
		total) are semi-automatically monitored for policy changes. Last verification was on {lastTestRun.toLocaleDateString()}.
	</p>
	<p>
		However, airline policies can change at any time. Always verify the current requirements on your
		airline's website before traveling, especially for unmarked airlines that aren't monitored.
	</p>
{/snippet}
