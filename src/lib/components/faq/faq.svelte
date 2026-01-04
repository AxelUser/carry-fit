<script lang="ts">
	import * as Card from '$ui/card';
	import * as Accordion from '$ui/accordion';
	import { DEFAULT_PERSONAL_ITEM } from '$lib/allowances';
	import { formatDims } from '$lib/utils/dimensions';
	import { MeasurementSystems } from '$lib/types';

	interface Props {
		airlinesCount: number;
	}

	const { airlinesCount }: Props = $props();
</script>

<div class="mx-auto w-full max-w-4xl">
	<Card.Root>
		<Card.Header>
			<Card.Title>FAQ</Card.Title>
		</Card.Header>
		<Card.Content>
			<Accordion.Root type="single">
				<Accordion.Item value="about">
					<Accordion.Trigger>What is CarryFit?</Accordion.Trigger>
					<Accordion.Content>
						{@render aboutContent()}
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="trust">
					<Accordion.Trigger>Can I trust this?</Accordion.Trigger>
					<Accordion.Content>
						{@render trustContent()}
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="carryon-vs-personal">
					<Accordion.Trigger>Carry-on vs personal item</Accordion.Trigger>
					<Accordion.Content>
						{@render carryonVsPersonalContent()}
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="results-explanation">
					<Accordion.Trigger>How do the results work?</Accordion.Trigger>
					<Accordion.Content>
						{@render resultsExplanationContent()}
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="missing-personal-item-dimensions">
					<Accordion.Trigger>Missing personal item dimensions</Accordion.Trigger>
					<Accordion.Content>
						{@render personalItemsDimensionsContent()}
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="wheels-handles">
					<Accordion.Trigger>Do wheels and handles count?</Accordion.Trigger>
					<Accordion.Content>
						{@render wheelsHandlesContent()}
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="weight-limits">
					<Accordion.Trigger>What about weight limits?</Accordion.Trigger>
					<Accordion.Content>
						{@render weightLimitsContent()}
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="contact">
					<Accordion.Trigger>Found something wrong or missing?</Accordion.Trigger>
					<Accordion.Content>
						{@render contactContent()}
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</Card.Content>
	</Card.Root>
</div>

{#snippet aboutContent()}
	<div class="flex flex-col gap-2">
		<p>
			CarryFit is a quick way to see if your bag is <em>likely</em> to fit an airline's cabin size
			limits. I collected data from all {airlinesCount} airlines so you can easily check how good your
			bag will fit as a carry-on and personal item.
		</p>
		<p>
			I built it because I got tired of bouncing between product pages, airline sites, and random
			YouTube videos to find a sweet spot between comfort and compliance.
		</p>
		<p>You can use it to compare bags before buying, and doing a quick pre-trip sanity check.</p>
	</div>
{/snippet}

{#snippet carryonVsPersonalContent()}
	<div class="flex flex-col gap-2">
		<p><strong>Carry-on</strong> is the bigger bag that usually goes in the overhead bin.</p>
		<p>
			<strong>Personal item</strong> is the smaller bag that goes under the seat (backpack, tote, laptop
			bag, small duffel).
		</p>
		<p>Airlines can be surprisingly strict about personal items, so it's worth checking both.</p>
	</div>
{/snippet}

{#snippet resultsExplanationContent()}
	<div class="flex flex-col gap-2">
		<p>
			When an airline has clear limits, CarryFit compares your bag to all cabin luggage allowances,
			providing a percentage of compliance as carry-on and personal item, as well as "fitting"
			details in the table below.
		</p>
		<p>
			However, some airlines have different rules by fare class, route, or aircraft, so the "right"
			limit can change. Think of the table as a helpful starting point, not a promise you'll never
			get stopped at the gate.
		</p>
	</div>
{/snippet}

{#snippet personalItemsDimensionsContent()}
	<div class="flex flex-col gap-2">
		<p>
			Personal item space varies a lot, because under-seat room depends on the plane and even your
			seat.
		</p>
		<p>
			Some airlines don't publish personal item dimensions at all (it's just "must fit under the
			seat").
		</p>
		<p>
			When there are no published numbers, CarryFit uses a conservative fallback so it doesn't
			over-promise:
		</p>
		<ul class="list-inside list-disc text-sm">
			<li>{formatDims(DEFAULT_PERSONAL_ITEM.centimeters, MeasurementSystems.Metric)}</li>
			<li>{formatDims(DEFAULT_PERSONAL_ITEM.inches, MeasurementSystems.Imperial)}</li>
		</ul>
	</div>
{/snippet}

{#snippet wheelsHandlesContent()}
	<div class="flex flex-col gap-2">
		<p>Usually, yes.</p>
		<p>
			If an airline measures your bag, they're typically looking at the <em>outermost</em> size.
		</p>
		<p>
			Measure including wheels, handles, and anything that sticks out, so you don't get surprised at
			the gate.
		</p>
	</div>
{/snippet}

{#snippet weightLimitsContent()}
	<div class="flex flex-col gap-2">
		<p>Some airlines do care about cabin-bag weight (and some barely check).</p>
		<p>CarryFit shows weight limits when the airline publishes them.</p>
		<p>
			If weight is tight for your airline, double-check the official policy page before you fly.
		</p>
	</div>
{/snippet}

{#snippet trustContent()}
	<div class="flex flex-col gap-2">
		<p>I use CarryFit myself, but I still treat it as guidance.</p>
		<p>
			Even though I do my best to update the data regularly, airline policies change, and
			enforcement depends on the airport staff and how full the flight is.
		</p>
		<p>
			If you're searching for most actual cabin luggage allowances, you might want to check the
			airline's official policy I provide for each airline. Always confirm your airline's current
			rules (and your fare class) before going to the airport!
		</p>
	</div>
{/snippet}

{#snippet contactContent()}
	<div class="flex flex-col gap-2">
		<p>
			If you spot a bug, a wrong allowance, or an airline that should be added, please open an issue
			on <a
				href="https://github.com/AxelUser/carry-fit/issues"
				class="text-primary hover:underline"
				target="_blank"
				rel="noopener noreferrer">GitHub</a
			>.
		</p>
		<p>
			You can also reach out to me via email at <a
				href="mailto:aleksey@maltsev.space"
				class="text-primary hover:underline"
				target="_blank"
				rel="noopener noreferrer">aleksey@maltsev.space</a
			>.
		</p>
		<p>Even a quick note like "this airline page says X" is super helpful.</p>
	</div>
{/snippet}
