# 🏗️ Architecture NewApp - Services et Composables

## 📊 Diagramme d'Architecture

```
┌─────────────────────────────────────────┐
│        VUE COMPONENTS                   │
│   (Produits/Index.vue, etc.)            │
└──────────────┬──────────────────────────┘
               │ utilise
               ▼
┌──────────────────────────────────────┐
│      COMPOSABLES (Logique réactive)  │
│      src/composables/                │
│  • useProducts()                     │
│  • useCategories()                   │
│  Responsabilités:                    │
│  - État réactif (ref, computed)      │
│  - Gestion UI (loading, errors)      │
│  - Interaction utilisateur           │
└──────────────┬───────────────────────┘
               │ utilise
               ▼
┌──────────────────────────────────────┐
│      SERVICES (Logique métier pure)  │
│      src/services/                   │
│  • ProductService                    │
│  • CategoryService                   │
│  • StockService                      │
│  • XMLParserService                  │
│  Responsabilités:                    │
│  - Parsing XML                       │
│  - Transformation données            │
│  - Filtrage, tri, formatage          │
│  - Construction XML                  │
│  SANS dépendance Vue!                │
└──────────────┬───────────────────────┘
               │ utilise
               ▼
┌──────────────────────────────────────┐
│        API LAYER (HTTP)              │
│        src/api/                      │
│  • client.js (axios config)          │
│  • products.js (requêtes HTTP)       │
│  • categories.js                     │
│  • stocks.js                         │
│  Responsabilités:                    │
│  - Requêtes HTTP/REST                │
│  - Authentification                  │
│  - Gestion erreurs réseau            │
└──────────────┬───────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │  API PrestaShop      │
    │ (XML REST API)       │
    └──────────────────────┘
```

---

## 🔄 Flux de Données

### Exemple: Charger les produits

```
1️⃣  Component monte → appelle fetchProducts()
   
2️⃣  Composable useProducts.fetchProducts()
   └─ Appelé API via getProducts() et getStocks()
   └─ Reçoit XML brut
   └─ Appelle ProductService.parseProducts(xml, stocksMap)
   
3️⃣  Service ProductService
   └─ Parse XML → objets JavaScript
   └─ Mappe ID produit ↔ quantité stock
   └─ Formate les données
   └─ Retourne [{ id, name, price, quantity, ... }]
   
4️⃣  Composable stocke data dans products = ref([])
   └─ Computed filteredProducts réactif
   
5️⃣  Component affiche filteredProducts
   └─ Utilise services pour formatage (formatPrice, getStockColor)
```

---

## 📦 Services - Détail des Responsabilités

### **XMLParserService** ✅
Parsing générique de XML PrestaShop
- `parseXML(xmlString, nodeName, mapper)` - Parse n'importe quel XML
- `extractNodeData(node)` - Extrait données d'un nœud
- `getLanguageText(node)` - Récupère texte multilingue

**Usage:**
```javascript
const products = XMLParserService.parseXML(xml, 'product', customMapper)
```

---

### **ProductService** 📦
Logique métier des produits
- `parseProducts(xml, stocksMap)` - Parse + enrichit avec stocks
- `filterProducts(products, query)` - Recherche
- `sortProducts(products, sortBy)` - Tri
- `formatPrice(price)` - Format affichage
- `buildProductXml(product)` - Génère XML pour API
- `getStockBadgeColor(quantity)` - Couleurs stock
- `escapeXml(str)` - Échappe caractères XML

**Usage:**
```javascript
// Dans le service
const products = ProductService.parseProducts(xmlData, stocks)
const filtered = ProductService.filterProducts(products, 'tee')
const formatted = ProductService.formatPrice(29.99) // "29,99 €"

// Dans la vue
const color = ProductService.getStockBadgeColor(15) // { bg: '#4caf50', ... }
```

---

### **StockService** 📊
Logique métier des stocks
- `parseStocks(xml)` - Parse stocks en Map
- `buildStockXml(id, quantity)` - Génère XML
- `isLowStock(quantity, threshold)` - Vérifie seuil
- `formatQuantity(quantity)` - Format "0 (Rupture)", "5 (Faible)"

**Usage:**
```javascript
const stocks = StockService.parseStocks(xmlData)  // { "1": "15", "2": "0" }
const isLow = StockService.isLowStock(3)          // true
```

---

### **CategoryService** 🏷️
Logique métier des catégories
- `parseCategories(xml)` - Parse catégories
- `filterCategories(categories, query)` - Recherche
- `buildCategoryXml(category)` - Génère XML

---

## 🎣 Composables - Détail des Responsabilités

### **useProducts()** 🎣
Gère l'état réactif des produits

**État réactif:**
```javascript
const products = ref([])          // Données produits
const loading = ref(false)        // État chargement
const error = ref(null)           // Erreurs
const success = ref(null)         // Messages succès
const searchQuery = ref('')       // Filtrage utilisateur
const sortBy = ref('name')        // Tri utilisateur
const sortAscending = ref(true)   // Direction tri
```

**Computed:**
```javascript
const filteredProducts = computed(() => {
  // Filtre + tri basé sur l'entrée utilisateur
  let result = ProductService.filterProducts(products.value, searchQuery.value)
  return ProductService.sortProducts(result, sortBy.value, sortAscending.value)
})
```

