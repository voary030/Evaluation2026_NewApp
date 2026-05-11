<template>
  <div class="product-create">
    <!-- En-tête -->
    <div class="header">
      <div class="header-content">
        <h1>{{ isEditMode ? 'Modifier le produit' : 'Créer un produit' }}</h1>
        <p class="subtitle">Remplissez les informations du produit ci-dessous</p>
      </div>
      <router-link to="/produits" class="btn-back">
        <span>←</span> Retour à la liste
      </router-link>
    </div>

    <!-- Conteneur principal -->
    <div class="form-container">
      <!-- Messages d'alerte -->
      <div v-if="error" class="alert alert-error">
        <span class="alert-icon">⚠️</span>
        <div>
          <strong>Erreur</strong>
          <p>{{ error }}</p>
        </div>
      </div>

      <div v-if="success" class="alert alert-success">
        <span class="alert-icon">✅</span>
        <div>
          <strong>Succès</strong>
          <p>{{ success }}</p>
        </div>
      </div>

      <!-- État de chargement -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Chargement du produit...</p>
      </div>

      <!-- Formulaire -->
      <form v-else @submit.prevent="handleSubmit" class="form">
        <!-- Section: Informations générales -->
        <fieldset class="form-section">
          <legend>📋 Informations générales</legend>

          <!-- Nom -->
          <div class="form-group">
            <label for="name">Nom du produit <span class="required">*</span></label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="Ex: Laptop Pro 15"
              maxlength="128"
              :class="{ 'has-error': errors.name }"
              @blur="handleFieldChange('name')"
            />
            <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
            <small>{{ formData.name.length }}/128 caractères</small>
          </div>

          <!-- Référence -->
          <div class="form-group">
            <label for="reference">Référence <span class="required">*</span></label>
            <input
              id="reference"
              v-model="formData.reference"
              type="text"
              placeholder="Ex: LAP-PRO-15-001"
              maxlength="32"
              :class="{ 'has-error': errors.reference }"
              @blur="handleFieldChange('reference')"
            />
            <div v-if="errors.reference" class="error-message">{{ errors.reference }}</div>
            <small>{{ formData.reference.length }}/32 caractères</small>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="formData.description"
              placeholder="Description détaillée du produit..."
              rows="4"
              maxlength="1024"
              :class="{ 'has-error': errors.description }"
              @blur="handleFieldChange('description')"
            ></textarea>
            <div v-if="errors.description" class="error-message">{{ errors.description }}</div>
            <small>{{ formData.description.length }}/1024 caractères</small>
          </div>
        </fieldset>

        <!-- Section: Tarification -->
        <fieldset class="form-section">
          <legend>💰 Tarification</legend>

          <div class="form-row">
            <!-- Prix HT -->
            <div class="form-group">
              <label for="price">Prix HT <span class="required">*</span></label>
              <div class="input-with-unit">
                <input
                  id="price"
                  v-model="formData.price"
                  type="number"
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  :class="{ 'has-error': errors.price }"
                  @blur="handleFieldChange('price')"
                />
                <span class="unit">€</span>
              </div>
              <div v-if="errors.price" class="error-message">{{ errors.price }}</div>
            </div>

            <!-- Aperçu du prix TTC -->
            <div class="form-group">
              <label>Prix TTC (TVA 20%)</label>
              <div class="price-display">
                <span class="amount">{{ formattedPriceTTC }}</span>
              </div>
              <small>Aperçu uniquement</small>
            </div>
          </div>
        </fieldset>

        <!-- Section: Stock et dimensions -->
        <fieldset class="form-section">
          <legend>📦 Stock et dimensions</legend>

          <div class="form-row">
            <!-- Quantité -->
            <div class="form-group">
              <label for="quantity">Quantité en stock <span class="required">*</span></label>
              <input
                id="quantity"
                v-model="formData.quantity"
                type="number"
                placeholder="0"
                min="0"
                :class="{ 'has-error': errors.quantity }"
                @blur="handleFieldChange('quantity')"
              />
              <div v-if="errors.quantity" class="error-message">{{ errors.quantity }}</div>
            </div>

            <!-- Poids -->
            <div class="form-group">
              <label for="weight">Poids (kg)</label>
              <div class="input-with-unit">
                <input
                  id="weight"
                  v-model="formData.weight"
                  type="number"
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                  :class="{ 'has-error': errors.weight }"
                  @blur="handleFieldChange('weight')"
                />
                <span class="unit">kg</span>
              </div>
              <div v-if="errors.weight" class="error-message">{{ errors.weight }}</div>
            </div>
          </div>
        </fieldset>

        <!-- Section: Statut -->
        <fieldset class="form-section">
          <legend>🔔 Statut</legend>

          <div class="form-group">
            <label for="active">
              <input
                id="active"
                v-model.number="formData.active"
                type="checkbox"
                :true-value="1"
                :false-value="0"
              />
              <span>Produit actif</span>
            </label>
            <small>Cochez pour que le produit soit visible en boutique</small>
          </div>
        </fieldset>

        <!-- Section: Options avancées (optionnel) -->
        <fieldset class="form-section">
          <legend>⚙️ Options avancées</legend>

          <div class="form-row">
            <!-- Fabricant -->
            <div class="form-group">
              <label for="id_manufacturer">Fabricant</label>
              <select
                id="id_manufacturer"
                v-model="formData.id_manufacturer"
                :disabled="loadingOptions"
              >
                <option value="">Aucun fabricant</option>
                <option v-for="man in manufacturers" :key="man.id" :value="man.id">
                  {{ man.name }}
                </option>
              </select>
              <small v-if="loadingOptions">Chargement des fabricants...</small>
              <small v-else>Laisser vide si non applicable</small>
            </div>

            <!-- Catégorie par défaut -->
            <div class="form-group">
              <label for="id_category_default">Catégorie par défaut <span class="required">*</span></label>
              <select
                id="id_category_default"
                v-model="formData.id_category_default"
                :class="{ 'has-error': errors.id_category_default }"
                :disabled="loadingOptions || categories.length === 0"
                @change="handleFieldChange('id_category_default')"
              >
                <option value="" disabled>Choisir une catégorie</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
              <div v-if="errors.id_category_default" class="error-message">{{ errors.id_category_default }}</div>
              <small v-if="loadingOptions">Chargement des catégories...</small>
              <small v-else>Catégorie requise pour la création</small>
            </div>
          </div>
        </fieldset>

        <!-- Section: Image du produit (uniquement en création) -->
        <fieldset v-if="!isEditMode" class="form-section">
          <legend>🖼️ Image du produit</legend>
          <p class="section-info">Uploadez une image pour votre produit (optionnel)</p>
          
          <!-- Message d'erreur image -->
          <div v-if="imageError" class="alert alert-error">
            <span class="alert-icon">⚠️</span>
            <p>{{ imageError }}</p>
          </div>

          <!-- Input file -->
          <div class="form-group">
            <label for="image-file">Sélectionner une image</label>
            <div class="file-input-wrapper">
              <input
                id="image-file"
                type="file"
                accept=".jpg,.jpeg,.png,.gif"
                :disabled="submitting || uploadingImage"
                @change="(e) => imageFile = e.target.files?.[0] || null"
                class="file-input"
              />
              <div class="file-input-label">
                <span class="file-icon">📁</span>
                <span class="file-text">
                  {{ imageFile ? `✅ ${imageFile.name}` : 'Cliquez pour sélectionner une image' }}
                </span>
              </div>
            </div>
            <small>Formats acceptés: JPG, JPEG, PNG, GIF (max 5MB)</small>
            <div v-if="imageFile" class="file-preview">
              <img :src="URL.createObjectURL(imageFile)" :alt="imageFile.name" />
            </div>
          </div>
        </fieldset>

        <!-- Boutons d'action -->
        <div class="form-actions">
          <button
            type="reset"
            class="btn btn-secondary"
            @click="resetForm"
            :disabled="submitting"
          >
            Réinitialiser
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="submitting || !isFormValid"
          >
            <span v-if="submitting" class="spinner-small"></span>
            {{ submitting ? 'Sauvegarde...' : (isEditMode ? 'Modifier le produit' : 'Créer le produit') }}
          </button>
        </div>
      </form>

      <!-- Aperçu des données -->
      <div v-if="!isEditMode && !hasErrors && formData.name" class="preview-section">
        <h3>Aperçu du produit</h3>
        <div class="preview-card">
          <div class="preview-row">
            <span class="label">Nom:</span>
            <strong>{{ formData.name }}</strong>
          </div>
          <div class="preview-row">
            <span class="label">Référence:</span>
            <code>{{ formData.reference }}</code>
          </div>
          <div class="preview-row">
            <span class="label">Prix:</span>
            <strong>{{ formattedPrice }} HT / {{ formattedPriceTTC }} TTC</strong>
          </div>
          <div class="preview-row">
            <span class="label">Stock:</span>
            <strong>{{ formData.quantity }} unités</strong>
          </div>
          <div v-if="formData.weight" class="preview-row">
            <span class="label">Poids:</span>
            <strong>{{ formData.weight }} kg</strong>
          </div>
          <div class="preview-row">
            <span class="label">Statut:</span>
            <span :class="{ 'badge-active': formData.active === 1, 'badge-inactive': formData.active === 0 }">
              {{ formData.active === 1 ? 'Actif' : 'Inactif' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductForm } from '@/composables/products'
import { useRouter } from 'vue-router'

const router = useRouter()
const productId = router.currentRoute.value.params.id || null

const {
  isEditMode,
  loading,
  submitting,
  error,
  success,
  loadingOptions,
  formData,
  errors,
  categories,
  manufacturers,
  imageFile,
  uploadingImage,
  imageError,
  hasErrors,
  isFormValid,
  formattedPrice,
  formattedPriceTTC,
  handleFieldChange,
  submitForm,
  resetForm,
  uploadImage,
  initForm
} = useProductForm(productId)

const handleSubmit = async () => {
  const result = await submitForm()
  if (result && !isEditMode) {
    // Redirection vers la liste après création réussie
    setTimeout(() => {
      router.push('/produits')
    }, 1500)
  }
}

// Initialiser le formulaire au montage
onMounted(async () => {
  await initForm()
})
</script>

<style scoped>
.product-create {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 0;
}

/* En-tête */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.header-content .subtitle {
  margin: 0.5rem 0 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-3px);
}

