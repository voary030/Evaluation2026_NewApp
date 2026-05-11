# 📐 Architecture NewApp - Guide d'Intégration de Nouveaux Modules

## Vue d'Ensemble

NewApp suit une **architecture en couches** pour communiquer avec l'API WebService PrestaShop 8.2.6:

```
Vue Components (UI)
        ↓
Composables (State Management)
        ↓
Services (Business Logic + XML Transformation)
        ↓
Models (Data Validation + Serialization)
        ↓
API Layer (HTTP Communication)
        ↓
PrestaShop WebService (XML)
```

---

## � Module Produits - Statut Complet ✅

**Fonctionnalités Implémentées:**

✅ **Listing (Index.vue)**
- Affichage tous les produits avec tableau
- Recherche par nom/ID/référence
- Images miniatures
- Prix HT/TTC
- Stock avec badge couleur
- Actions: Voir | Éditer | Supprimer

✅ **Création (Create.vue - mode création)**
- Formulaire complet avec validation
- Catégories (sélecteur, requis)
- Fabricants (optionnel)
- Images (upload au montage)
- Stock automatique
- Aperçu en temps réel
- Prix HT/TTC calculés

✅ **Édition (Create.vue - mode édition)**
- Route: `/produits/:id/edit`
- Charge données existantes
- Modification complète
- Stock mis à jour
- Validation identique à création
- Bouton "Éditer" partout (Details + Index)

✅ **Détails (Details.vue)**
- Affichage complet produit
- Marque/fabricant avec description
- Images responsives
- Catégories associées
- Timestamps création/modification
- Bouton "Éditer" dans header
- Stock avec badge

✅ **Gestion Stock**
- Stock distinct (table stock_available)
- Mise à jour création/édition
- Quantité affichée partout
- Filtrage par produit (query filter)

✅ **Gestion Catégories**
- Catégorie par défaut (requis)
- Sélecteur au chargement
- Association produit

✅ **Images**
- Upload à la création
- Affichage au détail
- Miniatures
- **📖 Documentation complète**: Voir [IMAGE_MANAGEMENT.md](./IMAGE_MANAGEMENT.md)

---

```
src/
├── api/
│   └── products.js                    # Communication HTTP avec /products endpoint
├── services/
│   └── products/
│       ├── ProductService.js          # Transformation XML ↔ JS Objects
│       └── index.js
├── models/
│   └── products/
│       ├── Product.js                 # Validation + Serialization
│       └── index.js
├── composables/
│   └── products/
│       ├── useProductForm.js          # State pour création/édition
│       ├── useProductDetails.js       # State pour détails produit
│       ├── useProducts.js             # State pour liste
│       └── index.js
└── views/
    └── Produits/
        ├── Index.vue                  # Listing + Search
        ├── Create.vue                 # Formulaire création
        └── Details.vue                # Affichage détails
```

---

## 🔄 Flux de Données (Exemple: Création d'un Produit)

```
Vue Component (Create.vue)
    ↓ (form input)
Composable (useProductForm.js)
    ↓ (validates + builds)
Model (Product.js - toJSON())
    ↓ (serializes to XML)
Service (ProductService.buildProductXml())
    ↓ (POST XML)
API (products.js - createProduct())
    ↓ (HTTP request)
PrestaShop WebService
    ↓ (response XML)
API (extract ID + data)
    ↓ (parse XML)
Service (parse response)
    ↓ (transform to JS object)
Composable (update state)
    ↓ (UI updates)
Vue Component (success message)
```

---

## 📋 Checklist: Créer un Nouveau Module

### ✅ ÉTAPE 1: Créer la Structure des Répertoires

```bash
# Créer les dossiers
mkdir -p src/api
mkdir -p src/services/{nom-module}
mkdir -p src/models/{nom-module}
mkdir -p src/composables/{nom-module}
mkdir -p src/views/{NomModule}
```

### ✅ ÉTAPE 2: Créer l'API Layer

**Fichier: `src/api/{module}.js`**

