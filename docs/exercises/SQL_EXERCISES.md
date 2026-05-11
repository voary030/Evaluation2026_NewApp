# 🎯 Exercices Pratiques - Base de Données PrestaShop

Bienvenue! Ce guide vous aidera à **comprendre et explorer** la base de données PrestaShop.

## 🛠️ Outils Nécessaires

- **PHPMyAdmin:** `http://localhost/phpmyadmin`
- **Terminal/CMD:** Pour MySQL en ligne de commande
- **MySQL Client:** DBeaver, Navicat, MySQL Workbench (optionnel)

---

## 📝 Exercice 1: Explorer les Tables

### Niveau: Débutant

### Objectif
Comprendre la structure de la base de données

### Requêtes à Essayer

```sql
-- 1️⃣ Voir toutes les tables
SHOW TABLES;
-- Résultat: Liste avec "ps_" prefix

-- 2️⃣ Voir la structure d'une table
DESCRIBE ps_customer;
-- Résultat: Colonnes, types, clés

-- 3️⃣ Compter les clients
SELECT COUNT(*) as total_clients FROM ps_customer;
-- Résultat: Nombre total de clients

-- 4️⃣ Afficher les 5 premiers clients
SELECT id_customer, email, firstname, lastname, active 
FROM ps_customer 
LIMIT 5;
-- Résultat: Les 5 premiers clients

-- 5️⃣ Compter les commandes
SELECT COUNT(*) as total_commandes FROM ps_order;
-- Résultat: Nombre total de commandes
```

### À comprendre
- Chaque table a une **clé primaire** (PK) unique
- Les colonnes ont des **types** (INT, VARCHAR, DATETIME)
- Utiliser `LIMIT` pour éviter de charger trop de données

---

## 🔍 Exercice 2: Rechercher des Données (WHERE)

### Niveau: Débutant

### Objectif
Filtrer les données avec des conditions

### Requêtes à Essayer

```sql
-- 1️⃣ Trouver un client par email
SELECT * FROM ps_customer 
WHERE email = 'jean@example.com';
-- Résultat: Le client Jean ou rien si absent

-- 2️⃣ Afficher tous les clients actifs
SELECT id_customer, email, firstname, lastname 
FROM ps_customer 
WHERE active = 1;
-- Résultat: Les clients actifs seulement

-- 3️⃣ Afficher les commandes du jour
SELECT id_order, id_customer, total_paid, date_add 
FROM ps_order 
WHERE DATE(date_add) = CURDATE();
-- Résultat: Commandes d'aujourd'hui

-- 4️⃣ Commandes > 100€
SELECT id_order, id_customer, total_paid 
FROM ps_order 
WHERE total_paid > 100
ORDER BY total_paid DESC;
-- Résultat: Les gros achats d'abord

-- 5️⃣ Produits inactifs
SELECT id_product, reference, active 
FROM ps_product 
WHERE active = 0;
-- Résultat: Produits à activer
```

### À comprendre
- `WHERE colonne = valeur` → Filtre les lignes
- `WHERE colonne > valeur` → Comparaison
- `WHERE active = 1` → Les booléens (0=non, 1=oui)
- `ORDER BY colonne DESC` → Tri décroissant

---

## 🔗 Exercice 3: Joindre Deux Tables (JOIN)

### Niveau: Intermédiaire

### Objectif
Récupérer des données de plusieurs tables

### Requêtes à Essayer

```sql
-- 1️⃣ Commandes avec email du client
SELECT 
  o.id_order,
  c.email,
  c.firstname,
  c.lastname,
  o.total_paid,
  o.date_add
FROM ps_order o
INNER JOIN ps_customer c ON o.id_customer = c.id_customer
LIMIT 10;
-- Résultat: Chaque commande + infos du client

-- 2️⃣ Articles d'une commande avec noms
SELECT 
  od.id_order_detail,
  od.product_name,
  od.product_quantity,
  od.product_price,
  od.product_total
FROM ps_order_detail od
WHERE od.id_order = 1;  -- Remplacer 1 par un vrai id_order
-- Résultat: Tous les articles de la commande

-- 3️⃣ Produits avec noms traduits
SELECT 
  p.id_product,
  p.reference,
  pl.name,
  pl.description
FROM ps_product p
LEFT JOIN ps_product_lang pl ON (
  p.id_product = pl.id_product 
  AND pl.id_lang = 1  -- 1 = Français
)
WHERE p.active = 1
LIMIT 10;
-- Résultat: Produits en français

-- 4️⃣ Adresses des clients
SELECT 
  c.email,
  a.firstname,
  a.lastname,
  a.address1,
  a.postcode,
  a.city
FROM ps_customer c
LEFT JOIN ps_address a ON c.id_customer = a.id_customer
WHERE c.active = 1
LIMIT 10;
-- Résultat: Email + toutes ses adresses

-- 5️⃣ Clients qui n'ont jamais commandé
SELECT 
  c.id_customer,
  c.email,
  c.firstname
FROM ps_customer c
LEFT JOIN ps_order o ON c.id_customer = o.id_customer
WHERE o.id_order IS NULL;
-- Résultat: Clients sans commande
```

