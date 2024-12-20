<script lang="ts">
    import type { UserDimensions } from '$lib/types/airline';

    export let userDimensions: UserDimensions;
</script>

<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
    <div>
        <label for="length" class="block text-sm font-medium text-gray-700 mb-1">Length</label>
        <input
            type="number"
            id="length"
            bind:value={userDimensions.length}
            class="w-full rounded border-gray-300 text-sm"
            min="0"
        />
    </div>
    <div>
        <label for="width" class="block text-sm font-medium text-gray-700 mb-1">Width</label>
        <input
            type="number"
            id="width"
            bind:value={userDimensions.width}
            class="w-full rounded border-gray-300 text-sm"
            min="0"
        />
    </div>
    <div>
        <label for="height" class="block text-sm font-medium text-gray-700 mb-1">Height</label>
        <input
            type="number"
            id="height"
            bind:value={userDimensions.height}
            class="w-full rounded border-gray-300 text-sm"
            min="0"
        />
    </div>
    <div>
        <label for="unit" class="block text-sm font-medium text-gray-700 mb-1">Unit</label>
        <select
            id="unit"
            bind:value={userDimensions.unit}
            class="w-full rounded border-gray-300 text-sm"
        >
            <option value="cm">Centimeters</option>
            <option value="in">Inches</option>
        </select>
    </div>
</div> 