```javascript
/**
 * API {Module}
 * Communication avec l'endpoint PrestaShop /endpoint
 */

import apiClient from './client'

/**
 * Récupère tous les {items}
 * @param {string} display - Champs à afficher
 * @returns {Promise<string>} Données XML
 */
export const getItems = async (display = 'full') => {
  try {
    const response = await apiClient.get(`/endpoint?display=${display}`)
    console.debug('[API.getItems] Réponse reçue')
    return response.data
  } catch (error) {
    console.error('[API.getItems] Erreur:', error.message)
    throw new Error(`Impossible de charger les items: ${error.message}`)
  }
}

/**
 * Récupère UN item
 * @param {number} id - ID de l'item
 * @returns {Promise<string>} Données XML
 */
export const getItem = async (id) => {
  try {
    const response = await apiClient.get(`/endpoint/${id}?display=full`)
    return response.data
  } catch (error) {
    console.error(`[API.getItem] Erreur ${id}:`, error.message)
    throw new Error(`Impossible de charger l'item: ${error.message}`)
  }
}

/**
 * Crée un nouvel item
 * @param {string} itemXml - Données XML
 * @returns {Promise<string>} Réponse XML avec ID
 */
export const createItem = async (itemXml) => {
  try {
    console.log('[API.createItem] XML envoyé:', itemXml.substring(0, 300))
    const response = await apiClient.post('/endpoint', itemXml)
    return response.data
  } catch (error) {
    console.error('[API.createItem] Erreur:', error.message)
    throw new Error(`Impossible de créer l'item: ${error.message}`)
  }
}

/**
 * Met à jour un item
 * @param {number} id - ID de l'item
 * @param {string} itemXml - Données XML complètes
 * @returns {Promise<string>} Réponse XML
 */
export const updateItem = async (id, itemXml) => {
  try {
    const response = await apiClient.put(`/endpoint/${id}`, itemXml)
    return response.data
  } catch (error) {
    console.error(`[API.updateItem] Erreur ${id}:`, error.message)
    throw new Error(`Impossible de mettre à jour l'item: ${error.message}`)
  }
}

/**
 * Supprime un item
 * @param {number} id - ID de l'item
 * @returns {Promise<void>}
 */
export const deleteItem = async (id) => {
  try {
    await apiClient.delete(`/endpoint/${id}`)
    console.log(`[API.deleteItem] Item ${id} supprimé`)
  } catch (error) {
    console.error(`[API.deleteItem] Erreur ${id}:`, error.message)
    throw new Error(`Impossible de supprimer l'item: ${error.message}`)
  }
}
```

**⚠️ Points importants:**
- Retourner **du XML brut** (string), pas d'objet
- Chaque fonction = 1 endpoint
- Logging systématique avec `[API.functionName]`
- Gestion d'erreurs cohérente

---

### ✅ ÉTAPE 3: Créer le Model

**Fichier: `src/models/{module}/{Item}.js`**

```javascript
/**
 * Model {Item}
 * Validation + Serialization pour {Item}
 */

export class Item {
  constructor(data = {}) {
    this.id = data.id || null
    this.name = data.name || ''
    this.description = data.description || ''
    this.active = data.active !== undefined ? data.active : true
    // ... autres propriétés
  }

  /**
   * Valide les champs requis
   * @throws {Error} Si validation échoue
   */
  validate() {
    const errors = []
    
    if (!this.name || this.name.trim() === '') {
      errors.push('Le nom est requis')
    }
    
    if (!this.description || this.description.trim() === '') {
      errors.push('La description est requise')
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '))
    }
  }

  /**
   * Sérialize pour JSON (excluant les champs non-sérialisables)
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      active: this.active ? 1 : 0
    }
  }

  /**
   * Parse depuis données XML
   */
  static fromXML(xmlNode) {
    return new Item({
      id: xmlNode.querySelector('id')?.textContent,
      name: xmlNode.querySelector('name')?.textContent,
      description: xmlNode.querySelector('description')?.textContent,
      active: xmlNode.querySelector('active')?.textContent === '1'
    })
  }
}
```

**⚠️ Points importants:**
- `validate()` lance une erreur si invalide
- `toJSON()` sérialise COMPLÈTEMENT (tous les champs, même XML-only)
- `fromXML()` parseur depuis DOM node
- Pas de logique métier, juste validation

---

### ✅ ÉTAPE 4: Créer le Service

**Fichier: `src/services/{module}/{Item}Service.js`**

```javascript
/**
 * Service {Item}
 * Transformation XML ↔ JS Objects
 */

