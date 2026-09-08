<script setup>
    import Tag from './Tag.vue'

    defineProps({
        tags: Array,
        removable: Boolean,
    })

    const emit = defineEmits(['remove'])
</script>

<template>
    <div class="tag-row">
        <span v-for="tag in tags" :key="tag.id" class="tag-chip" :class="{ removable }">
            <Tag :tag="tag" />
            <button
                v-if="removable"
                type="button"
                class="tag-remove"
                title="Remove tag"
                :aria-label="`Remove tag ${tag.name}`"
                @click="emit('remove', tag)"
            >
                −
            </button>
        </span>

        <!-- Where the parent drops a TagPicker, so the + sits inline with the chips. -->
        <slot />
    </div>
</template>

<style scoped>
.tag-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.tag-chip {
    position: relative;
    display: inline-flex;
    align-items: center;
    border: 1px solid #e0c060;
    border-radius: 999px;
    background: #fff8e1;
    color: #333;
    font-size: 0.8rem;
    padding: 0.2rem 0.65rem;
    word-break: break-word;
}

/* The minus is absolutely positioned into permanently reserved padding, so
   revealing it never changes the chip's size. Growing the chip on hover would
   rewrap the row, move the chip out from under the cursor, and flicker. */
.tag-chip.removable {
    padding-right: 1.4rem;
}

.tag-remove {
    position: absolute;
    right: 0.3rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    padding: 0;
    border: none;
    background: transparent;
    color: #a08020;
    font-size: 0.9rem;
    line-height: 1;
    opacity: 0;
    /* Not clickable while invisible, so the reserved area can't be hit. */
    pointer-events: none;
    cursor: pointer;
    transition: opacity 0.15s ease;
}

.tag-chip:hover .tag-remove,
.tag-remove:focus-visible {
    opacity: 1;
    pointer-events: auto;
}

.tag-remove:hover {
    color: #c0392b;
}
</style>
