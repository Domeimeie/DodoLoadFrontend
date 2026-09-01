<script setup>
    const props = defineProps({
        tag: Object
    })
</script>

<template>
    {{ tag.name }}
</template>
