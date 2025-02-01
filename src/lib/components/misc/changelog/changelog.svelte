<script lang="ts">
	import { X } from 'lucide-svelte';
	import { metrics } from '$lib/analytics';
	import { type Change } from '$lib/types';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';

	interface Props {
		changes: Change[];
		lastSeenVersion: Date | null;
		onOpen: (seenVersion: Date, isNewVersion: boolean) => void;
	}

	const { changes, lastSeenVersion, onOpen }: Props = $props();

	const currentVersion = $derived(
		changes.length > 0 ? changes.sort((a, b) => b.date.getTime() - a.date.getTime())[0] : null
	);
	let open = $state(false);
	let hasNewVersion = $derived(
		(currentVersion && lastSeenVersion && isNewerVersion(currentVersion.date, lastSeenVersion)) ??
			false
	);

	function close() {
		open = false;
	}

	function openChangelog() {
		open = true;
		if (currentVersion) {
			metrics.changelogOpened(currentVersion.date, hasNewVersion);
			onOpen(currentVersion.date, $state.snapshot(hasNewVersion));
		}
	}

	function isNewerVersion(current: Date, last: Date): boolean {
		if (!current) return true;
		return current.getTime() > last.getTime();
	}
</script>

{#if currentVersion}
	<div class="fixed bottom-4 z-50 w-full">
		<div class="mx-auto max-w-[1700px] px-4">
			<div class="flex justify-end">
				<Dialog.Root bind:open>
					<Dialog.Trigger>
						{#snippet child()}
							<Button
								size="sm"
								variant={hasNewVersion ? 'default' : 'secondary'}
								onclick={openChangelog}
								class="gap-2"
							>
								<span>Latest Updates</span>
								{#if hasNewVersion}
									<div class="relative mr-1">
										<div class="absolute -right-1.5 -top-1 h-2 w-2">
											<div
												class="absolute h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"
											></div>
											<div class="h-full w-full rounded-full bg-amber-400"></div>
										</div>
									</div>
								{/if}
							</Button>
						{/snippet}
					</Dialog.Trigger>
					<Dialog.Content>
						{@render changelogContent(currentVersion)}
					</Dialog.Content>
				</Dialog.Root>
			</div>
		</div>
	</div>
{/if}

{#snippet changelogContent(version: Change)}
	<Dialog.Header>
		<Dialog.Title>Latest Updates ({version.date.toLocaleDateString()})</Dialog.Title>
	</Dialog.Header>
	<div>
		{#if version.changes.length === 1}
			<p>
				{version.changes[0]}
			</p>
		{:else}
			<ul class="list-inside list-disc space-y-2">
				{#each version.changes as change}
					<li>{change}</li>
				{/each}
			</ul>
		{/if}
	</div>
{/snippet}
