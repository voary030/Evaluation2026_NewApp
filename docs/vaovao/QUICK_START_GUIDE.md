# 🚀 Quick Start Guide - Utiliser les Nouveaux Services

Pour les développeurs: Comment utiliser XMLNodeHelper, GenericEntityService, et colors.js

---

## 5 min: Comprendre le Flow

```
API brut (XML)
    ↓
XMLParserService.parseXML() 
    ↓
XMLNodeHelper.getText() etc. 
    ↓
ProductService.parseProducts()
    ↓
useProducts composable
    ↓
Vue component affiche
```

---

## 10 min: Charger des Produits

### Étape 1: Dans ton composable
```javascript
// composables/useProducts.js
import { ref, computed, onMounted } from 'vue'
import { getProducts, deleteProduct } from '@/api/products'
import { ProductService } from '@/services/ProductService'
import { GenericEntityService } from '@/services/GenericEntityService'

export function useProducts() {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(null)

  // ✅ Charger les produits
  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await getProducts()
      products.value = ProductService.parseProducts(response.data)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // ✅ Supprimer un produit (utilise GenericEntityService)
  const deleteProductById = async (id) => {
    const refs = { loading, error, success, entities: products }
    return await GenericEntityService.delete(deleteProduct, id, refs, {
      updateList: true
    })
  }

  return {
    products,
    loading,
    error,
    success,
    fetchProducts,
    deleteProductById
  }
}
```

### Étape 2: Dans ta vue
```vue
<template>
  <div>
    <!-- Messages -->
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="success" class="alert alert-success">{{ success }}</div>

    <!-- Chargement -->
    <div v-if="loading">Chargement...</div>

    <!-- Tableau -->
    <table v-else>
      <tr v-for="product in products" :key="product.id">
        <td>{{ product.name }}</td>
        <td>{{ formatPrice(product.price) }}</td>
        <td>
          <!-- Badge stock coloré (utilise colors.js) -->
          <span 
            class="badge" 
            :style="getStockBadgeColor(product.quantity)"
          >
            {{ product.quantity }}
          </span>
        </td>
        <td>
          <button @click="deleteProductById(product.id)" :disabled="loading">
            Supprimer
          </button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProducts } from '@/composables/useProducts'
import { getStockBadgeColor } from '@/constants/colors'

const { products, loading, error, success, fetchProducts, deleteProductById } = useProducts()

const formatPrice = (price) => `${price.toFixed(2)}€`

onMounted(() => fetchProducts())
</script>
```

---

## 10 min: XMLNodeHelper - Extraire Données XML

### Sans XMLNodeHelper (❌ Mauvais):
```javascript
const id = node.getElementsByTagName('id')[0]?.textContent
const name = node.getElementsByTagName('name')[0]?.textContent || 'Sans nom'
const quantity = parseInt(node.getElementsByTagName('quantity')[0]?.textContent || '0')
const active = node.getElementsByTagName('active')[0]?.textContent === '1' ? true : false
// 4 lignes pour 4 champs
```

### Avec XMLNodeHelper (✅ Bon):
```javascript
import { XMLNodeHelper } from '@/services/XMLNodeHelper'

const id = XMLNodeHelper.getText(node, 'id')
const name = XMLNodeHelper.getLangText(node, 'name', 'Sans nom')
const quantity = XMLNodeHelper.getInt(node, 'quantity')
const active = XMLNodeHelper.getBoolean(node, 'active')
// 4 lignes pour 4 champs, plus lisible et typé
```

### Cas Courants:

```javascript
// Extraire du texte simple
XMLNodeHelper.getText(node, 'id')              // → "123"
XMLNodeHelper.getText(node, 'name', 'default') // → "Product" ou "default"

// Extraire du texte multilingue
XMLNodeHelper.getLangText(node, 'name')        // → Premier langage
XMLNodeHelper.getLangText(node, 'name', 'N/A') // → Ou "N/A" si absent

// Extraire et convertir
XMLNodeHelper.getInt(node, 'id')              // → 123 (entier)
XMLNodeHelper.getNumber(node, 'price')        // → 12.50 (float)
XMLNodeHelper.getBoolean(node, 'active')      // → true/false

// Extraire associations (IDs de catégories, images, etc.)
XMLNodeHelper.getAssociationIds(node, 'category') // → [1, 2, 3]
XMLNodeHelper.getAssociationId(node, 'image', 0)  // → 123 (1er ID)

// Transformer associations en noms
const categoriesMap = { 1: 'Électronique', 2: 'Vêtements' }
XMLNodeHelper.getAssociationName(node, 'id_category_default', categoriesMap)
// → "Électronique"

// URLs images
XMLNodeHelper.getImageUrl(node, (imgId) => ProductService.getImageUrl(imgId))
XMLNodeHelper.getImageUrls(node, (imgId) => ProductService.getImageUrl(imgId))
```

---

## 10 min: GenericEntityService - CRUD Unifié

### Cas 1: Supprimer
```javascript
import { GenericEntityService } from '@/services/GenericEntityService'

const deleteProductById = async (id) => {
  const refs = { loading, error, success, entities: products }
  
  // ✅ C'est tout! GenericEntityService gère:
  // - loading state
  // - error handling
  // - success message (3s)
  // - liste local mise à jour
  const deleted = await GenericEntityService.delete(
    deleteProduct,    // Fonction API
    id,               // ID à supprimer
    refs,             // Refs réactives {loading, error, success, entities}
    {
      successMessage: 'Produit supprimé',
      updateList: true  // Met à jour products.value automatiquement
    }
  )
  
  return deleted
}
```

