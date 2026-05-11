# 📑 INDEX - Documentation PrestaShop & E-Commerce

## 🚀 Organisation

La documentation est organisée par **type de contenu** pour faciliter la navigation:

```
docs/
├── INDEX.md (vous êtes ici)
│
├── guides/ (📖 Pour APPRENDRE - Démarrage & Concepts)
│   ├── ECOMMERCE_CONCEPTS.md ⭐ PRIORITÉ (45 min)
│   └── GUIDE_DEMARRAGE.md (Plan apprentissage)
│
├── references/ (📚 Pour CONSULTER - Référence complète)
│   ├── DATABASE.md (Tables & structures)
│   ├── DATABASE_VISUAL.md (Diagrammes & flux)
│   ├── listeApi.md (Endpoints API)
│   └── README.md (API depuis Vue.js)
│
├── exercises/ (✍️ Pour PRATIQUER - Exercices SQL)
│   └── SQL_EXERCISES.md (5 niveaux)
│
└── data/ (💾 Données brutes)
    ├── prestashop_2026-05-05_163855.sql (Dump BDD)
    └── test-products.csv (Fichier test)
```

---

## 🎯 TL;DR - Commencer Rapidement

### 📍 Par où commencer?

**1️⃣ Première Lecture (45 min)**
- Ouvrir: [guides/ECOMMERCE_CONCEPTS.md](guides/ECOMMERCE_CONCEPTS.md)
- Comprendre: Produits, Clients, Commandes
- ⭐ **C'EST LA PRIORITÉ!**

**2️⃣ Plan d'Apprentissage (15 min)**
- Ouvrir: [guides/GUIDE_DEMARRAGE.md](guides/GUIDE_DEMARRAGE.md)
- Organiser votre apprentissage
- Voir les outils recommandés

**3️⃣ Diagrammes Visuels (30 min)**
- Ouvrir: [references/DATABASE_VISUAL.md](references/DATABASE_VISUAL.md)
- Voir flux et relations
- Exemples concrets

**4️⃣ Référence Complète (1h)**
- Ouvrir: [references/DATABASE.md](references/DATABASE.md)
- Documentation détaillée
- Tous les concepts

**5️⃣ Exercices Pratiques (4h)**
- Ouvrir: [exercises/SQL_EXERCISES.md](exercises/SQL_EXERCISES.md)
- Du débutant à avancé
- Tester en direct

---

## 📖 Guides - Pour Commencer {#guides}

### 🛍️ [E-Commerce Concepts](guides/ECOMMERCE_CONCEPTS.md) ⭐⭐⭐ PRIORITÉ

**Durée:** 45 min  
**Niveau:** Débutant  
**Ce qu'on y trouve:**
- Fondamentaux de l'e-commerce
- **3 Piliers:** Produits, Clients, Commandes
- Cycles de vie et processus complet
- Modèles de données
- 5 cas d'usage concrets
- Concepts avancés

**À faire:** Comprendre le flux client → panier → commande → livraison

---

### 📖 [Guide de Démarrage](guides/GUIDE_DEMARRAGE.md)

**Durée:** 15 min  
**Niveau:** Débutant  
**Ce qu'on y trouve:**
- Parcours d'apprentissage (2 semaines)
- Cartes mentales
- FAQ
- Outils recommandés (PHPMyAdmin, DBeaver)
- Erreurs courantes
- Mini-projets

**À faire:** Planifier votre apprentissage

---

## 📚 References - Pour Consulter {#references}

### 🗄️ [Base de Données Complète](references/DATABASE.md) ⭐⭐⭐

**Durée:** 1h  
**Niveau:** Intermédiaire  
**Ce qu'on y trouve:**
1. **Concepts Fondamentaux** (15 min)
   - Qu'est-ce qu'une BDD?
   - Termes: PK, FK, Index

2. **Architecture Générale** (15 min)
   - Types de tables
   - Préfixe ps_

