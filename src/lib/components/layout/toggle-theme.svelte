<script lang="ts">
	import { Sun, Moon, Check } from '@lucide/svelte';
	import { userPrefersMode } from 'mode-watcher';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { buttonVariants } from '$ui/button';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}>
		<Sun
			class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
		/>
		<Moon
			class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
		/>
		<span class="sr-only">Toggle theme</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item
			onclick={() => (userPrefersMode.current = 'light')}
			class="flex items-center justify-between"
		>
			<span>Light</span>
			{#if userPrefersMode.current === 'light'}
				<Check class="size-4" />
			{/if}
		</DropdownMenu.Item>
		<DropdownMenu.Item
			onclick={() => (userPrefersMode.current = 'dark')}
			class="flex items-center justify-between"
		>
			<span>Dark</span>
			{#if userPrefersMode.current === 'dark'}
				<Check class="size-4" />
			{/if}
		</DropdownMenu.Item>
		<DropdownMenu.Item
			onclick={() => (userPrefersMode.current = 'system')}
			class="flex items-center justify-between"
		>
			<span>System</span>
			{#if userPrefersMode.current === 'system'}
				<Check class="size-4" />
			{/if}
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
