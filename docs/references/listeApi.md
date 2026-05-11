# 📚 API PrestaShop - Guide d'Utilisation

**Shop:** ITU  
**Base URL:** `http://localhost/EVAL/api`

---

## 🚀 Démarrage Rapide

### Configuration de l'authentification
```javascript
import { getProducts, getCategories, getOrders } from '@/services/prestashopApi'

// Toutes les requêtes sont automatiquement authentifiées
```

---

## 📦 Endpoints Disponibles par Catégorie

### 🛍️ **PRODUITS & CATALOGUES**

| Endpoint | Description | GET | POST | PUT | PATCH | DELETE |
|----------|-------------|-----|------|-----|-------|--------|
| `/products` | Les produits | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/categories` | Catégories produits | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/combinations` | Variantes de produits | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/manufacturers` | Marques/Fournisseurs | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/suppliers` | Fournisseurs produits | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/product_features` | Caractéristiques produits | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/product_options` | Options produits | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/attachments` | Fichiers produits | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/tags` | Tags produits | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/images` | Images produits | ✅ | ✅ | ✅ | ✅ | ✅ |

### 👥 **CLIENTS & ADRESSES**

| Endpoint | Description | GET | POST | PUT | PATCH | DELETE |
|----------|-------------|-----|------|-----|-------|--------|
| `/customers` | Clients e-shop | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/addresses` | Adresses clients | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/groups` | Groupes clients | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/guests` | Clients invités | ✅ | ✅ | ✅ | ✅ | ✅ |

### 📋 **COMMANDES**

| Endpoint | Description | GET | POST | PUT | PATCH | DELETE |
|----------|-------------|-----|------|-----|-------|--------|
| `/orders` | Commandes clients | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/order_details` | Détails commandes | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/order_invoices` | Factures | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/order_slip` | Avoirs | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/order_histories` | Historique commandes | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/order_payments` | Paiements commandes | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/order_states` | États commandes | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/order_carriers` | Transporteurs | ✅ | ✅ | ✅ | ✅ | ✅ |

### 🛒 **PANIER & RÈGLES**

| Endpoint | Description | GET | POST | PUT | PATCH | DELETE |
|----------|-------------|-----|------|-----|-------|--------|
| `/carts` | Paniers clients | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/cart_rules` | Règles panier | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/order_cart_rules` | Règles appliquées | ✅ | ✅ | ✅ | ✅ | ✅ |

### 💰 **PRIX & STOCKS**

| Endpoint | Description | GET | POST | PUT | PATCH | DELETE |
|----------|-------------|-----|------|-----|-------|--------|
| `/stocks` | Stocks | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/stock_availables` | Quantités disponibles | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/stock_movements` | Mouvements stock | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/specific_prices` | Prix spécifiques | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/price_ranges` | Paliers prix | ✅ | ✅ | ✅ | ✅ | ✅ |

### 🌍 **CONFIGURATION & LOCALISATION**

| Endpoint | Description | GET | POST | PUT | PATCH | DELETE |
|----------|-------------|-----|------|-----|-------|--------|
| `/configurations` | Configuration shop | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/countries` | Pays | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/states` | États/Régions | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/zones` | Zones géographiques | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/currencies` | Devises | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/languages` | Langues | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/carriers` | Transporteurs | ✅ | ✅ | ✅ | ✅ | ✅ |

### 👔 **ADMINISTRATION**

| Endpoint | Description | GET | POST | PUT | PATCH | DELETE |
|----------|-------------|-----|------|-----|-------|--------|
| `/employees` | Employés | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/contacts` | Contacts shop | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/messages` | Messages | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/customer_messages` | Messages clients | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/customer_threads` | Fils discussions | ✅ | ✅ | ✅ | ✅ | ✅ |

### 💳 **TAXES & PAIEMENTS**

| Endpoint | Description | GET | POST | PUT | PATCH | DELETE |
|----------|-------------|-----|------|-----|-------|--------|
| `/taxes` | Taux TVA | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/tax_rules` | Règles fiscales | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/tax_rule_groups` | Groupes fiscaux | ✅ | ✅ | ✅ | ✅ | ✅ |

### 🏪 **MULTI-SHOP & DIVERS**

| Endpoint | Description | GET | POST | PUT | PATCH | DELETE |
|----------|-------------|-----|------|-----|-------|--------|
| `/shops` | Boutiques | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/shop_groups` | Groupes boutiques | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/shop_urls` | URLs boutiques | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/warehouses` | Entrepôts | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/stores` | Points de vente | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/content_management_system` | CMS | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/search` | Recherche | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 💡 Exemples d'Utilisation

### Récupérer les produits
```javascript
import { getProducts } from '@/services/prestashopApi'

