# 🔧 Architecture API PrestaShop - Tables Liées aux Produits

## 🐛 Le Problème Découvert

L'**API REST PrestaShop ne crée que `ps_product`** quand on POST un produit!

```
POST /api/products [XML]
    ↓
Crée SEULEMENT:
  ps_product (✅)
    ├─ ps_product_lang (❌ NON créé!)
    ├─ ps_stock_available (❌ NON créé!)
    ├─ ps_product_shop (❌ NON créé!)
    └─ ps_category_product (❌ NON créé!)
```

**Résultat:** Produit invisible dans le backoffice (pas de nom, pas de stock, pas de catégorie)

---

## ✅ La Solution: Créer Manuellement les Tables Liées

Après `POST /products`, il faut créer/mettre à jour les tables associées:

### 1️⃣ **ps_product_lang** (Noms et descriptions)
```javascript
// ✅ Crée l'entrée langue du produit
PUT /products/{productId}
{
  name: { language id="1": "Mon Produit" },
  description: { language id="1": "Description..." },
  link_rewrite: { language id="1": "mon-produit" }
}
```

### 2️⃣ **ps_stock_available** (Quantité en stock)
```javascript
// ✅ Met à jour la quantité
PUT /stock_availables/{stockId}
{
  quantity: 160
}
```

### 3️⃣ **ps_product_shop** (Prix/taxes par shop)
```javascript
// ✅ Active le produit pour la shop
PUT /products/{productId}
{
  show_price: 1,
  available_for_order: 1,
  indexed: 1
}
```

### 4️⃣ **ps_category_product** (Catégories) - OPTIONNEL
```javascript
// ✅ Assigne le produit à une catégorie
POST /categories/{categoryId}/products
{ id_product: 123 }
```

---

## 📊 Tableau des Tables Essentielles

| Table | Créée Auto? | Nécessaire? | Solution |
|-------|-------------|------------|----------|
| **ps_product** | ✅ Oui | ✅ Oui | POST |
| **ps_product_lang** | ❌ Non | ✅ OUI | PUT (ajouter name) |
| **ps_stock_available** | ⚠️ Oui* | ✅ OUI | PUT (ajouter qty) |
| **ps_product_shop** | ⚠️ Oui* | ✅ OUI | PUT (flags visibilité) |
| **ps_category_product** | ❌ Non | ❌ Opt | POST si catégorie |
| **ps_image** | ❌ Non | ❌ Opt | POST si images |
| **ps_attribute_combination** | ❌ Non | ❌ Opt | POST si variantes |

*Créé mais avec valeurs par défaut incorrectes (quantity=0, show_price=0, etc.)

---

## 🔄 Flux Complet d'Import (Solution)

```
1. Utilisateur upload CSV
   ↓
2. FileImporterService parse + valide
   ↓
3. Pour CHAQUE produit:
   ├─ Étape A: POST /products [XML basique]
   │  → Crée ps_product + ps_stock_available (qty=0)
   │
   ├─ Étape B: PUT /products/{id} [Langue + description]
   │  → Crée/met à jour ps_product_lang
   │
   ├─ Étape C: PUT /stock_availables/{id} [Quantité]
   │  → Met à jour ps_stock_available (qty=160)
   │
   └─ Étape D: PUT /products/{id} [Flags visibilité]
      → Met à jour show_price=1, available_for_order=1, indexed=1
   ↓
4. Produit complet et visible dans backoffice ✅
```

---

## 💻 Implémentation Actuelle (dans import.js)

```javascript
export const importSingleProduct = async (product) => {
  // Étape 1: Créer le produit (ps_product)
  const response = await apiClient.post('/products', xml)
  const productId = extractId(response.data)
  
  // Étape 2: Créer l'entrée langue (ps_product_lang)
  await createProductLang(productId, product)
  
  // Étape 3: Mettre à jour le stock (ps_stock_available)
  await updateProductStock(productId, product.quantity)
  
  return { success: true, id: productId }
}
```

---

## 🎯 Points Clés à Retenir

### ❌ Erreur Courante
```javascript
// ❌ FAUX: Penser que POST crée tout automatiquement
POST /products → Seulement ps_product créé
// Résultat: Produit invisible (pas de langue, pas de stock correct)
```

### ✅ Approche Correcte
```javascript
// ✅ BON: Créer manuellement après POST
POST /products               → ps_product
PUT /products/{id}           → ps_product_lang
PUT /stock_availables/{id}   → ps_stock_available
// Résultat: Produit complet et visible ✅
```

---

## 🔍 Diagnostic: Produit Non Visible

Si un produit n'apparaît pas dans le backoffice:

```sql
-- ✅ Existe dans ps_product
SELECT * FROM ps_product WHERE id_product = 123;

-- ❌ Mais MANQUE dans ps_product_lang
SELECT * FROM ps_product_lang WHERE id_product = 123;
-- Résultat vide = Produit invisible!

-- ✅ Solution: Ajouter l'entrée langue
INSERT INTO ps_product_lang VALUES
(123, 1, 1, 'Description...', NULL, 'slug', NULL, NULL, NULL, 'Nom Produit', NULL, NULL, NULL, NULL);

-- Maintenant visible! ✅
```

---

## 📋 Checklist Complet d'Import

Pour que un produit soit **complètement valide** dans PrestaShop:

- [ ] **ps_product** - Données de base (nom, prix, référence)
- [ ] **ps_product_lang** - Nom et description par langue ⭐
- [ ] **ps_stock_available** - Quantité en stock ⭐
- [ ] **ps_product_shop** - Prix et flags par shop ⭐
- [ ] **ps_category_product** - Assignation à catégorie (optionnel)
- [ ] **ps_image** - Images du produit (optionnel)
- [ ] **ps_product_feature** - Caractéristiques (optionnel)

⭐ = Essentiel pour affichage dans backoffice

---

## 🚀 Prochaines Étapes

### Immédiat
✅ Confirmer que `createProductLang()` fonctionne dans import.js
✅ Tester l'import avec la solution complète
✅ Vérifier que produits affichent correctement

### Futur (Améliorations)
- [ ] Ajouter support des catégories
- [ ] Ajouter support des images
- [ ] Ajouter support des caractéristiques/variantes
- [ ] Optimiser pour imports massifs (>1000 produits)

---

**Créé:** 7 mai 2026  
**Version:** 1.0 - Architecture Expliquée
