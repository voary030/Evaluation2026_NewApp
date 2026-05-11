# 📚 Guide d'Utilisation - Documentation Schéma Produit PrestaShop

## Vue d'ensemble

La documentation du schéma produit PrestaShop est maintenant disponible dans trois formats :

1. **Markdown** (`PRODUCT_SCHEMA.md`) - Documentation lisible
2. **JSON** (`product-schema.json`) - Structure machine-lisible
3. **TypeScript** (`ProductValidator.ts`) - Validateur de produit

---

## 🎯 Champs Obligatoires

### ⚠️ REQUIS pour créer un produit

| Champ | Type | Valeur exemple |
|-------|------|-----------------|
| **price** | nombre | `19.99` |

**C'est le SEUL champ absolument obligatoire** pour créer un produit via l'API PrestaShop.

---

## 💡 Champs Fortement Recommandés

Pour un produit complet et fonctionnel, ajouter aussi :

| Champ | Type | Valeur exemple |
|-------|------|-----------------|
| **id_category_default** | nombre | `1` |
| **name** | texte multilangue | `{ "1": "Mon Produit", "2": "My Product" }` |
| **active** | booléen | `1` ou `true` |

---

## 📖 Consulter la Documentation

### Format Markdown
👉 [PRODUCT_SCHEMA.md](./PRODUCT_SCHEMA.md)

Meilleur pour :
- Lire et comprendre le schéma
- Voir les exemples XML
- Comprendre les validations
- Les développeurs qui lient la documentation

### Format JSON
👉 [product-schema.json](../src/assets/schemas/product-schema.json)

Meilleur pour :
- Charger la définition du schéma dans l'application
- Générer automatiquement des formulaires
- Valider les données côté client
- L'intégration avec TypeScript/Vue 3

### Validateur TypeScript
👉 [ProductValidator.ts](../src/utils/ProductValidator.ts)

Meilleur pour :
- Valider un objet produit en TypeScript
- Créer des messages d'erreur personnalisés
- Utiliser dans les composants Vue 3

---

## 🔧 Exemples d'Utilisation

### 1. Valider un produit (TypeScript)

```typescript
import ProductValidator from '@/utils/ProductValidator'

// Créer un produit
const product = {
  name: { 1: 'Mon Produit', 2: 'My Product' },
  price: 29.99,
  id_category_default: 1,
  active: true
}

// Valider
const result = ProductValidator.validate(product)

if (result.valid) {
  console.log('✅ Produit valide')
} else {
  console.error('❌ Erreurs:', result.errors)
}

console.log('⚠️ Avertissements:', result.warnings)
```

### 2. Charger le schéma JSON (Vue 3)

```typescript
import productSchema from '@/assets/schemas/product-schema.json'

export default {
  data() {
    return {
      schema: productSchema
    }
  }
}
```

### 3. Obtenir les champs requis

```typescript
import ProductValidator from '@/utils/ProductValidator'

const required = ProductValidator.getRequiredFields()
// → ['price']

const recommended = ProductValidator.getRecommendedFields()
// → ['id_category_default', 'name', 'active']
```

### 4. Créer un produit vide

```typescript
import ProductValidator from '@/utils/ProductValidator'

const emptyProduct = ProductValidator.createEmptyProduct()
// Produit avec les champs par défaut
```

---

## 📊 Catégories de Champs

### Identification & Catégorisation
- `id_manufacturer` - ID du fabricant
- `id_supplier` - ID du fournisseur
- `id_category_default` - Catégorie par défaut
- `id_tax_rules_group` - Groupe de règles fiscales
- `id_shop_default` - Boutique par défaut

### Références & Codes
- `reference` - Référence interne
- `supplier_reference` - Référence fournisseur
- `ean13` - Code EAN-13
- `isbn` - Code ISBN
- `upc` - Code UPC
- `mpn` - Numéro de pièce

### Tarification
- `price` ⚠️ **REQUIS**
- `wholesale_price` - Prix de gros
- `ecotax` - Écotaxe
- `unit_price` - Prix unitaire

### Stock & Quantité
- `minimal_quantity` - Quantité minimale
- `low_stock_threshold` - Seuil stock faible
- `advanced_stock_management` - Gestion stock avancée

