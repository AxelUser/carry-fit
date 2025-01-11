<script lang="ts">
	import { localStore } from '$lib/storage/local-store.svelte';
	import { changes } from './changes';
	import { X } from 'lucide-svelte';

	const currentVersion = changes.length > 0 ? changes[0] : null;
	let open = $state(false);
	let hasNewVersion = $state(false);

	const lastSeenVersion = localStore<string | null>('lastSeenVersion', null);

	function close() {
		open = false;
		lastSeenVersion.value = currentVersion?.version;
		hasNewVersion = false;
	}

	function checkVersion() {
		try {
			if (!currentVersion) return;

			if (!lastSeenVersion.value || isNewerVersion(currentVersion.version, lastSeenVersion.value)) {
				hasNewVersion = true;
			}
		} catch (e) {
			console.error(e);
		}
	}

	function isNewerVersion(current: string, last: string): boolean {
		if (!current) return true;

		const currentParts = current.split('.').map(Number);
		const lastParts = last.split('.').map(Number);

		for (let i = 0; i < 3; i++) {
			if (currentParts[i] > lastParts[i]) return true;
			if (currentParts[i] < lastParts[i]) return false;
		}
		return false;
	}

	checkVersion();
</script>

{#if currentVersion}
	<div class="fixed bottom-4 right-4 z-50">
		<button
			onclick={() => (open = true)}
			class="flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:from-sky-700 hover:to-blue-800"
		>
			<span>What's New in {currentVersion.version}</span>
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
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div
			class="mx-4 w-full max-w-md rounded-xl bg-white/95 p-6 shadow-xl ring-1 ring-sky-100"
			role="alertdialog"
			aria-modal="true"
			aria-labelledby="dialog-title"
			aria-describedby="dialog-description"
		>
			<div class="mb-6">
				<div class="mb-4 flex items-start justify-between">
					<h2 id="dialog-title" class="text-xl font-semibold text-sky-900">
						What's new in CarryFit {currentVersion.version}?
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
