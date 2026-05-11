<template>
  <div class="product-details">
    <div class="page-header">
      <router-link class="back-link" to="/backoffice/produits">← Retour aux produits</router-link>
      <div class="header-main">
        <div>
          <h1>🧾 {{ product?.name || 'Produit' }}</h1>
          <p class="subtitle">ID {{ product?.id || '-' }}</p>
        </div>
        <div class="header-actions">
          <span
            v-if="product"
            class="status"
            :class="product.active ? 'active' : 'inactive'"
          >
            {{ product.active ? 'Actif' : 'Inactif' }}
          </span>
          <router-link
            v-if="product"
            :to="`/produits/${product.id}/edit`"
            class="btn btn-warning"
          >
            ✏️ Éditer
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="error" class="alert error">
      ❌ {{ error }}
    </div>

    <div v-if="loading" class="alert info">
      ⏳ Chargement du produit...
    </div>

    <div v-else-if="product" class="grid">
      <section class="card">
        <h2>Infos de base</h2>
        <div class="field-row">
          <span class="label">Reference</span>
          <span class="value">{{ product.reference || '-' }}</span>
        </div>
        <div class="field-row">
          <span class="label">Poids</span>
          <span class="value">{{ product.weight || 0 }} kg</span>
        </div>
        <div class="field-row">
          <span class="label">Date ajout</span>
          <span class="value">{{ formatDate(product.dateAdd) }}</span>
        </div>
        <div class="field-row">
          <span class="label">Derniere MAJ</span>
          <span class="value">{{ formatDate(product.dateUpd) }}</span>
        </div>
      </section>

      <section class="card brand-card">
        <h2>🏷️ Marque / Fabricant</h2>
        <div v-if="manufacturer" class="brand-content">
          <div class="brand-header">
            <div v-if="manufacturer.image" class="brand-image">
              <img :src="manufacturer.image" :alt="manufacturer.name" />
            </div>
            <div class="brand-info">
              <h3>{{ manufacturer.name }}</h3>
              <p v-if="manufacturer.shortDescription" class="short-desc">
                {{ manufacturer.shortDescription }}
              </p>
              <span
                v-if="manufacturer.active !== undefined"
                :class="manufacturer.active ? 'badge-active' : 'badge-inactive'"
              >
                {{ manufacturer.active ? '✓ Actif' : '✗ Inactif' }}
              </span>
            </div>
          </div>
          <div v-if="manufacturer.description" class="brand-description">
            <p v-html="manufacturer.description"></p>
          </div>
        </div>
        <div v-else class="muted">
          {{ product.manufacturer || 'Aucun fabricant associé' }}
        </div>
      </section>

      <section class="card">
        <h2>Prix</h2>
        <div class="field-row">
          <span class="label">Prix HT</span>
          <span class="value strong">{{ formatPrice(product.price) }}</span>
        </div>
        <div class="field-row">
          <span class="label">Prix TTC</span>
          <span class="value strong">{{ formatPrice(product.priceTTC) }}</span>
        </div>
      </section>

      <section class="card">
        <h2>Stock</h2>
        <div class="stock-row">
          <span class="stock-qty">{{ product.quantity }}</span>
          <span class="stock-badge" :style="stockBadgeStyle()">{{ stockLabel() }}</span>
        </div>
        <p class="muted">Quantite disponible (stock disponible)</p>
      </section>

      <section class="card images-card">
        <h2>Images</h2>
        <div v-if="product.imageMain" class="image-main">
          <img :src="product.imageMain" :alt="product.name" />
        </div>
        <div v-else class="muted">Aucune image disponible</div>
        <div v-if="product.images && product.images.length > 1" class="image-thumbs">
          <img
            v-for="img in product.images"
            :key="img"
            :src="img"
            :alt="product.name"
            class="thumb"
          />
        </div>
      </section>

      <section class="card">
        <h2>Categories</h2>
        <div class="field-row">
          <span class="label">Categorie par defaut</span>
          <span class="value">{{ product.categoryDefault || '-' }}</span>
        </div>
        <div class="field-row">
          <span class="label">Toutes les categories</span>
          <span class="value">
            <span v-if="product.categories && product.categories.length > 0">
              {{ product.categories.join(', ') }}
            </span>
            <span v-else>-</span>
          </span>
        </div>
      </section>
    </div>

    <div v-else class="empty">
      Aucun produit a afficher.
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductDetails } from '@/composables/products'
import { ProductService } from '@/services'

const route = useRoute()
const {
  product,
  manufacturer,
  loading,
  error,
  loadProduct,
  formatPrice,
  formatDate
} = useProductDetails()

const stockBadgeStyle = () => {
  if (!product.value) return {}
  const { bg, text } = ProductService.getStockBadgeColor(product.value.quantity)
  return { backgroundColor: bg, color: text }
}

const stockLabel = () => {
  if (!product.value) return ''
  const quantity = parseInt(product.value.quantity || '0')
  if (quantity === 0) return 'Rupture'
  if (quantity < 5) return 'Faible'
  if (quantity > 100) return 'Important'
  return 'OK'
}

watch(
  () => route.params.id,
  (newId) => {
    loadProduct(newId)
  },
  { immediate: true }
)
</script>

<style scoped>
.product-details {
  max-width: 1100px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.back-link {
  color: #1976d2;
  text-decoration: none;
  font-weight: 600;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 700;
}

.status.active {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status.inactive {
  background-color: #ffebee;
  color: #c62828;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-warning {
  background: #ff9800;
  color: white;
}

.btn-warning:hover {
  background: #f57c00;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.card h2 {
  margin: 0 0 12px;
  font-size: 16px;
}

.brand-card {
  grid-column: span 2;
}

.brand-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.brand-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.brand-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.brand-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.brand-info {
  flex: 1;
}

.brand-info h3 {
  margin: 0 0 4px;
  font-size: 18px;
}

.short-desc {
  margin: 4px 0;
  font-size: 13px;
  color: #666;
}

.badge-active {
  display: inline-block;
  background: #e8f5e9;
  color: #2e7d32;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 600;
}

.badge-inactive {
  display: inline-block;
  background: #ffebee;
  color: #c62828;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 600;
}

.brand-description {
  font-size: 13px;
  line-height: 1.6;
  color: #555;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 6px;
  border-left: 3px solid #1976d2;
}

.field-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.label {
  color: #666;
  font-size: 13px;
}

.value {
  font-weight: 600;
  text-align: right;
}

.value.strong {
  font-size: 18px;
}

.stock-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stock-qty {
  font-size: 28px;
  font-weight: 700;
}

.stock-badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 12px;
}

.images-card {
  grid-column: span 2;
}

.image-main {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
}

.image-main img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
}

.image-thumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.thumb {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.alert {
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.alert.error {
  background: #ffebee;
  color: #c62828;
}

.alert.info {
  background: #e3f2fd;
  color: #1565c0;
}

.muted {
  color: #666;
  font-size: 13px;
}

.empty {
  padding: 32px;
  background: #f5f5f5;
  border-radius: 8px;
  text-align: center;
  color: #666;
}

@media (max-width: 900px) {
  .images-card {
    grid-column: span 1;
  }

  .header-main {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