import { XMLBuilderService } from '../XMLBuilderService'
import { Item } from '@/models/{module}/Item'

export class ItemService {
  /**
   * Parse un document XML complet → array d'Items
   * @param {string} xmlData - Données XML
   * @returns {Array<Item>}
   */
  static parseItems(xmlData) {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlData, 'text/xml')
      
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('Erreur parsing XML')
      }
      
      const items = []
      xmlDoc.querySelectorAll('item').forEach(node => {
        items.push(Item.fromXML(node))
      })
      
      console.log(`[ItemService.parseItems] ${items.length} item(s) parsé(s)`)
      return items
    } catch (error) {
      console.error('[ItemService.parseItems] Erreur:', error.message)
      return []
    }
  }

  /**
   * Construit XML pour création/mise à jour
   * @param {Item} item - L'item à sérialiser
   * @returns {string} XML formaté
   */
  static buildItemXml(item) {
    const builder = new XMLBuilderService()
    builder.addElement('item')
    
    // Ajouter TOUS les champs (même si null)
    builder.addNestedElement('name', item.name)
    builder.addNestedElement('description', item.description)
    builder.addNestedElement('active', item.active ? 1 : 0)
    
    const xml = builder.build()
    console.log('[ItemService.buildItemXml] XML généré:', xml.substring(0, 200))
    
    return xml
  }

  /**
   * Récupère map ID → Name pour sélecteurs
   * @param {Array<Item>} items - Array d'items
   * @returns {Object} {id: name, ...}
   */
  static buildIdNameMap(items) {
    return items.reduce((map, item) => {
      map[item.id] = item.name
      return map
    }, {})
  }
}

// Export par défaut pour import facile
export default ItemService
```

**⚠️ Points importants:**
- `parse*()` = XML → JS Objects
- `build*Xml()` = JS Object → XML (ALL fields!)
- Statique (pas de state)
- Logging systématique

---

### ✅ ÉTAPE 5: Créer le Composable

**Fichier: `src/composables/{module}/useItems.js`**

```javascript
/**
 * Composable useItems
 * State management pour listing d'items
 */

import { ref, computed, onMounted } from 'vue'
import { getItems, deleteItem } from '@/api/{module}'
import { ItemService } from '@/services/{module}/ItemService'