### À comprendre
- `INNER JOIN` → Retourne seulement si existe dans les deux
- `LEFT JOIN` → Retourne tous du côté gauche même si absent à droite
- `ON table1.fk = table2.pk` → La condition de liaison
- Aliaser les tables (`o`, `c`) rend lisible

---

## 📊 Exercice 4: Statistiques (GROUP BY)

### Niveau: Intermédiaire

### Objectif
Résumer et agréger les données

### Requêtes à Essayer

```sql
-- 1️⃣ Nombre de commandes par client
SELECT 
  c.email,
  COUNT(o.id_order) as nb_commandes,
  SUM(o.total_paid) as total_depense
FROM ps_customer c
LEFT JOIN ps_order o ON c.id_customer = o.id_customer
GROUP BY c.id_customer
ORDER BY total_depense DESC
LIMIT 10;
-- Résultat: Top 10 clients par dépense

-- 2️⃣ Ventes par jour
SELECT 
  DATE(date_add) as date,
  COUNT(*) as nb_commandes,
  SUM(total_paid) as ca_jour
FROM ps_order
GROUP BY DATE(date_add)
ORDER BY date DESC
LIMIT 30;
-- Résultat: Chiffre d'affaires par jour (30 derniers jours)

-- 3️⃣ Produits les plus vendus
SELECT 
  od.product_name,
  SUM(od.product_quantity) as qty_vendue,
  SUM(od.product_total) as ca_produit
FROM ps_order_detail od
GROUP BY od.product_name
ORDER BY qty_vendue DESC
LIMIT 10;
-- Résultat: Top 10 produits

-- 4️⃣ Moyenne du panier
SELECT 
  AVG(total_paid) as panier_moyen,
  MIN(total_paid) as panier_min,
  MAX(total_paid) as panier_max,
  COUNT(*) as nb_commandes
FROM ps_order;
-- Résultat: Stats des paniers

-- 5️⃣ Taux de conversion
SELECT 
  COUNT(DISTINCT id_customer) as clients,
  COUNT(DISTINCT CASE WHEN id_customer IN (SELECT id_customer FROM ps_order) THEN id_customer END) as clients_acheteurs,
  ROUND(100 * COUNT(DISTINCT CASE WHEN id_customer IN (SELECT id_customer FROM ps_order) THEN id_customer END) / COUNT(DISTINCT id_customer), 2) as conversion_pct
FROM ps_customer;
-- Résultat: % de clients qui ont acheté
```

### À comprendre
- `COUNT()` → Compte les lignes
- `SUM()` → Additionne les valeurs
- `AVG()` → Moyenne
- `GROUP BY colonne` → Groupe par cette colonne
- `ORDER BY colonne DESC` → Tri décroissant

---

## 🎯 Exercice 5: Cas Réels

### Niveau: Avancé

### Objectif
Résoudre des problèmes métier réels

### Cas 1: Emails à relancer

```sql
-- Clients avec panier abandonné (> 7 jours)
SELECT 
  c.email,
  c.firstname,
  c.lastname,
  COUNT(cp.id_product) as nb_articles,
  SUM(cp.quantity) as qty_total,
  cart.date_add as date_panier
FROM ps_customer c
INNER JOIN ps_cart cart ON c.id_customer = cart.id_customer
INNER JOIN ps_cart_product cp ON cart.id_cart = cp.id_cart
WHERE cart.checkouted = 0  -- Panier non finalisé
AND DATEDIFF(NOW(), cart.date_add) >= 7  -- Depuis 7 jours
GROUP BY cart.id_cart
ORDER BY cart.date_add ASC;
-- Résultat: Emails à relancer
```

### Cas 2: Gestion de stock

```sql
-- Produits en rupture de stock
SELECT 
  p.id_product,
  pl.name,
  ps.quantity as stock_actuel,
  ps.quantity - (
    SELECT COALESCE(SUM(product_quantity), 0) 
    FROM ps_order_detail 
    WHERE id_product = p.id_product
    AND MONTH(date_add) = MONTH(NOW())
  ) as stock_restant
FROM ps_product p
LEFT JOIN ps_product_lang pl ON p.id_product = pl.id_product AND pl.id_lang = 1
LEFT JOIN ps_product_shop ps ON p.id_product = ps.id_product
WHERE ps.quantity <= 5  -- Stock faible
ORDER BY ps.quantity ASC;
-- Résultat: Produits à réapprovisionner
```

### Cas 3: Analyse de rentabilité

