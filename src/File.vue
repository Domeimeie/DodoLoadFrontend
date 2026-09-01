<script setup>
    import { ref, computed } from 'vue'
    import axios from 'axios'
    import Tags from './Tags.vue'

    const props = defineProps({
        file: Object
    })

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyLmlkIjoxfQ.PowlOBKCLMaWykz1KlesbDOuDt-gFZhEyD__-kWFyxk";
    const loading = ref(false)

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
    <div class="card" style="width: 18rem;">
        <img src="..." class="card-img-top" alt="...">
        <div class="card-body" style="padding-bottom: 0.5rem;">
            <h5 class="card-title">{{ file.filename }}</h5>
            <p class="card-text">Size: {{ file.size }}<br>Upload Date: {{ file.uploaded_at }}<br>ID: {{ file.id }}</p>
            <button @click="downloadFile" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Downloading...' : 'Download' }}
            </button>
            <Tags :tags="props.file.tags" />
        </div>
    </div>
</template>