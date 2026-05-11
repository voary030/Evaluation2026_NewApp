# 🎯 Guide de Démarrage - Évaluation J1

## Résumé Exécutif

Vous avez 3 documents clés pour implémenter l'évaluation J1:

| Document | Contenu | Audience |
|----------|---------|----------|
| **[SUJET_EVALUATION_J1.md](./SUJET_EVALUATION_J1.md)** | Spécification complète: Pages, workflows, APIs | PMs, QA, Devs |
| **[PLAN_IMPLEMENTATION_J1.md](./PLAN_IMPLEMENTATION_J1.md)** | Phases de développement avec code exemple | Devs |
| **[DONNEES_STRUCTURE_REFERENCE.md](./DONNEES_STRUCTURE_REFERENCE.md)** | Structure CSV, XML, JSON avec exemples | Devs, Data |

---

## 🚀 Démarrage Rapide (30 secondes)

### Étape 1: Comprendre le Sujet
```
Lire: SUJET_EVALUATION_J1.md
Durée: 15 min
Focus: Sections "BackOffice" et "FrontOffice"
```

### Étape 2: Voir le Plan
```
Lire: PLAN_IMPLEMENTATION_J1.md
Durée: 20 min
Focus: Phases 1-7 et checklist
```

### Étape 3: Référence Données
```
Consulter: DONNEES_STRUCTURE_REFERENCE.md
Durée: À la demande
Focus: Sections pertinentes lors du code
```

---

## 📋 Checklist de Lecture

### Pour les Développeurs

- [ ] **SUJET_EVALUATION_J1.md**
  - [ ] Vue d'Ensemble (comprendre le scope)
  - [ ] BackOffice - Spécifications (5 pages)
  - [ ] FrontOffice - Spécifications (5 pages)
  - [ ] Workflow Complet (comprendre les flux)
  
- [ ] **PLAN_IMPLEMENTATION_J1.md**
  - [ ] Phase 1: Auth (30 min)
  - [ ] Phase 2: Import (1h)
  - [ ] Phase 3: Commandes (30 min)
  - [ ] Phase 4-6: FrontOffice (2h)
  - [ ] Checklist d'intégration
  
- [ ] **DONNEES_STRUCTURE_REFERENCE.md**
  - [ ] Format CSV d'import (ref rapide)
  - [ ] Format XML PrestaShop (ref rapide)
  - [ ] SessionStorage Panier (ref rapide)

### Pour les QA/Testeurs

- [ ] **SUJET_EVALUATION_J1.md**
  - [ ] Critères de Réussite (voir fin du doc)
  - [ ] Workflows Complets (section "Workflow Complet")
  - [ ] Contraintes (voir fin du doc)

### Pour les PMs

- [ ] **SUJET_EVALUATION_J1.md**
  - [ ] Vue d'Ensemble (vue globale)
  - [ ] Critères de Réussite
  - [ ] Dates clés

---

## 📁 Fichiers à Créer

### BackOffice (5 fichiers Vue)

```
src/views/Admin/
├── AdminLogin.vue           ← Formulaire login
├── AdminDashboard.vue       ← Tableau de bord (optionnel)
├── AdminReset.vue           ← Bouton réinitialiser
├── AdminImport.vue          ← Importer 4 fichiers
└── AdminOrders.vue          ← Afficher/modifier commandes
```

### FrontOffice (5 fichiers Vue)

```
src/views/Shop/
├── Home.vue                 ← Catalogue produits
├── ProductDetail.vue        ← Fiche produit avec variantes
├── Cart.vue                 ← Panier
├── Checkout.vue             ← Validation commande
└── MyOrders.vue             ← Mes commandes
```

### Composables (4 fichiers)

```
src/composables/
├── admin/
│   ├── useAdminAuth.js      ← Login
│   ├── useImport.js         ← Import CSV/ZIP
│   └── useAdminOrders.js    ← Commandes admin
└── shop/
    ├── useCart.js           ← Panier
    ├── useCatalog.js        ← Produits
    ├── useCheckout.js       ← Checkout
    └── useMyOrders.js       ← Mes commandes
```