```sql
-- Clients rentables (CA > coût moyen)
SELECT 
  c.id_customer,
  c.email,
  COUNT(o.id_order) as nb_cmd,
  SUM(o.total_paid) as ca_client,
  ROUND(SUM(o.total_paid) / COUNT(o.id_order), 2) as panier_moyen,
  CASE 
    WHEN SUM(o.total_paid) > 500 THEN 'VIP'
    WHEN SUM(o.total_paid) > 200 THEN 'Fidèle'
    ELSE 'Occasionnel'
  END as segment
FROM ps_customer c
INNER JOIN ps_order o ON c.id_customer = o.id_customer
GROUP BY c.id_customer
HAVING SUM(o.total_paid) > 100
ORDER BY ca_client DESC;
-- Résultat: Segmentation clients
```

### Cas 4: Performance commerciale

```sql
-- Comparaison mois-sur-mois
SELECT 
  MONTH(date_add) as mois,
  YEAR(date_add) as annee,
  COUNT(*) as nb_commandes,
  SUM(total_paid) as ca,
  ROUND(SUM(total_paid) / COUNT(*), 2) as ticket_moyen,
  COUNT(DISTINCT id_customer) as nb_clients
FROM ps_order
WHERE date_add >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
GROUP BY YEAR(date_add), MONTH(date_add)
ORDER BY annee DESC, mois DESC;
-- Résultat: Évolution mensuelle
```

### Cas 5: Audit d'intégrité

```sql
-- Vérifier les données orphelines
SELECT 'Commandes sans client' as type, COUNT(*) as nombre
FROM ps_order 
WHERE id_customer NOT IN (SELECT id_customer FROM ps_customer)
UNION ALL
SELECT 'Articles sans commande' as type, COUNT(*) as nombre
FROM ps_order_detail 
WHERE id_order NOT IN (SELECT id_order FROM ps_order)
UNION ALL
SELECT 'Adresses sans client' as type, COUNT(*) as nombre
FROM ps_address 
WHERE id_customer > 0 
  AND id_customer NOT IN (SELECT id_customer FROM ps_customer);
-- Résultat: Les problèmes de référencialité
```

---

## 🧪 Exercices Créatifs

### Défi 1: Panier Moyen par Jour
Calcule le panier moyen pour chaque jour du mois

```sql
-- À FAIRE: Adapter la requête au mois de mai 2026
SELECT 
  DATE(date_add) as date,
  COUNT(*) as nb_commandes,
  ROUND(SUM(total_paid) / COUNT(*), 2) as panier_moyen
FROM ps_order
WHERE MONTH(date_add) = 5 AND YEAR(date_add) = 2026
GROUP BY DATE(date_add)
ORDER BY date ASC;
```

### Défi 2: Top Produits Rentables
Produits les plus vendus avec marge estimée

```sql
-- À FAIRE: Estimer une marge (ex: 30%)
SELECT 
  od.product_name,
  SUM(od.product_quantity) as qty,
  ROUND(SUM(od.product_total), 2) as ca,
  ROUND(SUM(od.product_total) * 0.30, 2) as marge_estimee
FROM ps_order_detail od
GROUP BY od.product_name
ORDER BY marge_estimee DESC
LIMIT 20;
```

### Défi 3: Fidelisation
Clients à risque (inactifs depuis 3 mois)

```sql
-- À FAIRE: Écrire la requête
-- Indices: 
-- - MAX(date_add) pour dernière commande
-- - DATE_SUB pour 3 mois
-- - HAVING pour filtrer
```

---

## 📚 Ressources

- [Fichier SQL complet](prestashop_2026-05-05_163855.sql)
- [Diagrammes visuels](DATABASE_VISUAL.md)
- [Documentation détaillée](DATABASE.md)

---

## ✅ Solutions des Défis

<details>
<summary>🔓 Cliquer pour voir les solutions</summary>

### Solution Défi 3

```sql
SELECT 
  c.id_customer,
  c.email,
  c.firstname,
  MAX(o.date_add) as derniere_cmd,
  DATEDIFF(NOW(), MAX(o.date_add)) as jours_sans_achat
FROM ps_customer c
LEFT JOIN ps_order o ON c.id_customer = o.id_customer
GROUP BY c.id_customer
HAVING MAX(o.date_add) < DATE_SUB(NOW(), INTERVAL 3 MONTH)
OR MAX(o.date_add) IS NULL
ORDER BY derniere_cmd ASC;
```

</details>

---

## 🎓 Résumé des Commandes

```
SELECT   → Quel(s) colonne(s) retourner
FROM     → Quelle table
WHERE    → Quel filtre appliquer
JOIN     → Joindre une autre table
GROUP BY → Grouper les résultats
HAVING   → Filtre après GROUP BY
ORDER BY → Trier les résultats
LIMIT    → Nombre de lignes max
```

---

**Bon travail!** 🚀

Créé le: 6 mai 2026  
Version: 1.0
