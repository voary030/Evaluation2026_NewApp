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

    <!-- Section Progression -->
    <div v-if="loading || message || progress.errors.length > 0" class="progress-section">
      <!-- Barre de progression -->
      <div v-if="loading && progress.total > 0" class="progress-bar">
        <div class="progress-fill" :style="{ width: progress.percentage + '%' }"></div>
        <span class="progress-text">{{ progress.percentage }}%</span>
      </div>

      <!-- Message principal -->
      <p v-if="message" class="message">{{ message }}</p>

      <!-- Afficher les erreurs si présentes -->
      <div v-if="progress.errors.length > 0" class="errors-section">
        <h3>⚠️ Erreurs rencontrées ({{ progress.errors.length }})</h3>
        <ul>
          <li v-for="(error, i) in progress.errors.slice(0, 5)" :key="i" class="error-item">
            <strong>Ligne {{ error.row }}</strong> ({{ error.reference }})
            — {{ error.message }}
          </li>
          <li v-if="progress.errors.length > 5" class="info">
            ... et {{ progress.errors.length - 5 }} autres erreurs
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { FileImporterService } from '@/services/FileImporterService'
import { ProductImportService } from '@/services/imports/ProductImportService'

const files = reactive({
  produits: null,
  variantes: null,
  clients: null,
  images: null
})

const loading = ref(false)
const message = ref('')
const progress = reactive({
  current: 0,
  total: 0,
  percentage: 0,
  errors: []
})

/**
 * Lance l'import des fichiers
 * Pour l'instant: seulement le CSV des produits
 */
const handleImport = async () => {
  try {
    // Vérifier que le fichier produits est sélectionné
    if (!files.produits) {
      message.value = '❌ Veuillez sélectionner le fichier Produits'
      return
    }

    loading.value = true
    progress.errors = []
    
    // ===== ÉTAPE 1: IMPORTER LES PRODUITS =====
    await importProducts()

    // À l'avenir: étapes 2, 3, 4, 5...
    message.value = '✅ Import terminé avec succès!'

  } catch (error) {
    message.value = `❌ Erreur: ${error.message}`
    console.error('Erreur import:', error)
  } finally {
    loading.value = false
  }
}

/**
 * Étape 1: Import des produits
 */
const importProducts = async () => {
  message.value = '📦 Lecture du fichier produits...'

  // Parser le CSV
  const csvData = await FileImporterService.parseFile(files.produits)
  
  message.value = `📦 Importation de ${csvData.length} produits...`
  progress.total = csvData.length
  progress.current = 0

  // Lancer l'import via le service
  const results = await ProductImportService.importProducts(
    csvData,
    (current, total, msg) => {
      progress.current = current
      progress.total = total
      progress.percentage = Math.round((current / total) * 100)
      message.value = `${msg} (${progress.percentage}%)`
    }
  )

  // Compiler les résultats
  if (results.errors.length > 0) {
    progress.errors = results.errors
    message.value = `⚠️ ${results.success} produits créés, ${results.failed} erreurs`
  } else {
    message.value = `✅ ${results.success} produits créés avec succès`
  }
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
  border-radius: 4px;
}

.progress-bar {
  position: relative;
  height: 24px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #45a049);
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 12px;
  z-index: 1;
}

.progress-section p {
  margin: 5px 0;
  font-size: 14px;
}

.message {
  padding: 10px;
  background-color: #fff;
  border-left: 4px solid #4caf50;
}

.errors-section {
  margin-top: 15px;
  padding: 10px;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
}

.errors-section h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #856404;
}

.errors-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.error-item {
  padding: 8px;
  background-color: #fff;
  border-left: 3px solid #dc3545;
  margin-bottom: 5px;
  font-size: 13px;
  color: #333;
}

.errors-section .info {
  padding: 8px;
  background-color: #f8f9fa;
  border-left: 3px solid #6c757d;
  color: #666;
  font-style: italic;
}
</style>
