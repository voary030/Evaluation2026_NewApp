# 🚀 Étape 1: Import des Produits

## ✅ Ce qui vient d'être implémenté

### Services créés:
- **ProductImportService.js** — Logique métier pour l'import de produits
  - `importProducts()` — Lance l'import du CSV
  - `getOrCreateCategory()` — Gère la création/récupération des catégories
  - `createProduct()` — Crée un produit via l'API PrestaShop
  - `calculatePriceHT()` — Convertit prix TTC → prix HT

### Composant mis à jour:
- **FileImporter.vue** — Interface d'import améliorée
  - Progression en temps réel
  - Gestion des erreurs
  - Affichage des problèmes ligne par ligne

---

## 📝 Processus d'Import des Produits

```
CSV → Parse → Pour chaque ligne:
      ↓
      1. Chercher ou créer la catégorie
      2. Calculer prix HT (prix TTC / 1.20)
      3. Créer le produit via API PrestaShop
      ↓
      Résultat: X produits créés, Y erreurs
```

### Colonnes CSV attendues:
| Colonne | Exemple | Obligatoire |
|---------|---------|-------------|
| `date_availability_produit` | 2026-01-01 | ❌ |
| `nom` | T-Shirt Blanc | ✅ |
| `reference` | T_01 | ✅ |
| `prix_ttc` | 29.99 | ✅ |
| `Taxe` | 20 | ❌ (défaut: 20%) |
| `categorie` | Vêtements | ❌ (défaut: Uncategorized) |
| `prix_achat` | 10.00 | ❌ (défaut: 0) |

---

## 🧪 Comment Tester

### 1. Préparer le fichier CSV
Utilisez le fichier exemple: `docs/data/import/produits_exemple.csv`

Ou créez le vôtre avec les colonnes ci-dessus (séparateur: `,` `;` ou `\t` — auto-détecté)

### 2. Aller à la page d'import
```
http://localhost:5173/backoffice/import
```

### 3. Sélectionner le fichier
- Cliquez sur l'input "Fichier 1: Produits (CSV)"
- Choisissez votre fichier CSV

### 4. Lancer l'import
- Cliquez sur "📤 Importer"
- Suivez la progression en direct
- Attendez la confirmation de succès

### 5. Vérifier les résultats
- Rendez-vous à: `/backoffice/produits`
- Vérifiez que les produits sont apparus
- Regardez dans PrestaShop admin que les catégories ont été créées

---

## ⚠️ Points Importants

### Prix HT vs TTC
- **Vous fournissez**: Prix TTC (ce que paie le client)
- **L'API PrestaShop attend**: Prix HT (avant taxes)
- **Conversion**: Prix HT = Prix TTC / (1 + Taxe/100)
  - Ex: 29.99 TTC avec 20% TVA → 24.99 HT

### Catégories
- Si la catégorie existe → réutilisée
- Si n'existe pas → créée automatiquement
- Recherche par nom exact

### Erreurs Possibles
- Nom ou référence manquants → ligne ignorée
- API PrestaShop inaccessible → import échoue
- Erreurs affichées avec le numéro de ligne et le message

---

## 🐛 Débogage

### Vérifier les logs
Ouvrez la console du navigateur (F12) pour voir les appels API et erreurs.

### Accéder à l'API directement
```javascript
// Dans la console, tester la création d'une catégorie
import { ProductImportService } from './src/services/imports/ProductImportService'
ProductImportService.createCategory('Test')
```

### Vérifier PrestaShop
- Admin: `http://localhost/EVAL/admin850fwun0l1kmrqi5hw6`
- Catalogue → Produits
- Catalogue → Catégories

---

## 📊 Prochaines Étapes

Une fois l'import des produits validé:

1. **Étape 2: Importer les Variantes** (tailles, couleurs, stock)
2. **Étape 3: Importer les Clients** (emails, adresses)
3. **Étape 4: Importer les Commandes** (avec réservation de stock)
4. **Étape 5: Importer les Images** (ZIP avec images)

Chaque étape ajoutera une section au `handleImport()` du composant.

---

## ✅ Checklist pour Phase 1 Complète

- [x] Créer ProductImportService.js
- [x] Parser CSV des produits
- [x] Gérer catégories (créer/chercher)
- [x] Calculer prix HT
- [x] Créer produits via API
- [x] Afficher progression + erreurs
- [ ] **Tester avec CSV exemple**
- [ ] Valider dans PrestaShop
- [ ] Démarrer Phase 2 (variantes)
