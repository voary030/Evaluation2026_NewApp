<template>
  <div>
    <h1>Catégories</h1>
    <p>Liste des catégories</p>
    <button @click="loadCategories">Charger les catégories</button>
    <ul v-if="categories.length > 0">
      <li v-for="category in categories" :key="category.id">{{ category.name }}</li>
    </ul>
    <p v-else>Aucune catégorie chargée</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const categories = ref([])

const loadCategories = async () => {
  // Placeholder pour charger les catégories
  categories.value = [
    { id: 1, name: 'Catégorie 1' },
    { id: 2, name: 'Catégorie 2' }
  ]
}
</script>
