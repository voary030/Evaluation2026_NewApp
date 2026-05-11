<template>
  <div class="reset-container">
    <div class="reset-header">
      <h1>⚠️ Réinitialisation des Données</h1>
      <p class="subtitle">Gestion complète du module produit</p>
    </div>

    <!-- Alertes -->
    <div v-if="error" class="alert alert-error">
      <strong>Erreur:</strong> {{ error }}
    </div>

    <div v-if="success" class="alert alert-success">
      <strong>Succès:</strong> {{ success }}
    </div>

    <!-- États de l'interface -->
    <div v-if="!isResetting && !hasCompleted" class="reset-options">
      <div class="info-box">
        <h3>📋 Informations avant réinitialisation:</h3>
        <ul>
          <li>{{ totalProducts }} produit(s) actuellement en base</li>
          <li>Suppression via API WebService PrestaShop</li>
          <li>Toutes les tables dépendantes seront nettoyées (stocks, images, etc.)</li>
          <li>⚠️ <strong>Cette action est IRRÉVERSIBLE</strong></li>
        </ul>
      </div>

      <div class="reset-buttons">
        <button @click="performReset" class="btn btn-danger" :disabled="totalProducts === 0">
          🗑️ Supprimer tous les produits
        </button>
      </div>
    </div>

    <!-- Progression -->
    <div v-if="isResetting" class="reset-progress">
      <div class="progress-header">
        <h3>⏳ Suppression en cours...</h3>
        <div class="progress-message">{{ progressMessage }}</div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
      </div>

      <div class="progress-details">
        <p>Veuillez ne pas fermer cette page...</p>
      </div>
    </div>

    <!-- Rapport -->
    <div v-if="hasCompleted && resetReport" class="reset-report">
      <div :class="['report-header', resetReport.success ? 'success' : 'error']">
        <h3>{{ resetReport.success ? '✅ Suppression Réussie' : '❌ Erreur' }}</h3>
        <p>{{ resetReport.message }}</p>
      </div>

      <div class="report-details">
        <div v-for="(step, index) in resetReport.steps" :key="index" class="report-step">
          <h4>{{ step.name }}</h4>
          <div class="step-info">
            <p v-if="step.deleted !== undefined">✅ Supprimé: {{ step.deleted }} produit(s)</p>
            <p v-if="step.failed">❌ Erreurs: {{ step.failed }} produit(s)</p>
            <p v-if="step.errors && step.errors.length > 0" class="error-details">
              <strong>Détails des erreurs:</strong>
              <ul>
                <li v-for="(err, idx) in step.errors.slice(0, 5)" :key="idx">
                  {{ err.productId ? `Produit ${err.productId}` : 'Erreur' }}: {{ err.error }}
                </li>
                <li v-if="step.errors.length > 5">... et {{ step.errors.length - 5 }} autre(s)</li>
              </ul>
            </p>
          </div>
        </div>
      </div>

      <div class="reset-buttons">
        <button @click="resetInterface" class="btn btn-primary">
          🔄 Nouvelle suppression
        </button>
        <router-link to="/produits" class="btn btn-secondary">
          📦 Retour aux produits
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getProducts } from '@/api/products'
import { performCompleteReset } from '@/api/reset'

const isResetting = ref(false)
const hasCompleted = ref(false)
const progressMessage = ref('')
const progressPercent = ref(0)
const error = ref(null)
const success = ref(null)
const resetReport = ref(null)
const totalProducts = ref(0)

// Charger le nombre de produits au montage
onMounted(async () => {
  try {
    console.log('[DataReset.onMounted] Chargement du nombre de produits')
    
    const response = await getProducts('[id,name]')
    console.log('[DataReset.onMounted] Réponse reçue (premiers 300 chars):', response.substring(0, 300))
    
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(response, 'text/xml')
    
    // Vérifier les erreurs du parseur
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('Erreur parsing XML')
    }
    
    const products = xmlDoc.querySelectorAll('product')
    console.log('[DataReset.onMounted] Nombre de produits trouvés:', products.length)
    
    totalProducts.value = products.length
    console.log('[DataReset.onMounted] totalProducts mis à jour:', totalProducts.value)
  } catch (err) {
    console.error('[DataReset.onMounted] Erreur chargement nombre produits:', err)
    totalProducts.value = 0
  }
})