/* Conteneur du formulaire */
.form-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

/* Messages d'alerte */
.alert {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  align-items: flex-start;
}

.alert-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.alert-error {
  background: #fff3cd;
  border-left: 4px solid #dc3545;
  color: #856404;
}

.alert-error strong {
  color: #dc3545;
}

.alert-success {
  background: #d4edda;
  border-left: 4px solid #28a745;
  color: #155724;
}

.alert-success strong {
  color: #28a745;
}

.alert p {
  margin: 0.25rem 0 0;
  font-size: 0.95rem;
}

/* État de chargement */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.spinner-small {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Formulaire */
.form-section {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: #fafafa;
}

.form-section legend {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  padding: 0 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  font-size: 0.95rem;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea,
.form-group input[type="email"],
.form-group input[type="password"],
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  background: #f8f9ff;
}

.form-group input.has-error,
.form-group textarea.has-error,
.form-group select.has-error {
  border-color: #dc3545;
  background: #fff5f5;
}

.form-group textarea {
  resize: vertical;
}

.required {
  color: #dc3545;
  font-weight: bold;
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.error-message::before {
  content: '⚠';
}

.form-group small {
  display: block;
  color: #666;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

/* Input avec unité */
.input-with-unit {
  position: relative;
  display: flex;
}

.input-with-unit input {
  flex: 1;
}

.input-with-unit .unit {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  pointer-events: none;
  font-weight: 500;
}

/* Affichage du prix */
.price-display {
  background: #f0f4ff;
  border: 2px solid #667eea;
  border-radius: 6px;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.price-display .amount {
  font-size: 1.3rem;
  font-weight: 700;
  color: #667eea;
}

/* Disposition en ligne */
.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* Checkbox personnalisée */
.form-group input[type="checkbox"] {
  margin-right: 0.5rem;
  width: auto;
  cursor: pointer;
}

.form-group label {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.form-group label span {
  margin: 0;
}

/* Boutons d'action */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background: #d0d0d0;
}

/* Section d'aperçu */
.preview-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
}

.preview-section h3 {
  margin: 0 0 1rem;
  color: #333;
}

.preview-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  padding: 1.5rem;
}

.preview-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.preview-row:last-child {
  border-bottom: none;
}

.preview-row .label {
  font-weight: 600;
  color: #666;
  min-width: 120px;
}

.preview-row code {
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.badge-active {
  display: inline-block;
  background: #28a745;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-inactive {
  display: inline-block;
  background: #6c757d;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Section d'info */
.section-info {
  margin: 0 0 1rem;
  color: #666;
  font-size: 0.95rem;
  font-style: italic;
}

/* File input personnalisé */
.file-input {
  display: none;
}

.file-input-wrapper {
  position: relative;
}

.file-input-label {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  border: 2px dashed #667eea;
  border-radius: 8px;
  background: #f8f9ff;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  justify-content: center;
}

.file-input-label:hover {
  border-color: #764ba2;
  background: #f0f0ff;
}

.file-input-label:active {
  background: #e8e8ff;
}

.file-input:disabled ~ .file-input-label {
  opacity: 0.6;
  cursor: not-allowed;
}

.file-icon {
  font-size: 2rem;
}

.file-text {
  color: #667eea;
  font-weight: 500;
}

.file-preview {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.file-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive */
@media (max-width: 768px) {
  .product-create {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    padding: 1.5rem;
  }

  .header-content h1 {
    font-size: 1.5rem;
  }

  .form-container {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .file-input-label {
    padding: 1.5rem 1rem;
  }
}
</style>
