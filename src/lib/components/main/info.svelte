<script lang="ts">
	import { AlertTriangle, MonitorCheck } from 'lucide-svelte';
	import { Card } from '$lib/components/ui/card';

	interface Props {
		coveredByTest: number;
		lastTestRun: Date;
	}

	let { coveredByTest, lastTestRun }: Props = $props();
</script>

<div class="mx-auto mb-8 max-w-2xl lg:mx-0 lg:mb-0 lg:flex-1">
	<Card collapsible title="About CarryFit" class="mb-4 lg:hidden">
		{@render aboutContent()}
	</Card>

	<Card class="mb-4 hidden lg:block">
		{@render aboutContent()}
	</Card>

	<Card variant="warning" collapsible title="Can I trust this tool?" class="lg:hidden">
		{@render warningContent()}
	</Card>

	<Card variant="warning" class="hidden lg:block">
		{@render warningContent()}
	</Card>
</div>

{#snippet aboutContent()}
	<p class="mb-4 leading-relaxed text-sky-900">
		This tool helps you check if your carry-on luggage meets the size requirements for different
		airlines worldwide. Enter your bag's dimensions, and we'll show you which airlines will accept
		it as cabin baggage.
	</p>
	<p class="mb-4 text-sm text-sky-700">
		<strong>Note:</strong> The dimensions shown are for standard carry-on luggage (cabin bags), not
		personal items. Some airlines may not allow these sizes with basic/economy tickets or may
		require an additional fee. Personal item allowances will be
		<a
			href="https://github.com/AxelUser/carry-fit/issues/11"
			class="text-blue-600 hover:text-blue-800 hover:underline"
			target="_blank"
			rel="noopener noreferrer">added in a future update</a
		>. If you'd like to see this feature, please vote for it on GitHub.
	</p>
	<div class="border-t border-sky-100 pt-3 text-sm text-sky-800">
		<p class="mb-2">
			Created by <a
				href="https://www.maltsev.space/"
				class="text-blue-600 hover:text-blue-800 hover:underline"
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
						class="text-blue-600 hover:text-blue-800 hover:underline"
						target="_blank"
						rel="noopener noreferrer">GitHub</a
					>
				</li>
				<li>
					Email me at <a
						href="mailto:alexey.maltsev.work@gmail.com"
						class="text-blue-600 hover:text-blue-800 hover:underline"
						>alexey.maltsev.work@gmail.com</a
					>
				</li>
				<li>
					Contact me on <a
						href="https://x.com/axel_user"
						class="text-blue-600 hover:text-blue-800 hover:underline"
						target="_blank"
						rel="noopener noreferrer">X (Twitter)</a
					>
				</li>
			</ul>
		</div>
	</div>
{/snippet}

{#snippet warningContent()}
	<div class="flex items-start">
		<div class="mt-0.5 flex-shrink-0">
			<AlertTriangle class="h-5 w-5 text-amber-400" />
		</div>

		<div class="ml-3 text-sm leading-relaxed text-amber-700">
			<p class="mb-2">
				Airlines marked with <MonitorCheck size={16} class="mb-1 inline text-green-600" /> ({coveredByTest}
				total) are semi-automatically monitored for policy changes. Last verification was on {lastTestRun.toLocaleDateString()}.
			</p>
			<p>
				However, airline policies can change at any time. Always verify the current requirements on
				your airline's website before traveling, especially for unmarked airlines that aren't
				monitored.
			</p>
		</div>
	</div>
{/snippet}
