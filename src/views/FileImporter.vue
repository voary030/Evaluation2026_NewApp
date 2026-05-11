<template>
  <div class="importer-container">
    <h1>📂 Importer des Données</h1>
    <p class="subtitle">Format accepté: CSV, JSON, XML</p>

    <!-- Messages d'erreur/succès -->
    <div v-if="error" class="alert alert-error">
      ❌ {{ error }}
    </div>
    <div v-if="success" class="alert alert-success">
      {{ success }}
    </div>

    <!-- Barre de progression des étapes -->
    <div class="steps-container">
      <div :class="['step', { active: step >= 1, current: step === 1 }]">
        <div class="step-number">1</div>
        <div class="step-label">Upload</div>
      </div>
      <div :class="['step', { active: step >= 2, current: step === 2 }]">
        <div class="step-number">2</div>
        <div class="step-label">Aperçu</div>
      </div>
      <div :class="['step', { active: step >= 3, current: step === 3 }]">
        <div class="step-number">3</div>
        <div class="step-label">Mapping</div>
      </div>
      <div :class="['step', { active: step >= 4, current: step === 4 }]">
        <div class="step-number">4</div>
        <div class="step-label">Importer</div>
      </div>
    </div>

    <!-- ÉTAPE 1: Upload -->
    <div v-if="step === 1" class="step-content">
      <div class="upload-area">
        <input
          type="file"
          accept=".csv,.json,.xml"
          @change="(e) => handleFileSelect(e.target.files[0])"
          class="file-input"
          :disabled="loading"
        />
        <div v-if="!file" class="upload-placeholder">
          <div class="upload-icon">📁</div>
          <p>Sélectionnez un fichier CSV, JSON ou XML</p>
          <small>ou glissez-déposez votre fichier ici</small>
        </div>
        <div v-else class="file-selected">
          <div class="file-info">
            <span class="file-icon">✓</span>
            <div>
              <div class="file-name">{{ file.name }}</div>
              <div class="file-details">{{ file.size }} octets</div>
            </div>
          </div>
          <button @click="resetImport" class="btn btn-secondary">Changer</button>
        </div>
      </div>
      <div class="step-actions">
        <button
          @click="goToStep3"
          :disabled="!isStep1Valid || loading"
          class="btn btn-primary"
        >
          {{ loading ? '⏳ Analyse...' : '➜ Suivant' }}
        </button>
      </div>
    </div>

    <!-- ÉTAPE 2: Aperçu -->
    <div v-if="step === 2" class="step-content">
      <h2>Aperçu des données</h2>
      <p>{{ rowCount }} ligne(s) détectée(s)</p>

      <div class="table-container">
        <table class="preview-table">
          <thead>
            <tr>
              <th v-for="col in columns" :key="col">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in parsedData.slice(0, 5)" :key="index">
              <td v-for="col in columns" :key="col">{{ row[col] }}</td>
            </tr>
            <tr v-if="rowCount > 5">
              <td :colspan="columns.length" class="more-rows">
                ... et {{ rowCount - 5 }} autre(s) ligne(s)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="step-actions">
        <button @click="goBack" class="btn btn-secondary">← Retour</button>
        <button @click="goToStep3" class="btn btn-primary">Continuer ➜</button>
      </div>
    </div>

    <!-- ÉTAPE 3: Mapping des colonnes -->
    <div v-if="step === 3" class="step-content">
      <h2>Mapper les colonnes</h2>
      <p class="info">Associez vos colonnes aux champs PrestaShop</p>

      <div class="mapping-container">
        <div v-for="fileCol in columns" :key="fileCol" class="mapping-row">
          <div class="mapping-label">{{ fileCol }}</div>
          <div class="mapping-arrow">→</div>
          <select
            :value="columnMapping[fileCol] || ''"
            @change="(e) => updateColumnMapping(fileCol, e.target.value)"
            class="mapping-select"
          >
            <option value="">-- Ignorer --</option>
            <option v-for="psField in prestashopFields" :key="psField" :value="psField">
              {{ psField }}
            </option>
          </select>
        </div>
      </div>

      <div class="validation-info" v-if="isStep3Valid">
        ✅ Mapping valide
      </div>
      <div class="validation-error" v-else>
        ⚠️ Colonnes obligatoires: name, price
      </div>

      <div class="step-actions">
        <button @click="goBack" class="btn btn-secondary">← Retour</button>
        <button
          @click="goToStep4"
          :disabled="!isStep3Valid"
          class="btn btn-primary"
        >
          Continuer ➜
        </button>
      </div>
    </div>

    <!-- ÉTAPE 4: Confirmation et Import -->
    <div v-if="step === 4" class="step-content">
      <h2>Confirmation d'import</h2>
      <p>{{ rowCount }} produit(s) seront importé(s)</p>

      <div v-if="!loading" class="table-container">
        <table class="confirmation-table">
          <thead>
            <tr>
              <th v-for="psField in Object.values(columnMapping)" :key="psField" v-if="psField">
                {{ psField }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in getMappedData().slice(0, 5)" :key="index">
              <td v-for="(val, key) in row" :key="key">
                {{ val }}
              </td>
            </tr>
            <tr v-if="rowCount > 5">
              <td :colspan="Object.values(columnMapping).filter(v => v).length" class="more-rows">
                ... et {{ rowCount - 5 }} autre(s) ligne(s)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Affichage pendant l'import -->
      <div v-if="loading" class="import-progress">
        <div class="progress-header">
          <h3>🔄 Import en cours...</h3>
          <div class="progress-percentage">{{ Math.round(importProgress) }}%</div>
        </div>
        
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: importProgress + '%' }"></div>
        </div>
        
        <p class="progress-text">
          Importation des produits en cours... Veuillez patienter.
        </p>
      </div>

      <!-- Rapport après import -->
      <div v-if="importReport && !loading" class="import-report">
        <div :class="['report-header', importReport.failed.length === 0 ? 'success' : 'partial']">
          <div class="report-title">{{ success }}</div>
          <div class="report-stats">
            <span class="stat-item success-item">✅ {{ importReport.successful.length }} réussi(s)</span>
            <span v-if="importReport.failed.length > 0" class="stat-item error-item">❌ {{ importReport.failed.length }} échoué(s)</span>
          </div>
        </div>

        <!-- Liste des succès -->
        <div v-if="importReport.successful.length > 0" class="report-section">
          <h4 class="section-title success-title">✅ Produits importés avec succès ({{ importReport.successful.length }})</h4>
          <div class="success-list">
            <div v-for="item in importReport.successful.slice(0, 10)" :key="item.id" class="success-item-detail">
              <span class="item-index">{{ item.index }}</span>
              <span class="item-name">{{ item.name }}</span>
              <span class="item-id">#{{ item.id }}</span>
            </div>
            <div v-if="importReport.successful.length > 10" class="more-items">
              ... et {{ importReport.successful.length - 10 }} autre(s)
            </div>
          </div>
        </div>

        <!-- Liste des erreurs -->
        <div v-if="importReport.errors.length > 0" class="report-section">
          <h4 class="section-title error-title">❌ Erreurs d'import ({{ importReport.errors.length }})</h4>
          <div class="error-list">
            <div v-for="err in importReport.errors.slice(0, 10)" :key="`${err.index}-${err.name}`" class="error-item-detail">
              <div class="error-header">
                <span class="item-index">Ligne {{ err.index }}</span>
                <span class="item-name">{{ err.name }}</span>
              </div>
              <div class="error-message">📍 {{ err.error }}</div>
            </div>
            <div v-if="importReport.errors.length > 10" class="more-items">
              ... et {{ importReport.errors.length - 10 }} autre(s) erreur(s)
            </div>
          </div>
        </div>
      </div>

      <div class="step-actions">
        <button v-if="!loading" @click="goBack" class="btn btn-secondary">← Retour</button>
        <button
          v-if="!loading"
          @click="importProducts"
          :disabled="loading"
          class="btn btn-success"
        >
          📤 Importer maintenant
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFileImport } from '@/composables/useFileImport'

