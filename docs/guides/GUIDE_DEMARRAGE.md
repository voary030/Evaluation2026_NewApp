# 📖 Guide Complet - Comprendre PrestaShop et sa Base de Données

Bienvenue! Ce guide vous aidera à **comprendre comment fonctionne PrestaShop** et sa base de données.

---

## 🚀 Par Où Commencer?

### 👶 Vous Débutez? Commencez ici!

**Étape 1: Comprendre l'architecture (15 min)**
```
Lire → DATABASE_VISUAL.md
       ↳ Diagrammes simples et visuels
       ↳ Flow de circulation des données
       ↳ Exemples concrets
```

**Étape 2: Découvrir les tables principales (20 min)**
```
Lire → DATABASE.md
       ↳ Section "Tables Principales"
       ↳ Comprendre ps_product, ps_customer, ps_order
       ↳ Voir les relations
```

**Étape 3: Essayer des requêtes SQL (30 min)**
```
Faire → SQL_EXERCISES.md
        ↳ Exercices 1 & 2 (niveau débutant)
        ↳ Exécuter dans PHPMyAdmin
        ↳ Voir les résultats concrètement
```

---

## 📚 Structure des Documents

```
NewApp/docs/
├── 📄 listeApi.md
│   └─ Guide des ENDPOINTS PrestaShop
│      (Comment interroger l'API via HTTP)
│
├── 📄 DATABASE.md ⭐ (CE FICHIER - À lire!)
│   └─ Documentation complète des tables SQL
│      - Concepts fondamentaux
│      - Tables principales
│      - Relations entre tables
│      - Exemples SQL détaillés
│
├── 📄 DATABASE_VISUAL.md ⭐ (À lire ENSUITE!)
│   └─ Diagrammes et visualisations
│      - Flux de données visuels
│      - Schémas des tables
│      - Relations avec diagrammes
│      - Exemples concrets
│
├── 📄 SQL_EXERCISES.md ⭐ (À pratiquer!)
│   └─ Exercices pratiques du débutant à l'avancé
│      - 5 exercices progressifs
│      - Cas réels métier
│      - Défis créatifs
│      - Solutions
│
├── 📄 README.md (Documentation générale)
│   └─ Comment utiliser l'API via Vue.js
│
├── 📄 prestashop_2026-05-05_163855.sql
│   └─ Dump complet de la base de données
```

---

## 🎯 Cartes Mentales

### Bloc 1: COMPRENDRE

```
┌─ Qu'est-ce qu'une BDD?
│  ├─ Système de stockage de données
│  ├─ Organisé en tables (comme Excel)
│  ├─ Avec des relations entre elles
│  └─ Interrogée en SQL
│
├─ Qu'est-ce que SQL?
│  ├─ Langage pour interroger une BDD
│  ├─ SELECT = Récupérer
│  ├─ INSERT = Ajouter
│  ├─ UPDATE = Modifier
│  └─ DELETE = Supprimer
│
└─ Qu'est-ce que PrestaShop?
   ├─ Plateforme e-commerce
   ├─ Gère: produits, clients, commandes, stocks
   ├─ Stocke tout dans MySQL
   └─ API pour accéder programmatiquement
```

### Bloc 2: LES DONNÉES

```
┌─ DONNÉES PRODUITS
│  ├─ ps_product (description de base)
│  ├─ ps_product_lang (noms en FR, EN, ES...)
│  ├─ ps_product_shop (prix par boutique)
│  ├─ ps_image (photos)
│  └─ ps_stock (quantités)
│
├─ DONNÉES CLIENTS
│  ├─ ps_customer (compte client)
│  ├─ ps_address (adresses)
│  └─ ps_customer_message (support)
│
├─ DONNÉES COMMANDES
│  ├─ ps_order (commande)
│  ├─ ps_order_detail (articles)
│  ├─ ps_order_invoice (facture)
│  ├─ ps_order_payment (paiements)
│  └─ ps_order_state (état)
│
└─ DONNÉES DE CONFIGURATION
   ├─ ps_language (langues)
   ├─ ps_country (pays)
   ├─ ps_currency (devises)
   └─ ps_carrier (transporteurs)
```

### Bloc 3: LES OPERATIONS

```
┌─ LIRE des données
│  └─ SELECT ... FROM ... WHERE ...
│
├─ COMBINER des tables
│  └─ SELECT ... JOIN ... ON ...
│
├─ RÉSUMER les données
│  └─ SELECT ... GROUP BY ... HAVING ...
│
├─ CRÉER des données
│  └─ INSERT INTO ... VALUES ...
│
├─ MODIFIER des données
│  └─ UPDATE ... SET ... WHERE ...
│
└─ SUPPRIMER des données
   └─ DELETE FROM ... WHERE ...
```

