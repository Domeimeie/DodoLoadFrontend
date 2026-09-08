<script setup>
    import { ref, computed } from 'vue'
    import axios from 'axios'
    import Tags from './Tags.vue'
    import TagPicker from './TagPicker.vue'
    import { api } from './main.js'

    const props = defineProps({
        file: Object,
        // Every tag the user owns, loaded once by the parent.
        allTags: { type: Array, default: () => [] },
    })

    const emit = defineEmits(['changed', 'tag-created'])

    const selectedIds = computed(() => (props.file.tags || []).map(tag => tag.id))

    // Both tag endpoints take "tag_ids" as a form field, one entry per tag.
    const tagIdsForm = (tagId) => {
        const form = new FormData()
        form.append('tag_ids', tagId)
        return form
    }

    const addTag = async (tag) => {
        try {
            await api.post(`/files/${props.file.id}/tags`, tagIdsForm(tag.id))
            emit('changed')
        } catch (error) {
            console.error("Adding tag failed:", error)
        }
    }

    const removeTag = async (tag) => {
        try {
            // A DELETE body goes in the config's data field, not as an argument.
            await api.delete(`/files/${props.file.id}/tags`, { data: tagIdsForm(tag.id) })
            emit('changed')
        } catch (error) {
            console.error("Removing tag failed:", error)
        }
    }

    const createTag = async (name) => {
        try {
            const response = await api.post("/tags/", { name })
            // Lets the parent offer the new tag on every other card too.
            emit('tag-created', response.data)
            await addTag(response.data)
        } catch (error) {
            console.error("Creating tag failed:", error)
        }
    }

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyLmlkIjoxfQ.PowlOBKCLMaWykz1KlesbDOuDt-gFZhEyD__-kWFyxk";
    const loading = ref(false)

    const getFileExtension = () => {
        return props.file.filename.split('.').pop()?.toLowerCase() || ''
    }

    const getFileIcon = () => {
        const ext = getFileExtension()
        const icons = {
            pdf: '📄',
            doc: '📝',
            docx: '📝',
            txt: '📝',
            png: '🖼️',
            jpg: '🖼️',
            jpeg: '🖼️',
            gif: '🖼️',
            zip: '📦',
            rar: '📦',
            xlsx: '📊',
            xls: '📊',
            csv: '📊',
            mp4: '🎬',
            mp3: '🎵'
        }
        return icons[ext] || '📄'
    }

    const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${day}.${month}.${year} ${hours}:${minutes}`
    }

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 MB'
        const mb = bytes / (1024 * 1024)
        return mb.toFixed(2) + ' MB'
    }

    const downloadFile = async () => {
        loading.value = true
        try {
            const response = await axios.get(`http://127.0.0.1:8000/files/${props.file.id}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            })
            const url = window.URL.createObjectURL(response.data)
            const link = document.createElement('a')
            link.href = url
            link.download = props.file.filename
            link.click()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Download failed:", error)
        } finally {
            loading.value = false
        }
    }
</script>

<template>
    <div class="card file-card">
        <div class="file-icon-header">
            <span class="file-icon">{{ getFileIcon() }}</span>
        </div>
        <div class="card-body">
            <h5 class="card-title">{{ file.filename }}</h5>
            <p class="card-text">
                <small>Size: {{ formatFileSize(file.size) }}</small><br>
                <small>{{ formatDate(file.uploaded_at) }}</small><br>
                <small class="content-type">{{ file.content_type }}</small>
            </p>
            <button @click="downloadFile" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Downloading...' : 'Download' }}
            </button>
            <Tags :tags="props.file.tags" removable @remove="removeTag">
                <TagPicker
                    :all-tags="allTags"
                    :selected-ids="selectedIds"
                    @select="addTag"
                    @create="createTag"
                />
            </Tags>
        </div>
    </div>
</template>

<style scoped>
.file-card {
    transition: all 0.2s ease;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
}

.file-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.file-icon-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px 8px 0 0;
}

.file-icon {
    font-size: 2.5rem;
}

.card-body {
    padding: 1rem;
}

.card-title {
    font-size: 0.95rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    word-break: break-word;
}

.card-text {
    font-size: 0.85rem;
    color: #666;
    margin-bottom: 0.75rem;
}

.btn {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    margin-bottom: 0.5rem;
}

small {
    display: block;
    margin: 0;
    line-height: 1.1;
}

.content-type {
    margin-top: 0.3rem;
    padding-top: 0.3rem;
    border-top: 1px solid #eee;
    font-style: italic;
    color: #999;
}
</style>