<script setup>
    import { ref , onMounted} from 'vue'
    import File from './File.vue'

    import axios from "axios";


    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyLmlkIjoxfQ.PowlOBKCLMaWykz1KlesbDOuDt-gFZhEyD__-kWFyxk";

    const files = ref([])

    onMounted(async () => {
    const response = await axios.get("http://127.0.0.1:8000/files/", {
        headers: { Authorization: `Bearer ${token}` }
    })
    files.value = response.data
    })

</script>

<template>
  <div class="files-container">
    <div class="files-grid">
        <div class="file-card-wrapper" v-for="file in files" :key="file.id">
            <File :file="file" />
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
}
</style>
