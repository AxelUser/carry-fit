<script lang="ts">
	import { localStore } from '$lib/storage/local-store.svelte';
	import { changes } from './changes';

	const currentVersion = changes.length > 0 ? changes[0] : null;
	let open = $state(false);

	const lastSeenVersion = localStore<string | null>(
		'lastSeenVersion',
		currentVersion?.version ?? null
	);

	function close() {
		open = false;
		lastSeenVersion.value = currentVersion?.version;
	}

	function checkVersion() {
		if (!currentVersion) return;

		if (!lastSeenVersion.value || isNewerVersion(currentVersion.version, lastSeenVersion.value)) {
			open = true;
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
				<h2 id="dialog-title" class="mb-2 text-xl font-semibold text-sky-900">
					What's new in CarryFit {currentVersion.version}?
				</h2>
				<p id="dialog-description" class="leading-relaxed text-sky-900">
					{#each currentVersion.changes as change}
						<li>{change}</li>
					{/each}
				</p>
			</div>

			<div class="flex justify-end gap-4">
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