/**
 * Demande confirmation et lance suppression
 */
const performReset = async () => {
  const confirmMsg = `⚠️ ATTENTION - SUPPRESSION COMPLÈTE\n\n` +
    `Cette action va supprimer les ${totalProducts.value} produit(s).\n` +
    `Toutes les tables dépendantes seront nettoyées.\n\n` +
    `Cette action est IRRÉVERSIBLE!\n\n` +
    `Êtes-vous absolument sûr?`

  if (!confirm(confirmMsg)) {
    return
  }

  isResetting.value = true
  progressMessage.value = '🗑️ Suppression des produits...'
  progressPercent.value = 0
  error.value = null
  success.value = null

  try {
    const result = await performCompleteReset((step, message) => {
      progressMessage.value = message
      progressPercent.value = Math.min((step / 2) * 100, 95)
    })

    resetReport.value = result
    hasCompleted.value = true

    if (result.success) {
      success.value = '✅ Suppression complète terminée'
      totalProducts.value = 0
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = `Erreur: ${err.message}`
    console.error('Erreur suppression:', err)
  } finally {
    isResetting.value = false
    progressPercent.value = 100
  }
}

/**
 * Réinitialise l'interface pour une nouvelle opération
 */
const resetInterface = () => {
  hasCompleted.value = false
  resetReport.value = null
  progressPercent.value = 0
  progressMessage.value = ''
  error.value = null
  success.value = null
}
</script>

<style scoped>
.reset-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.reset-header {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.reset-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.subtitle {
  margin: 0.5rem 0 0;
  opacity: 0.9;
}

/* Alertes */
.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid;
}

.alert-error {
  background: #fff5f5;
  color: #c62828;
  border-left-color: #f44336;
}

.alert-success {
  background: #f1f8e9;
  color: #33a000;
  border-left-color: #4caf50;
}

/* Info box */
.info-box {
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.info-box h3 {
  margin-top: 0;
  color: #1976d2;
}

.info-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-box li {
  padding: 0.5rem 0;
  color: #555;
}

.info-box li strong {
  color: #c62828;
}

/* Boutons */
.reset-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-warning {
  background: #ff9800;
  color: white;
}

.btn-warning:hover:not(:disabled) {
  background: #f57c00;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

.btn-danger {
  background: #f44336;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #d32f2f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

.btn-primary {
  background: #2196f3;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1976d2;
}

.btn-secondary {
  background: #757575;
  color: white;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-secondary:hover:not(:disabled) {
  background: #616161;
}

/* Progression */
.reset-progress {
  text-align: center;
  padding: 2rem;
}

.progress-header h3 {
  margin: 0 0 0.5rem;
  color: #1976d2;
}

.progress-message {
  font-size: 0.95rem;
  color: #666;
  margin: 1rem 0;
}

.progress-bar-container {
  width: 100%;
  height: 30px;
  background: #e0e0e0;
  border-radius: 15px;
  overflow: hidden;
  margin: 1.5rem 0;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4caf50 0%, #81c784 100%);
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
}

.progress-details {
  color: #999;
  font-size: 0.9rem;
  margin-top: 1rem;
}

/* Rapport */
.reset-report {
  margin-top: 2rem;
}

.report-header {
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  color: white;
}

.report-header.success {
  background: linear-gradient(135deg, #4caf50 0%, #81c784 100%);
}

.report-header.error {
  background: linear-gradient(135deg, #f44336 0%, #ef5350 100%);
}

.report-header h3 {
  margin: 0 0 0.5rem;
  font-size: 1.3rem;
}

.report-header p {
  margin: 0;
  opacity: 0.9;
}

.report-details {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.report-step {
  margin-bottom: 1.5rem;
}

.report-step h4 {
  margin: 0 0 0.5rem;
  color: #333;
}

.step-info {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  border-left: 3px solid #2196f3;
}

.step-info p {
  margin: 0.5rem 0;
  color: #666;
}

.error-details ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
  color: #c62828;
  font-size: 0.9rem;
}

.error-details li {
  margin: 0.25rem 0;
}
</style>