async function loadProducts() {
  try {
    const xmlData = await getProducts()
    // Parse et utilise les données
  } catch (error) {
    console.error('Erreur:', error)
  }
}
```

### Récupérer les clients
```javascript
const response = await fetch('/api/customers', {
  headers: {
    'Authorization': 'Basic ...',
    'Accept': 'text/xml'
  }
})
```

### Récupérer les commandes
```javascript
const response = await fetch('/api/orders?display=[id,reference,total_paid]', {
  headers: {
    'Authorization': 'Basic ...',
    'Accept': 'text/xml'
  }
})
```

---

## 📊 Paramètres de Requête Courants

### Filtrage
```
?display=[id,name,price]  # Affiche uniquement ces champs
?filter[name]=Test        # Filtre par name
?limit=10&offset=0        # Pagination
```

### Schémas
```
?schema=blank             # Structure vierge
?schema=synopsis          # Vue d'ensemble
```

---

## 🔗 Ressources Utiles

- **Schéma vierge produits:** `/api/products?schema=blank`
- **Synopsis produits:** `/api/products?schema=synopsis`
- **Requête de test:** `/api/products?display=[id,name,price]`

---

## ⚙️ Configuration Proxy (Vite)

Le proxy Vite relie automatiquement `/api` vers `http://localhost/EVAL/api`

