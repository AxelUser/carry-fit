<script lang="ts">
	import { MonitorCheck } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';

	interface Props {
		coveredByTest: number;
		lastTestRun: Date;
	}

	let { coveredByTest, lastTestRun }: Props = $props();
</script>

<div class="mx-auto mb-8 flex max-w-2xl flex-col gap-4">
	<Card.Root>
		<Card.Header>
			<Card.Title>What is CarryFit?</Card.Title>
		</Card.Header>
		<Card.Content>
			{@render aboutContent()}
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Only for carry-on luggage</Card.Title>
			<Card.Description>
				The dimensions shown are for standard carry-on luggage (cabin bags), not personal items.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<p>
				Some airlines may not allow these sizes with basic/economy tickets or may require an
				additional fee. Personal item allowances will be
				<a
					href="https://github.com/AxelUser/carry-fit/issues/11"
					class="text-primary hover:underline"
					target="_blank"
					rel="noopener noreferrer">added in a future update</a
				>. If you'd like to see this feature, please vote for it on GitHub.
			</p>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Can I trust this?</Card.Title>
		</Card.Header>
		<Card.Content>
			{@render warningContent()}
		</Card.Content>
	</Card.Root>
</div>

{#snippet aboutContent()}
	<p class="mb-4 leading-relaxed">
		CarryFit helps you check if your carry-on luggage meets the size requirements for different
		airlines worldwide. Enter your bag's dimensions, and we'll show you which airlines will accept
		it as cabin baggage.
	</p>

	<Separator class="mb-3" />
	<div class="text-sm">
		<p class="mb-2">
			Created by <a
				href="https://www.maltsev.space/"
				class="text-primary hover:underline"
				target="_blank"
				rel="noopener noreferrer">Aleksey Maltsev</a
			>
		</p>
		<div class="mb-2">
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
{/snippet}

{#snippet warningContent()}
	<p class="mb-2">
		Airlines marked with <MonitorCheck size={16} class="mb-1 inline text-green-600" /> ({coveredByTest}
		total) are semi-automatically monitored for policy changes. Last verification was on {lastTestRun.toLocaleDateString()}.
	</p>
	<p>
		However, airline policies can change at any time. Always verify the current requirements on your
		airline's website before traveling, especially for unmarked airlines that aren't monitored.
	</p>
{/snippet}
