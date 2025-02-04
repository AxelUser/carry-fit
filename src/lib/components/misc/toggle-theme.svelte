<script lang="ts">
	import { Sun, Moon, Check } from 'lucide-svelte';
	import { userPrefersMode } from 'mode-watcher';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { buttonVariants } from '$lib/components/ui/button';

	let currentTheme: 'light' | 'dark' | 'system' = $state('system');

	userPrefersMode.subscribe((theme) => {
		currentTheme = theme;
	});
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}>
		<Sun
			class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
		/>
		<Moon
			class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
		/>
		<span class="sr-only">Toggle theme</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item
			onclick={() => userPrefersMode.set('light')}
			class="flex items-center justify-between"
		>
			<span>Light</span>
			{#if currentTheme === 'light'}
				<Check class="h-4 w-4" />
			{/if}
		</DropdownMenu.Item>
		<DropdownMenu.Item
			onclick={() => userPrefersMode.set('dark')}
			class="flex items-center justify-between"
		>
			<span>Dark</span>
			{#if currentTheme === 'dark'}
				<Check class="h-4 w-4" />
			{/if}
		</DropdownMenu.Item>
		<DropdownMenu.Item
			onclick={() => userPrefersMode.set('system')}
			class="flex items-center justify-between"
		>
			<span>System</span>
			{#if currentTheme === 'system'}
				<Check class="h-4 w-4" />
			{/if}
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
