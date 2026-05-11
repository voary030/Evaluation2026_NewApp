# Schéma API Produit PrestaShop

## Champs Requis (Required)

Les champs suivants sont **obligatoires** pour créer ou mettre à jour un produit :

| Champ | Type | Format | Description |
|-------|------|--------|-------------|
| **price** | Nombre | `isPrice` | Prix du produit ⚠️ OBLIGATOIRE |

### Associations Requises

| Association | Node Type | Sous-champs requis |
|------------|-----------|-------------------|
| **categories** | category | `id` (required) |
| **combinations** | combination | `id` (required) |
| **product_option_values** | product_option_value | `id` (required) |
| **product_features** | product_feature | `id` (required), `id_feature_value` (required) |
| **tags** | tag | `id` (required) |
| **stock_availables** | stock_available | `id` (required), `id_product_attribute` (required) |
| **attachments** | attachment | `id` (required) |
| **accessories** | product | `id` (required) |
| **product_bundle** | product | `id` (required) |

---

## Champs Principaux par Catégorie

### 📋 Identification & Catégorisation

| Champ | Format | MaxSize | Notes |
|-------|--------|---------|-------|
| id_manufacturer | isUnsignedId | - | ID du fabricant |
| id_supplier | isUnsignedId | - | ID du fournisseur |
| **id_category_default** | isUnsignedId | - | Catégorie par défaut |
| id_tax_rules_group | isUnsignedId | - | Groupe de règles fiscales |
| id_shop_default | isUnsignedId | - | Boutique par défaut |

### 📦 Références & Codes

| Champ | Format | MaxSize | Requis |
|-------|--------|---------|--------|
| reference | isReference | 64 | Référence interne |
| supplier_reference | isReference | 64 | Référence fournisseur |
| ean13 | isEan13 | 13 | Code EAN-13 |
| isbn | isIsbn | 32 | Code ISBN |
| upc | isUpc | 12 | Code UPC |
| mpn | isMpn | 40 | Numéro de pièce du fabricant |

### 📐 Dimensions & Poids

| Champ | Format |
|-------|--------|
| width | isUnsignedFloat |
| height | isUnsignedFloat |
| depth | isUnsignedFloat |
| weight | isUnsignedFloat |
| location | isString (255) |

### 💰 Tarification

| Champ | Format | Requis |
|-------|--------|--------|
| **price** | isPrice | ⚠️ **OUI** |
| wholesale_price | isPrice | Non |
| ecotax | isPrice | Non |
| additional_shipping_cost | isPrice | Non |
| unit_price | isPrice | Non |
| unit_price_ratio | - | Non |

### 📊 Stock & Quantité

| Champ | Format | Notes |
|-------|--------|-------|
| quantity | read_only | Lecture seule |
| minimal_quantity | isPositiveInt | Quantité minimale |
| low_stock_threshold | isInt | Seuil stock faible |
| low_stock_alert | isBool | Alerte stock faible |
| quantity_discount | isBool | Remise quantité |
| customizable | isUnsignedInt | |
| text_fields | isUnsignedInt | |
| uploadable_files | isUnsignedInt | |

### 📝 Descriptions Multilingues

| Champ | Format | MaxSize |
|-------|--------|---------|
| name | isCatalogName | 128 |
| description | isCleanHtml | 4194303 |
| description_short | isCleanHtml | 4194303 |
| meta_title | isGenericName | 255 |
| meta_description | isGenericName | 512 |
| meta_keywords | isGenericName | 255 |
| link_rewrite | isLinkRewrite | 128 |

**Note**: Ces champs supportent les langues (language id="1", id="2", etc.)

### 🏷️ État & Visibilité

| Champ | Format | Notes |
|-------|--------|-------|
| active | isBool | Produit actif |
| new | - | Nouveau produit |
| on_sale | isBool | En solde |
| online_only | isBool | Vente en ligne uniquement |
| indexed | isBool | Indexé pour recherche |
| visibility | isProductVisibility | `both`, `catalog`, `search`, `none` |
| available_for_order | isBool | Disponible à la commande |
| show_price | isBool | Afficher le prix |
| show_condition | isBool | Afficher la condition |
| condition | isGenericName | `new`, `used`, `refurbished` |

### 🔗 Redirection & Type

| Champ | Format |
|-------|--------|
| redirect_type | isString |
| id_type_redirected | isUnsignedId |
| type | - | Type de produit |
| product_type | isGenericName | |
| pack_stock_type | isUnsignedInt | |
| is_virtual | isBool | Produit virtuel |
| cache_is_pack | isBool | Cache pack |
| cache_has_attachments | isBool | Cache attachements |

