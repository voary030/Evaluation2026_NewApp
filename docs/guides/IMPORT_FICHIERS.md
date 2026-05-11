# 📂 Guide d'Import de Fichiers - NewApp

## 🎯 Fonctionnalités

La section **Importer** permet d'importer des produits en masse depuis des fichiers:
- **Format CSV** - Le plus courant (Excel, Google Sheets)
- **Format JSON** - Pour les données structurées
- **Format XML** - Format natif PrestaShop

Tous les fichiers sont converti en **XML PrestaShop** avant envoi à l'API.

---

## 📋 Processus d'Import (4 étapes)

### 1️⃣ Upload du fichier
```
[Sélectionnez un fichier CSV, JSON ou XML]
```
- Accepte `.csv`, `.json`, `.xml`
- Détecte automatiquement le format
- Affiche le nom et la taille du fichier

### 2️⃣ Aperçu des données
```
Affiche les premières lignes du fichier
```
- Montre les colonnes détectées
- Affiche les 5 premières lignes (aperçu)
- Compte le nombre total de lignes

### 3️⃣ Mapping des colonnes
```
Colonne fichier → Champ PrestaShop
```
- Associe chaque colonne du fichier aux champs PrestaShop
- Mapping automatique intelligent (détecte name, price, reference)
- Colonnes obligatoires: **name**, **price**

### 4️⃣ Confirmation et Import
```
Aperçu final avant import
Envoie les données en XML à l'API
```
- Dernière vérification avant envoi
- Affiche les données qui seront importées
- Bouton "Importer maintenant"

---

## 📊 Formats Acceptés

### CSV - Format Texte Simple
```csv
name,price,reference,description,quantity
Produit A,19.99,REF001,Description A,10
Produit B,29.99,REF002,Description B,5
Produit C,9.99,REF003,Description C,20
```

**Avantages:**
- Plus facile à créer
- Compatible Excel, Google Sheets
- Largement supporté

**Exemple fichier:**
```
c:\xampp\htdocs\EVAL\NewApp\docs\data\test-products.csv
```

---

### JSON - Format Structuré
```json
[
  {
    "name": "Produit A",
    "price": 19.99,
    "reference": "REF001",
    "quantity": 10
  },
  {
    "name": "Produit B",
    "price": 29.99,
    "reference": "REF002",
    "quantity": 5
  }
]
```

**Avantages:**
- Format structuré et flexible
- Supporte les objets imbriqués
- Contrôle de type natif

---

### XML - Format PrestaShop
```xml
<?xml version="1.0" encoding="UTF-8"?>
<prestashop>
  <product>
    <name>
      <language id="1">Produit A</language>
    </name>
    <price>19.99</price>
    <reference>REF001</reference>
    <quantity>10</quantity>
  </product>
</prestashop>
```

**Avantages:**
- Format natif PrestaShop
- Supporte le multilingue
- Pas de conversion nécessaire

---

## 🗂️ Champs PrestaShop Supportés

| Champ | Type | Requis | Exemple |
|-------|------|--------|---------|
| `name` | String | ✅ OUI | "Tee-Shirt Blanc" |
| `price` | Decimal | ✅ OUI | 19.99 |
| `reference` | String | ❌ Non | "REF001" |
| `description` | String | ❌ Non | "Description courte" |
| `quantity` | Integer | ❌ Non | 10 |
| `active` | Boolean | ❌ Non | 1 (actif) |

---

## 🔄 Flux de Conversion

```
Fichier (CSV/JSON/XML)
         ↓
   FileImporterService
     - Parse fichier
     - Valide données
         ↓
   Mapping des colonnes
    (fichier → PrestaShop)
         ↓
   Génération XML
  (format PrestaShop)
         ↓
   API PrestaShop
  (Envoi POST /products)
         ↓
   ✅ Produits créés
```

---

## 📝 Code d'Implémentation

### Service: FileImporterService

```javascript
// Parse un fichier CSV
const data = FileImporterService.parseCSV(csvContent)

// Parse un fichier JSON
const data = FileImporterService.parseJSON(jsonContent)

// Parse un fichier XML
const data = FileImporterService.parseXML(xmlContent, 'product')

// Détecte automatiquement le type
const data = await FileImporterService.parseFile(file)

// Valide les données
const validation = FileImporterService.validateProductData(data)
if (!validation.isValid) {
  console.error(validation.errors)
}

// Mappe les colonnes
const mapped = FileImporterService.mapColumns(data, {
  'Product Name': 'name',
  'Product Price': 'price'
})

// Génère le XML
const xml = FileImporterService.buildProductsXml(mapped)
```

### Composable: useFileImport

```javascript
import { useFileImport } from '@/composables/useFileImport'

const {
  file,
  parsedData,
  columns,
  columnMapping,
  loading,
  error,
  success,
  step,
  handleFileSelect,
  importProducts
} = useFileImport()

// Lors de la sélection du fichier
handleFileSelect(file)

// Importer les produits
await importProducts()
```

