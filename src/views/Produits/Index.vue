<template>
  <div>
    <h1>📦 Produits</h1>
    
    <div v-if="error" style="color: white; background-color: #d32f2f; padding: 12px; border-radius: 4px; margin: 10px 0;">
      ❌ Erreur: {{ error }}
    </div>
    
    <div v-if="success" style="color: white; background-color: #388e3c; padding: 12px; border-radius: 4px; margin: 10px 0;">
      ✓ {{ success }}
    </div>
    
    <div style="margin-bottom: 20px;">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="🔍 Rechercher un produit (nom, ID, référence)..."
        style="padding: 10px; width: 400px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px;"
      />
      <button 
        @click="fetchProducts" 
        :disabled="loading"
        style="padding: 10px 20px; margin-left: 10px; background-color: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;"
      >
        {{ loading ? '⏳ Chargement...' : '🔄 Recharger' }}
      </button>
      <router-link
        to="/backoffice/produits/create"
        style="display: inline-block; padding: 10px 20px; margin-left: 10px; background-color: #4caf50; color: white; text-decoration: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 600;"
      >
        ➕ Créer un produit
      </router-link>
    </div>

    <p v-if="loading" style="font-size: 16px; color: #666;">⏳ Chargement des produits...</p>

    <div v-if="!loading && filteredProducts.length > 0">
      <p style="font-weight: bold; font-size: 16px; margin-bottom: 15px;">
        📊 {{ filteredProducts.length }} produit(s) trouvé(s) sur {{ products.length }}
      </p>
      <table style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
        <thead>
          <tr style="background-color: #1976d2; color: white;">
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">ID</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Image</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Nom</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Référence</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Catégorie</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Montant HT</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Montant TTC</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Quantité</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">État</th>
            <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="product in filteredProducts" 
            :key="product.id"
            style="border-bottom: 1px solid #ddd; background-color: white;"
          >
            <td style="border: 1px solid #ddd; padding: 12px; font-weight: bold;">{{ product.id }}</td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">
              <img 
                v-if="product.image" 
                :src="product.image" 
                :alt="product.name"
                style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"
              />
              <span v-else style="color: #999;">-</span>
            </td>
            <td style="border: 1px solid #ddd; padding: 12px; font-weight: 500;">
              <router-link
                :to="`/backoffice/produits/${product.id}`"
                style="color: #1976d2; text-decoration: none; font-weight: 600;"
              >
                {{ product.name }}
              </router-link>
            </td>
            <td style="border: 1px solid #ddd; padding: 12px;">
              <code style="background-color: #f0f0f0; padding: 4px 8px; border-radius: 3px;">{{ product.reference }}</code>
            </td>
            <td style="border: 1px solid #ddd; padding: 12px;">
              <span style="font-size: 14px;">{{ product.category || '-' }}</span>
            </td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: right; font-weight: 500;">
              {{ formatPrice(product.price) }} €
            </td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: right; font-weight: 500;">
              {{ formatPrice(product.priceTTC) }} €
            </td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">
              <span 
                :style="{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  display: 'inline-block',
                  backgroundColor: product.quantity > 10 ? '#4caf50' : product.quantity > 0 ? '#ff9800' : '#f44336',
                  color: 'white'
                }"
              >
                {{ product.quantity }}
              </span>
            </td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">
              <span 
                :style="{
                  padding: '4px 8px',
                  borderRadius: '3px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: product.active ? '#e8f5e9' : '#ffebee',
                  color: product.active ? '#2e7d32' : '#c62828'
                }"
              >
                {{ product.active ? '✓ Actif' : '✗ Inactif' }}
              </span>
            </td>
            <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">
              <router-link
                :to="`/backoffice/produits/${product.id}`"
                style="display: inline-block; padding: 6px 12px; background-color: #1976d2; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px; text-decoration: none; margin-right: 6px;"
              >
                👁️ Voir
              </router-link>
              <router-link
                :to="`/backoffice/produits/${product.id}/edit`"
                style="display: inline-block; padding: 6px 12px; background-color: #ff9800; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px; text-decoration: none; margin-right: 6px;"
              >
                ✏️ Éditer
              </router-link>
              <button
                @click="deleteProductById(product.id)"
                :disabled="loading"
                style="padding: 6px 12px; background-color: #f44336; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;"
              >
                🗑️ Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="!loading && products.length === 0" style="text-align: center; padding: 40px; background-color: #f5f5f5; border-radius: 4px; color: #666;">
      <p style="font-size: 18px; margin-bottom: 10px;">📭 Aucun produit trouvé</p>
      <p style="font-size: 14px;">Cliquez sur "Recharger" pour charger les produits depuis PrestaShop</p>
    </div>

    <div v-else-if="!loading && filteredProducts.length === 0" style="text-align: center; padding: 40px; background-color: #f5f5f5; border-radius: 4px; color: #666;">
      <p style="font-size: 18px;">🔎 Aucun résultat pour "{{ searchQuery }}"</p>
    </div>
  </div>
</template>

<script setup>
import { useProducts } from '@/composables/products'
import { onMounted } from 'vue'

const { 
  products, 
  loading, 
  error, 
  success, 
  searchQuery, 
  filteredProducts, 
  fetchProducts, 
  deleteProductById 
} = useProducts()

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2).replace('.', ',')
}

onMounted(() => {
  fetchProducts()
})
</script>