const {
  file,
  parsedData,
  columns,
  columnMapping,
  loading,
  error,
  success,
  importProgress,
  importReport,
  step,
  prestashopFields,
  rowCount,
  isStep1Valid,
  isStep2Valid,
  isStep3Valid,
  handleFileSelect,
  goToStep3,
  goToStep4,
  importProducts,
  resetImport,
  goBack,
  updateColumnMapping,
  getMappedData
} = useFileImport()
</script>

<style scoped>
.importer-container {
  max-width: 900px;
  margin: 0 auto;
}

.subtitle {
  color: #666;
  font-size: 14px;
}

/* Alertes */
.alert {
  padding: 15px;
  margin: 20px 0;
  border-radius: 4px;
  font-weight: 500;
}

.alert-error {
  background-color: #ffebee;
  color: #c62828;
  border-left: 4px solid #f44336;
}

.alert-success {
  background-color: #e8f5e9;
  color: #2e7d32;
  border-left: 4px solid #4caf50;
}

/* Étapes */
.steps-container {
  display: flex;
  justify-content: space-around;
  margin: 30px 0;
  gap: 20px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.4;
  transition: all 0.3s ease;
}

.step.active {
  opacity: 1;
}

.step.current {
  opacity: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #666;
  border: 2px solid #ddd;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background-color: #e3f2fd;
  border-color: #1976d2;
  color: #1976d2;
}