export const useItems = () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')

  // Computed: items filtrés
  const filteredItems = computed(() => {
    if (!searchQuery.value) return items.value
    
    const query = searchQuery.value.toLowerCase()
    return items.value.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    )
  })

  /**
   * Charge tous les items
   */
  const loadItems = async () => {
    loading.value = true
    error.value = null
    
    try {
      console.log('[useItems.loadItems] Chargement...')
      const response = await getItems('[id,name,description,active]')
      items.value = ItemService.parseItems(response)
      console.log(`[useItems.loadItems] ${items.value.length} item(s) chargé(s)`)
    } catch (err) {
      error.value = err.message
      console.error('[useItems.loadItems] Erreur:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Supprime un item
   */
  const removeItem = async (id) => {
    if (!confirm('Êtes-vous sûr?')) return
    
    try {
      await deleteItem(id)
      items.value = items.value.filter(item => item.id !== id)
      console.log(`[useItems.removeItem] Item ${id} supprimé`)
    } catch (err) {
      error.value = err.message
      console.error('[useItems.removeItem] Erreur:', err)
    }
  }

  // Charger au montage
  onMounted(loadItems)

  return {
    items,
    filteredItems,
    loading,
    error,
    searchQuery,
    loadItems,
    removeItem
  }
}
```

**⚠️ Points importants:**
- Logique d'état (ref, computed)
- Pas de logique UI (pas de router, alerts, etc.)
- Callbacks pour actions (loading, error)
- Logging systématique

---

### ✅ ÉTAPE 6: Créer la Vue Listing

**Fichier: `src/views/{Module}/Index.vue`**

```vue
<template>
  <div class="items-container">
    <div class="items-header">
      <h1>📋 Gestion des Items</h1>
      <router-link to="/items/create" class="btn btn-primary">
        ➕ Nouvel Item
      </router-link>
    </div>

    <!-- Erreur -->
    <div v-if="error" class="alert alert-error">
      {{ error }}
    </div>

    <!-- Barre de recherche -->
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="🔍 Rechercher..."
        class="search-input"
      />
    </div>

    <!-- Tableau -->
    <div v-if="!loading" class="items-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Actif</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item.id">
            <td>{{ item.id }}</td>
            <td>
              <router-link :to="`/items/${item.id}`" class="link">
                {{ item.name }}
              </router-link>
            </td>
            <td>{{ item.description }}</td>
            <td>
              <span :class="['status', item.active ? 'active' : 'inactive']">
                {{ item.active ? '✅ Oui' : '❌ Non' }}
              </span>
            </td>
            <td class="actions">
              <button @click="removeItem(item.id)" class="btn btn-danger btn-sm">
                🗑️ Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Chargement -->
    <div v-else class="loading">
      ⏳ Chargement...
    </div>
  </div>
</template>

<script setup>
import { useItems } from '@/composables/{module}/useItems'

const { items, filteredItems, loading, error, searchQuery, removeItem } = useItems()
</script>

<style scoped>
.items-container {
  padding: 2rem;
}

.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.search-bar {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

table {
  width: 100%;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f5f5f5;
  font-weight: 600;
  color: #333;
}

.link {
  color: #2196f3;
  text-decoration: none;
  cursor: pointer;
}

.link:hover {
  text-decoration: underline;
}

.status.active {
  color: #4caf50;
}

.status.inactive {
  color: #ff9800;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.alert-error {
  background: #fff5f5;
  color: #c62828;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border-left: 4px solid #f44336;
}
</style>
```

---

### ✅ ÉTAPE 7: Router - Ajouter les Routes

**Fichier: `src/router/index.js`**

```javascript
// Ajouter les imports
import ItemsIndex from '../views/Items/Index.vue'
import ItemsCreate from '../views/Items/Create.vue'
import ItemsDetails from '../views/Items/Details.vue'

// Ajouter dans le tableau routes:
{
  path: '/items',
  name: 'items',
  component: ItemsIndex,
  meta: { title: 'Items' }
},
{
  path: '/items/create',
  name: 'item-create',
  component: ItemsCreate,
  meta: { title: 'Créer un item' }
},
{
  path: '/items/:id',
  name: 'item-details',
  component: ItemsDetails,
  meta: { title: 'Détails Item' }
}
```

---

### ✅ ÉTAPE 8: Sidebar - Ajouter le Menu

**Fichier: `src/components/layout/Sidebar.vue`**

```vue
<li>
  <router-link to="/items">
    📦 Items
  </router-link>
</li>
```

---

## 🎯 Résumé de l'Architecture

| Couche | Fichier | Responsabilité |
|--------|---------|-----------------|
| **UI** | `views/{Module}/{View}.vue` | Affichage, input utilisateur |
| **State** | `composables/{module}/use*.js` | State reactivity, loading, errors |
| **Métier** | `services/{module}/*Service.js` | XML transformation, parsing |
| **Données** | `models/{module}/*.js` | Validation, serialization |
| **HTTP** | `api/{module}.js` | Endpoints PrestaShop |

---

## ⚡ Quick Start: Nouveau Module en 5 Min

**1. Copier la structure produits:**
```bash
cp -r src/api/products.js src/api/clients.js
cp -r src/models/products src/models/clients
cp -r src/services/products src/services/clients
cp -r src/composables/products/useProducts.js src/composables/clients/useClients.js
cp -r src/views/Produits src/views/Clients
```

**2. Remplacer partout:**
- `product/Product` → `client/Client`
- `/products` → `/customers` (endpoint PrestaShop)
- `useProductForm` → `useClientForm`

**3. Ajouter routes dans `router/index.js`**

**4. Ajouter menu dans `Sidebar.vue`**

**5. Tester!**

---

## 🔒 Patterns Importants

### ✅ TOUJOURS faire ça:
- ✅ Logging `[LayerName.functionName]` partout
- ✅ Validation dans Model.validate()
- ✅ Envoyer XML COMPLET aux PUT/POST
- ✅ Parser XML → Model dans Service
- ✅ State réactif dans Composables
- ✅ Erreurs en state (pas alert())

### ❌ JAMAIS faire ça:
- ❌ Logique métier dans Vue
- ❌ API calls directes depuis Vue
- ❌ Modifications du code source PrestaShop
- ❌ Omission de champs XML
- ❌ State global (Pinia etc) - Composables suffisent
- ❌ Oublier le logging

---

## � Pièges Courants & Solutions

### ⚠️ PIÈGE 1 (MAJEUR): **Données Distribuées sur Plusieurs Endpoints** 🔴

> **C'EST LE CHALLENGE PRINCIPAL DE L'API!**
> 
> PrestaShop fragmente les données d'une même entité sur **plusieurs endpoints**.
> Ignorer ce pattern = 90% des bugs de chargement/édition!

---

#### 📊 La Réalité de PrestaShop WebService

**L'API ne retourne JAMAIS "tout":**

```
Un "Produit" c'est en fait 5 endpoints!
- GET /products/:id                       (name, price, ref, description...)
- GET /stock_availables?filter[...]       (quantity)
- GET /images?filter[id_product]=:id      (images)
- GET /product_attributes?filter[...]     (variantes)
- GET /categories?filter[...]             (categories)
```

**Chaque endpoint = table séparée dans PrestaShop:**
- `products` table → `/products` endpoint
- `stock_available` table → `/stock_availables` endpoint
- `image` table → `/images` endpoint
- `product_attribute` table → `/product_attributes` endpoint
- `category_product` table → `/categories` endpoint

---

#### 📋 Matrice Complète: Entités & Données Séparées

| Entité | Endpoint Principal | Données Séparées | Endpoint Secondaire | Filter |
|--------|-------------------|------------------|---------------------|--------|
| **Produit** | `/products/:id` | Stock | `/stock_availables` | `?filter[id_product]=:id` |
| **Produit** | `/products/:id` | Images | `/images` | `?filter[id_product]=:id` |
| **Produit** | `/products/:id` | Variantes | `/product_attributes` | `?filter[id_product]=:id` |
| **Commande** | `/orders/:id` | Détails (items) | `/order_details` | `?filter[id_order]=:id` |
| **Commande** | `/orders/:id` | Historique état | `/order_histories` | `?filter[id_order]=:id` |
| **Client** | `/customers/:id` | Adresses | `/addresses` | `?filter[id_customer]=:id` |
| **Client** | `/customers/:id` | Commandes | `/orders` | `?filter[id_customer]=:id` |
| **Catégorie** | `/categories/:id` | Produits | `/products` | `?filter[id_category]=:id` |

---

#### 🔴 Le Bug Classique (Réel!)

**Le problème:**
```javascript
// ❌ MAUVAIS: On charge qu'1 API, on pense avoir toutes les données
const loadProductData = async (productId) => {
  const xmlData = await getProduct(productId)  // UNE seule API!
  const product = parseProduct(xmlData)
  
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: product.quantity || '0'  // ← ??? TOUJOURS vide ou 0!
  }
}
```

**Résultat:** Édition de produit = quantity disparaît (réinitialise à 0).

**Pourquoi?** Parce que `GET /products/:id` ne retourne **JAMAIS** le quantity!

---

#### ✅ La Solution: Pattern de Chargement Parallèle

**Identifier les dépendances:**
```
Produit = {
  data: GET /products/:id
  stock: GET /stock_availables?filter[id_product]=:id
  images: GET /images?filter[id_product]=:id
}
```

**Implémenter le chargement parallèle:**
```javascript
// ✅ BON: Charger TOUS les endpoints EN PARALLÈLE
const loadProductData = async (productId) => {
  const [xmlData, stockXml, imagesXml] = await Promise.all([
    getProduct(productId),              // Principal
    getProductStock(productId),         // Secondaire 1
    getProductImages(productId)         // Secondaire 2
  ])
  
  // Parser chaque réponse
  const product = parseProduct(xmlData)
  const stockEntries = parseStockEntries(stockXml)
  const images = parseImages(imagesXml)
  
  // Fusionner
  return {
    ...product,
    quantity: stockEntries[0]?.quantity || '0',  // ← VRAIE VALEUR
    images: images                               // ← VRAIES IMAGES
  }
}
```

**Résultat:** Toutes les données chargées, édition fonctionne parfaitement.

---

#### 🎯 3 Stratégies de Chargement

##### Stratégie 1: PARALLÈLE (Recommandée)

**Quand:** Données indépendantes, chargées ensemble, affichées ensemble
```javascript
const [mainData, secondaryData] = await Promise.all([
  getMain(id),
  getSecondary(id)
])
```
**Avantage:** Temps total = max(T1, T2) pas T1+T2
**Exemple:** Produit + Stock = ~50ms total au lieu de ~100ms

---

##### Stratégie 2: CASCADE (Dépendances)

**Quand:** Données B dépend du résultat de données A
```javascript
const mainData = await getMain(id)
const relatedIds = mainData.ids
const secondaryData = await Promise.all(
  relatedIds.map(rid => getSecondary(rid))
)
```
**Exemple:** 
- GET `/customers/:id` → récupère `id` et `id_address_default`
- PUIS GET `/addresses/:id` pour chaque adresse

---

##### Stratégie 3: LAZY (À la demande)

**Quand:** Données coûteuses, pas toujours nécessaires
```javascript
const product = await getProduct(id)  // Fast!

// Lazy load seulement si l'user clique "Voir images"
const images = await getProductImages(id)
```
**Exemple:** Produit sans images vs avec images

---

#### 🐛 Debugging: Comment Détecter ce Piège?

**Test 1: Créer & Éditer**
```
1. Créer produit avec quantity=100, name="Test"
2. Aller en édition
3. Vérifier: quantity affiche 100?
   ✓ OUI → Pas ce bug
   ✗ NON (affiche 0/vide) → C'EST LE BUG!
```

**Test 2: Vérifier l'API directement**
```bash
# Produit principal
curl "http://localhost/api/products/123?display=full"
# Chercher "quantity" dans réponse
# → Pas trouvé? → Données dans autre table!

# Essayer /stock_availables
curl "http://localhost/api/stock_availables?filter[id_product]=123"
# → Quantity ici!
```

**Test 3: Vérifier les API calls dans console**
```javascript
// Console.log dans loadProductData()
console.log('[useProductForm.loadProductData] Chargement produit...')
console.log('[useProductForm.loadProductData] Réponse produit:', xmlData)  // A-t-on quantity?
console.log('[useProductForm.loadProductData] Chargement stock...')
console.log('[useProductForm.loadProductData] Réponse stock:', stockXml)   // Quantity ici!
```

---

#### 📋 Checklist de Design pour Nouveau Module

Avant de coder un nouveau module:

- [ ] **Lister TOUTES les données du formulaire**
- [ ] **Pour chaque champ, demander:** "D'où vient cette données?"
- [ ] **Répondre pour CHACUN:**
  - "De GET `/endpoint` → Endpoint principal"
  - "De GET `/other_endpoint?filter[...]` → Endpoint secondaire → **À charger en parallèle!**"
- [ ] **Si > 1 endpoint → Implémenter `Promise.all()`**
- [ ] **Tester: créer + éditer → données persistent?**

---

#### ✅ Exemples Résolus

**Produits (RÉSOLU):**
```javascript
const [xmlData, stockXml] = await Promise.all([
  getProduct(productId),
  getProductStock(productId)
])
```

**Prochains à implémenter (Même pattern):**
- **Commandes:** `[getOrder(id), getOrderDetails(id)]`
- **Clients:** `[getCustomer(id), getCustomerAddresses(id)]`
- **Catégories:** `[getCategory(id), getCategoryProducts(id)]`

---

### ⚠️ PIÈGE 2: XML Incomplet aux Updates

**Le problème:**
PrestaShop WebService en mode `PUT` **remplace TOUS les champs**. Si on omet un champ, il devient NULL!

**❌ MAUVAIS:**
```javascript
// ❌ Envoyer XML partiel
const xml = `
  <product>
    <name>Nouveau Nom</name>
    <price>99.99</price>
  </product>
`
// Les autres champs (weight, reference, description...) deviennent NULL!
```

**✅ BON:**
```javascript
// ✅ Envoyer XML COMPLET
const xml = `
  <product>
    <name>Nouveau Nom</name>
    <price>99.99</price>
    <reference>REF-001</reference>
    <weight>1.5</weight>
    <description>...</description>
    <id_category_default>2</id_category_default>
    <!-- TOUS les champs même s'inchangés -->
  </product>
`
```

**Solution:**
- ✅ Toujours charger les données complètes avant édition
- ✅ Utiliser `Model.toJSON()` qui sérialise complètement
- ✅ `Service.buildXml()` ajoute TOUS les champs

---

### ⚠️ PIÈGE 3: Filtrage à l'API (pas au parsing)

**Le problème:**
Certains endpoints retournent **trop de résultats**, et on les filtre mal en parsing.

**Exemple: Stock**
```
GET /stock_availables
  ↓ Retourne TOUS les stocks (100+ entrées)
  
Si on cherche stock d'un produit:
  ❌ Charger TOUS, puis filter en JS = lent + risqué
  ✅ Filtrer À L'API = GET /stock_availables?filter[id_product]=123
```

**❌ MAUVAIS:**
```javascript
const stockXml = await apiClient.get(`/stock_availables`)
const stocks = parseStocks(stockXml)  // Parse 100+ entrées!
const productStock = stocks.find(s => s.id_product === productId)  // Cherche dedans
```

**✅ BON:**
```javascript
const stockXml = await apiClient.get(
  `/stock_availables?filter[id_product]=${productId}`
)
const stocks = parseStockEntries(stockXml)  // Parse 1-2 entrées seulement
const productStock = stocks[0]  // Première (et seule)
```

---

### ⚠️ PIÈGE 4: Langage & Multi-langue

**Le problème:**
PrestaShop supporte **plusieurs langues**. Certains champs sont multi-lang.

**Champs mono-lang:**
```xml
<id>1</id>
<price>99.99</price>
<reference>REF-001</reference>
<weight>1.5</weight>
```

**Champs multi-lang:**
```xml
<name>
  <language id="1">Produit Français</language>
  <language id="2">English Product</language>
</name>

<description>
  <language id="1">Description FR</language>
  <language id="2">Description EN</language>
</description>
```

**❌ MAUVAIS:**
```javascript
const name = XMLNodeHelper.getText(node, 'name')  // ← Retourne undefined!
```

**✅ BON:**
```javascript
const name = XMLNodeHelper.getLangText(node, 'name')  // ← Retourne première langue
// Ou spécifier: XMLNodeHelper.getLangText(node, 'name', 1)  // Français
```

---

## 📋 Checklist Nouveaux Modules

Avant de créer un module, vérifier:

### ✅ Données

- [ ] Toutes les données du formulaire viennent du MÊME endpoint?
  - Si **NON** → Charger en parallèle! (comme stock)
  - Si **OUI** → Single API call suffit

- [ ] Exemple: GET `/customers/:id`
  - Données client: `/customers`
  - Adresses: `/addresses?filter[id_customer]=X` (SÉPARÉ!)
  - Commandes: `/orders?filter[id_customer]=X` (SÉPARÉ!)

### ✅ Filtrage

- [ ] Vérifier `?filter[...]` sur chaque endpoint
- [ ] Ne PAS charger 1000 items pour en chercher 1!

### ✅ Multi-langue

- [ ] Quels champs sont multi-lang?
- [ ] Utiliser `getLangText()` pas `getText()`

### ✅ XML Complet en UPDATE

- [ ] Envoyer TOUS les champs
- [ ] Pas de NULL accidentels

---

## �📚 Exemple Complet: Module Clients

Voir `src/models/products/Product.js` pour un exemple réel de Model complet avec tous les champs.

Reproduire le même pattern pour Clients:
1. `Client.js` - Tous les champs du WebService
2. `ClientService.js` - Parse/build XML
3. `useClients.js` - State management
4. `useClientForm.js` - Formulaire
5. Vues - Index, Create, Details

---

## 🚀 Prochaines Étapes

Une fois un nouveau module créé:

1. **Tester l'API:**
   - `http://localhost/api/endpoint?display=full`
   - Noter les champs disponibles

2. **Vérifier les contraintes:**
   - Quels champs sont requis?
   - Quels champs sont multi-lang?
   - Y a-t-il des tables dépendantes?

3. **Adapter le Model:**
   - Ajouter tous les champs
   - Validation appropriée

4. **Tester en prod:**
   - `npm run build`
   - Vérifier pas d'erreurs de compilation
   - Tester sur vrai PrestaShop

---

## 📖 Références

- **PrestaShop WebService:** http://localhost/api/
- **Vue 3 Docs:** https://vuejs.org
- **Vite Docs:** https://vitejs.dev

---

**Créé le:** 9 mai 2026  
**Version:** 1.0  
**Status:** Production ✅