### API (2 nouveaux fichiers)

```
src/api/
├── admin.js                 ← Login, logout
└── import.js                ← Import données
```

### Services (2 nouveaux fichiers)

```
src/services/
├── CSVParserService.js      ← Parser CSV
└── ImportService.js         ← Orchestration import
```

### Store (1 fichier)

```
src/stores/
└── cartStore.js             ← Gestion panier (Pinia ou ref)
```

### Router (1 modification)

```
src/router/
└── index.js                 ← Ajouter routes + guards
```

---

## 🔄 Flux de Développement Recommandé

### Jour 1: Backend Admin

```
Phase 1 (1h):   Authentification
                → AdminLogin.vue
                → useAdminAuth.js
                → api/admin.js

Phase 2 (2h):   Import Données
                → AdminImport.vue
                → CSVParserService.js
                → ImportService.js
                → api/import.js

Phase 3 (1h):   Gestion Commandes
                → AdminOrders.vue
                → api/orders.js
```

### Jour 2: Frontend Shop

```
Phase 4 (1h):   Catalogue Produits
                → Home.vue
                → useCatalog.js
                → ProductDetail.vue

Phase 5 (1.5h): Panier & Checkout
                → Cart.vue
                → Checkout.vue
                → useCart.js
                → cartStore.js

Phase 6 (0.5h): Mes Commandes
                → MyOrders.vue
                → useMyOrders.js

Phase 7 (0.5h): Intégration & Tests
                → Routes
                → Guards
                → Tests end-to-end
```

**Total estimé**: 8 heures

---

## 🔗 Navigation Rapide

### Par Sujet

**Authentification?**
→ Voir PLAN_IMPLEMENTATION_J1.md Phase 1 + SUJET_EVALUATION_J1.md "Page 1: Authentification"

**Import CSV?**
→ Voir PLAN_IMPLEMENTATION_J1.md Phase 2 + DONNEES_STRUCTURE_REFERENCE.md "Format CSV"

**Panier?**
→ Voir SUJET_EVALUATION_J1.md "Page 3: Panier" + DONNEES_STRUCTURE_REFERENCE.md "SessionStorage"

**Commandes?**
→ Voir SUJET_EVALUATION_J1.md "Page 5: Gestion Commandes" + DONNEES_STRUCTURE_REFERENCE.md "Format XML"

**Variantes?**
→ Voir DONNEES_STRUCTURE_REFERENCE.md "Fichier 2: variantes.csv" + SUJET_EVALUATION_J1.md "Fiche Produit"

---

## 💡 Tips & Astuces

### Commencer petit

```javascript
// ✅ BON: Commencer par la login
1. Créer AdminLogin.vue simple
2. Valider le formulaire côté client
3. Sauvegarder en sessionStorage
4. Tester avec défaut admin@newapp.com

// ❌ MAUVAIS: Tout faire d'un coup
Créer Admin + Shop + API + Services en même temps
```

### Réutiliser le code existant

```javascript
// Vous avez déjà:
- api/products.js ← Utiliser pour le catalogue
- services/ProductService.js ← Pour les URLs images
- composables/products/ ← Pour l'inspiration

// À adapter:
- useProducts.js ← Adapter pour useCatalog.js
- ProductService.getImageUrl() ← Réutiliser
```

### Data Mock pour tester

```javascript
// Au lieu de dépendre de l'import, utiliser des données statiques d'abord

const MOCK_PRODUCTS = [
  { id: 1, reference: 'T_01', name: 'Tshirt', price: 11.20, priceTTC: 12.50, ... },
  { id: 2, reference: 'P_01', name: 'Pantalon', price: 16.97, priceTTC: 18.99, ... },
  // ...
]

// Puis remplacer par l'API réelle
```

### Tester les trois workflows

```
Workflow 1: Achat client neuf
- Accueil → Produit → Ajouter panier → Checkout → Commande

Workflow 2: Modifier état commande
- Admin login → Voir commande → Changer état → Refresh front → Voir changement

Workflow 3: Import données
- Admin login → Importer CSV/ZIP → Vérifier PrestaShop → Voir produits front
```