### Contenu Multilangue
- `name` - Nom du produit
- `description` - Description complète
- `description_short` - Description courte
- `meta_title`, `meta_description`, `meta_keywords` - SEO
- `link_rewrite` - URL réécrite

### État & Visibilité
- `active` - Produit actif
- `visibility` - Visibilité (`both`, `catalog`, `search`, `none`)
- `available_for_order` - Disponible à la commande
- `indexed` - Indexé pour recherche

### Dimensions
- `width`, `height`, `depth` - Dimensions
- `weight` - Poids
- `location` - Localisation

---

## 🔒 Champs en Lecture Seule

Ces champs sont générés automatiquement et ne peuvent pas être modifiés :

- `manufacturer_name`
- `quantity`
- `position_in_category`
- `id_default_image`
- `id_default_combination`
- `cache_default_attribute`
- `date_add` (après création)
- `date_upd` (après création)

---

## 🌍 Langues Multilingues

Les champs multilangues utilisent cette structure :

```json
{
  "name": {
    "1": "Français",
    "2": "English"
  }
}
```

Champs multilangues :
- `name`
- `description`
- `description_short`
- `meta_title`
- `meta_description`
- `meta_keywords`
- `link_rewrite`
- `condition`
- `available_now`
- `available_later`
- `delivery_in_stock`
- `delivery_out_stock`

---

## ✅ Checklist Produit Minimal

Avant de créer un produit, assurez-vous d'avoir :

- [ ] `price` - Prix du produit ⚠️ **REQUIS**
- [ ] `name` (multilangue) - Nom du produit
- [ ] `id_category_default` - Catégorie par défaut
- [ ] `active` - Statut d'activation (booléen)
- [ ] `associations.categories` - Au moins une catégorie
- [ ] `associations.stock_availables` - Stock disponible

---

## 🔗 API PrestaShop

URL de schéma : http://localhost/EVAL/api/products?schema=synopsis

Endpoints :
- GET `/api/products?schema=synopsis` - Voir le schéma
- GET `/api/products` - Lister les produits
- POST `/api/products` - Créer un produit
- PUT `/api/products/{id}` - Mettre à jour
- DELETE `/api/products/{id}` - Supprimer

---

## 📝 Formats de Validation

| Format | Exemple | Validation |
|--------|---------|-----------|
| `isUnsignedId` | `123` | Nombre entier positif |
| `isPrice` | `19.99` | Nombre décimal positif |
| `isReference` | `PROD-001` | Alphanumérique avec tirets |
| `isEan13` | `5901234123457` | Exactement 13 chiffres |
| `isIsbn` | `978-0-596-52068-7` | Alphanumérique avec tirets |
| `isUpc` | `123456789012` | Exactement 12 chiffres |
| `isCatalogName` | `Mon Produit` | Texte max 128 car. |
| `isCleanHtml` | `<p>...</p>` | HTML nettoyé max 4MB |
| `isLinkRewrite` | `mon-produit` | Minuscules, tirets, alphanumérique |

---

## 🚀 Prochaines Étapes

1. **Consulter** la documentation Markdown pour comprendre le schéma
2. **Importer** le validateur TypeScript dans vos composants
3. **Utiliser** le schéma JSON pour générer des formulaires
4. **Valider** les produits avant de les envoyer à l'API
5. **Tester** avec l'endpoint `/api/products?schema=synopsis`

---

## ❓ Questions Fréquentes

**Q: Quel est le seul champ obligatoire ?**
R: `price` - Le prix du produit

**Q: Comment créer un produit minimal ?**
R: Avec au minimum `price` et `name`. Fortement recommandé : ajouter `id_category_default`, `active`, et une catégorie.

**Q: Comment gérer les langues ?**
R: Utilisez la structure `{ "1": "FR", "2": "EN" }` pour les champs multilangues.

**Q: Comment valider un produit en TypeScript ?**
R: Importez `ProductValidator` et appelez `.validate(product)`

**Q: Où voir les erreurs de validation ?**
R: Consultez `result.errors` et `result.warnings` après validation.

---

## 📞 Support

Pour les questions sur l'API PrestaShop :
- Documentation officielle: https://devdocs.prestashop-project.org/
- Schéma API: http://localhost/EVAL/api/products?schema=synopsis
