# 🔄 Flux Complet d'Import - Implémentation NewApp

## 📊 Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                    Utilisateur Upload CSV                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    Étape 1: UPLOAD & PREVIEW
                             │
                    ┌────────▼────────┐
                    │ FileImporter    │
                    │ Service         │
                    │ - parseCSV()    │
                    │ - validate()    │
                    │ - preview()     │
                    └────────┬────────┘
                             │
                    Étape 2: MAPPING COLONNES
                             │
                    ┌────────▼─────────────────┐
                    │ useFileImport Composable │
                    │ - Détecte colonnes      │
                    │ - Propose mapping auto   │
                    │ - Valide mappings        │
                    └────────┬─────────────────┘
                             │
                    Étape 3: CONFIRMATION
                             │
                    ┌────────▼────────────────────────────────┐
                    │ Pour CHAQUE produit:                    │
                    │                                        │
                    │ A) POST /products                       │
                    │    ↓ Crée ps_product                  │
                    │    ↓ Crée ps_stock_available (qty=0)   │
                    │                                        │
                    │ B) PUT /products/{id}                   │
                    │    ↓ Crée ps_product_lang              │
                    │    ↓ Ajoute name + description         │
                    │                                        │
                    │ C) PUT /stock_availables/{id}           │
                    │    ↓ Met à jour quantity               │
                    │                                        │
                    │ D) Callback: onProgress(i, total)      │
                    │    ↓ Barre progression (0-100%)        │
                    └────────┬────────────────────────────────┘
                             │
                    Étape 4: RAPPORT D'IMPORT
                             │
                    ┌────────▼──────────────────┐
                    │ Affiche:                 │
                    │ ✅ N produits créés     │
                    │ ❌ M erreurs             │
                    │ 📊 Liste détaillée       │
                    └────────┬──────────────────┘
                             │
                    Produits visibles dans Backoffice ✅
```

---

## 🗂️ Structure des Tables Crées

### ✅ Pour "iPod Nano" (100€, qty: 160)

```
ps_product
├─ id_product: 30
├─ reference: "RP-demo_1"
├─ price: 100.000000
├─ active: 1
├─ show_price: 1 ✅
├─ available_for_order: 1 ✅
├─ indexed: 1 ✅
└─ quantity: 0 (déprécié)

ps_product_lang
├─ id_product: 30
├─ id_lang: 1
├─ id_shop: 1
├─ name: "iPod Nano" ✅
├─ description: "New design." ✅
└─ link_rewrite: "ipod-nano" ✅

ps_stock_available
├─ id_stock_available: X
├─ id_product: 30
├─ id_product_attribute: 0
├─ quantity: 160 ✅
└─ physical_quantity: 160
```

---

## 📈 Progression de l'Import

### Exemple: 7 Produits

```
🔄 Import en cours...

📦 Produit 1/7: iPod Nano
  ├─ POST /products ✅ (id=30)
  ├─ PUT /products/30 (langue) ✅
  ├─ PUT /stock_availables (qty) ✅
  └─ Progression: 14%

📦 Produit 2/7: iPod shuffle
  ├─ POST /products ✅ (id=31)
  ├─ PUT /products/31 (langue) ✅
  ├─ PUT /stock_availables (qty) ✅
  └─ Progression: 29%

📦 Produit 3/7: MacBook Air
  ├─ POST /products ✅ (id=32)
  ├─ PUT /products/32 (langue) ✅
  ├─ PUT /stock_availables (qty) ✅
  └─ Progression: 43%

... (4 autres produits)

📊 RAPPORT FINAL
  ✅ 7 produits importés
  ❌ 0 erreurs
  📦 Tous les produits sont maintenant visibles dans le backoffice!
```

---

## 🔍 Ce Qui Était Mal

### ❌ AVANT (sans tables liées)

```
POST /products
  ↓
Crée ps_product (nom, prix)
  ↓
Mais MANQUE:
  ❌ ps_product_lang (pas de nom visible)
  ❌ ps_stock_available (qty=0)
  ❌ show_price=0, available_for_order=0
  ↓
Résultat: Produit invisible! 👻
```

### ✅ APRÈS (avec tables liées)

```
POST /products + PUT /products/{id} + PUT /stock_availables/{id}
  ↓
Crée ps_product
Crée ps_product_lang ← NOM VISIBLE
Met à jour ps_stock_available ← QUANTITÉ
Met à jour show_price=1, available_for_order=1 ← VISIBLE
  ↓
Résultat: Produit visible et fonctionnel! ✅
```

---

## 💡 Points Clés

### 1. **L'API REST ne crée que ps_product**
- Le reste des tables doit être créé manuellement
- C'est une limitation/conception de l'API PrestaShop

### 2. **Approche en 4 Étapes**
- Étape A: Créer le produit (POST)
- Étape B: Ajouter la langue (PUT)
- Étape C: Mettre à jour le stock (PUT)
- Étape D: Afficher la progression

### 3. **Tables Essentielles**
| Table | Quand? | Pourquoi |
|-------|--------|---------|
| ps_product | POST | Base du produit |
| ps_product_lang | PUT | Nom visible dans BO |
| ps_stock_available | PUT | Quantité en stock |

### 4. **Erreurs N'Arrêtent Pas l'Import**
- Si ps_product_lang échoue → continuer
- Si stock_available échoue → continuer
- Mais l'utilisateur le sait (rapport détaillé)

---

## 🧪 Test de Validation

Pour vérifier qu'un produit importé est correct:

```sql
-- 1. Vérifier ps_product
SELECT id_product, reference, price, active, show_price, available_for_order
FROM ps_product
WHERE reference = 'RP-demo_1';
-- Doit retourner 1 ligne avec show_price=1, available_for_order=1

-- 2. Vérifier ps_product_lang
SELECT id_product, name, description
FROM ps_product_lang
WHERE id_product = 30 AND id_lang = 1;
-- Doit retourner le nom: "iPod Nano"

-- 3. Vérifier ps_stock_available
SELECT id_product, quantity
FROM ps_stock_available
WHERE id_product = 30;
-- Doit retourner quantity = 160

-- Si tous les 3 passent → Produit OK ✅
```

---

## 🚀 Utilisation dans NewApp

### Dans FileImporter.vue (Interface)
```vue
<!-- Étape 4: Confirmation et Import -->
<button @click="importProducts">
  📤 Importer maintenant
</button>

<!-- Pendant l'import: barre de progression -->
<div class="progress-bar" :style="{ width: importProgress + '%' }">
  {{ Math.round(importProgress) }}%
</div>

<!-- Après: Rapport détaillé -->
<div class="import-report">
  ✅ 7 produits importés
  ❌ 0 erreurs
</div>
```

### Dans useFileImport.js (Logique)
```javascript
const importProducts = async () => {
  const results = await importMultipleProducts(
    getMappedData(),
    (current, total) => {
      importProgress.value = ((current + 1) / total) * 100
    }
  )
  
  importReport.value = results
  // Affiche le rapport automatiquement
}
```

### Dans api/import.js (API)
```javascript
export const importSingleProduct = async (product) => {
  // Étape 1: POST /products
  const productId = await createProduct(product)
  
  // Étape 2: PUT /products/{id} (langue)
  await createProductLang(productId, product)
  
  // Étape 3: PUT /stock_availables/{id} (stock)
  await updateProductStock(productId, product.quantity)
  
  return { success: true, id: productId, name: product.name }
}
```

---

**Architecture Validée:** 7 mai 2026  
**Statut:** ✅ Implémentée et Testée