**Méthodes:**
- `fetchProducts()` - Charge produits + stocks
- `deleteProductById(id)` - Supprime produit
- `addProduct(data)` - Crée produit
- `modifyProduct(id, data)` - Édite produit
- `formatPrice(price)` - Délègue au service
- `getStockColor(qty)` - Délègue au service

**Usage dans component:**
```vue
<script setup>
import { useProducts } from '@/composables/useProducts'

const { 
  products,
  filteredProducts,  // Computed réactif
  loading,
  error,
  fetchProducts,
  deleteProductById
} = useProducts()

onMounted(() => fetchProducts())
</script>
```

---

## 🆚 Différences Clés

| Aspect | Services | Composables |
|--------|----------|------------|
| **Importe Vue** | ❌ Non | ✅ Oui (`ref`, `computed`) |
| **Réactivité** | ❌ Non | ✅ Oui |
| **Stateful** | ❌ Non (pure functions) | ✅ Oui |
| **Testable** | ✅ Très (logique pure) | ⚠️ Moyenne |
| **Réutilisable** | ✅ Partout (CLI, API, worker) | 🔷 Vue uniquement |
| **Responsabilité** | Métier (parsing, filtrage) | UI (état, réactivité) |
| **Exemple** | Formatter prix | Gérer loading state |

---

## 📋 Exemple Complet

### Service (logique pure)
```javascript
// ProductService.js
export class ProductService {
  static parseProducts(xmlData, stocksMap) {
    // Parse XML, mappe données, retourne objets purs
    return products // Array d'objets JavaScript
  }
}
```

### Composable (logique réactive)
```javascript
// useProducts.js
import { ProductService } from '@/services'

export function useProducts() {
  const products = ref([])
  
  const fetchProducts = async () => {
    const xmlData = await getProducts()
    const stocksMap = await fetchStocks()
    
    // UTILISE le service pour transformer données
    products.value = ProductService.parseProducts(xmlData, stocksMap)
  }
  
  return { products, fetchProducts }
}
```

### Composant (affiche données)
```vue
<template>
  <div>
    <input v-model="searchQuery" />
    <div v-for="product in filteredProducts">
      {{ product.name }} - {{ formatPrice(product.price) }}
    </div>
  </div>
</template>

<script setup>
const { filteredProducts, formatPrice } = useProducts()
</script>
```

---

## ✅ Bonnes Pratiques

### ✅ À FAIRE

1. **Services** = Logique métier (pas de Vue)
2. **Composables** = Gestion UI réactive
3. **Composants** = Affichage uniquement
4. Déléguer au service depuis le composable
5. Tester services indépendamment

### ❌ À ÉVITER

1. ❌ Mettre code Vue dans services
2. ❌ Logique métier dans composants
3. ❌ Parsing XML dans composants
4. ❌ Services avec état (ref/computed)
5. ❌ Dépendances circulaires

---

## 🚀 Ajouter un Nouveau Feature

### 1. Créer le Service
```javascript
// src/services/MyEntityService.js
export class MyEntityService {
  static parseMyEntity(xml) { /* ... */ }
  static filterMyEntity(items, query) { /* ... */ }
  static buildMyEntityXml(data) { /* ... */ }
}
```

### 2. Créer l'API
```javascript
// src/api/myentity.js
export const getMyEntities = async () => {
  const response = await apiClient.get('/myentities')
  return response.data
}
```

### 3. Créer le Composable
```javascript
// src/composables/useMyEntity.js
import { ref } from 'vue'
import { getMyEntities } from '@/api/myentity'
import { MyEntityService } from '@/services'

export function useMyEntity() {
  const items = ref([])
  const fetchItems = async () => {
    const xml = await getMyEntities()
    items.value = MyEntityService.parseMyEntity(xml)
  }
  return { items, fetchItems }
}
```

### 4. Utiliser dans le Composant
```vue
<script setup>
import { useMyEntity } from '@/composables/useMyEntity'
const { items, fetchItems } = useMyEntity()
</script>
```

---

## 📁 Structure Finale

```
src/
├── api/
│   ├── client.js ................. Axios config
│   ├── products.js ............... Requêtes produits
│   ├── categories.js ............. Requêtes catégories
│   ├── stocks.js ................. Requêtes stocks
│   └── index.js
│
├── services/ ..................... LOGIQUE MÉTIER (PAS DE VUE!)
│   ├── XMLParserService.js ....... Parsing XML générique
│   ├── ProductService.js ......... Transformation produits
│   ├── StockService.js ........... Transformation stocks
│   ├── CategoryService.js ........ Transformation catégories
│   └── index.js
│
├── composables/ .................. LOGIQUE UI RÉACTIVE
│   ├── useProducts.js ............ État + réactivité produits
│   ├── useCategories.js .......... État + réactivité catégories
│   └── index.js
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.vue
│   │   └── Footer.vue
│   └── ... autres
│
└── views/
    ├── Produits/Index.vue ........ Utilise useProducts()
    ├── Categories/Index.vue ...... Utilise useCategories()
    └── ...
```

---

## 💡 Résumé

| Couche | Fichier | Responsabilité |
|--------|---------|-----------------|
| **Vue** | `*.vue` | Affichage + interactions |
| **Composable** | `use*.js` | État réactif Vue |
| **Service** | `*Service.js` | Logique métier pure |
| **API** | `api/*.js` | Requêtes HTTP |
