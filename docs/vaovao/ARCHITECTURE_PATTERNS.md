# 🏗️ Architecture Patterns Guide - NewApp

## Objectif
Document de référence pour maintenir la cohérence architecturale lors des évolutions

---

## 📂 Structure Recommandée

```
src/
├── api/                    # Appels API bas-niveau
│   ├── products.js        # CRUD produits brut
│   ├── categories.js      # CRUD catégories brut
│   └── manufacturers.js   # CRUD fabricants brut
│
├── services/              # Transformation + logique métier
│   ├── XMLParserService.js      # Parser XML générique
│   ├── XMLNodeHelper.js         # Utilitaires XML
│   ├── ProductService.js        # Transformation produits
│   ├── CategoryService.js       # Transformation catégories
│   ├── ManufacturerService.js   # Transformation fabricants
│   ├── StockService.js          # Gestion stocks
│   ├── GenericEntityService.js  # CRUD unifié
│   └── FileImporterService.js   # Import fichiers
│
├── composables/           # État + orchestration
│   ├── useProducts.js     # Liste produits
│   ├── useProductDetails.js  # Détails produit
│   ├── useCategories.js   # Liste catégories
│   └── useManufacturers.js  # Liste fabricants
│
├── views/                 # Pages
│   ├── Produits/
│   │   ├── Index.vue      # Liste
│   │   └── Details.vue    # Détails
│   └── Categories/
│       └── Index.vue      # Liste
│
├── components/            # Composants réutilisables
│   ├── ui/
│   │   ├── Alert.vue      # Alertes
│   │   ├── Button.vue     # Boutons
│   │   ├── Badge.vue      # Badges
│   │   └── Table.vue      # Tableaux
│   └── Product/
│       ├── ProductImage.vue
│       └── ProductBadge.vue
│
└── constants/             # Énumérations
    └── colors.js          # Couleurs + labels
```

---

## 🔄 Flow de Données Recommandé

```
API Endpoint
    ↓
api/*.js (requête brute)
    ↓
XMLParserService (parsing XML) 
    ↓
Service*.js (transformation + enrichissement)
    ↓
Composable useXxx.js (état + orchestration)
    ↓
Vue Component (affichage uniquement)
```

### Exemple: Charger Produits

```javascript
// 1. API: Requête brute
const response = await getProducts() // api/products.js
// → Retourne XML brut

// 2. Parser: Extraire l'XML
const xmlData = response.data      // XMLParserService utilise ça
// → XML parsé en DOM

// 3. Service: Transformer
const products = ProductService.parseProducts(
  xmlData,
  stocksMap,
  categoriesMap,
  imagesMap
) // → Tableaux objets JS

// 4. Composable: État + chargement
const { products, loading } = useProducts()
await fetchProducts() // → met à jour products

// 5. Vue: Afficher uniquement
<div v-for="p in products">{{ p.name }}</div>
```

---

## 🏛️ Patterns CRUD (Create, Read, Update, Delete)

### Cas 1: Appel Simple (Liste)
```javascript
// composable/useProducts.js
import { ref } from 'vue'
import { getProducts } from '@/api/products'
import { ProductService } from '@/services/ProductService'

export function useProducts() {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(null)

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

  // ✅ Utilise GenericEntityService
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

### Cas 2: Appel Compliqué (Détails)
```javascript
// composable/useProductDetails.js
import { ref } from 'vue'
import { GenericEntityService } from '@/services/GenericEntityService'

export function useProductDetails() {
  const product = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const loadProduct = async (productId) => {
    // ✅ Utilise GenericEntityService.call() pour orchestration
    product.value = await GenericEntityService.call(
      async () => {
        // Fetch parallèle
        const [productRes, stockRes, catRes] = await Promise.all([
          getProduct(productId),
          getStocks(),
          getCategories()
        ])
        
        // Transform
        return {
          ...ProductService.parseProduct(productRes.data),
          quantity: StockService.parseStocks(stockRes.data)[productId],
          categories: CategoryService.parseCategories(catRes.data)
        }
      },
      { loading, error }
    )
  }

  return { product, loading, error, loadProduct }
}
```

---

## 📝 Patterns de Service

### Pattern 1: Transformer une Réponse API

**Template:**
```javascript
// services/XxxService.js
import { XMLParserService } from './XMLParserService'
import { XMLNodeHelper } from './XMLNodeHelper'

export class XxxService {
  static parseXxx(xmlData) {
    // ✅ Utiliser XMLParserService.parseXML
    return XMLParserService.parseXML(xmlData, 'xxx', (node) => {
      // ✅ Utiliser XMLNodeHelper pour extraction
      return {
        id: XMLNodeHelper.getText(node, 'id'),
        name: XMLNodeHelper.getLangText(node, 'name', 'Sans nom'),
        active: XMLNodeHelper.getBoolean(node, 'active'),
        quantity: XMLNodeHelper.getNumber(node, 'quantity'),
        associations: {
          categoryIds: XMLNodeHelper.getAssociationIds(node, 'category')
        }
      }
    })
  }

