# 🗄️ Guide Complet des Bases de Données PrestaShop

## 📚 Table des Matières
1. [Concepts Fondamentaux](#concepts)
2. [Architecture Générale](#architecture)
3. [Tables Principales](#tables)
4. [Relations entre Tables](#relations)
5. [Exemples Pratiques](#exemples)
6. [Requêtes SQL Utiles](#requetes)

---

## 📖 Concepts Fondamentaux {#concepts}

### Qu'est-ce qu'une Base de Données (BDD)?

Une base de données est un **ensemble organisé d'informations** stockées sur le serveur. PrestaShop utilise **MySQL/MariaDB**.

```
📦 PrestaShop (Application)
    ↓
🗄️ MySQL Database (Stockage des données)
    ↓
📊 Tables (Excel-like spreadsheets)
    ↓
📋 Lignes (Records/entrées)
    ↓
🔲 Colonnes (Fields/champs)
```

### Termes Importants

| Terme | Explication | Exemple |
|-------|-------------|---------|
| **Table** | Liste de données structurée | `ps_product` |
| **Colonne/Champ** | Type d'information | `id_product`, `name`, `price` |
| **Ligne/Enregistrement** | Une entrée unique | Un produit spécifique |
| **Clé Primaire (PK)** | Identifiant unique | `id_product = 5` |
| **Clé Étrangère (FK)** | Lien vers une autre table | `id_category` |
| **Index** | Accélère les recherches | Index sur `id_product` |

---

## 🏗️ Architecture Générale {#architecture}

### Préfixe des Tables

Toutes les tables commencent par `ps_` (PrestaShop).

```sql
ps_product           -- Produits
ps_customer          -- Clients
ps_order             -- Commandes
ps_category          -- Catégories
ps_address           -- Adresses
ps_cart              -- Paniers
```

### Types de Tables

#### 1️⃣ **Tables Principales** (Core Data)
Données de base de l'e-commerce

```
ps_product           → Les produits vendus
ps_customer          → Les clients enregistrés
ps_order             → Les commandes passées
ps_category          → Organisation des produits
ps_cart              → Paniers d'achat
```

#### 2️⃣ **Tables Multilingues** (Lang Tables)
Mêmes données en plusieurs langues

```
ps_product_lang      → Noms/descriptions en FR, EN, ES...
ps_category_lang     → Noms des catégories par langue
ps_customer_message_lang
```

#### 3️⃣ **Tables Multi-Shop** (Shop Tables)
Même données par boutique (si multi-shop activé)

```
ps_product_shop      → Prix/stocks par boutique
ps_attribute_group_shop
```

#### 4️⃣ **Tables de Liaison** (Junction/Pivot)
Relient deux tables ensemble

```
ps_category_product  → Lie produits et catégories
ps_accessory         → Lie produits accessoires
ps_feature_product   → Lie produits et caractéristiques
```

---

## 📊 Tables Principales {#tables}

### 1. **ps_product** - Les Produits
La table la plus importante!

```sql
CREATE TABLE ps_product (
  id_product           INT PRIMARY KEY,           -- ID unique (PK)
  id_category_default  INT,                       -- Catégorie par défaut
  id_manufacturer      INT,                       -- Marque/Fabricant
  id_supplier          INT,                       -- Fournisseur
  reference            VARCHAR(64),               -- Référence produit
  width                DECIMAL(20,6),             -- Largeur
  height               DECIMAL(20,6),             -- Hauteur
  depth                DECIMAL(20,6),             -- Profondeur
  weight               DECIMAL(20,6),             -- Poids
  quantity_discount    TINYINT,                   -- Remise quantité
  ean13                VARCHAR(13),               -- Code-barre EAN13
  isbn                 VARCHAR(32),               -- Code ISBN
  upc                  VARCHAR(12),               -- Code UPC
  date_add             DATETIME,                  -- Date création
  date_upd             DATETIME,                  -- Date modification
  active               TINYINT(1)                 -- Actif/Inactif (1/0)
);
```

### 2. **ps_product_lang** - Noms & Descriptions Produits

```sql
CREATE TABLE ps_product_lang (
  id_product           INT NOT NULL,              -- Lien vers ps_product
  id_lang              INT NOT NULL,              -- Lien vers ps_lang
  id_shop              INT NOT NULL,              -- Lien vers ps_shop
  name                 VARCHAR(128),              -- Nom du produit
  description          LONGTEXT,                  -- Description complète
  description_short    LONGTEXT,                  -- Résumé
  link_rewrite         VARCHAR(128),              -- URL friendly (slug)
  meta_description     VARCHAR(512),              -- Meta description SEO
  meta_keywords        VARCHAR(255)               -- Meta keywords SEO
);
```

### 3. **ps_customer** - Les Clients

```sql
CREATE TABLE ps_customer (
  id_customer          INT PRIMARY KEY,           -- ID unique
  id_gender            INT,                       -- Civilité (M/F)
  id_default_group     INT,                       -- Groupe client
  email                VARCHAR(255) UNIQUE,       -- Email unique
  passwd               VARCHAR(255),              -- Mot de passe hashé
  firstname            VARCHAR(255),              -- Prénom
  lastname             VARCHAR(255),              -- Nom
  birthday             DATE,                      -- Date naissance
  newsletter           TINYINT(1),                -- Inscrit newsletter
  ip_registration_address VARCHAR(16),           -- IP d'enregistrement
  date_add             DATETIME,                  -- Date création
  date_upd             DATETIME,                  -- Date modification
  active               TINYINT(1)                 -- Compte actif
);
```

### 4. **ps_order** - Les Commandes

```sql
CREATE TABLE ps_order (
  id_order             INT PRIMARY KEY,           -- ID unique
  id_customer          INT NOT NULL,              -- Lien vers client
  id_address_delivery  INT,                       -- Adresse livraison
  id_address_invoice   INT,                       -- Adresse facturation
  id_currency          INT,                       -- Devise
  id_carrier           INT,                       -- Transporteur
  current_state        INT,                       -- État actuel
  secure_key           VARCHAR(32),               -- Clé de sécurité
  payment              VARCHAR(255),              -- Méthode paiement
  total_paid           DECIMAL(20,6),             -- Total payé
  total_paid_real      DECIMAL(20,6),             -- Total réel payé
  total_products       DECIMAL(20,6),             -- Montant produits
  total_products_wt    DECIMAL(20,6),             -- Montant produits TTC
  total_shipping       DECIMAL(20,6),             -- Frais livraison
  total_tax            DECIMAL(20,6),             -- Montant TVA
  total_discounts      DECIMAL(20,6),             -- Remises
  carrier_tax_rate     DECIMAL(10,6),             -- TVA transporteur
  date_add             DATETIME,                  -- Date commande
  date_upd             DATETIME                   -- Modification
);
```

### 5. **ps_order_detail** - Détails de Commande

```sql
CREATE TABLE ps_order_detail (
  id_order_detail      INT PRIMARY KEY,           -- ID unique
  id_order             INT NOT NULL,              -- Lien vers commande
  id_product           INT,                       -- Lien vers produit
  id_product_attribute INT,                       -- Variante produit
  product_name         VARCHAR(255),              -- Nom du produit
  product_quantity     INT,                       -- Quantité commandée
  product_price        DECIMAL(20,6),             -- Prix unitaire HT
  product_total        DECIMAL(20,6),             -- Total HT
  product_tax          DECIMAL(20,6),             -- TVA unitaire
  unit_price_tax_incl  DECIMAL(20,6),             -- Prix unitaire TTC
  unit_price_tax_excl  DECIMAL(20,6)              -- Prix unitaire HT
);
```

### 6. **ps_category** - Les Catégories

```sql
CREATE TABLE ps_category (
  id_category          INT PRIMARY KEY,           -- ID unique
  id_parent            INT DEFAULT 0,             -- Catégorie parent
  position             INT,                       -- Ordre d'affichage
  level_depth          INT,                       -- Profondeur (1=racine)
  nleft                INT,                       -- Nested Set Left
  nright               INT,                       -- Nested Set Right
  active               TINYINT(1),                -- Active
  date_add             DATETIME,                  -- Date création
  date_upd             DATETIME                   -- Date modification
);
```

### 7. **ps_cart** - Les Paniers

```sql
CREATE TABLE ps_cart (
  id_cart              INT PRIMARY KEY,           -- ID unique
  id_customer          INT,                       -- Lien vers client
  id_shop_group        INT,                       -- Groupe boutique
  id_shop              INT,                       -- Boutique
  id_lang              INT,                       -- Langue
  date_add             DATETIME,                  -- Date création
  date_upd             DATETIME,                  -- Dernière modification
  secure_key           VARCHAR(32),               -- Clé de sécurité
  checkouted           TINYINT(1)                 -- Finalisé
);
```

### 8. **ps_cart_product** - Articles du Panier

```sql
CREATE TABLE ps_cart_product (
  id_cart              INT NOT NULL,              -- Lien vers panier
  id_product           INT NOT NULL,              -- Lien vers produit
  id_product_attribute INT NOT NULL,              -- Variante
  quantity             INT,                       -- Quantité
  date_add             DATETIME                   -- Ajouté à
);
```

---

## 🔗 Relations entre Tables {#relations}

### Diagramme des Relations Principales

```
┌─────────────────┐
│  ps_customer    │ (Clients)
│  id_customer (PK)
└────────┬────────┘
         │
         │ 1:N (1 client → N adresses)
         │
         ▼
┌─────────────────┐
│  ps_address     │ (Adresses)
│  id_address (PK)
│  id_customer (FK)
└────────┬────────┘


┌─────────────────┐
│  ps_customer    │ 1
└────────┬────────┘
         │ N:1 (1 client → N commandes)
         │
         ▼
┌─────────────────────┐
│  ps_order           │ (Commandes)
│  id_order (PK)      │
│  id_customer (FK)   │
└────────┬────────────┘
         │
         │ 1:N (1 commande → N articles)
         │
         ▼
┌─────────────────────────┐
│  ps_order_detail        │ (Détails)
│  id_order_detail (PK)   │
│  id_order (FK)          │
│  id_product (FK)        │
└─────────────────────────┘


┌─────────────────┐
│  ps_product     │ N:M (via ps_category_product)
└────────┬────────┘
         │
         │ M:N
         │
         ▼
┌──────────────────────┐
│  ps_category_product │ (Liaison)
│  id_category (FK)    │
│  id_product (FK)     │
└──────────────────────┘
         │
         │
         ▼
┌─────────────────┐
│  ps_category    │
└─────────────────┘
```

### Types de Relations

#### **1:N (Un vers Plusieurs)**
```
1 Client → N Commandes
1 Panier → N Articles du Panier
1 Catégorie → N Produits
```

#### **N:M (Plusieurs vers Plusieurs)**
```
N Produits ↔ M Catégories
N Produits ↔ M Accessoires
```

#### **1:1 (Un vers Un)**
```
1 Commande → 1 Facture
```

---

## 💡 Exemples Pratiques {#exemples}

### Exemple 1: Afficher un Produit Complet

```sql
-- Récupérer les infos d'un produit avec sa langue
SELECT 
  p.id_product,
  p.reference,
  pl.name,
  pl.description,
  pl.description_short,
  p.width,
  p.height,
  p.depth,
  p.weight,
  p.active
FROM ps_product p
LEFT JOIN ps_product_lang pl ON (p.id_product = pl.id_product)
WHERE p.id_product = 5
AND pl.id_lang = 1;  -- 1 = Français
```

### Exemple 2: Lister les Commandes d'un Client

```sql
SELECT 
  o.id_order,
  o.reference,
  o.total_paid,
  o.date_add,
  os.name as state
FROM ps_order o
LEFT JOIN ps_order_state_lang os ON (
  o.current_state = os.id_order_state 
  AND os.id_lang = 1
)
WHERE o.id_customer = 2
ORDER BY o.date_add DESC;
```

### Exemple 3: Récupérer les Articles d'une Commande

```sql
SELECT 
  od.id_order_detail,
  od.product_name,
  od.product_quantity,
  od.product_price,
  od.product_total
FROM ps_order_detail od
WHERE od.id_order = 10
ORDER BY od.id_order_detail;
```

### Exemple 4: Produits par Catégorie

```sql
SELECT 
  p.id_product,
  pl.name,
  p.reference
FROM ps_product p
INNER JOIN ps_product_lang pl ON (p.id_product = pl.id_product)
INNER JOIN ps_category_product cp ON (p.id_product = cp.id_product)
WHERE cp.id_category = 3
AND pl.id_lang = 1
AND p.active = 1;
```

### Exemple 5: Statistiques de Ventes

```sql
SELECT 
  DATE(o.date_add) as date,
  COUNT(DISTINCT o.id_order) as nb_commandes,
  SUM(o.total_paid) as montant_total,
  COUNT(DISTINCT o.id_customer) as nb_clients
FROM ps_order o
WHERE o.date_add >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(o.date_add)
ORDER BY date DESC;
```

---

## 🔍 Requêtes SQL Utiles {#requetes}

### Clients

```sql
-- Nombre total de clients
SELECT COUNT(*) FROM ps_customer;

-- Clients les plus actifs (par commandes)
SELECT c.email, COUNT(o.id_order) as nb_commandes
FROM ps_customer c
LEFT JOIN ps_order o ON c.id_customer = o.id_customer
GROUP BY c.id_customer
ORDER BY nb_commandes DESC
LIMIT 10;

-- Clients non actifs
SELECT * FROM ps_customer WHERE active = 0;
```

### Produits

```sql
-- Tous les produits actifs
SELECT id_product, reference FROM ps_product WHERE active = 1;

-- Produits sans description
SELECT p.id_product, p.reference
FROM ps_product p
LEFT JOIN ps_product_lang pl ON p.id_product = pl.id_product
WHERE pl.description IS NULL OR pl.description = '';

-- Produits coûteux
SELECT pl.name, ps.price
FROM ps_product p
JOIN ps_product_lang pl ON p.id_product = pl.id_product
JOIN ps_product_shop ps ON p.id_product = ps.id_product
WHERE ps.price > 1000;
```

### Commandes

```sql
-- Commandes du jour
SELECT * FROM ps_order WHERE DATE(date_add) = CURDATE();

-- Chiffre d'affaires mensuel
SELECT 
  DATE_TRUNC(date_add, MONTH) as mois,
  SUM(total_paid) as ca
FROM ps_order
GROUP BY DATE_TRUNC(date_add, MONTH)
ORDER BY mois DESC;

-- Commandes en attente
SELECT o.id_order, c.email
FROM ps_order o
JOIN ps_customer c ON o.id_customer = c.id_customer
WHERE o.current_state IN (1, 2);  -- États 1 et 2 = en attente
```

---

## 📈 Schéma Complet Simplifié

```
CORE ENTITIES
├── ps_product (Produits)
├── ps_customer (Clients)
├── ps_order (Commandes)
├── ps_category (Catégories)
└── ps_cart (Paniers)

LANGUAGE VARIANTS
├── ps_product_lang
├── ps_category_lang
├── ps_customer_message_lang
└── ...

MULTI-SHOP VARIANTS
├── ps_product_shop
├── ps_attribute_group_shop
└── ...

JUNCTION TABLES (Liaisons N:M)
├── ps_category_product
├── ps_accessory
├── ps_feature_product
├── ps_cart_product
└── ps_order_detail

REFERENCE DATA
├── ps_language
├── ps_currency
├── ps_country
├── ps_state
├── ps_carrier
└── ps_shop
```

---

## 🎓 Bonnes Pratiques

### ✅ À Faire

```sql
-- ✅ Bon : Utiliser INNER JOIN pour les données liées
SELECT p.*, pl.name
FROM ps_product p
INNER JOIN ps_product_lang pl ON p.id_product = pl.id_product;

-- ✅ Bon : Filtrer les données actives
SELECT * FROM ps_product WHERE active = 1;

-- ✅ Bon : Utiliser des INDEX sur les clés étrangères
SELECT * FROM ps_order WHERE id_customer = 5;
```

### ❌ À Éviter

```sql
-- ❌ Mauvais : Requête sans JOIN (données incomplètes)
SELECT * FROM ps_product;  -- Sans traductions!

-- ❌ Mauvais : N+1 queries (boucle inefficace)
foreach product in products:
  query: SELECT * FROM ps_product_lang WHERE id_product = product.id

-- ❌ Mauvais : LIKE sur colonne très volumineuse
SELECT * FROM ps_product WHERE name LIKE '%test%';  -- Lent!
```

---

## 🔗 Ressources

- **Accès Direct:** `c:\xampp\htdocs\EVAL\NewApp\docs\prestashop_2026-05-05_163855.sql`
- **PHPMyAdmin:** `http://localhost/phpmyadmin` (Gérer visuellement)
- **Clients Disponibles:** Navicat, MySQL Workbench, DBeaver

---

**Créé le:** 6 mai 2026  
**Version:** 1.0
