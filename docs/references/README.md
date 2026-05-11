# 📖 Documentation API PrestaShop - NewApp

Bienvenue! Cette documentation vous aidera à utiliser facilement l'API PrestaShop depuis votre application Vue.js.

---

## 📚 Fichiers de Référence

### 1. **listeApi.md** ⭐ (Ce que vous lirez en premier)
- Guide complet et lisible de tous les endpoints
- Organisé par catégorie (produits, clients, commandes, etc.)
- Tableaux avec les méthodes HTTP supportées
- Exemples d'utilisation

### 2. **api-endpoints.json** (Pour les développeurs)
- Structure JSON des endpoints
- Utilisable programmatiquement dans l'application
- Import via: `import apiEndpoints from '@/assets/api-endpoints.json'`

---

## 🛠️ Outils Disponibles

### Service Helper (`apiHelper.js`)

Facilite l'accès aux endpoints:

```javascript
import { 
  getEndpointsList,
  searchEndpoints,
  getEndpointsByCategory,
  getEndpointUrl,
  isMethodSupported 
} from '@/services/apiHelper'

// Récupère la liste complète
const all = getEndpointsList()

// Recherche
const results = searchEndpoints('product')

// Par catégorie
const products = getEndpointsByCategory('products')

// Vérifie une méthode
if (isMethodSupported('products', 'POST')) {
  // Créer un produit...
}
```

### Composant Explorateur (`ApiExplorer.vue`)

Interface visuelle pour explorer les endpoints:

```vue
<template>
  <ApiExplorer />
</template>

<script>
import ApiExplorer from '@/components/ApiExplorer.vue'

export default {
  components: { ApiExplorer }
}
</script>
```

---

## 🚀 Utilisation Rapide

### Récupérer les produits
```javascript
import { getProducts } from '@/services/prestashopApi'

const xmlData = await getProducts()
```

### Rechercher un endpoint
```javascript
import { searchEndpoints } from '@/services/apiHelper'

const matches = searchEndpoints('order')
// Retourne tous les endpoints contenant "order"
```

### Construire une URL complète
```javascript
import { getEndpointUrl } from '@/services/apiHelper'

const url = getEndpointUrl('customers')
// Retourne: http://localhost/EVAL/api/customers
```

---

## 📋 Catégories d'Endpoints Principales

| Catégorie | Nombre d'endpoints | Exemples |
|-----------|-------------------|----------|
| 🛍️ Produits | 10 | products, categories, combinations |
| 👥 Clients | 4 | customers, addresses, groups |
| 📋 Commandes | 8 | orders, invoices, payments |
| 🛒 Panier | 3 | carts, cart_rules |
| 💰 Stocks | 5 | stocks, stock_movements, prices |
| 🌍 Config | 7 | countries, currencies, languages |

---

## 🔗 Requêtes API de Base

Tous les endpoints supportent le format XML:

```javascript
// GET - Récupérer
fetch('/api/products?display=[id,name,price]', {
  method: 'GET',
  headers: {
    'Accept': 'text/xml',
    'Authorization': 'Basic ...'
  }
})

// POST - Créer
fetch('/api/products', {
  method: 'POST',
  body: xmlData,
  headers: {
    'Content-Type': 'text/xml',
    'Authorization': 'Basic ...'
  }
})
```

---

## 💡 Conseils

✅ **À faire:**
- Utiliser le service `prestashopApi.js` pour les requêtes
- Vérifier `listeApi.md` quand vous cherchez un endpoint
- Tester les URLs dans Postman avant de les coder
- Utiliser le proxy Vite (`/api/...`)

❌ **À éviter:**
- URLs absolues (`http://localhost/EVAL/api/...`)
- Passer l'authentification en dur dans le code
- Oublier de parser le XML côté client

---

## 🔄 Proxy Vite (Important!)

Le serveur Vite redirige automatiquement les requêtes:

```
Client Request: /api/products
        ↓
Vite Proxy
        ↓
PrestaShop Server: http://localhost/EVAL/api/products
```

Configuration dans `vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost/EVAL',
      changeOrigin: true
    }
  }
}
```

---

## 📞 Support & Ressources

| Ressource | URL |
|-----------|-----|
| Documentation markdown | `docs/listeApi.md` |
| Endpoints JSON | `src/assets/api-endpoints.json` |
| Service API | `src/services/prestashopApi.js` |
| Helper utilitaire | `src/services/apiHelper.js` |
| Explorateur UI | `src/components/ApiExplorer.vue` |

---

## 🎓 Exemple Complet

Charger et afficher les produits:

```vue
<template>
  <div>
    <button @click="loadProducts">Charger produits</button>
    <ul>
      <li v-for="product in products" :key="product.id">
        {{ product.name }} - {{ product.price }}€
      </li>
    </ul>
  </div>
</template>

<script>
import { getProducts } from '@/services/prestashopApi'

export default {
  data() {
    return {
      products: []
    }
  },
  methods: {
    async loadProducts() {
      try {
        const xmlData = await getProducts()
        const parser = new DOMParser()
        const doc = parser.parseFromString(xmlData, 'text/xml')
        
        this.products = Array.from(doc.querySelectorAll('product')).map(p => ({
          id: p.querySelector('id')?.textContent,
          name: p.querySelector('name language')?.textContent,
          price: p.querySelector('price')?.textContent
        }))
      } catch (error) {
        console.error('Erreur:', error)
      }
    }
  }
}
</script>
```

---

**Créé le:** 6 mai 2026  
**Version:** 1.0
