<script lang="ts">
	import { metrics } from '$lib/analytics';
	import '../app.css';
	import { AlertTriangle } from 'lucide-svelte';
	import { CarryFitIcon } from '$lib/components/icons';
	let { children } = $props();
	let error = $state<Error | null>(null);

	function handleError(e: Event) {
		if (e instanceof ErrorEvent) {
			error = e.error;
		}
		metrics.errorOccurred(error);
	}
</script>

<svelte:window on:error={handleError} />

{#if error}
	<div class="min-h-screen px-2 py-8 sm:px-4">
		<div class="min-h-screen bg-white/90">
			<div class="mx-auto md:container">
				<div class="mb-12 py-2 text-center">
					<h1 class="mb-3 font-extrabold">
						<span
							class="bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-4xl text-transparent sm:text-6xl"
						>
							CarryFit
						</span>
						<span class="ml-0 inline-flex translate-y-2">
							<CarryFitIcon class="h-12 w-12 sm:h-16 sm:w-16" />
						</span>
					</h1>
				</div>

				<div class="mx-auto max-w-2xl rounded-xl bg-white/95 p-8 shadow-xl ring-1 ring-sky-100">
					<div class="mb-6 flex items-start gap-4">
						<div
							class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100"
						>
							<AlertTriangle class="h-6 w-6 text-red-600" />
						</div>
						<div>
							<h2 class="mb-2 text-xl font-semibold text-red-900">
								Oops! Our code took an unexpected vacation 🏖️
							</h2>
							<p class="mb-4 text-red-600">
								{error?.message ||
									"Looks like our pixels got a bit tangled. Don't worry, they're just having a bad hair day!"}
							</p>
						</div>
					</div>

					<div class="rounded-lg border border-sky-100 bg-sky-50 p-6">
						<h3 class="mb-3 font-medium text-sky-900">Want to help catch this bug? Here's how:</h3>
						<ul class="ml-2 space-y-2 text-sm text-sky-800">
							<li>
								• File a bug report on <a
									href="https://github.com/AxelUser/carry-fit"
									class="text-blue-600 hover:text-blue-800 hover:underline"
									target="_blank"
									rel="noopener noreferrer">GitHub</a
								> (our bug collection gallery)
							</li>
							<li>
								• Send a friendly email to <a
									href="mailto:alexey.maltsev.work@gmail.com"
									class="text-blue-600 hover:text-blue-800 hover:underline"
									>alexey.maltsev.work@gmail.com</a
								>
							</li>
							<li>
								• Tweet at me on <a
									href="https://x.com/axel_user"
									class="text-blue-600 hover:text-blue-800 hover:underline"
									target="_blank"
									rel="noopener noreferrer">X (Twitter)</a
								> - I promise I don't byte! 🤓
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	{@render children()}
{/if}
