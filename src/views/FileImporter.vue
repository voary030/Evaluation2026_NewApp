<template>
  <div class="importer-container">
    <div class="header-box">
      <h1>Importer les Données</h1>
    </div>

    <div class="import-card">
      <div class="file-group">
        <label>📄 Fichier 1: Produits (CSV)</label>
        <div class="input-wrapper">
          <input type="file" accept=".csv" @change="(e) => files.produits = e.target.files[0]" />
        </div>
      </div>

      <div class="file-group">
        <label>📄 Fichier 2: Variantes (CSV)</label>
        <div class="input-wrapper">
          <input type="file" accept=".csv" @change="(e) => files.variantes = e.target.files[0]" />
        </div>
      </div>

      <div class="file-group">
        <label>👥 Fichier 3: Clients & Commandes (CSV)</label>
        <div class="input-wrapper">
          <input type="file" accept=".csv" @change="(e) => files.clients = e.target.files[0]" />
        </div>
      </div>

      <div class="file-group">
        <label>🖼️ Fichier 4: Images (ZIP)</label>
        <div class="input-wrapper">
          <input type="file" accept=".zip" @change="(e) => files.images = e.target.files[0]" />
        </div>
      </div>

      <div class="actions">
        <button class="btn btn-primary" @click="handleImport" :disabled="loading">
          {{ loading ? 'Importation en cours...' : '📤 Importer' }}
        </button>
      </div>
    </div>

    <div v-if="loading || message" class="progress-section">
      <p v-if="loading">État: [████████░░] 80%</p>
      <p>Message: {{ message || 'Création des produits...' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const files = reactive({
  produits: null,
  variantes: null,
  clients: null,
  images: null
})

const loading = ref(false)
const message = ref('')

const handleImport = async () => {
  loading.value = true
  message.value = 'Création des produits...'

  setTimeout(() => {
    message.value = 'Succès ✅'
    loading.value = false
  }, 2000)
}
</script>

<style scoped>
.importer-container {
  max-width: 600px;
  margin: 40px auto;
  font-family: Arial, sans-serif;
}

.header-box {
  border: 1px solid #ccc;
  border-bottom: none;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px 4px 0 0;
}

h1 {
  margin: 0;
  font-size: 20px;
  text-align: center;
}

.import-card {
  border: 1px solid #ccc;
  border-radius: 0 0 4px 4px;
  padding: 20px;
  background-color: #fff;
}

.file-group {
  margin-bottom: 20px;
}

.file-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.input-wrapper {
  padding: 8px;
  border: 1px dashed #aaa;
  background-color: #fafafa;
}

.actions {
  text-align: center;
  margin-top: 30px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.btn-primary {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  color: #333;
}

.btn-primary:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.progress-section {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  background-color: #fafafa;
}

.progress-section p {
  margin: 5px 0;
}
</style>