### Cas 2: Créer
```javascript
const addProduct = async (productData) => {
  const refs = { loading, error, success }
  const xml = ProductService.buildProductXml(productData)
  
  const created = await GenericEntityService.create(
    createProduct,    // Fonction API
    xml,              // Données XML
    refs,
    () => fetchProducts(),  // Optionnel: recharger liste après création
    {
      successMessage: 'Produit créé avec succès'
    }
  )
  
  return created
}
```

### Cas 3: Modifier
```javascript
const updateProduct = async (id, productData) => {
  const refs = { loading, error, success }
  const xml = ProductService.buildProductXml(productData)
  
  const updated = await GenericEntityService.update(
    updateProductApi,      // Fonction API (id, xml) => Promise
    id,
    xml,
    refs,
    () => fetchProducts(),  // Optionnel: recharger après modif
    {
      successMessage: 'Produit mis à jour'
    }
  )
  
  return updated
}
```

### Cas 4: Appel Générique
```javascript
const loadData = async () => {
  const refs = { loading, error, success }
  
  const data = await GenericEntityService.call(
    async () => {
      // Logique complexe d'orchestration
      const [products, categories] = await Promise.all([
        getProducts(),
        getCategories()
      ])
      return { products, categories }
    },
    refs,
    { successMessage: 'Données chargées' }
  )
  
  return data
}
```

---

## 5 min: Utiliser les Couleurs Centralisées

### Sans colors.js (❌ Mauvais):
```javascript
// Dupliqué partout dans le code
if (quantity > 10) {
  return { bg: '#4caf50', text: 'white' }
} else if (quantity > 0) {
  return { bg: '#ff9800', text: 'white' }
} else {
  return { bg: '#f44336', text: 'white' }
}
```

### Avec colors.js (✅ Bon):
```javascript
import { getStockBadgeColor, getStatusBadgeColor } from '@/constants/colors'

// Dans ton composant
const badgeColor = getStockBadgeColor(product.quantity)
// → {bg: '#4caf50', text: 'white'} pour quantity > 10
```

### Dans la Vue:
```vue
<template>
  <!-- Badge stock -->
  <span 
    class="badge"
    :style="getStockBadgeColor(product.quantity)"
  >
    {{ product.quantity }}
  </span>

  <!-- Badge état -->
  <span 
    class="badge"
    :style="getStatusBadgeColor(product.active)"
  >
    {{ product.active ? 'Actif' : 'Inactif' }}
  </span>

  <!-- Alert -->
  <div 
    v-if="error"
    class="alert"
    :style="{ ...getAlertColor('error'), padding: '1rem' }"
  >
    {{ error }}
  </div>
</template>

<script setup>
import { 
  getStockBadgeColor, 
  getStatusBadgeColor, 
  getAlertColor 
} from '@/constants/colors'
</script>
```

---

## 🎯 Patterns Courants

### Pattern 1: Charger une Entité
```javascript
export function useXxx() {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchXxx = async () => {
    loading.value = true
    try {
      const response = await getXxx()
      items.value = XxxService.parseXxx(response.data)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { items, loading, error, fetchXxx }
}
```

### Pattern 2: Supprimer une Entité
```javascript
const deleteXxxById = async (id) => {
  const refs = { loading, error, success, entities: items }
  return await GenericEntityService.delete(deleteXxx, id, refs)
}
```

### Pattern 3: Orchestre Plusieurs Requêtes
```javascript
const loadDetails = async (id) => {
  loading.value = true
  try {
    const [entityRes, relatedRes] = await Promise.all([
      getEntity(id),
      getRelated(id)
    ])
    
    entity.value = EntityService.parse(entityRes.data)
    related.value = RelatedService.parse(relatedRes.data)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
```

---

## ⚠️ Pièges Courants

### ❌ Ne pas faire:
```javascript
// ❌ Créer des refs partout
const id = ref(node.getElementsByTagName('id')[0]?.textContent)

// ❌ Logique métier dans la vue
<script setup>
const prices = products.map(p => p.price * 1.2)
</script>

// ❌ API call dans la vue
onMounted(async () => {
  products.value = (await getProducts()).data
})

// ❌ Colors en dur
:style="{ backgroundColor: '#4caf50' }"
```

### ✅ À la place:
```javascript
// ✅ Utiliser XMLNodeHelper
const id = XMLNodeHelper.getText(node, 'id')

// ✅ Logique dans le service
const prices = ProductService.parsePricesTTC(xmlData)

// ✅ API call dans composable
const { fetchProducts } = useProducts()
onMounted(() => fetchProducts())

// ✅ Colors des constantes
:style="getStockBadgeColor(quantity)"
```

---

## 📚 Pour Aller Plus Loin

- [ARCHITECTURE_PATTERNS.md](/ARCHITECTURE_PATTERNS.md) - Patterns détaillés
- [INTEGRATION_CHECKLIST.md](/INTEGRATION_CHECKLIST.md) - Checklist complète
- [FINAL_SUMMARY.md](/FINAL_SUMMARY.md) - Vue d'ensemble
- [XMLNodeHelper.js](/src/services/XMLNodeHelper.js) - Référence API
- [GenericEntityService.js](/src/services/GenericEntityService.js) - Référence CRUD

---

## 💬 Questions Fréquentes

**Q: J'ai oublié la bonne méthode XMLNodeHelper?**  
A: Regarde XMLNodeHelper.js - chaque méthode est documentée

**Q: Comment savoir si j'ai besoin de GenericEntityService?**  
A: Si tu écris try/catch + loading/error/success, utilise GenericEntityService

**Q: Où mets-je ma logique métier?**  
A: Dans le Service (ProductService, etc.), pas dans le composable

**Q: Comment tester les services?**  
A: Chaque Service est indépendant et testable

**Q: GenericEntityService accepte mes cas spéciaux?**  
A: Utilise `options` pour passer des paramètres personnalisés

---

**Bon code! 🚀**