### 📅 Dates

| Champ | Format |
|-------|--------|
| available_date | isDateFormat |
| date_add | isDate |
| date_upd | isDate |

### 🏥 État & Disponibilité

| Champ | Format |
|-------|--------|
| state | isUnsignedId |
| additional_delivery_times | isUnsignedId |
| delivery_in_stock | isGenericName (255) |
| delivery_out_stock | isGenericName (255) |

**Note**: Ces champs supportent les langues (language id="1", id="2", etc.)

### 🔍 Cache & Metadata

| Champ | Format | Notes |
|-------|--------|-------|
| cache_default_attribute | - | Lecture seule |
| id_default_image | - | Lecture seule |
| id_default_combination | - | Lecture seule |
| manufacturer_name | - | Lecture seule |
| position_in_category | - | Lecture seule |

### ⚙️ Configuration

| Champ | Format | Notes |
|-------|--------|-------|
| advanced_stock_management | isBool | Gestion stock avancée |
| unity | isString | Unité |

---

## Format de Validation

| Format | Description |
|--------|-------------|
| isUnsignedId | Nombre entier positif |
| isPrice | Nombre décimal (prix) |
| isString | Chaîne de caractères |
| isBool | Booléen (0 ou 1) |
| isReference | Référence alphanumériques |
| isEan13 | Code EAN-13 |
| isIsbn | Code ISBN |
| isUpc | Code UPC |
| isMpn | Numéro de pièce |
| isGenericName | Nom générique multilangue |
| isCatalogName | Nom de catalogue multilangue |
| isCleanHtml | HTML nettoyé multilangue |
| isLinkRewrite | Réécriture d'URL multilangue |
| isProductVisibility | Visibilité produit |
| isDateFormat | Format date |
| isDate | Date ISO |
| isUnsignedFloat | Nombre décimal positif |
| isInt | Nombre entier |
| isPositiveInt | Nombre entier positif |
| isUnsignedInt | Nombre entier non signé |

---

## Exemple Minimal (Champs Obligatoires)

```xml
<prestashop>
  <product>
    <price required="true">19.99</price>
  </product>
</prestashop>
```

## Exemple Complet (Produit Simple)

```xml
<prestashop>
  <product>
    <!-- Identification -->
    <id_manufacturer></id_manufacturer>
    <id_supplier></id_supplier>
    <id_category_default>1</id_category_default>
    <id_tax_rules_group></id_tax_rules_group>
    <id_shop_default>1</id_shop_default>
    
    <!-- Références -->
    <reference>PROD-001</reference>
    <supplier_reference></supplier_reference>
    <ean13></ean13>
    <isbn></isbn>
    <upc></upc>
    <mpn></mpn>
    
    <!-- Tarification (OBLIGATOIRE) -->
    <price>29.99</price>
    <wholesale_price>15.00</wholesale_price>
    <ecotax>0</ecotax>
    
    <!-- Informations Multilingues -->
    <name>
      <language id="1">Mon Produit</language>
      <language id="2">My Product</language>
    </name>
    <description>
      <language id="1">Description du produit...</language>
      <language id="2">Product description...</language>
    </description>
    
    <!-- État -->
    <active>1</active>
    <visibility>both</visibility>
    <available_for_order>1</available_for_order>
    
    <!-- Associations -->
    <associations>
      <categories>
        <category>
          <id>1</id>
        </category>
      </categories>
      <stock_availables>
        <stock_available>
          <id>1</id>
          <id_product_attribute>0</id_product_attribute>
        </stock_available>
      </stock_availables>
    </associations>
  </product>
</prestashop>
```

---

## Résumé des Contraintes

✅ **Champs vraiment obligatoires** :
- `price` - Prix du produit

⚠️ **Champs fortement recommandés** :
- `id_category_default` - Catégorie par défaut
- `name` (multilangue) - Nom du produit
- `active` - Statut d'activation
- `associations/categories` - Au moins une catégorie

🔒 **Champs en lecture seule** :
- `manufacturer_name`
- `quantity`
- `position_in_category`
- `id_default_image`
- `id_default_combination`
- `cache_default_attribute`

📍 **Langues supportées** :
Les champs multilingues utilisent la structure : `<language id="1">valeur</language>`
- id="1" = Français
- id="2" = Anglais
- (Peut varier selon la configuration PrestaShop)
