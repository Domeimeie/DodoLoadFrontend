<script setup>
    import { ref , onMounted} from 'vue'
    import File from './File.vue'
    import FileUpload from './FileUpload.vue'

    import { api } from './main.js'

    const files = ref([])

    const allTags = ref([])

    const loadFiles = async () => {
        const response = await api.get("/files/")
        files.value = response.data
    }

    const loadTags = async () => {
        const response = await api.get("/tags/")
        allTags.value = response.data
    }

    const onTagCreated = (tag) => {
        if (!allTags.value.some(t => t.id === tag.id)) allTags.value.push(tag)
    }

    onMounted(() => {
        loadFiles()
        loadTags()
    })

</script>

<template>
  <div class="files-container">
    <FileUpload :all-tags="allTags" @uploaded="loadFiles" @tag-created="onTagCreated" />
    <div class="files-grid">
        <div class="file-card-wrapper" v-for="file in files" :key="file.id">
            <File
                :file="file"
                :all-tags="allTags"
                @changed="loadFiles"
                @tag-created="onTagCreated"
            />
        </div>
    </div>
  </div>
</template>

<style scoped>
.files-container {
    padding: 2rem 1rem;
    max-width: 1100px;
    margin: 0 auto;
}

.files-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    padding: 0;
}

@media (max-width: 768px) {
    .files-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
    }
}

@media (max-width: 480px) {
    .files-grid {
        grid-template-columns: 1fr;
    }
}

.file-card-wrapper {
    height: 100%;
    position: relative;
}

/* Cards are siblings, so a card's open tag popover would be painted over by
   the cards after it. Raise the active card above the rest of the grid;
   focus-within covers the popover's search field, hover the mouse. */
.file-card-wrapper:hover,
.file-card-wrapper:focus-within {
    z-index: 10;
}
</style>
