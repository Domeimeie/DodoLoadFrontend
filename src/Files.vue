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
  <div class="container mt-4">
    <h1 class="mb-4">List of Files</h1>
    <div class="row g-1">
        <div class="col-md-6 col-lg-4" v-for="file in files" :key="file.id">
            <File :file="file" />
        </div>
    </div>
  </div>
</template>
