# 🚀 Plan d'Implémentation - Évaluation J1

## Sommaire

1. [Structuration du Projet](#structuration-du-projet)
2. [Phase 1: BackOffice - Authentification](#phase-1-backoffice---authentification)
3. [Phase 2: BackOffice - Import Données](#phase-2-backoffice---import-données)
4. [Phase 3: BackOffice - Commandes](#phase-3-backoffice---commandes)
5. [Phase 4: FrontOffice - Catalogue](#phase-4-frontoffice---catalogue)
6. [Phase 5: FrontOffice - Panier & Checkout](#phase-5-frontoffice---panier--checkout)
7. [Phase 6: FrontOffice - Mes Commandes](#phase-6-frontoffice---mes-commandes)
8. [Phase 7: Intégration Finale](#phase-7-intégration-finale)

---

## Structuration du Projet

### Répertoires à Créer

```
src/
├── views/
│   ├── Admin/
│   │   ├── AdminLogin.vue              ← Nouveau
│   │   ├── AdminDashboard.vue          ← Nouveau
│   │   ├── AdminReset.vue              ← Nouveau
│   │   ├── AdminImport.vue             ← Nouveau
│   │   └── AdminOrders.vue             ← Nouveau
│   ├── Shop/
│   │   ├── Home.vue                    ← Nouveau (catalogue)
│   │   ├── ProductDetail.vue           ← Nouveau
│   │   ├── Cart.vue                    ← Nouveau
│   │   ├── Checkout.vue                ← Nouveau
│   │   └── MyOrders.vue                ← Nouveau
│   └── Produits/
│       └── (existant)
│
├── api/
│   ├── admin.js                        ← Nouveau (login, reset)
│   ├── import.js                       ← Nouveau (import CSV/ZIP)
│   ├── orders.js                       ← Nouveau (récupérer/modifier commandes)
│   ├── customers.js                    ← Existant (utiliser)
│   ├── products.js                     ← Existant (utiliser)
│   └── (autres existants)
│
├── composables/
│   ├── admin/
│   │   ├── useAdminAuth.js             ← Nouveau
│   │   ├── useImport.js                ← Nouveau
│   │   └── useAdminOrders.js           ← Nouveau
│   ├── shop/
│   │   ├── useCart.js                  ← Nouveau
│   │   ├── useCheckout.js              ← Nouveau
│   │   ├── useCatalog.js               ← Nouveau
│   │   └── useMyOrders.js              ← Nouveau
│   └── (autres existants)
│
├── services/
│   ├── ImportService.js                ← Nouveau
│   ├── CSVParserService.js             ← Nouveau
│   └── (autres existants)
│
├── router/
│   └── index.js                        ← Modifier (ajouter routes)
│
├── stores/
│   └── cartStore.js                    ← Nouveau (Pinia ou ref)
│
└── App.vue                             ← Modifier (navigation)
```

---

## Phase 1: BackOffice - Authentification

### 1.1 Créer API: admin.js

**Fichier**: `src/api/admin.js`

```javascript
/**
 * API Admin
 * Login et gestion session
 */

export const adminLogin = async (email, password) => {
  // Validation simple côté client
  if (!email || !password) {
    throw new Error('Email et mot de passe requis')
  }

  // Données admin par défaut
  const ADMIN_EMAIL = 'admin@newapp.com'
  const ADMIN_PASSWORD = 'Admin123!'

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Simuler une session
    const session = {
      email,
      loggedIn: true,
      timestamp: Date.now()
    }
    sessionStorage.setItem('adminSession', JSON.stringify(session))
    return { success: true, user: email }
  } else {
    throw new Error('Email ou mot de passe incorrect')
  }
}

export const adminLogout = () => {
  sessionStorage.removeItem('adminSession')
}

export const isAdminLoggedIn = () => {
  const session = sessionStorage.getItem('adminSession')
  return session ? JSON.parse(session) : null
}
```

### 1.2 Créer Composable: useAdminAuth.js

**Fichier**: `src/composables/admin/useAdminAuth.js`

```javascript
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminLogin, adminLogout, isAdminLoggedIn } from '@/api/admin'

export function useAdminAuth() {
  const router = useRouter()
  const email = ref('admin@newapp.com')
  const password = ref('Admin123!')
  const loading = ref(false)
  const error = ref(null)
  const user = ref(isAdminLoggedIn())

  const login = async () => {
    loading.value = true
    error.value = null

    try {
      const result = await adminLogin(email.value, password.value)
      user.value = result.user
      await router.push('/admin/dashboard')
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    adminLogout()
    user.value = null
    router.push('/admin/login')
  }

  return {
    email,
    password,
    loading,
    error,
    user,
    login,
    logout
  }
}
```

### 1.3 Créer Component: AdminLogin.vue

**Fichier**: `src/views/Admin/AdminLogin.vue`

```vue
<template>
  <div class="admin-login">
    <div class="login-card">
      <h1>Connexion BackOffice</h1>
      
      <form @submit.prevent="login">
        <!-- Email -->
        <div class="form-group">
          <label>Email</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="admin@newapp.com"
            required
          />
        </div>

        <!-- Mot de passe -->
        <div class="form-group">
          <label>Mot de passe</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••"
            required
          />
        </div>

        <!-- Erreur -->
        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <!-- Bouton -->
        <button type="submit" :disabled="loading" class="btn btn-primary">
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <p class="hint">
        Défaut: admin@newapp.com / Admin123!
      </p>
    </div>
  </div>
</template>

<script setup>
import { useAdminAuth } from '@/composables/admin/useAdminAuth'

const { email, password, loading, error, login } = useAdminAuth()
</script>

<style scoped>
.admin-login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
}

.login-card h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.alert {
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 4px;
  background: #fee;
  color: #c33;
  border: 1px solid #fcc;
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.hint {
  text-align: center;
  color: #999;
  font-size: 12px;
  margin-top: 10px;
}
</style>
```

### 1.4 Router Guard

**Modifier**: `src/router/index.js`

```javascript
import { isAdminLoggedIn } from '@/api/admin'

export const requireAdminAuth = (to, from, next) => {
  if (!isAdminLoggedIn()) {
    next('/admin/login')
  } else {
    next()
  }
}

// Dans les routes:
{
  path: '/admin/dashboard',
  component: AdminDashboard,
  beforeEnter: requireAdminAuth
},
{
  path: '/admin/reset',
  component: AdminReset,
  beforeEnter: requireAdminAuth
},
{
  path: '/admin/import',
  component: AdminImport,
  beforeEnter: requireAdminAuth
},
{
  path: '/admin/orders',
  component: AdminOrders,
  beforeEnter: requireAdminAuth
}
```

---

## Phase 2: BackOffice - Import Données

### 2.1 Créer Service: CSVParserService.js

**Fichier**: `src/services/CSVParserService.js`

```javascript
/**
 * Service de parsing CSV
 */

export class CSVParserService {
  /**
   * Parse un fichier CSV en array d'objets
   * @param {string} csvContent - Contenu du CSV
   * @param {string[]} headers - En-têtes des colonnes
   * @returns {Array<Object>}
   */
  static parseCSV(csvContent, headers) {
    const lines = csvContent.trim().split('\n')
    const result = []

    // Ignorer la première ligne (en-têtes) si elle existe
    const startLine = this._isHeaderLine(lines[0], headers) ? 1 : 0

    for (let i = startLine; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = this._parseCSVLine(line)
      const obj = {}

      headers.forEach((header, index) => {
        obj[header] = values[index] || ''
      })

      result.push(obj)
    }

    return result
  }

  /**
   * Parse une ligne CSV en respectant les guillemets
   * @private
   */
  static _parseCSVLine(line) {
    const result = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }

    result.push(current.trim())
    return result
  }

  /**
   * Détecte si une ligne est l'en-tête
   * @private
   */
  static _isHeaderLine(line, expectedHeaders) {
    const values = this._parseCSVLine(line)
    return expectedHeaders.some(h => values.some(v => v.includes(h)))
  }
}
```

### 2.2 Créer Service: ImportService.js

**Fichier**: `src/services/ImportService.js`

```javascript
import { CSVParserService } from './CSVParserService'
import { 
  createProduct, createCategory, getCategories,
  createCustomer, createOrder
} from '@/api'

export class ImportService {
  /**
   * Importe les produits depuis CSV
   */
  static async importProducts(csvContent, onProgress) {
    onProgress(10, 'Parsing produits...')

    const headers = ['date_produit', 'nom', 'reference', 'prix_ttc', 'taxe', 'categorie', 'prix_achat']
    const products = CSVParserService.parseCSV(csvContent, headers)

    // Créer les catégories d'abord
    const categories = {}
    const uniqueCategories = [...new Set(products.map(p => p.categorie))]

    onProgress(15, `Création ${uniqueCategories.length} catégories...`)
    for (const catName of uniqueCategories) {
      try {
        const result = await createCategory(catName)
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(result, 'text/xml')
        const catId = xmlDoc.querySelector('category > id')?.textContent
        categories[catName] = catId
      } catch (err) {
        console.warn(`Catégorie ${catName} existe peut-être déjà`)
      }
    }

    // Créer les produits
    const createdProducts = []
    const step = 55 / products.length

    onProgress(20, 'Création des produits...')
    for (let i = 0; i < products.length; i++) {
      const p = products[i]
      const taxeRate = parseFloat(p.taxe) / 100
      const prixHT = parseFloat(p.prix_ttc) / (1 + taxeRate)

      const productXml = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop>
  <product>
    <name>
      <language id="1">${p.nom}</language>
    </name>
    <reference>${p.reference}</reference>
    <price>${prixHT.toFixed(2)}</price>
    <id_category_default>${categories[p.categorie] || 2}</id_category_default>
    <active>1</active>
    <date_add>${p.date_produit}</date_add>
  </product>
</prestashop>`

      try {
        const result = await createProduct(productXml)
        const xmlDoc = new DOMParser().parseFromString(result, 'text/xml')
        const productId = xmlDoc.querySelector('product > id')?.textContent
        createdProducts.push({ ...p, id: productId })
        
        onProgress(20 + (i * step), `Produit ${i + 1}/${products.length}`)
      } catch (err) {
        console.error(`Erreur création produit ${p.reference}:`, err)
      }
    }

    return createdProducts
  }

  /**
   * Importe les variantes depuis CSV
   */
  static async importVariants(csvContent, products, onProgress) {
    onProgress(75, 'Import variantes...')

    const headers = ['reference', 'specificite', 'karazany', 'stock_initial', 'prix_vente_ttc']
    const variants = CSVParserService.parseCSV(csvContent, headers)

    // TODO: Implémenter créa attributs + combinaisons
    // Voir PRODUCT_SCHEMA.md pour la structure

    onProgress(85, 'Variantes importées')
  }

  /**
   * Importe les clients et commandes depuis CSV
   */
  static async importOrders(csvContent, onProgress) {
    onProgress(85, 'Import clients et commandes...')

    const headers = ['date', 'nom', 'email', 'pwd', 'adresse', 'achat', 'etat']
    const orders = CSVParserService.parseCSV(csvContent, headers)

    // TODO: Créer clients et commandes

    onProgress(95, 'Clients et commandes importés')
  }

  /**
   * Importe les images depuis ZIP
   */
  static async importImages(zipFile, onProgress) {
    onProgress(95, 'Upload images...')

    const JSZip = require('jszip')
    const zip = new JSZip()
    const zipContent = await zip.loadAsync(zipFile)

    const files = Object.keys(zipContent.files)
    for (const filename of files) {
      if (filename.endsWith('/')) continue

      const file = await zipContent.files[filename].async('blob')
      const reference = filename.split('.')[0]

      // TODO: Trouver produit par référence et uploader image

      onProgress(95 + (5 * (files.indexOf(filename) / files.length)), filename)
    }

    onProgress(100, 'Import terminé')
  }
}
```

### 2.3 Créer API: import.js

**Fichier**: `src/api/import.js`

```javascript
import { ImportService } from '@/services/ImportService'

/**
 * Lance l'import complet
 */
export const importAllData = async (productsFile, variantsFile, ordersFile, imagesFile, onProgress) => {
  try {
    // 1. Parser les fichiers CSV
    const productsCsv = await productsFile.text()
    const variantsCsv = await variantsFile.text()
    const ordersCsv = await ordersFile.text()

    // 2. Importer produits
    const createdProducts = await ImportService.importProducts(productsCsv, onProgress)

    // 3. Importer variantes
    await ImportService.importVariants(variantsCsv, createdProducts, onProgress)

    // 4. Importer commandes
    await ImportService.importOrders(ordersCsv, onProgress)

    // 5. Importer images
    await ImportService.importImages(imagesFile, onProgress)

    onProgress(100, 'Import terminé avec succès ✅')
    return { success: true }
  } catch (err) {
    throw new Error(`Erreur lors de l'import: ${err.message}`)
  }
}
```

### 2.4 Créer Component: AdminImport.vue

**Fichier**: `src/views/Admin/AdminImport.vue`

```vue
<template>
  <div class="admin-import">
    <h1>Importer les Données</h1>

    <div class="import-container">
      <!-- Formulaire -->
      <form @submit.prevent="handleImport">
        <!-- Produits -->
        <div class="form-group">
          <label>📄 Produits (CSV)</label>
          <input 
            ref="productsInput"
            type="file" 
            accept=".csv"
            @change="productsFile = $event.target.files?.[0]"
          />
          <span v-if="productsFile" class="file-selected">✓ {{ productsFile.name }}</span>
        </div>

        <!-- Variantes -->
        <div class="form-group">
          <label>📄 Variantes (CSV)</label>
          <input 
            ref="variantsInput"
            type="file" 
            accept=".csv"
            @change="variantsFile = $event.target.files?.[0]"
          />
          <span v-if="variantsFile" class="file-selected">✓ {{ variantsFile.name }}</span>
        </div>

        <!-- Clients/Commandes -->
        <div class="form-group">
          <label>👥 Clients & Commandes (CSV)</label>
          <input 
            ref="ordersInput"
            type="file" 
            accept=".csv"
            @change="ordersFile = $event.target.files?.[0]"
          />
          <span v-if="ordersFile" class="file-selected">✓ {{ ordersFile.name }}</span>
        </div>

        <!-- Images -->
        <div class="form-group">
          <label>🖼️ Images (ZIP)</label>
          <input 
            ref="imagesInput"
            type="file" 
            accept=".zip"
            @change="imagesFile = $event.target.files?.[0]"
          />
          <span v-if="imagesFile" class="file-selected">✓ {{ imagesFile.name }}</span>
        </div>

        <button type="submit" :disabled="importing || !allFilesSelected" class="btn btn-primary">
          📤 Importer
        </button>
      </form>

      <!-- Progression -->
      <div v-if="importing" class="progress-section">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <p>{{ progress }}% - {{ message }}</p>
      </div>

      <!-- Erreur -->
      <div v-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <!-- Succès -->
      <div v-if="success" class="alert alert-success">
        {{ success }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { importAllData } from '@/api/import'

const productsFile = ref(null)
const variantsFile = ref(null)
const ordersFile = ref(null)
const imagesFile = ref(null)

const importing = ref(false)
const progress = ref(0)
const message = ref('')
const error = ref(null)
const success = ref(null)

const allFilesSelected = computed(() => 
  productsFile.value && variantsFile.value && ordersFile.value && imagesFile.value
)

const handleImport = async () => {
  error.value = null
  success.value = null
  importing.value = true

  try {
    await importAllData(
      productsFile.value,
      variantsFile.value,
      ordersFile.value,
      imagesFile.value,
      (progressValue, msg) => {
        progress.value = progressValue
        message.value = msg
      }
    )

    success.value = 'Import terminé avec succès! ✅'
  } catch (err) {
    error.value = err.message
  } finally {
    importing.value = false
  }
}
</script>

<style scoped>
.admin-import {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.admin-import h1 {
  margin-bottom: 30px;
}

.import-container {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.form-group input {
  display: block;
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.file-selected {
  display: block;
  color: #090;
  font-size: 12px;
  margin-top: 4px;
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.progress-section {
  margin-top: 30px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 4px;
}

.progress-bar {
  height: 20px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.progress-section p {
  margin: 0;
  color: #555;
  font-size: 14px;
}

.alert {
  padding: 12px;
  border-radius: 4px;
  margin-top: 20px;
}

.alert-error {
  background: #fee;
  color: #c33;
  border: 1px solid #fcc;
}

.alert-success {
  background: #efe;
  color: #3c3;
  border: 1px solid #cfc;
}
</style>
```

---

## Phase 3: BackOffice - Commandes

### 3.1 Créer API: orders.js

**Fichier**: `src/api/orders.js` (compléter si incomplet)

```javascript
import apiClient from './client'

export const getOrders = async () => {
  try {
    const response = await apiClient.get('/orders?display=full')
    return response.data
  } catch (error) {
    throw new Error(`Erreur getOrders: ${error.message}`)
  }
}

export const getOrder = async (id) => {
  try {
    const response = await apiClient.get(`/orders/${id}?display=full`)
    return response.data
  } catch (error) {
    throw new Error(`Erreur getOrder: ${error.message}`)
  }
}

export const updateOrder = async (id, orderXml) => {
  try {
    const response = await apiClient.put(`/orders/${id}`, orderXml)
    return response.data
  } catch (error) {
    throw new Error(`Erreur updateOrder: ${error.message}`)
  }
}

export const getOrderDetails = async (id) => {
  try {
    const response = await apiClient.get(`/order_details?filter[id_order]=${id}`)
    return response.data
  } catch (error) {
    throw new Error(`Erreur getOrderDetails: ${error.message}`)
  }
}
```

### 3.2 Créer Component: AdminOrders.vue

**Fichier**: `src/views/Admin/AdminOrders.vue`

(À implémenter - structure similaire à Details.vue existant)

```vue
<template>
  <div class="admin-orders">
    <h1>Gestion des Commandes</h1>

    <div class="orders-container">
      <!-- Liste commandes -->
      <div v-if="!selectedOrder" class="orders-list">
        <div v-if="loading" class="loading">Chargement...</div>
        <div v-else-if="orders.length === 0" class="empty">Aucune commande</div>
        
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <span>Commande #{{ order.id }}</span>
            <span class="customer">{{ order.customer_name }}</span>
            <span class="date">{{ formatDate(order.date_add) }}</span>
          </div>
          
          <div class="order-body">
            <p>Montant: {{ formatPrice(order.total_paid) }}</p>
            <select 
              :value="order.current_state" 
              @change="(e) => updateOrderState(order.id, e.target.value)"
            >
              <option value="1">En attente paiement à la livraison</option>
              <option value="2">Paiement accepté</option>
              <option value="6">Erreur de paiement</option>
              <option value="6">Annulé</option>
            </select>
          </div>

          <button @click="selectedOrder = order" class="btn-details">Détails</button>
        </div>
      </div>

      <!-- Détails commande -->
      <div v-else class="order-detail">
        <button @click="selectedOrder = null" class="btn-back">← Retour</button>
        
        <h2>Commande #{{ selectedOrder.id }}</h2>
        <p>Client: {{ selectedOrder.customer_name }}</p>
        <p>Email: {{ selectedOrder.customer_email }}</p>
        <p>Adresse: {{ selectedOrder.delivery_address }}</p>
        <p>Total: {{ formatPrice(selectedOrder.total_paid) }}</p>
        <p>État: {{ getStateName(selectedOrder.current_state) }}</p>

        <h3>Articles</h3>
        <!-- Lister les articles de la commande -->
        <div v-for="item in orderItems" :key="item.id" class="item">
          {{ item.product_name }} x{{ item.product_quantity }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getOrders, updateOrder, getOrderDetails, getOrder } from '@/api/orders'
import { XMLParserService } from '@/services'

const orders = ref([])
const selectedOrder = ref(null)
const orderItems = ref([])
const loading = ref(false)

const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR')
const formatPrice = (price) => `${parseFloat(price).toFixed(2).replace('.', ',')} €`

const getStateName = (state) => {
  const states = {
    '1': 'En attente paiement à la livraison',
    '2': 'Paiement accepté',
    '6': 'Annulé'
  }
  return states[state] || 'Inconnu'
}

const loadOrders = async () => {
  loading.value = true
  try {
    const xml = await getOrders()
    // Parser XML et mettre à jour orders.value
    // Utiliser XMLParserService pour parser
  } finally {
    loading.value = false
  }
}

const updateOrderState = async (orderId, newState) => {
  try {
    const xml = await getOrder(orderId)
    // Modifier l'état et envoyer
    // updateOrder(orderId, newXml)
  } catch (err) {
    alert('Erreur: ' + err.message)
  }
}

onMounted(loadOrders)
</script>

<style scoped>
/* À styles ... */
</style>
```

---

## Phase 4: FrontOffice - Catalogue

### 4.1 Créer Composable: useCatalog.js

**Fichier**: `src/composables/shop/useCatalog.js`

```javascript
import { ref, onMounted, computed } from 'vue'
import { getProducts } from '@/api/products'
import { XMLParserService, ProductService } from '@/services'

export function useCatalog() {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  const loadProducts = async () => {
    loading.value = true
    error.value = null

    try {
      const xml = await getProducts()
      
      // Parser les produits
      products.value = XMLParserService.parseXML(xml, 'product', (node) => {
        const getId = (tag) => node.getElementsByTagName(tag)[0]?.textContent || ''
        const getLang = (tag) => {
          const tagNode = node.getElementsByTagName(tag)[0]
          return XMLParserService.getLanguageText(tagNode) || ''
        }

        return {
          id: getId('id'),
          reference: getId('reference'),
          name: getLang('name'),
          price: parseFloat(getId('price')),
          priceTTC: ProductService.calculatePriceTTC(parseFloat(getId('price'))),
          image: ProductService.getImageUrl(getId('id'), 'medium_default')
        }
      })
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  onMounted(loadProducts)

  return {
    products: computed(() => products.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    loadProducts
  }
}
```

### 4.2 Créer Component: Home.vue (Catalogue)

**Fichier**: `src/views/Shop/Home.vue`

```vue
<template>
  <div class="shop-home">
    <header class="shop-header">
      <h1>NewApp - Boutique</h1>
      <nav>
        <router-link to="/">Accueil</router-link>
        <router-link to="/cart">
          Panier
          <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
        </router-link>
        <router-link to="/myorders">Mes Commandes</router-link>
      </nav>
    </header>

    <div class="catalog">
      <h2>Produits</h2>

      <div v-if="loading" class="loading">Chargement...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="products.length === 0" class="empty">Aucun produit</div>

      <div v-else class="products-grid">
        <div 
          v-for="product in products" 
          :key="product.id" 
          class="product-card"
          @click="$router.push(`/product/${product.reference}`)"
        >
          <img :src="product.image" :alt="product.name" class="product-image" />
          <h3>{{ product.name }}</h3>
          <p class="reference">{{ product.reference }}</p>
          <p class="price">{{ formatPrice(product.priceTTC) }} TTC</p>
          <button class="btn-details">Voir Détails</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCatalog } from '@/composables/shop/useCatalog'

const { products, loading, error } = useCatalog()

const cartCount = computed(() => {
  const cart = JSON.parse(sessionStorage.getItem('cart') || '{"items":[]}')
  return cart.items.length
})

const formatPrice = (price) => 
  `${parseFloat(price).toFixed(2).replace('.', ',')} €`
</script>

<style scoped>
.shop-home {
  min-height: 100vh;
}

.shop-header {
  background: #333;
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.shop-header h1 {
  margin: 0;
}

.shop-header nav {
  display: flex;
  gap: 20px;
}

.shop-header a {
  color: white;
  text-decoration: none;
  position: relative;
}

.badge {
  position: absolute;
  top: -8px;
  right: -10px;
  background: red;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.catalog {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.catalog h2 {
  margin-bottom: 30px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-4px);
}

.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;
}

.product-card h3 {
  margin: 10px 0 5px 0;
}

.reference {
  color: #999;
  font-size: 12px;
  margin: 5px 0;
}

.price {
  font-size: 18px;
  font-weight: 600;
  color: #667eea;
  margin: 10px 0;
}

.btn-details {
  width: 100%;
  padding: 8px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.btn-details:hover {
  background: #5568d3;
}

.loading, .error, .empty {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: red;
}
</style>
```

---

## Phase 5: FrontOffice - Panier & Checkout

### 5.1 Créer Store: cartStore.js

**Fichier**: `src/stores/cartStore.js`

```javascript
import { ref, computed } from 'vue'

const CART_KEY = 'newapp_cart'

export const useCartStore = () => {
  const items = ref(JSON.parse(sessionStorage.getItem(CART_KEY) || '[]'))

  const saveCart = () => {
    sessionStorage.setItem(CART_KEY, JSON.stringify(items.value))
  }

  const addToCart = (product, variante, quantity) => {
    const key = `${product.reference}_${variante}`
    const existing = items.value.find(item => item.key === key)

    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({
        key,
        reference: product.reference,
        name: product.name,
        variante: variante || '',
        quantity,
        priceTTC: product.priceTTC,
        priceHT: product.priceHT
      })
    }

    saveCart()
  }

  const removeFromCart = (key) => {
    items.value = items.value.filter(item => item.key !== key)
    saveCart()
  }

  const clearCart = () => {
    items.value = []
    saveCart()
  }

  const total = computed(() => 
    items.value.reduce((sum, item) => sum + (item.priceTTC * item.quantity), 0)
  )

  return {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    total,
    saveCart
  }
}
```

### 5.2 Créer Component: Cart.vue

(Voir Phase 4 pour structure - afficher les items du panier avec totaux)

### 5.3 Créer Component: Checkout.vue

(Formulaire de validation - voir spécification dans SUJET_EVALUATION_J1.md)

---

## Phase 6: FrontOffice - Mes Commandes

### 6.1 Créer Component: MyOrders.vue

(Afficher les commandes du client connecté)

---

## Phase 7: Intégration Finale

### Checklist d'Intégration

- [ ] Routes créées et testées
- [ ] Protection pages admin fonctionnelle
- [ ] Import CSV fonctionne
- [ ] Images uploadées
- [ ] Panier persiste en sessionStorage
- [ ] Checkout crée commandes préstaShop
- [ ] États commandes synchronisés
- [ ] Affichage images produits
- [ ] Listing produits complet
- [ ] Tests end-to-end

---

**Document créé**: 11 mai 2026
**Version**: 1.0 - Plan d'implémentation