---

## 🔍 Parcours d'Apprentissage Recommandé

### Semaine 1: Découverte

**Jour 1 - Concepts**
- Lire: DATABASE_VISUAL.md (flux et diagrammes)
- Temps: 20 min

**Jour 2 - Tables**
- Lire: DATABASE.md (Tables Principales)
- Temps: 30 min
- Comprendre ps_product, ps_customer, ps_order

**Jour 3 - Relations**
- Lire: DATABASE.md (Relations entre Tables)
- Temps: 20 min
- Voir comment les tables se lient

**Jour 4 - Exercices Simples**
- Faire: SQL_EXERCISES.md (Exercices 1 & 2)
- Temps: 30 min
- Exécuter dans PHPMyAdmin

**Jour 5 - Révision**
- Relire: DATABASE_VISUAL.md (Cas d'usage)
- Temps: 15 min
- Questions?

### Semaine 2: Pratique

**Jour 6 - JOINs**
- Faire: SQL_EXERCISES.md (Exercice 3)
- Temps: 40 min
- Combiner plusieurs tables

**Jour 7 - Statistiques**
- Faire: SQL_EXERCISES.md (Exercice 4)
- Temps: 40 min
- GROUP BY, COUNT, SUM, AVG

**Jour 8 - Cas Réels**
- Faire: SQL_EXERCISES.md (Exercice 5)
- Temps: 60 min
- Problèmes métier concrets

**Jour 9 - Défis**
- Faire: SQL_EXERCISES.md (Défis créatifs)
- Temps: 60 min
- Écrire des requêtes seul(e)

**Jour 10 - Projet**
- Créer: Votre propre requête
- Temps: Libre
- Répondre à une question métier

---

## 🎮 Outils à Utiliser

### PHPMyAdmin (Web Interface)

```
Accès: http://localhost/phpmyadmin
├─ User: root
├─ Password: (généralement vide)
└─ Database: prestashop

Navigation:
├─ Onglet "Database"
├─ Choisir "prestashop"
├─ Lister toutes les tables
├─ Cliquer sur une table pour voir les données
├─ Onglet "SQL" pour exécuter des requêtes
└─ Voir les résultats
```

### Terminal MySQL

```bash
# Se connecter
mysql -u root -p prestashop

# Lister les tables
SHOW TABLES;

# Voir la structure
DESCRIBE ps_product;

# Exécuter une requête
SELECT * FROM ps_customer LIMIT 5;

# Quitter
EXIT;
```

### DBeaver (Application Desktop - Plus puissant)

```
Installation: Gratuit via https://dbeaver.io
Avantages:
├─ Meilleure interface
├─ Autocomplétion SQL
├─ Visualisation schémas
├─ Export données
└─ Benchmarking
```

---

## 🧠 Concepts Clés à Retenir

### 1. Clés Primaires (PK)
```
= Identifiant UNIQUE d'une ligne
Exemple: id_product = 5 (toujours unique)
Utilité: Identifier précisément une entrée
```

### 2. Clés Étrangères (FK)
```
= Référence vers une autre table
Exemple: id_customer = 2 (dans ps_order)
Utilité: Créer des relations entre tables
```

### 3. Relations N:M
```
= Plusieurs vers plusieurs via table de liaison
Exemple: Produit A peut être dans Catégorie 1 ET Catégorie 2
Table de liaison: ps_category_product
```

### 4. Tables Multilingues
```
= Mêmes données en plusieurs langues
Structure: 1 table principale + 1 table "_lang" par langue
Exemple: ps_product + ps_product_lang (FR, EN, ES)
```

### 5. INDEX
```
= Accélérateur de recherche
Sans INDEX: Balaye TOUTES les lignes ❌ Lent
Avec INDEX: Accès direct ✅ Rapide
Les clés primaires et étrangères sont automatiquement indexées
```

---

## ❓ Foire Aux Questions

### Q: Comment afficher tous les produits?
```sql
SELECT * FROM ps_product;
-- Retour: Tous les produits (peut être lent!)

-- Mieux:
SELECT id_product, reference FROM ps_product LIMIT 100;
-- Retour: Les 100 premiers produits
```

### Q: Comment trouver un client par email?
```sql
SELECT * FROM ps_customer WHERE email = 'jean@example.com';
-- Retour: Les infos du client Jean (ou vide)
```

### Q: Comment voir les commandes d'un client?
```sql
SELECT * FROM ps_order WHERE id_customer = 5;
-- Retour: Toutes les commandes du client 5
```

### Q: Comment voir les articles d'une commande?
```sql
SELECT * FROM ps_order_detail WHERE id_order = 100;
-- Retour: Les 3 articles commandés
```

### Q: Comment compter les clients?
```sql
SELECT COUNT(*) as total FROM ps_customer;
-- Retour: 1523 clients
```

### Q: Comment avoir le chiffre d'affaires total?
```sql
SELECT SUM(total_paid) as ca_total FROM ps_order;
-- Retour: 45678.90€
```

---

## ⚠️ Erreurs Courantes

### ❌ Erreur 1: Oublier le JOIN
```sql
-- MAUVAIS:
SELECT customer.email, order.id_order FROM customer, order;
-- Résultat: Cartésien! Chaque client = chaque commande!

-- BON:
SELECT c.email, o.id_order FROM ps_customer c
JOIN ps_order o ON c.id_customer = o.id_customer;
-- Résultat: Appairage correct
```

### ❌ Erreur 2: Mélanger des langues
```sql
-- MAUVAIS:
SELECT * FROM ps_product_lang WHERE id_lang = 1;
-- Résultat: Produits français seulement

-- BON:
SELECT * FROM ps_product_lang 
WHERE id_lang = 1  -- Spécifier la langue
AND id_product IN (1, 2, 3);  -- Ou produits spécifiques
```

### ❌ Erreur 3: N+1 queries
```python
# MAUVAIS (Python):
products = db.query("SELECT * FROM ps_product")
for product in products:
    lang = db.query("SELECT name FROM ps_product_lang WHERE id_product = ?", product.id)
    # = N requêtes au lieu de 1!

# BON:
products = db.query("""
  SELECT p.*, pl.name FROM ps_product p
  JOIN ps_product_lang pl ON p.id_product = pl.id_product
""")
# = 1 requête seulement!
```

---

## 🎯 Mini-Projets à Faire

### Projet 1: Dashboard Ventes
```sql
-- Affiche le CA du mois
SELECT 
  COUNT(*) as commandes_mois,
  SUM(total_paid) as ca_mois,
  ROUND(AVG(total_paid), 2) as panier_moyen
FROM ps_order
WHERE MONTH(date_add) = MONTH(NOW());
```

### Projet 2: Meilleurs Clients
```sql
-- Top 10 clients les plus actifs
SELECT c.email, COUNT(o.id_order) as achats
FROM ps_customer c
JOIN ps_order o ON c.id_customer = o.id_customer
GROUP BY c.id_customer
ORDER BY achats DESC
LIMIT 10;
```

### Projet 3: Produits en Rupture
```sql
-- Stock faible
SELECT pl.name, ps.quantity
FROM ps_product p
JOIN ps_product_lang pl ON p.id_product = pl.id_product
JOIN ps_product_shop ps ON p.id_product = ps.id_product
WHERE ps.quantity < 5
ORDER BY ps.quantity;
```

---

## 📞 Besoin d'Aide?

1. **Relire DATABASE.md** - 90% des questions y sont répondues
2. **Essayer sur PHPMyAdmin** - Testez vos requêtes
3. **Utiliser LIMIT** - Limitez les résultats pour tester
4. **Lire les erreurs** - MySQL vous dit ce qui ne va pas

---

## 🚀 Prochaines Étapes

Une fois à l'aise avec SQL:

1. **Connecter en Vue.js**
   - Lire: listeApi.md (endpoints)
   - Fichier: src/services/prestashopApi.js
   - Faire: Charger les produits dans l'app

2. **Créer des visualisations**
   - Créer: Composants Vue.js
   - Afficher: Données de la BDD
   - Exemple: Dashboard des ventes

3. **Analyser les données**
   - Faire: Requêtes complexes
   - Créer: Rapports SQL
   - Exporter: Données en CSV/Excel

---

## 📊 Résumé Complet

| Concept | Emplacement | Temps |
|---------|-----------|-------|
| **Découverte** | DATABASE_VISUAL.md | 20 min |
| **Tables** | DATABASE.md | 30 min |
| **Exercices 1-2** | SQL_EXERCISES.md | 30 min |
| **Exercices 3-4** | SQL_EXERCISES.md | 60 min |
| **Exercices 5** | SQL_EXERCISES.md | 60 min |
| **Défis** | SQL_EXERCISES.md | 60 min |
| **TOTAL** | - | **4h30** |

---

**Bon apprentissage!** 🚀

Créé le: 6 mai 2026  
Version: 1.0
