<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { links } from '$lib/utils/navigation';
	import * as Avatar from '$lib/components/ui/avatar';
	import { BuyMeCoffeeButton, GithubStarButton } from '$lib/components/social';

	interface Contributor {
		login: string;
		avatar_url: string;
		html_url: string;
		contributions: number;
	}

	let contributors = $state<Contributor[]>([]);
	let isLoading = $state(true);

	const fetchContributors = async () => {
		try {
			const response = await fetch('https://api.github.com/repos/AxelUser/carry-fit/contributors');
			if (!response.ok) throw new Error('Failed to fetch contributors');
			return await response.json();
		} catch (error) {
			console.error('Error fetching contributors:', error);
			return [];
		}
	};

	$effect(() => {
		fetchContributors().then((data) => {
			contributors = data;
			isLoading = false;
		});
	});
</script>

<footer class="border-t bg-muted/50">
	<div class="mx-auto max-w-6xl px-6 py-12 sm:px-8 md:px-10">
		<div class="grid items-start justify-items-start gap-10 sm:grid-cols-2 lg:grid-cols-4">
			<div class="flex flex-col gap-3">
				<h3 class="text-xs font-semibold uppercase tracking-wide text-foreground/70">About</h3>
				<p class="text-sm leading-relaxed text-muted-foreground">
					CarryFit helps you validate cabin bag dimensions across airlines.
				</p>
				<p class="text-sm text-muted-foreground">
					Created by
					<a
						href="https://maltsev.space"
						class="text-primary hover:underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						Aleksey Maltsev
					</a>
				</p>
			</div>

			<div class="flex flex-col gap-3">
				<h3 class="text-xs font-semibold uppercase tracking-wide text-foreground/70">Support</h3>
				<div class="flex flex-col gap-2 text-sm text-muted-foreground">
					<p>If this tool helps you, consider supporting it:</p>
					<div class="flex flex-wrap items-center gap-2">
						<GithubStarButton />
						<BuyMeCoffeeButton />
					</div>
				</div>
			</div>

			<div class="flex flex-col gap-3">
				<h3 class="text-xs font-semibold uppercase tracking-wide text-foreground/70">
					Contributors
				</h3>
				<div class="flex flex-wrap gap-1.5">
					{#if isLoading}
						{#each Array(5) as _}
							<div
								class="h-10 w-10 animate-pulse rounded-full bg-gradient-to-r from-muted to-muted/50"
							></div>
						{/each}
					{:else}
						{#each [...contributors].sort((a, b) => b.contributions - a.contributions) as contributor (contributor.login)}
							<a
								href={contributor.html_url}
								class="group transition-transform hover:scale-110"
								target="_blank"
								rel="noopener noreferrer"
								title={`${contributor.login} (${contributor.contributions} contributions)`}
							>
								<Avatar.Root>
									<Avatar.Image src={contributor.avatar_url} alt={contributor.login} />
									<Avatar.Fallback>{contributor.login.slice(0, 2).toUpperCase()}</Avatar.Fallback>
								</Avatar.Root>
							</a>
						{/each}
					{/if}
				</div>
			</div>

			<div class="flex flex-col gap-3">
				<h3 class="text-xs font-semibold uppercase tracking-wide text-foreground/70">Legal</h3>
				<div class="flex flex-col gap-2">
					<Button href={links.legal.privacy} variant="link" size="sm" class="justify-start p-0">
						Privacy Policy
					</Button>
					<Button href={links.legal.terms} variant="link" size="sm" class="justify-start p-0">
						Terms of Use
					</Button>
				</div>
			</div>
		</div>
	</div>
</footer>
