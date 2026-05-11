# 📦 Module Produits - Documentation Complète

## 🎯 Statut: Production ✅

Le module Produits est **100% fonctionnel** avec:
- ✅ Création de produits
- ✅ Édition de produits
- ✅ Listing avec recherche
- ✅ Gestion des catégories
- ✅ Gestion du stock
- ✅ Upload d'images
- ✅ Suppression

---

## 📊 Flux de Données

```
Utilisateur Interface
    ↓
Index.vue (listing)          → Create.vue (création)    → Edit (via Create.vue)
    ↓                            ↓
[Voir] → Details.vue        [Soumettre]
   ↓                             ↓
[Éditer] → Create.vue       useProductForm (state)
   ↓                             ↓
[Supprimer] → API            Validation + XML
                                 ↓
                            ProductService
                                 ↓
                            api/products.js
                                 ↓
                            PrestaShop API
                                 ↓
                            Base de Données
```

---

## 🔄 Workflow Complet: Création → Édition → Suppression

### 1️⃣ CRÉATION

**Route:** `/produits/create`  
**Vue:** `Create.vue` (mode création)  
**Flux:**

```
1. Utilisateur clique "Créer un produit" dans Index.vue
2. Navigate vers /produits/create
3. Create.vue monte → useProductForm(null) → isEditMode = false
4. initForm() charge catégories + fabricants
5. Utilisateur remplit formulaire:
   - name (requis)
   - reference (requis)
   - price (requis)
   - weight (optionnel)
   - quantity (requis)
   - description (optionnel)
   - id_category_default (requis)
   - id_manufacturer (optionnel)
   - image (optionnel)
6. Validation en temps réel
7. Clique "Créer le produit"
   → submitForm()
   → createProduct(XML)
   → API POST /products
   → Récupère ID
   → updateProductStock(newId, qty)
   → uploadProductImage(newId) si image
   → Success message
   → Redirect /produits
```

**Model:**
```javascript
// Product.js
Product {
  id: null,
  name: "Mon Produit",        // string, requis
  reference: "REF-001",       // string, requis
  price: 99.99,               // number, requis
  weight: 1.5,                // number, optionnel
  quantity: 50,               // number, requis
  active: 1,                  // 0 ou 1
  description: "...",         // string, optionnel
  id_manufacturer: "3",       // optionnel
  id_category_default: "2"    // requis
}
```

---

### 2️⃣ ÉDITION

**Route:** `/produits/:id/edit`  
**Vue:** `Create.vue` (mode édition)  
**Flux:**

```
1. Utilisateur clique "Éditer" depuis:
   - Index.vue (bouton dans Actions)
   - Details.vue (bouton dans header)
2. Navigate vers /produits/:id/edit
3. Create.vue monte → useProductForm(:id) → isEditMode = true
4. initForm() charge:
   - Catégories + Fabricants
   - getProduct(:id) → parseProductData()
   - Remplit formData avec valeurs existantes
5. Utilisateur modifie champs
6. Validation en temps réel
7. Clique "Modifier le produit"
   → submitForm()
   → updateProduct(id, XML)
   → API PUT /products/:id
   → updateProductStock(id, qty) → MODIFICATION STOCK
   → Success message
   → RESTE SUR PAGE (pas de redirect)
```

**⚠️ Important:** L'édition:
- ✅ Modifie les champs du produit
- ✅ Modifie le stock via `updateProductStock()`
- ⚠️ N'upload PAS d'images (section image cachée en mode édition)
- ✅ Peut changer la catégorie

---

### 3️⃣ AFFICHAGE

**Route:** `/produits/:id`  
**Vue:** `Details.vue`  
**Flux:**

```
1. Utilisateur clique sur produit (Index ou via lien)
2. Navigate vers /produits/:id
3. Details.vue monte → useProductDetails()
4. loadProduct(:id)
   → getProduct(:id)
   → parseProduct()
   → Récupère fabricant associé
5. Affiche:
   - Infos générales (name, ref, dates)
   - Marque/Fabricant (description, logo)
   - Prix HT/TTC
   - Stock disponible
   - Images + miniatures
   - Catégories
   - Statut (actif/inactif)
6. Actions disponibles:
   - "Éditer" → /produits/:id/edit
   - "Retour" → /produits
```

---

### 4️⃣ SUPPRESSION

**Route:** `/produits` (depuis Index)  
**Flux:**

```
1. Utilisateur clique "Supprimer" dans Index.vue
2. Confirmation popup
3. deleteProductById(id)
   → deleteProduct(id)
   → API DELETE /products/:id
   → CASCADE: deletes associations, stock, images
   → Remplace produit de la liste locale
   → Success message
```

**⚠️ Important:**
- La suppression est **en cascade** (stock, images supprimés)
- Les catégories associées ne sont pas supprimées
- Ne peut pas être annulée

---

## 🏗️ Architecture Détaillée

### API Layer (`src/api/products.js`)

```javascript
getProducts(display)           // GET /products?display=...
getProduct(id)                 // GET /products/:id
createProduct(productXml)      // POST /products
updateProduct(id, productXml)  // PUT /products/:id
deleteProduct(id)              // DELETE /products/:id
```

**Chaque fonction:**
- Retourne XML brut (string)
- Logging `[API.functionName]`
- Gestion erreurs complète

---

### Service Layer (`src/services/products/ProductService.js`)

```javascript
parseProducts(xmlData)         // XML → Array<Product>
buildProductXml(product)       // Product → XML string
getStockBadgeColor(qty)        // qty → {bg, text} colors
```

**Responsabilités:**
- XML ↔ JS Objects
- Transformation données
- Validation structure
- Defaults si champs manquants

