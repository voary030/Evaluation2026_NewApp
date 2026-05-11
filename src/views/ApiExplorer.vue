<template>
  <div>
    <h1>Explorateur API</h1>
    <p>Explorez les points d'accès de l'API</p>
    <input v-model="searchQuery" type="text" placeholder="Rechercher un endpoint..." />
    <button @click="searchEndpoints">Rechercher</button>
    <ul v-if="endpoints.length > 0">
      <li v-for="(endpoint, index) in endpoints" :key="index">
        {{ endpoint }}
      </li>
    </ul>
    <p v-else>Aucun endpoint trouvé</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const endpoints = ref([])

const searchEndpoints = () => {
  if (searchQuery.value.trim()) {
    endpoints.value = [
      '/api/products',
      '/api/categories',
      '/api/customers'
    ]
  }
}
</script>