3. **Tables Principales** (20 min)
   - ps_product, ps_customer, ps_order
   - ps_category, ps_cart, etc.

4. **Relations** (10 min)
   - 1:N, N:M, 1:1
   - Diagrammes

5. **Exemples Pratiques** (15 min)
   - 5 requêtes détaillées

6. **Requêtes SQL Utiles** (15 min)
   - Clients, Produits, Commandes

**À faire:** Consulter comme référence

---

### 📊 [Diagrammes et Visualisations](references/DATABASE_VISUAL.md) ⭐⭐⭐

**Durée:** 30 min  
**Niveau:** Débutant  
**Ce qu'on y trouve:**
1. **Flux de Données Principal** (5 min)
   - Comment un client achète

2. **Arborescence des Tables** (5 min)
   - Structure complète

3. **Schéma Multilingue** (5 min)
   - Produit en FR, EN, ES

4. **Schéma Multi-Shop** (5 min)
   - Prix différents par boutique

5. **Exemple: Commande** (5 min)
   - Cas concret "Sandwich"

6. **Relations Visuelles** (5 min)
   - PK vs FK

**À faire:** Visualiser pour mieux comprendre

---

### 🔌 [Liste des Endpoints API](references/listeApi.md)

**Durée:** 10-15 min consultation  
**Niveau:** Intermédiaire  
**Ce qu'on y trouve:**
- 100+ endpoints organisés
- Tableaux des méthodes (GET, POST, PUT, DELETE)
- Exemples de requêtes
- Paramètres de filtrage

**À faire:** Consulter pour connaître les ressources disponibles

---

### 💻 [API depuis Vue.js](references/README.md)

**Durée:** 15 min  
**Niveau:** Intermédiaire  
**Ce qu'on y trouve:**
- Service helper pour l'API
- Exemples d'utilisation
- Configuration proxy Vite
- Ressources utiles

**À faire:** Intégrer l'API dans du code Vue.js

---

## ✍️ Exercises - Pour Pratiquer {#exercises}

### 🎯 [Exercices SQL Pratiques](exercises/SQL_EXERCISES.md) ⭐⭐⭐

**Durée:** 4h (complet)  
**Niveau:** Débutant à Avancé  
**5 Exercices Progressifs:**

1. **Explorer** (30 min) - Débutant
   - SHOW TABLES, DESCRIBE, SELECT simple

2. **WHERE** (30 min) - Débutant
   - Filtrer, ORDER BY

3. **JOIN** (40 min) - Intermédiaire
   - Combiner tables, INNER/LEFT JOIN

4. **GROUP BY** (40 min) - Intermédiaire
   - COUNT, SUM, AVG, GROUP BY

5. **Cas Réels** (60+ min) - Avancé
   - Paniers abandonnés
   - Gestion stock
   - Rentabilité clients
   - Audit intégrité

**À faire:**
- Ouvrir PHPMyAdmin
- Copier-coller requêtes
- Modifier et tester

---

## 💾 Data - Fichiers Bruts {#data}

### 📦 [Export Base de Données](data/prestashop_2026-05-05_163855.sql)

**Taille:** ~230 KB  
**Contient:** Structure complète de la BDD  
**Utilité:**
- Voir la structure SQL exact
- Restaurer la BDD
- Référence SQL complète

**Commande pour restaurer:**
```bash
mysql -u root prestashop < data/prestashop_2026-05-05_163855.sql
```

---

### 📋 [Fichier Test CSV](data/test-products.csv)

**Taille:** ~1 KB  
**Contient:** Exemple de produits en CSV  
**Utilité:**
- Tester import de fichiers
- Exemple de format

---

## 🗺️ Plans d'Apprentissage Personnalisés

### 👶 Débutant Complet (10-12h total)