---

### Model Layer (`src/models/products/Product.js`)

```javascript
class Product {
  constructor(data)
  validate()                   // Lance erreur si invalide
  toJSON()                     // Sérialize complètement
  static fromXML(node)         // Parse depuis DOM node
}
```

**Validation:**
- name: requis, 3-128 chars
- reference: requis, max 32 chars
- price: requis, ≥ 0
- weight: optionnel, ≥ 0 si présent
- quantity: requis, ≥ 0
- description: max 1024 chars
- id_category_default: requis

---

### Composable Layer (`src/composables/products/useProductForm.js`)

```javascript
useProductForm(productId)
```

**État:**
```javascript
{
  isEditMode,              // boolean
  loading,                 // boolean (chargement données)
  submitting,              // boolean (soumission)
  error,                   // string|null
  success,                 // string|null
  loadingOptions,          // boolean (catégories/fabricants)
  formData: {              // reactive object
    name, reference, price, weight, quantity,
    description, active, id_manufacturer, id_category_default
  },
  errors: {                // errors par champ
    name, reference, price, ...
  },
  categories,              // Array<Category>
  manufacturers,           // Array<Manufacturer>
  imageFile,               // File|null
}
```

**Méthodes:**
```javascript
initForm()                 // Charge options + données (mode edit)
submitForm()               // Validate + create/update + stock + image
validateField(name, value) // Validate un champ
resetForm()                // Reset à défaut
handleFieldChange(name)    // Validate lors du changement
uploadImage(productId)     // Upload image to product
updateProductStock(id, qty) // Mise à jour stock
```

---

### Vue Components

#### `Index.vue` - Listing

```vue
<!-- Affiche: -->
- Tableau avec 10 colonnes
  - ID
  - Image (miniature)
  - Nom (lien vers Details)
  - Référence
  - Catégorie
  - Prix HT
  - Prix TTC
  - Quantité (avec badge couleur)
  - Statut (Actif/Inactif)
  - Actions (Voir | Éditer | Supprimer)
- Barre de recherche
- Bouton "Créer un produit"
- Bouton "Recharger"
```

#### `Create.vue` - Création & Édition

```vue
<!-- Mode Création (productId = null): -->
- Formulaire vide
- Sections:
  - Informations générales
  - Tarification
  - Description
  - Méta
  - Image du produit ← VISIBLE
  - Actions
- Aperçu en temps réel

<!-- Mode Édition (productId = :id): -->
- Formulaire pré-rempli
- Sections IDENTIQUES
- Image du produit ← CACHÉE
- Actions
```

#### `Details.vue` - Détails Produit

```vue
<!-- Affiche: -->
- En-tête avec nom + statut + bouton ÉDITER
- Grille de cards:
  - Infos de base (ref, poids, dates)
  - Marque/Fabricant (avec image)
  - Prix (HT/TTC)
  - Stock (avec badge)
  - Images (principale + miniatures)
  - Catégories
```

---

## 📋 Checklist de Vérification

### ✅ Avant d'utiliser

- [ ] Compilé sans erreurs: `npm run build`
- [ ] Routes `/produits`, `/produits/create`, `/produits/:id`, `/produits/:id/edit` présentes
- [ ] Boutons "Éditer" visibles dans Index et Details
- [ ] Menu Sidebar a lien vers /produits

### ✅ Fonctionnalités à Tester

- [ ] Création: formulaire, validation, stock, image, redirect
- [ ] Édition: charge données, modification stock, pas de redirect
- [ ] Listing: recherche, tri, pagination (si implémentée)
- [ ] Détails: affichage complet, images, lien éditer
- [ ] Suppression: confirmation, removal, erreur handling
- [ ] Catégories: sélecteur fonctionne, validation fonctionne
- [ ] Images: upload fonctionne, affiche bien

---

## 🐛 Troubleshooting

### "Produits ne charge pas"
1. Vérifier que PrestaShop API tourne: `http://localhost/api/products?display=full`
2. Vérifier logs console (F12) pour erreurs API
3. Vérifier auth WebService si 403

### "Catégorie vide"
- Vérifier que PrestaShop a des catégories: `http://localhost/api/categories`
- Vérifier CategoryService.parseCategories()

### "Stock ne se met à jour"
- Vérifier que stock_available existe pour produit
- Vérifier `updateProductStock()` logs
- Vérifier StockService.buildStockXml() génère XML complet

### "Image n'upload pas"
- Vérifier permissions dossier images PrestaShop
- Vérifier format/taille (JPG/PNG/GIF, max 5MB)
- Vérifier logs `uploadProductImage()`

### "Édition ne sauvegarde pas"
- Vérifier que `updateProduct()` n'a pas d'erreur (401/403)
- Vérifier que XML complète toutes les données
- Vérifier logs `updateProductStock()` dans mode édition

---

## 🚀 Optimisations Possibles

- [ ] Édition images (remplacer, ajouter plusieurs)
- [ ] Attributs/Variantes (couleurs, tailles)
- [ ] Bulk edit (modifier plusieurs produits)
- [ ] Pagination lazy loading
- [ ] Filtres avancés (prix, catégorie, stock)
- [ ] Export CSV/Excel
- [ ] Historique modifications

---

## 📚 References

- **API Endpoint:** `/products`
- **Lang:** Français uniquement (id_lang = 1)
- **Devise:** Euro (EUR, symbole €)
- **TTI Appliqué:** 20% fixe

---

**Dernière mise à jour:** 9 mai 2026  
**Version Module:** 2.0 (Création + Édition)  
**Status:** Production ✅
