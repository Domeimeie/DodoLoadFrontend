<script setup>
    import { ref, computed } from 'vue'
    import Tags from './Tags.vue'
    import TagPicker from './TagPicker.vue'
    import { api } from './main.js'

    defineProps({
        // Every tag the user owns, loaded once by the parent.
        allTags: { type: Array, default: () => [] },
    })

    const emit = defineEmits(['uploaded', 'tag-created'])

    const fileInput = ref(null)
    const selectedFile = ref(null)
    const selectedTags = ref([])
    const uploading = ref(false)
    const progress = ref(0)
    const error = ref('')
    const success = ref('')

    const selectedIds = computed(() => selectedTags.value.map(tag => tag.id))

    const onFileChange = (event) => {
        selectedFile.value = event.target.files[0] || null
        error.value = ''
        success.value = ''
    }

    const addTag = (tag) => {
        if (!selectedIds.value.includes(tag.id)) selectedTags.value.push(tag)
    }

    const removeTag = (tag) => {
        selectedTags.value = selectedTags.value.filter(t => t.id !== tag.id)
    }

    const createTag = async (name) => {
        const response = await api.post("/tags/", { name })
        selectedTags.value.push(response.data)
        emit('tag-created', response.data)
    }

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 MB'
        const mb = bytes / (1024 * 1024)
        return mb.toFixed(2) + ' MB'
    }

    const reset = () => {
        selectedFile.value = null
        selectedTags.value = []
        progress.value = 0
        // The input keeps its value after an upload, so clear it to allow
        // picking the same file again.
        if (fileInput.value) fileInput.value.value = ''
    }

    const upload = async () => {
        if (!selectedFile.value) return

        error.value = ''
        success.value = ''
        uploading.value = true
        progress.value = 0

        const filename = selectedFile.value.name

        const form = new FormData()
        form.append('upload', selectedFile.value)
        selectedIds.value.forEach(tagId => form.append('tag_ids', tagId))

        try {
            await api.post("/files/", form, {
                onUploadProgress: (event) => {
                    if (event.total) {
                        progress.value = Math.round((event.loaded * 100) / event.total)
                    }
                }
            })
            success.value = `${filename} uploaded.`
            reset()
            emit('uploaded')
        } catch (e) {
            if (e.response?.status === 401) {
                error.value = 'Your session expired. Please sign in again.'
            } else if (e.response?.status === 404) {
                error.value = 'One of the selected tags no longer exists.'
            } else {
                error.value = 'Upload failed. Please try again.'
            }
        } finally {
            uploading.value = false
        }
    }
</script>

<template>
    <div class="upload-card">
        <h2 class="upload-title">Upload a file</h2>

        <div v-if="error" class="alert alert-danger py-2" role="alert">{{ error }}</div>
        <div v-if="success" class="alert alert-success py-2" role="alert">{{ success }}</div>

        <input
            ref="fileInput"
            type="file"
            id="fileUploadInput"
            class="form-control mb-3"
            @change="onFileChange"
        />

        <p v-if="selectedFile" class="selected-file">
            {{ selectedFile.name }} — {{ formatFileSize(selectedFile.size) }}
        </p>

        <div class="tag-section">
            <span class="tag-label">Tags</span>
            <Tags :tags="selectedTags" removable @remove="removeTag">
                <TagPicker
                    :all-tags="allTags"
                    :selected-ids="selectedIds"
                    @select="addTag"
                    @create="createTag"
                />
            </Tags>
        </div>

        <div v-if="uploading" class="progress mb-3">
            <div class="progress-bar" :style="{ width: progress + '%' }">{{ progress }}%</div>
        </div>

        <button
            class="btn-upload"
            :disabled="!selectedFile || uploading"
            @click="upload"
        >
            {{ uploading ? 'Uploading…' : 'Upload' }}
        </button>
    </div>
</template>

<style scoped>
.upload-card {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    position: relative;
}

/* The file grid comes after this card, so its cards would paint over an open
   tag popover unless the card is raised while in use. */
.upload-card:hover,
.upload-card:focus-within {
    z-index: 10;
}

.upload-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 1rem 0;
}

/* Matches the purple the navbar and card headers already use. */
.form-control:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.2);
}

.selected-file {
    font-size: 0.85rem;
    color: #666;
    margin: 0 0 1rem 0;
    word-break: break-word;
}

.tag-section {
    margin-bottom: 1rem;
}

.tag-label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: #555;
    margin-bottom: 0.25rem;
}

.progress {
    height: 1.25rem;
}

.progress-bar {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-size: 0.75rem;
    transition: width 0.2s ease;
}

.btn-upload {
    padding: 0.6rem 1.5rem;
    border: none;
    border-radius: 6px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.btn-upload:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-1px);
}

.btn-upload:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>