---

## ✅ Validation des Données

### Champs Obligatoires
- **name** - Nom du produit (string)
- **price** - Prix (nombre décimal)

### Validations Effectuées
1. ✅ Fichier non vide
2. ✅ Format valide (CSV/JSON/XML)
3. ✅ Colonnes obligatoires présentes
4. ✅ Prix au format numérique
5. ✅ Quantités entières

### Messages d'Erreur
```javascript
// Fichier CSV vide
"Fichier CSV vide"

// JSON invalide
"Erreur parsing JSON: Unexpected token"

// Colonnes manquantes
"Colonnes manquantes: name, price"

// Prix invalide
"Ligne 2: prix invalide "ABC""

// Format non supporté
"Format non supporté: .xls"
```

---

## 🎨 Interface Utilisateur

### Étape 1: Upload
```
┌─────────────────────────────────┐
│  📁 Sélectionnez un fichier...  │
│                                 │
│  ou glissez-déposez ici         │
└─────────────────────────────────┘

         [Fichier sélectionné: test.csv]
         
                    [➜ Suivant]
```

### Étape 2: Aperçu
```
┌──────────────────────────────────────────┐
│ name          | price  | reference      │
├──────────────────────────────────────────┤
│ Produit Test  │ 19.99  | REF001        │
│ Produit Test  │ 29.99  │ REF002        │
│ Produit Test  │ 9.99   │ REF003        │
├──────────────────────────────────────────┤
│ ... et 0 autre(s) ligne(s)             │
└──────────────────────────────────────────┘
```

### Étape 3: Mapping
```
name         →  [name               ▼]
price        →  [price              ▼]
reference    →  [reference          ▼]

✅ Mapping valide
```

### Étape 4: Confirmation
```
✅ 3 produit(s) seront importé(s)

Prévisualisation:
┌──────────────────────────────────────────┐
│ name          | price  | reference      │
├──────────────────────────────────────────┤
│ Produit Test  │ 19.99  | REF001        │
│ Produit Test  │ 29.99  │ REF002        │
│ Produit Test  │ 9.99   │ REF003        │
└──────────────────────────────────────────┘

            [← Retour]  [📤 Importer maintenant]
```

---

## 🚀 Exemple Complet

### Fichier CSV à importer
```csv
name,price,reference,quantity
Tee-Shirt Blanc,19.99,TS-001,100
Jeans Bleu,49.99,JB-001,50
Chaussettes Noires,9.99,CN-001,200
```

### Étapes à suivre

1. **Upload** → Sélectionner le fichier CSV
2. **Aperçu** → Voir les 3 produits
3. **Mapping** → 
   - `name` → `name` ✓
   - `price` → `price` ✓
   - `reference` → `reference` ✓
   - `quantity` → `quantity` ✓
4. **Import** → Cliquer sur "Importer maintenant"

### XML Généré
```xml
<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
  <product>
    <name>
      <language id="1">Tee-Shirt Blanc</language>
    </name>
    <price>19.99</price>
    <reference>TS-001</reference>
    <description>
      <language id="1"></language>
    </description>
    <quantity>100</quantity>
    <active>1</active>
  </product>
  <product>
    <name>
      <language id="1">Jeans Bleu</language>
    </name>
    <price>49.99</price>
    <reference>JB-001</reference>
    <description>
      <language id="1"></language>
    </description>
    <quantity>50</quantity>
    <active>1</active>
  </product>
  <!-- ... etc -->
</prestashop>
```

---

## 🛠️ Troubleshooting

### Problème: "Format non supporté"
**Solution:** Vérifiez l'extension du fichier (.csv, .json, .xml)

### Problème: "Colonnes manquantes: name, price"
**Solution:** Assurez-vous que votre fichier a au minimum les colonnes `name` et `price`

### Problème: "Prix invalide ABC"
**Solution:** Les prix doivent être des nombres (19.99, 100, etc.)

### Problème: Import n'envoie pas à l'API
**Solution:** Vérifiez que l'API PrestaShop est accessible et les colonnes sont correctement mappées

---

## 📚 Structure des Fichiers

```
src/
├── services/
│   └── FileImporterService.js .... Parsing et transformation
│
├── composables/
│   └── useFileImport.js .......... État réactif import
│
└── views/
    └── FileImporter.vue .......... Interface 4 étapes
```

---

## 🎓 Points Clés à Retenir

✅ **Support multiformat** - CSV, JSON, XML  
✅ **Conversion automatique** - Tous les formats → XML  
✅ **Mapping flexible** - Champs customisables  
✅ **Validation avant envoi** - Prévient les erreurs  
✅ **Interface intuitive** - 4 étapes guidées  
✅ **Aperçu avant import** - Vérification finale  

---

**Version:** 1.0  
**Date:** Mai 2026  
**Status:** ✅ En production
