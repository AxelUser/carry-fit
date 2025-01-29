<script lang="ts">
	import { MonitorCheck } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import * as Accordion from '$lib/components/ui/accordion';
	import { SupportSection } from '$lib/components/misc';

	interface Props {
		coveredByTest: number;
		lastTestRun: Date;
	}

	let { coveredByTest, lastTestRun }: Props = $props();
</script>

<div class="mx-auto flex w-full max-w-2xl flex-col">
	<Card.Root>
		<Card.Header>
			<Card.Title>FAQ</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4">
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
			<SupportSection />
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

		<Separator />
		<div class="flex flex-col gap-2">
			<p>
				Created by <a
					href="https://www.maltsev.space/"
					class="text-primary hover:underline"
					target="_blank"
					rel="noopener noreferrer">Aleksey Maltsev</a
				>
			</p>
			<div>
				Found an error or have a feature suggestion? You can:
				<ul class="ml-2 list-inside list-disc">
					<li>
						Create an issue or submit a pull request on <a
							href="https://github.com/AxelUser/carry-fit"
							class="text-primary hover:underline"
							target="_blank"
							rel="noopener noreferrer">GitHub</a
						>
					</li>
					<li>
						Email me at <a
							href="mailto:alexey.maltsev.work@gmail.com"
							class="text-primary hover:underline">alexey.maltsev.work@gmail.com</a
						>
					</li>
					<li>
						Contact me on <a
							href="https://x.com/axel_user"
							class="text-primary hover:underline"
							target="_blank"
							rel="noopener noreferrer">X (Twitter)</a
						>
					</li>
				</ul>
			</div>
		</div>
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