```
Jour 1:
  ├─ Lire → guides/ECOMMERCE_CONCEPTS.md (45 min) ⭐ PRIORITÉ
  └─ Lire → guides/GUIDE_DEMARRAGE.md (15 min)

Jour 2:
  ├─ Lire → references/DATABASE_VISUAL.md (30 min)
  └─ Lire → references/DATABASE.md Sections 1-3 (45 min)

Jour 3-4:
  ├─ Faire → exercises/SQL_EXERCISES.md 1-2 (60 min)
  └─ Lire → references/DATABASE.md Sections 4-6 (30 min)

Jour 5-6:
  └─ Faire → exercises/SQL_EXERCISES.md 3-4 (120 min)

Jour 7-10:
  └─ Faire → exercises/SQL_EXERCISES.md 5 (90+ min)

✓ Compréhension complète
```

### 📊 Analyste/DBA (15-20h total)

```
Jour 1-2:
  ├─ Lire → guides/ECOMMERCE_CONCEPTS.md (45 min)
  ├─ Lire → references/DATABASE.md (90 min)
  └─ Lire → references/DATABASE_VISUAL.md (30 min)

Jour 3-4:
  └─ Faire → exercises/SQL_EXERCISES.md Tout (240 min)

Jour 5-10:
  ├─ Projets avancés
  ├─ Optimisations SQL
  └─ Audit intégrité données

✓ Expertise complète
```

### 🚀 Développeur Vue.js (8-10h total)

```
Jour 1:
  ├─ Lire → guides/ECOMMERCE_CONCEPTS.md (45 min)
  └─ Lire → guides/GUIDE_DEMARRAGE.md (15 min)

Jour 2:
  ├─ Lire → references/DATABASE_VISUAL.md (30 min)
  └─ Lire → references/README.md (15 min)

Jour 3:
  ├─ Faire → exercises/SQL_EXERCISES.md 1-3 (100 min)
  └─ Coder → Intégrer API Vue.js

Jour 4-5:
  └─ Projet: Component productif

✓ Prêt à coder
```

---

## 🔍 Trouver Rapidement

| Je veux... | Je lis... | Durée |
|-----------|-----------|-------|
| Comprendre l'e-commerce | [guides/ECOMMERCE_CONCEPTS.md](guides/ECOMMERCE_CONCEPTS.md) | 45 min |
| Voir la structure BDD | [references/DATABASE_VISUAL.md](references/DATABASE_VISUAL.md) | 30 min |
| Apprendre les tables | [references/DATABASE.md](references/DATABASE.md) | 60 min |
| Explorer les endpoints | [references/listeApi.md](references/listeApi.md) | 15 min |
| Faire des exercices | [exercises/SQL_EXERCISES.md](exercises/SQL_EXERCISES.md) | 240 min |
| Intégrer l'API | [references/README.md](references/README.md) | 15 min |
| Planifier mon temps | [guides/GUIDE_DEMARRAGE.md](guides/GUIDE_DEMARRAGE.md) | 15 min |

---

## ✨ Points Clés

### 3 Piliers E-Commerce
1. **PRODUITS** = Ce qu'on vend
2. **CLIENTS** = Qui achète
3. **COMMANDES** = Qui achète quoi

### 3 Tables Essentielles
1. **ps_product** = Catalogue
2. **ps_customer** = Clients
3. **ps_order** = Historique

### Flux Principal
```
Consulter → Panier → Commander → Payer → Livrer
```

---

## 📞 Aide Rapide

**J'ai une erreur de CORS?**
→ Vérifier [references/README.md](references/README.md) - Configuration Vite

**Je ne comprends pas les relations?**
→ Voir [references/DATABASE_VISUAL.md](references/DATABASE_VISUAL.md)

**Je veux une requête SQL?**
→ Chercher dans [exercises/SQL_EXERCISES.md](exercises/SQL_EXERCISES.md)

**Je veux connaître un endpoint?**
→ Lister dans [references/listeApi.md](references/listeApi.md)

---

**Créé:** 6 mai 2026  
**Dernière mise à jour:** 6 mai 2026  
**Version:** 2.0 - Réorganisé par type