.step.current .step-number {
  background-color: #1976d2;
  color: white;
  font-size: 1.2rem;
}

.step-label {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.step.active .step-label {
  color: #333;
  font-weight: 500;
}

/* Contenu des étapes */
.step-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  margin: 30px 0;
}

.step-content h2 {
  margin-top: 0;
  color: #2c3e50;
}

/* Upload */
.upload-area {
  border: 2px dashed #1976d2;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  background-color: #f8f9fa;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover {
  background-color: #e3f2fd;
  border-color: #1565c0;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.upload-placeholder {
  pointer-events: none;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.upload-placeholder p {
  margin: 10px 0 5px;
  color: #333;
  font-weight: 500;
}

.upload-placeholder small {
  color: #999;
  display: block;
}

.file-selected {
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: auto;
}

.file-info {
  display: flex;
  gap: 15px;
  align-items: center;
  flex: 1;
}

.file-icon {
  font-size: 24px;
  color: #4caf50;
}

.file-name {
  font-weight: 500;
  color: #333;
}

.file-details {
  font-size: 12px;
  color: #999;
}

/* Tables */
.table-container {
  overflow-x: auto;
  margin: 20px 0;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.preview-table,
.confirmation-table {
  width: 100%;
  border-collapse: collapse;
}

.preview-table th,
.confirmation-table th {
  background-color: #f5f5f5;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
}

.preview-table td,
.confirmation-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 13px;
}

.preview-table tr:hover,
.confirmation-table tr:hover {
  background-color: #f9f9f9;
}

.more-rows {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 15px 12px;
}

/* Mapping */
.mapping-container {
  display: grid;
  gap: 15px;
  margin: 20px 0;
}

.mapping-row {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.mapping-label {
  flex: 0 0 150px;
  font-weight: 500;
  color: #333;
  background-color: #f0f0f0;
  padding: 8px 12px;
  border-radius: 3px;
  font-family: monospace;
}

.mapping-arrow {
  color: #999;
  font-size: 18px;
}

.mapping-select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.mapping-select:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 4px rgba(25, 118, 210, 0.3);
}

/* Validation */
.validation-info {
  padding: 12px 15px;
  background-color: #e8f5e9;
  color: #2e7d32;
  border-left: 4px solid #4caf50;
  border-radius: 4px;
  margin: 20px 0;
  font-weight: 500;
}

.validation-error {
  padding: 12px 15px;
  background-color: #fff3e0;
  color: #e65100;
  border-left: 4px solid #ff9800;
  border-radius: 4px;
  margin: 20px 0;
  font-weight: 500;
}

/* Progression d'import */
.import-progress {
  margin: 30px 0;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.progress-header h3 {
  margin: 0;
  color: #333;
}

.progress-percentage {
  font-size: 24px;
  font-weight: bold;
  color: #1976d2;
}

.progress-bar-container {
  width: 100%;
  height: 30px;
  background-color: #e0e0e0;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 20px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 12px;
}

.progress-text {
  text-align: center;
  color: #666;
  margin: 0;
  font-size: 14px;
}

/* Rapport d'import */
.import-report {
  margin: 30px 0;
}

.report-header {
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-weight: 500;
  font-size: 16px;
}

.report-header.success {
  background-color: #e8f5e9;
  color: #2e7d32;
  border-left: 4px solid #4caf50;
}

.report-header.error {
  background-color: #ffebee;
  color: #c62828;
  border-left: 4px solid #f44336;
}

/* Rapport d'import */
.import-report {
  margin: 30px 0;
}

.report-header {
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 16px;
}

.report-header.success {
  background-color: #e8f5e9;
  color: #2e7d32;
  border-left: 4px solid #4caf50;
}

.report-header.partial {
  background-color: #fff3e0;
  color: #e65100;
  border-left: 4px solid #ff9800;
}

.report-header.error {
  background-color: #ffebee;
  color: #c62828;
  border-left: 4px solid #f44336;
}

.report-title {
  margin-bottom: 10px;
}

.report-stats {
  display: flex;
  gap: 20px;
  font-size: 14px;
  font-weight: 500;
}

.stat-item {
  padding: 6px 12px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.3);
}

.stat-item.success-item {
  color: #2e7d32;
}

.stat-item.error-item {
  color: #c62828;
}

.report-section {
  margin-bottom: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.section-title {
  margin: 0;
  padding: 15px 20px;
  font-size: 14px;
  font-weight: 600;
}

.section-title.success-title {
  background-color: #f1f8e9;
  color: #33691e;
}

.section-title.error-title {
  background-color: #ffebee;
  color: #880e4f;
}

.success-list {
  padding: 15px;
  background-color: #fafafa;
}

.success-item-detail {
  display: flex;
  gap: 15px;
  padding: 10px;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.success-item-detail:last-child {
  border-bottom: none;
}

.error-list {
  padding: 15px;
  background-color: #fafafa;
}

.error-item-detail {
  padding: 12px;
  margin-bottom: 12px;
  background-color: white;
  border-left: 4px solid #f44336;
  border-radius: 3px;
}

.error-item-detail:last-child {
  margin-bottom: 0;
}

.error-header {
  display: flex;
  gap: 15px;
  margin-bottom: 8px;
}

.error-message {
  color: #d32f2f;
  font-size: 13px;
  font-family: monospace;
}

.item-index {
  background-color: #f0f0f0;
  padding: 4px 8px;
  border-radius: 3px;
  font-weight: 600;
  color: #666;
  min-width: 60px;
  text-align: center;
  font-size: 12px;
}

.item-name {
  flex: 1;
  color: #333;
  font-weight: 500;
}

.item-id {
  color: #999;
  font-size: 12px;
  font-family: monospace;
}

.more-items {
  padding: 10px;
  color: #999;
  font-style: italic;
  text-align: center;
  font-size: 13px;
  background-color: #f9f9f9;
}

/* Boutons */
.step-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #1976d2;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1565c0;
}

.btn-secondary {
  background-color: #757575;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #616161;
}

.btn-success {
  background-color: #4caf50;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #388e3c;
}
</style>