  // ✅ Si image locale au service
  static getImageUrl(imageId, format = 'medium_default') {
    // Logique spécifique au format image
    return `/img/xxx/${imageId}-${format}.jpg`
  }
}
```

### Pattern 2: Centraliser la Logique

**Ne PAS faire:**
```javascript
// ❌ Duplication dans chaque composable
const deleteItem = async (id) => {
  loading.value = true
  try {
    await deleteApi(id)
    items.value = items.value.filter(i => i.id !== id)
    success.value = 'Supprimé'
    setTimeout(() => success.value = null, 3000)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
```

**Faire à la place:**
```javascript
// ✅ Utiliser GenericEntityService
import { GenericEntityService } from '@/services/GenericEntityService'

const deleteItem = async (id) => {
  const refs = { loading, error, success, entities: items }
  return await GenericEntityService.delete(deleteApi, id, refs, {
    updateList: true
  })
}
```

### Pattern 3: Gérer les Associations

**Si image + catégorie:**
```javascript
// services/ProductService.js
static parseProducts(xmlData, categoriesMap = {}, imagesMap = {}) {
  return XMLParserService.parseXML(xmlData, 'product', (node) => {
    const categoryId = XMLNodeHelper.getText(node, 'id_category_default')
    
    return {
      id: XMLNodeHelper.getText(node, 'id'),
      name: XMLNodeHelper.getLangText(node, 'name'),
      // ✅ Utiliser XMLNodeHelper pour maps
      category: XMLNodeHelper.getAssociationName(
        node, 
        'id_category_default', 
        categoriesMap, 
        'Sans catégorie'
      ),
      images: XMLNodeHelper.getImageUrls(
        node,
        (imgId) => this.getImageUrl(imgId),
        'medium_default'
      )
    }
  })
}
```

---

## 🎨 Patterns Vue Component

### Pattern 1: Affichage Simple (En Lecture Seule)
```vue
<!-- vue/Produits/Index.vue -->
<template>
  <div>
    <Alert v-if="error" type="error" :message="error" />
    <Alert v-if="success" type="success" :message="success" />
    
    <table v-if="!loading">
      <tr v-for="product in products" :key="product.id">
        <td>{{ product.id }}</td>
        <td>{{ product.name }}</td>
        <td>
          <!-- ✅ Utiliser les composants réutilisables -->
          <Badge :value="product.quantity" :color="getStockBadgeColor(product.quantity)" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { useProducts } from '@/composables/useProducts'
import { getStockBadgeColor } from '@/constants/colors'

const { products, loading, error, success, fetchProducts, deleteProductById } = useProducts()

// Appeler au montage
onMounted(() => fetchProducts())
</script>
```

### Pattern 2: Affichage avec Actions
```vue
<!-- Action DELETE avec confirmation -->
<template>
  <button 
    @click="handleDelete(product.id)"
    :disabled="loading"
  >
    Supprimer
  </button>
</template>

<script setup>
const handleDelete = async (id) => {
  if (!confirm('Êtes-vous sûr?')) return
  
  // ✅ GenericEntityService gère loading/error/success
  const deleted = await deleteProductById(id)
  if (deleted) {
    console.log('Suppression réussie')
  }
}
</script>
```

---

## 🚀 Ajouter une Nouvelle Entité

### Étapes:

1. **Créer l'API** (`src/api/xxx.js`):
```javascript
export async function getXxx() { /* fetch */ }
export async function deleteXxx(id) { /* delete */ }
```

2. **Créer le Service** (`src/services/XxxService.js`):
```javascript
export class XxxService {
  static parseXxx(xmlData) { /* transform */ }
}
```

3. **Créer le Composable** (`src/composables/useXxx.js`):
```javascript
export function useXxx() {
  const items = ref([])
  const { loading, error, success } = useStates()
  
  const fetchXxx = async () => { /* load */ }
  const deleteXxxById = async (id) => {
    return GenericEntityService.delete(deleteXxx, id, refs)
  }
  
  return { items, loading, error, fetchXxx, deleteXxxById }
}
```

4. **Créer la Vue** (`src/views/Xxx/Index.vue`):
```vue
<template>
  <div>
    <Alert v-if="error" type="error" :message="error" />
    <table>
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.name }}</td>
      </tr>
    </table>
  </div>
</template>
```

**Total: ~50 lignes pour une entité complète** ✅

---

## ⚠️ Anti-Patterns à Éviter

### ❌ Ne PAS faire:

1. **Logique métier dans les composants Vue**
   ```javascript
   // ❌ Mauvais
   <script setup>
   const parseProduct = (xml) => { /* 20 lignes de logique */ }
   </script>
   ```
   
   **✅ À la place**: Mettre dans ProductService

2. **Appels API directs dans les composants**
   ```javascript
   // ❌ Mauvais
   import { getProducts } from '@/api/products'
   const products = ref([])
   
   onMounted(async () => {
     products.value = (await getProducts()).data
   })
   ```
   
   **✅ À la place**: Utiliser le composable useProducts

3. **Duplication d'erreur handling**
   ```javascript
   // ❌ Mauvais
   try {
     await delete(id)
     success.value = 'OK'
   } catch { /* ... */ }
   
   try {
     await create(xml)
     success.value = 'OK'
   } catch { /* ... */ }
   ```
   
   **✅ À la place**: GenericEntityService

4. **Magic colors partout**
   ```javascript
   // ❌ Mauvais
   const color = quantity > 10 ? '#4caf50' : '#f44336'
   ```
   
   **✅ À la place**: getStockBadgeColor(quantity)

---

## 📊 Checklist Qualité

Avant de commit:

- [ ] Pas de duplication de code > 5 lignes?
- [ ] API bas-niveau dans `api/`?
- [ ] Transformation dans `services/`?
- [ ] Orchestration dans `composables/`?
- [ ] Vue n'a que du rendu?
- [ ] Erreurs gérées via GenericEntityService?
- [ ] Couleurs de `constants/`?
- [ ] XMLNodeHelper pour extraction XML?

---

## 🔗 Références

- [GenericEntityService.js](/src/services/GenericEntityService.js)
- [XMLNodeHelper.js](/src/services/XMLNodeHelper.js)
- [colors.js](/src/constants/colors.js)
- [REFACTORING_SUMMARY.md](/REFACTORING_SUMMARY.md)
- [INTEGRATION_CHECKLIST.md](/INTEGRATION_CHECKLIST.md)