```javascript
// Dans vite.config.js
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

**Dernière mise à jour:** 6 mai 2026

<!-- LEGACY XML ENDPOINTS REFERENCE - Preserved for reference only -->
<!--
API PrestaShop
<addresses xlink:href="http://localhost/EVAL/api/addresses" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/addresses" get="true" put="true" post="true" patch="true" delete="true" head="true"> The Customer, Brand and Customer addresses</description>
<schema xlink:href="http://localhost/EVAL/api/addresses?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/addresses?schema=synopsis" type="synopsis"/>
</addresses>
<attachments xlink:href="http://localhost/EVAL/api/attachments" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/attachments" get="true" put="true" post="true" patch="true" delete="true" head="true"> The product Attachments</description>
</attachments>
<carriers xlink:href="http://localhost/EVAL/api/carriers" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/carriers" get="true" put="true" post="true" patch="true" delete="true" head="true"> The Carriers</description>
<schema xlink:href="http://localhost/EVAL/api/carriers?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/carriers?schema=synopsis" type="synopsis"/>
</carriers>
<cart_rules xlink:href="http://localhost/EVAL/api/cart_rules" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/cart_rules" get="true" put="true" post="true" patch="true" delete="true" head="true"> Cart rules management</description>
<schema xlink:href="http://localhost/EVAL/api/cart_rules?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/cart_rules?schema=synopsis" type="synopsis"/>
</cart_rules>
<carts xlink:href="http://localhost/EVAL/api/carts" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/carts" get="true" put="true" post="true" patch="true" delete="true" head="true"> Customer's carts</description>
<schema xlink:href="http://localhost/EVAL/api/carts?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/carts?schema=synopsis" type="synopsis"/>
</carts>
<categories xlink:href="http://localhost/EVAL/api/categories" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/categories" get="true" put="true" post="true" patch="true" delete="true" head="true"> The product categories</description>
<schema xlink:href="http://localhost/EVAL/api/categories?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/categories?schema=synopsis" type="synopsis"/>
</categories>
<combinations xlink:href="http://localhost/EVAL/api/combinations" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/combinations" get="true" put="true" post="true" patch="true" delete="true" head="true"> The product combinations</description>
<schema xlink:href="http://localhost/EVAL/api/combinations?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/combinations?schema=synopsis" type="synopsis"/>
</combinations>
<configurations xlink:href="http://localhost/EVAL/api/configurations" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/configurations" get="true" put="true" post="true" patch="true" delete="true" head="true"> Shop configuration</description>
<schema xlink:href="http://localhost/EVAL/api/configurations?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/configurations?schema=synopsis" type="synopsis"/>
</configurations>
<contacts xlink:href="http://localhost/EVAL/api/contacts" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/contacts" get="true" put="true" post="true" patch="true" delete="true" head="true"> Shop contacts</description>
<schema xlink:href="http://localhost/EVAL/api/contacts?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/contacts?schema=synopsis" type="synopsis"/>
</contacts>
<content_management_system xlink:href="http://localhost/EVAL/api/content_management_system" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/content_management_system" get="true" put="true" post="true" patch="true" delete="true" head="true"> Content management system</description>
<schema xlink:href="http://localhost/EVAL/api/content_management_system?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/content_management_system?schema=synopsis" type="synopsis"/>
</content_management_system>
<countries xlink:href="http://localhost/EVAL/api/countries" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/countries" get="true" put="true" post="true" patch="true" delete="true" head="true"> The countries</description>
<schema xlink:href="http://localhost/EVAL/api/countries?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/countries?schema=synopsis" type="synopsis"/>
</countries>
<currencies xlink:href="http://localhost/EVAL/api/currencies" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/currencies" get="true" put="true" post="true" patch="true" delete="true" head="true"> The currencies</description>
<schema xlink:href="http://localhost/EVAL/api/currencies?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/currencies?schema=synopsis" type="synopsis"/>
</currencies>
<customer_messages xlink:href="http://localhost/EVAL/api/customer_messages" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/customer_messages" get="true" put="true" post="true" patch="true" delete="true" head="true"> Customer services messages</description>
<schema xlink:href="http://localhost/EVAL/api/customer_messages?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/customer_messages?schema=synopsis" type="synopsis"/>
</customer_messages>
<customer_threads xlink:href="http://localhost/EVAL/api/customer_threads" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/customer_threads" get="true" put="true" post="true" patch="true" delete="true" head="true"> Customer services threads</description>
<schema xlink:href="http://localhost/EVAL/api/customer_threads?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/customer_threads?schema=synopsis" type="synopsis"/>
</customer_threads>
<customers xlink:href="http://localhost/EVAL/api/customers" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/customers" get="true" put="true" post="true" patch="true" delete="true" head="true"> The e-shop's customers</description>
<schema xlink:href="http://localhost/EVAL/api/customers?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/customers?schema=synopsis" type="synopsis"/>
</customers>
<customizations xlink:href="http://localhost/EVAL/api/customizations" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/customizations" get="true" put="true" post="true" patch="true" delete="true" head="true"> Customization values</description>
<schema xlink:href="http://localhost/EVAL/api/customizations?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/customizations?schema=synopsis" type="synopsis"/>
</customizations>
<deliveries xlink:href="http://localhost/EVAL/api/deliveries" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/deliveries" get="true" put="true" post="true" patch="true" delete="true" head="true"> Product delivery</description>
<schema xlink:href="http://localhost/EVAL/api/deliveries?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/deliveries?schema=synopsis" type="synopsis"/>
</deliveries>
<employees xlink:href="http://localhost/EVAL/api/employees" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/employees" get="true" put="true" post="true" patch="true" delete="true" head="true"> The Employees</description>
<schema xlink:href="http://localhost/EVAL/api/employees?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/employees?schema=synopsis" type="synopsis"/>
</employees>
<groups xlink:href="http://localhost/EVAL/api/groups" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/groups" get="true" put="true" post="true" patch="true" delete="true" head="true"> The customer's groups</description>
<schema xlink:href="http://localhost/EVAL/api/groups?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/groups?schema=synopsis" type="synopsis"/>
</groups>
<guests xlink:href="http://localhost/EVAL/api/guests" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/guests" get="true" put="true" post="true" patch="true" delete="true" head="true"> The guests</description>
<schema xlink:href="http://localhost/EVAL/api/guests?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/guests?schema=synopsis" type="synopsis"/>
</guests>
<image_types xlink:href="http://localhost/EVAL/api/image_types" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/image_types" get="true" put="true" post="true" patch="true" delete="true" head="true"> The image types</description>
<schema xlink:href="http://localhost/EVAL/api/image_types?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/image_types?schema=synopsis" type="synopsis"/>
</image_types>
<images xlink:href="http://localhost/EVAL/api/images" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/images" get="true" put="true" post="true" patch="true" delete="true" head="true"> The images</description>
</images>
<klaviyo xlink:href="http://localhost/EVAL/api/klaviyo" get="true" put="true" post="true" patch="false" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/klaviyo" get="true" put="true" post="true" patch="false" delete="true" head="true"> Klaviyo custom endpoints</description>
</klaviyo>
<languages xlink:href="http://localhost/EVAL/api/languages" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/languages" get="true" put="true" post="true" patch="true" delete="true" head="true"> Shop languages</description>
<schema xlink:href="http://localhost/EVAL/api/languages?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/languages?schema=synopsis" type="synopsis"/>
</languages>
<manufacturers xlink:href="http://localhost/EVAL/api/manufacturers" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/manufacturers" get="true" put="true" post="true" patch="true" delete="true" head="true"> The product brands</description>
<schema xlink:href="http://localhost/EVAL/api/manufacturers?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/manufacturers?schema=synopsis" type="synopsis"/>
</manufacturers>
<messages xlink:href="http://localhost/EVAL/api/messages" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/messages" get="true" put="true" post="true" patch="true" delete="true" head="true"> The Messages</description>
<schema xlink:href="http://localhost/EVAL/api/messages?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/messages?schema=synopsis" type="synopsis"/>
</messages>
<order_carriers xlink:href="http://localhost/EVAL/api/order_carriers" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/order_carriers" get="true" put="true" post="true" patch="true" delete="true" head="true"> The Order carriers</description>
<schema xlink:href="http://localhost/EVAL/api/order_carriers?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/order_carriers?schema=synopsis" type="synopsis"/>
</order_carriers>
<order_cart_rules xlink:href="http://localhost/EVAL/api/order_cart_rules" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/order_cart_rules" get="true" put="true" post="true" patch="true" delete="true" head="true"> The Order cart rules</description>
<schema xlink:href="http://localhost/EVAL/api/order_cart_rules?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/order_cart_rules?schema=synopsis" type="synopsis"/>
</order_cart_rules>
<order_details xlink:href="http://localhost/EVAL/api/order_details" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/order_details" get="true" put="true" post="true" patch="true" delete="true" head="true"> Details of an order</description>
<schema xlink:href="http://localhost/EVAL/api/order_details?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/order_details?schema=synopsis" type="synopsis"/>
</order_details>
<order_histories xlink:href="http://localhost/EVAL/api/order_histories" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/order_histories" get="true" put="true" post="true" patch="true" delete="true" head="true"> The Order histories</description>
<schema xlink:href="http://localhost/EVAL/api/order_histories?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/order_histories?schema=synopsis" type="synopsis"/>
</order_histories>
<order_invoices xlink:href="http://localhost/EVAL/api/order_invoices" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/order_invoices" get="true" put="true" post="true" patch="true" delete="true" head="true"> The Order invoices</description>
<schema xlink:href="http://localhost/EVAL/api/order_invoices?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/order_invoices?schema=synopsis" type="synopsis"/>
</order_invoices>
<order_payments xlink:href="http://localhost/EVAL/api/order_payments" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/order_payments" get="true" put="true" post="true" patch="true" delete="true" head="true"> The Order payments</description>
<schema xlink:href="http://localhost/EVAL/api/order_payments?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/order_payments?schema=synopsis" type="synopsis"/>
</order_payments>
<order_slip xlink:href="http://localhost/EVAL/api/order_slip" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/order_slip" get="true" put="true" post="true" patch="true" delete="true" head="true"> The Order slips</description>
<schema xlink:href="http://localhost/EVAL/api/order_slip?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/order_slip?schema=synopsis" type="synopsis"/>
</order_slip>
<order_states xlink:href="http://localhost/EVAL/api/order_states" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/order_states" get="true" put="true" post="true" patch="true" delete="true" head="true"> The Order statuses</description>
<schema xlink:href="http://localhost/EVAL/api/order_states?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/order_states?schema=synopsis" type="synopsis"/>
</order_states>
<orders xlink:href="http://localhost/EVAL/api/orders" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/orders" get="true" put="true" post="true" patch="true" delete="true" head="true"> The Customers orders</description>
<schema xlink:href="http://localhost/EVAL/api/orders?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/orders?schema=synopsis" type="synopsis"/>
</orders>
<price_ranges xlink:href="http://localhost/EVAL/api/price_ranges" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/price_ranges" get="true" put="true" post="true" patch="true" delete="true" head="true"> Price ranges</description>
<schema xlink:href="http://localhost/EVAL/api/price_ranges?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/price_ranges?schema=synopsis" type="synopsis"/>
</price_ranges>
<product_customization_fields xlink:href="http://localhost/EVAL/api/product_customization_fields" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/product_customization_fields" get="true" put="true" post="true" patch="true" delete="true" head="true"> Customization Field</description>
<schema xlink:href="http://localhost/EVAL/api/product_customization_fields?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/product_customization_fields?schema=synopsis" type="synopsis"/>
</product_customization_fields>
<product_feature_values xlink:href="http://localhost/EVAL/api/product_feature_values" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/product_feature_values" get="true" put="true" post="true" patch="true" delete="true" head="true"> The product feature values</description>
<schema xlink:href="http://localhost/EVAL/api/product_feature_values?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/product_feature_values?schema=synopsis" type="synopsis"/>
</product_feature_values>
<product_features xlink:href="http://localhost/EVAL/api/product_features" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/product_features" get="true" put="true" post="true" patch="true" delete="true" head="true"> The product features</description>
<schema xlink:href="http://localhost/EVAL/api/product_features?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/product_features?schema=synopsis" type="synopsis"/>
</product_features>
<product_option_values xlink:href="http://localhost/EVAL/api/product_option_values" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/product_option_values" get="true" put="true" post="true" patch="true" delete="true" head="true"> The product options value</description>
<schema xlink:href="http://localhost/EVAL/api/product_option_values?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/product_option_values?schema=synopsis" type="synopsis"/>
</product_option_values>
<product_options xlink:href="http://localhost/EVAL/api/product_options" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/product_options" get="true" put="true" post="true" patch="true" delete="true" head="true"> The product options</description>
<schema xlink:href="http://localhost/EVAL/api/product_options?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/product_options?schema=synopsis" type="synopsis"/>
</product_options>
<product_suppliers xlink:href="http://localhost/EVAL/api/product_suppliers" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/product_suppliers" get="true" put="true" post="true" patch="true" delete="true" head="true"> Product Suppliers</description>
<schema xlink:href="http://localhost/EVAL/api/product_suppliers?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/product_suppliers?schema=synopsis" type="synopsis"/>
</product_suppliers>
<products xlink:href="http://localhost/EVAL/api/products" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/products" get="true" put="true" post="true" patch="true" delete="true" head="true"> The products</description>
<schema xlink:href="http://localhost/EVAL/api/products?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/products?schema=synopsis" type="synopsis"/>
</products>
<search xlink:href="http://localhost/EVAL/api/search" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/search" get="true" put="true" post="true" patch="true" delete="true" head="true"> Search</description>
</search>
<shop_groups xlink:href="http://localhost/EVAL/api/shop_groups" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/shop_groups" get="true" put="true" post="true" patch="true" delete="true" head="true"> Shop groups from multi-shop feature</description>
<schema xlink:href="http://localhost/EVAL/api/shop_groups?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/shop_groups?schema=synopsis" type="synopsis"/>
</shop_groups>
<shop_urls xlink:href="http://localhost/EVAL/api/shop_urls" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/shop_urls" get="true" put="true" post="true" patch="true" delete="true" head="true"> Shop URLs from multi-shop feature</description>
<schema xlink:href="http://localhost/EVAL/api/shop_urls?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/shop_urls?schema=synopsis" type="synopsis"/>
</shop_urls>
<shops xlink:href="http://localhost/EVAL/api/shops" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/shops" get="true" put="true" post="true" patch="true" delete="true" head="true"> Shops from multi-shop feature</description>
<schema xlink:href="http://localhost/EVAL/api/shops?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/shops?schema=synopsis" type="synopsis"/>
</shops>
<specific_price_rules xlink:href="http://localhost/EVAL/api/specific_price_rules" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/specific_price_rules" get="true" put="true" post="true" patch="true" delete="true" head="true"> Specific price management</description>
<schema xlink:href="http://localhost/EVAL/api/specific_price_rules?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/specific_price_rules?schema=synopsis" type="synopsis"/>
</specific_price_rules>
<specific_prices xlink:href="http://localhost/EVAL/api/specific_prices" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/specific_prices" get="true" put="true" post="true" patch="true" delete="true" head="true"> Specific price management</description>
<schema xlink:href="http://localhost/EVAL/api/specific_prices?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/specific_prices?schema=synopsis" type="synopsis"/>
</specific_prices>
<states xlink:href="http://localhost/EVAL/api/states" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/states" get="true" put="true" post="true" patch="true" delete="true" head="true"> The available states of countries</description>
<schema xlink:href="http://localhost/EVAL/api/states?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/states?schema=synopsis" type="synopsis"/>
</states>
<stock_availables xlink:href="http://localhost/EVAL/api/stock_availables" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/stock_availables" get="true" put="true" post="true" patch="true" delete="true" head="true"> Available quantities</description>
<schema xlink:href="http://localhost/EVAL/api/stock_availables?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/stock_availables?schema=synopsis" type="synopsis"/>
</stock_availables>
<stock_movement_reasons xlink:href="http://localhost/EVAL/api/stock_movement_reasons" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/stock_movement_reasons" get="true" put="true" post="true" patch="true" delete="true" head="true"> Stock movement reason</description>
<schema xlink:href="http://localhost/EVAL/api/stock_movement_reasons?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/stock_movement_reasons?schema=synopsis" type="synopsis"/>
</stock_movement_reasons>
<stock_movements xlink:href="http://localhost/EVAL/api/stock_movements" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/stock_movements" get="true" put="true" post="true" patch="true" delete="true" head="true"> Stock movements</description>
<schema xlink:href="http://localhost/EVAL/api/stock_movements?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/stock_movements?schema=synopsis" type="synopsis"/>
</stock_movements>
<stocks xlink:href="http://localhost/EVAL/api/stocks" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/stocks" get="true" put="true" post="true" patch="true" delete="true" head="true"> Stocks</description>
<schema xlink:href="http://localhost/EVAL/api/stocks?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/stocks?schema=synopsis" type="synopsis"/>
</stocks>
<stores xlink:href="http://localhost/EVAL/api/stores" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/stores" get="true" put="true" post="true" patch="true" delete="true" head="true"> The stores</description>
<schema xlink:href="http://localhost/EVAL/api/stores?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/stores?schema=synopsis" type="synopsis"/>
</stores>
<suppliers xlink:href="http://localhost/EVAL/api/suppliers" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/suppliers" get="true" put="true" post="true" patch="true" delete="true" head="true"> The product suppliers</description>
<schema xlink:href="http://localhost/EVAL/api/suppliers?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/suppliers?schema=synopsis" type="synopsis"/>
</suppliers>
<supply_order_details xlink:href="http://localhost/EVAL/api/supply_order_details" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/supply_order_details" get="true" put="true" post="true" patch="true" delete="true" head="true"> Supply Order Details</description>
<schema xlink:href="http://localhost/EVAL/api/supply_order_details?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/supply_order_details?schema=synopsis" type="synopsis"/>
</supply_order_details>
<supply_order_histories xlink:href="http://localhost/EVAL/api/supply_order_histories" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/supply_order_histories" get="true" put="true" post="true" patch="true" delete="true" head="true"> Supply Order Histories</description>
<schema xlink:href="http://localhost/EVAL/api/supply_order_histories?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/supply_order_histories?schema=synopsis" type="synopsis"/>
</supply_order_histories>
<supply_order_receipt_histories xlink:href="http://localhost/EVAL/api/supply_order_receipt_histories" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/supply_order_receipt_histories" get="true" put="true" post="true" patch="true" delete="true" head="true"> Supply Order Receipt Histories</description>
<schema xlink:href="http://localhost/EVAL/api/supply_order_receipt_histories?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/supply_order_receipt_histories?schema=synopsis" type="synopsis"/>
</supply_order_receipt_histories>
<supply_order_states xlink:href="http://localhost/EVAL/api/supply_order_states" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/supply_order_states" get="true" put="true" post="true" patch="true" delete="true" head="true"> Supply Order Statuses</description>
<schema xlink:href="http://localhost/EVAL/api/supply_order_states?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/supply_order_states?schema=synopsis" type="synopsis"/>
</supply_order_states>
<supply_orders xlink:href="http://localhost/EVAL/api/supply_orders" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/supply_orders" get="true" put="true" post="true" patch="true" delete="true" head="true"> Supply Orders</description>
<schema xlink:href="http://localhost/EVAL/api/supply_orders?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/supply_orders?schema=synopsis" type="synopsis"/>
</supply_orders>
<tags xlink:href="http://localhost/EVAL/api/tags" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/tags" get="true" put="true" post="true" patch="true" delete="true" head="true"> The Products tags</description>
<schema xlink:href="http://localhost/EVAL/api/tags?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/tags?schema=synopsis" type="synopsis"/>
</tags>
<tax_rule_groups xlink:href="http://localhost/EVAL/api/tax_rule_groups" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/tax_rule_groups" get="true" put="true" post="true" patch="true" delete="true" head="true"> Tax rule groups</description>
<schema xlink:href="http://localhost/EVAL/api/tax_rule_groups?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/tax_rule_groups?schema=synopsis" type="synopsis"/>
</tax_rule_groups>
<tax_rules xlink:href="http://localhost/EVAL/api/tax_rules" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/tax_rules" get="true" put="true" post="true" patch="true" delete="true" head="true"> Tax rules entity</description>
<schema xlink:href="http://localhost/EVAL/api/tax_rules?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/tax_rules?schema=synopsis" type="synopsis"/>
</tax_rules>
<taxes xlink:href="http://localhost/EVAL/api/taxes" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/taxes" get="true" put="true" post="true" patch="true" delete="true" head="true"> The tax rate</description>
<schema xlink:href="http://localhost/EVAL/api/taxes?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/taxes?schema=synopsis" type="synopsis"/>
</taxes>
<translated_configurations xlink:href="http://localhost/EVAL/api/translated_configurations" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/translated_configurations" get="true" put="true" post="true" patch="true" delete="true" head="true"> Shop configuration</description>
<schema xlink:href="http://localhost/EVAL/api/translated_configurations?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/translated_configurations?schema=synopsis" type="synopsis"/>
</translated_configurations>
<warehouse_product_locations xlink:href="http://localhost/EVAL/api/warehouse_product_locations" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/warehouse_product_locations" get="true" put="true" post="true" patch="true" delete="true" head="true"> Location of products in warehouses</description>
<schema xlink:href="http://localhost/EVAL/api/warehouse_product_locations?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/warehouse_product_locations?schema=synopsis" type="synopsis"/>
</warehouse_product_locations>
<warehouses xlink:href="http://localhost/EVAL/api/warehouses" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/warehouses" get="true" put="true" post="true" patch="true" delete="true" head="true"> Warehouses</description>
<schema xlink:href="http://localhost/EVAL/api/warehouses?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/warehouses?schema=synopsis" type="synopsis"/>
</warehouses>
<weight_ranges xlink:href="http://localhost/EVAL/api/weight_ranges" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/weight_ranges" get="true" put="true" post="true" patch="true" delete="true" head="true"> Weight ranges</description>
<schema xlink:href="http://localhost/EVAL/api/weight_ranges?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/weight_ranges?schema=synopsis" type="synopsis"/>
</weight_ranges>
<zones xlink:href="http://localhost/EVAL/api/zones" get="true" put="true" post="true" patch="true" delete="true" head="true">
<description xlink:href="http://localhost/EVAL/api/zones" get="true" put="true" post="true" patch="true" delete="true" head="true"> The Countries zones</description>
<schema xlink:href="http://localhost/EVAL/api/zones?schema=blank" type="blank"/>
<schema xlink:href="http://localhost/EVAL/api/zones?schema=synopsis" type="synopsis"/>
</zones>
</api>
</prestashop>