---

## ❓ FAQ

### Q: Par où commencer?
**R**: Lire SUJET_EVALUATION_J1.md (15 min), puis PLAN_IMPLEMENTATION_J1.md Phase 1 (AdminLogin).

### Q: Comment organiser le code?
**R**: Suivre la structure proposée dans PLAN_IMPLEMENTATION_J1.md "Structuration du Projet".

### Q: Dois-je utiliser Pinia?
**R**: Non obligatoire. Pour le panier, sessionStorage avec ref() Composition API suffit.

### Q: Quels endpoints PrestaShop?
**R**: Voir SUJET_EVALUATION_J1.md "API Endpoints Nécessaires" et DONNEES_STRUCTURE_REFERENCE.md.

### Q: Comment parser le CSV?
**R**: Voir DONNEES_STRUCTURE_REFERENCE.md "Parsing JavaScript" et PLAN_IMPLEMENTATION_J1.md "CSVParserService.js".

### Q: Que faire si l'image est vide?
**R**: Afficher un placeholder gris avec icône 🖼️.

### Q: Comment tester l'import?
**R**: Créer un fichier CSV de test (3 lignes) et vérifier les données dans PrestaShop backoffice.

---

## 📞 Aide & Référence

### Erreurs Courantes

```
❌ Erreur: "Impossible de créer le produit"
→ Vérifier le XML format
→ Vérifier les champs requis (name, price, id_category_default)

❌ Erreur: "CSV parse invalide"
→ Vérifier les guillemets dans les données
→ Vérifier les séparateurs virgules

❌ Erreur: "Image non uploadée"
→ Vérifier le format (jpg, png, gif)
→ Vérifier la taille (max 5MB)

❌ Erreur: "État commande pas changé"
→ Vérifier que l'ID commande existe
→ Vérifier que l'état est valide (1, 2, 6)
```

### Ressources Utiles

- **ImageManagement.md**: Voir la gestion images (réutiliser uploadProductImage)
- **ARCHITECTURE.md**: Comprendre l'architecture existante
- **Fichiers existants**: ProductService.js, useProducts.js, etc.

---

## 📅 Timeline Suggérée

```
Jour 1 (8h):
├─ 09:00-10:00: Lire docs + setup initial
├─ 10:00-12:00: Phase 1 (Auth) + Phase 2 (Import)
├─ 13:00-15:00: Phase 3 (Commandes) + Phase 4 (Catalogue)
└─ 15:00-17:00: Phase 5-6 (Panier, Checkout, Mes Commandes) + Tests

Jour 2 (si nécessaire):
├─ 09:00-11:00: Fix bugs + ajustements
├─ 11:00-12:00: Tests end-to-end
└─ 13:00-17:00: Optimisations + polishing
```

---

## ✅ Validation Finale

Avant de terminer, vérifier:

- [ ] **BackOffice**
  - [ ] Login fonctionne avec admin@newapp.com
  - [ ] Pages protégées (redirection si pas connecté)
  - [ ] Réinitialiser : supprime tout
  - [ ] Importer: crée produits, clients, commandes, images
  - [ ] Commandes: affichage + modification état

- [ ] **FrontOffice**
  - [ ] Accueil: affiche 4 produits
  - [ ] Fiche produit: affiche variantes
  - [ ] Panier: ajouter/supprimer articles
  - [ ] Checkout: créer commande
  - [ ] Mes Commandes: affiche commandes du client

- [ ] **Intégration**
  - [ ] Données import visibles PrestaShop
  - [ ] Images affichées correctement
  - [ ] États commandes synchronisés
  - [ ] Aucune page non demandée

---

## 🎉 Prêt à Commencer?

```
1. Ouvrir SUJET_EVALUATION_J1.md ✓
2. Lire les spécifications ✓
3. Ouvrir PLAN_IMPLEMENTATION_J1.md ✓
4. Créer AdminLogin.vue ✓
5. Implémenter Phase 1 ✓

Bon développement! 🚀
```

---

**Document créé**: 11 mai 2026
**Version**: 1.0 - Guide de Démarrage

