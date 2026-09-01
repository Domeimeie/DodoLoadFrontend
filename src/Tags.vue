<script setup>
    import Tag from './Tag.vue'
    defineProps({
        tags: Array
    })
</script>

<template>
    <div class="mt-2 mb-0" v-if="tags && tags.length > 0">
        <div class="d-flex flex-wrap gap-2">
            <span v-for="tag in tags" :key="tag.id" class="badge bg-warning text-dark" style="word-wrap: break-word;">
                <Tag :tag="tag" />
            </span>
        </div>
    </div>
</template>