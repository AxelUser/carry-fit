<script lang="ts">
	import { localStore } from '$lib/storage/local-store.svelte';
	import { changes } from './changes';
	import { X } from 'lucide-svelte';
	import { analyticsService } from '$lib/analytics';

	const currentVersion = changes.length > 0 ? changes[0] : null;
	let open = $state(false);
	let hasNewVersion = $state(false);

	const lastSeenVersion = localStore<Date | null>('lastSeenVersion', null);

	function close() {
		open = false;
		lastSeenVersion.value = currentVersion?.date;
		hasNewVersion = false;
	}

	function openChangelog() {
		open = true;
		if (currentVersion) {
			analyticsService.trackEventDebounced(
				'changelog_opened',
				{
					version_date: currentVersion.date.toISOString(),
					is_new_version: hasNewVersion
				},
				3000
			);
		}
	}

	function checkVersion() {
		try {
			if (!currentVersion) return;

			if (!lastSeenVersion.value || isNewerVersion(currentVersion.date, lastSeenVersion.value)) {
				hasNewVersion = true;
				analyticsService.trackEventDebounced(
					'new_version_available',
					{
						version_date: currentVersion.date.toISOString()
					},
					3000
				);
			}
		} catch (e) {
			console.error(e);
			lastSeenVersion.value = null;
			hasNewVersion = true;
		}
	}

	function isNewerVersion(current: Date, last: Date): boolean {
		if (!current) return true;
		return current.getTime() > last.getTime();
	}

	checkVersion();

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
			document.getElementById('app')?.setAttribute('inert', '');
		} else {
			document.body.style.overflow = '';
			document.getElementById('app')?.removeAttribute('inert');
		}
	});
</script>

{#if currentVersion}
	<div class="fixed bottom-4 right-4 z-50">
		<button
			onclick={openChangelog}
			class="flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:from-sky-700 hover:to-blue-800"
		>
			<span>Latest Updates</span>
			{#if hasNewVersion}
				<div class="relative">
					<div class="absolute -right-1.5 -top-1 h-2 w-2">
						<div
							class="absolute h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"
						></div>
						<div class="h-full w-full rounded-full bg-amber-400"></div>
					</div>
				</div>
			{/if}
		</button>
	</div>
{/if}

{#if open && currentVersion}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		onclick={({ target, currentTarget }) => target === currentTarget && close()}
		role="presentation"
	>
		<div
			class="mx-4 w-full max-w-md rounded-xl bg-white/95 p-6 shadow-xl ring-1 ring-sky-100"
			role="dialog"
			aria-modal="true"
			aria-labelledby="dialog-title"
			aria-describedby="dialog-description"
		>
			<div class="mb-6">
				<div class="mb-4 flex items-start justify-between">
					<h2 id="dialog-title" class="text-xl font-semibold text-sky-900">
						Latest Updates ({currentVersion.date.toLocaleDateString()})
					</h2>
					<button
						onclick={() => (open = false)}
						class="rounded-lg p-1 text-sky-600 hover:bg-sky-100"
						aria-label="Close dialog"
					>
						<X class="h-5 w-5" />
					</button>
				</div>
				<ul id="dialog-description" class="list-inside list-disc space-y-2 text-sky-900">
					{#each currentVersion.changes as change}
						<li>{change}</li>
					{/each}
				</ul>
			</div>

			<div class="flex justify-end">
				<button
					class="rounded-lg bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-sky-700 hover:to-blue-800"
					onclick={close}
				>
					Got it!
				</button>
			</div>
		</div>
	</div>
{/if}
