# 🎨 Diagrammes & Visualisations - Base de Données PrestaShop

## 📊 Flux de Données Principal

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT ACHÈTE UN PRODUIT                      │
└─────────────────────────────────────────────────────────────────┘

1️⃣  CONSULTER PRODUIT
    ┌──────────────────────┐
    │   ps_product         │◄───┐
    │ - id_product         │    │
    │ - reference          │    │ ID Produit
    │ - weight             │    │
    │ - date_add           │    │
    └──────────────────────┘    │
                    │           │
                    ▼           │
            ┌──────────────────────┐
            │ ps_product_lang      │
            │ - name               │
            │ - description        │
            │ - meta_keywords      │
            └──────────────────────┘

2️⃣  AJOUTER AU PANIER
    ┌──────────────────────┐
    │   ps_cart            │ (1 panier par client)
    │ - id_cart (PK)       │
    │ - id_customer (FK)   │
    │ - date_add           │
    └──────────────────────┘
            │
            │ ajoute produit
            ▼
    ┌──────────────────────────────┐
    │ ps_cart_product (Liaison)    │
    │ - id_cart (FK)               │
    │ - id_product (FK)            │
    │ - quantity                   │
    └──────────────────────────────┘

3️⃣  CRÉER COMMANDE
    ┌──────────────────────┐
    │   ps_order           │ (Nouvelle commande)
    │ - id_order (PK)      │
    │ - id_customer (FK)   │
    │ - id_address_delivery
    │ - id_address_invoice │
    │ - total_paid         │
    │ - current_state      │
    │ - payment_method     │
    └──────────────────────┘
            │
            │ copie articles du panier
            ▼
    ┌──────────────────────────────┐
    │ ps_order_detail (Détails)    │
    │ - id_order_detail (PK)       │
    │ - id_order (FK)              │
    │ - id_product (FK)            │
    │ - product_quantity           │
    │ - product_price              │
    │ - product_total              │
    └──────────────────────────────┘
```

---

## 🗂️ Arborescence des Tables

```
╔════════════════════════════════════════════════════════════╗
║              PRESTASHOP DATABASE STRUCTURE                 ║
╚════════════════════════════════════════════════════════════╝

📦 CORE SHOPPING
├─ ps_product ..................... Produits
│  ├─ ps_product_lang ............ [NOM + DESC par langue]
│  ├─ ps_product_shop ............ [PRIX par boutique]
│  ├─ ps_product_attribute ....... [Variantes: taille, couleur]
│  ├─ ps_product_combination .... [Combinaisons]
│  └─ ps_image ................... [Images produits]
│
├─ ps_category .................... Catégories
│  └─ ps_category_lang ........... [NOM par langue]
│
├─ ps_cart ........................ Paniers
│  └─ ps_cart_product ............ [Articles du panier]
│
├─ ps_order ....................... Commandes
│  ├─ ps_order_detail ............ [Articles commandés]
│  ├─ ps_order_payment ........... [Paiements]
│  ├─ ps_order_invoice ........... [Factures]
│  ├─ ps_order_slip .............. [Avoirs]
│  └─ ps_order_state_lang ........ [État de la commande]
│
└─ ps_stock ....................... Stocks
   └─ ps_stock_available ......... [Quantités dispo]

👥 CUSTOMERS & ACCOUNTS
├─ ps_customer .................... Clients
│  ├─ ps_customer_group .......... [Groupes clients]
│  ├─ ps_address ................. [Adresses client]
│  ├─ ps_customer_message ........ [Messages client]
│  └─ ps_customer_session ........ [Sessions]
│
├─ ps_employee .................... Employés
└─ ps_guest ....................... Visiteurs anonymes

🌍 CONFIGURATION
├─ ps_shop ........................ Boutiques
├─ ps_language .................... Langues
├─ ps_currency .................... Devises
├─ ps_country ..................... Pays
├─ ps_state ....................... États/Régions
├─ ps_zone ........................ Zones géographiques
└─ ps_carrier ..................... Transporteurs

💼 BUSINESS
├─ ps_manufacturer ................ Marques/Fabricants
├─ ps_supplier .................... Fournisseurs
├─ ps_feature ..................... Caractéristiques
│  └─ ps_feature_value ........... [Valeurs]
│
├─ ps_tag ......................... Tags produits
├─ ps_attachment .................. Fichiers joignables
├─ ps_cart_rule ................... Coupons/Codes promo
└─ ps_tax ......................... Taux de TVA
```

---

## 🔀 Schéma de Circulation Multilingue

```
PROBLÈME: Les produits existent en PLUSIEURS LANGUES!

Solution: Tables "Lang" supplémentaires

┌────────────────────────────────────────────────┐
│              ps_product                        │
│ id_product (PK) = 5                            │
│ reference = "PROD-001"                         │
│ weight = 2.5 kg                                │
│ (données communes à toutes les langues)        │
└────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ product_lang │ │ product_lang │ │ product_lang │
│ id_lang=1(FR)│ │ id_lang=2(EN)│ │ id_lang=3(ES)│
│ name="Chat"  │ │ name="Cat"   │ │ name="Gato"  │
│ desc="..."   │ │ desc="..."   │ │ desc="..."   │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## 🏪 Schéma Multi-Shop

```
Un PrestaShop peut gérer PLUSIEURS BOUTIQUES!

┌────────────────────────────────────────────────┐
│              ps_product                        │
│ id_product (PK) = 5                            │
│ reference = "PROD-001"                         │
└────────────────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
┌──────────────────┐          ┌──────────────────┐
│ product_shop     │          │ product_shop     │
│ id_shop=1 (Shop1)│          │ id_shop=2 (Shop2)│
│ price=100€       │          │ price=80€        │
│ quantity=50      │          │ quantity=200     │
└──────────────────┘          └──────────────────┘

Même produit, prix et stocks DIFFÉRENTS par boutique!
```

---

## 📋 Exemple Concret: Commande "Sandwich"

```
CLIENT: Jean Dupont
─────────────────────────────────────────────────

1️⃣  VISITE LE SITE
    ps_customer = Jean's account (id_customer=2)

2️⃣  AJOUTE "Sandwich Pain Complet" AU PANIER
    ps_cart (id_cart=100) créé
    ps_cart_product = {
        id_cart: 100,
        id_product: 5 (Sandwich),
        quantity: 2
    }

3️⃣  COMMANDE
    ps_order créée = {
        id_order: 1000,
        id_customer: 2,
        total_paid: 29.98€,
        current_state: 1 (Nouvelle),
        payment: "Credit Card",
        date_add: "2026-05-06 14:30:00"
    }

    ps_order_detail créée = {
        id_order_detail: 1,
        id_order: 1000,
        id_product: 5,
        product_name: "Sandwich Pain Complet",
        product_quantity: 2,
        product_price: 14.99€,
        product_total: 29.98€
    }

4️⃣  ÉTAT DE LIVRAISON
    État change dans ps_order:
    current_state: 2 (Payée)
    ↓
    current_state: 5 (Expédiée)
    ↓
    current_state: 12 (Livrée)

5️⃣  HISTORIQUE COMPLET
    SELECT * FROM ps_order WHERE id_customer=2;
    → Jean verra TOUTES ses commandes!
```

---

## 🔍 Clés Primaires vs Clés Étrangères

```
┌─────────────────────────────────────────────────────────┐
│  CLÉS PRIMAIRES (PK) = Identification Unique             │
└─────────────────────────────────────────────────────────┘

    ps_product
    ├─ id_product = 5  ← PRIMARY KEY (unique)
    ├─ id_product = 6  ← PRIMARY KEY (unique)
    └─ id_product = 7  ← PRIMARY KEY (unique)

    ✅ Chaque produit a UN SEUL id_product unique


┌─────────────────────────────────────────────────────────┐
│  CLÉS ÉTRANGÈRES (FK) = Liens vers autres tables        │
└─────────────────────────────────────────────────────────┘

    ps_order
    ├─ id_order = 1000           ← PRIMARY KEY
    ├─ id_customer = 2           ← FOREIGN KEY → ps_customer
    ├─ id_address_delivery = 4   ← FOREIGN KEY → ps_address
    └─ id_carrier = 3            ← FOREIGN KEY → ps_carrier

    ✅ La commande 1000 appartient au client 2
    ✅ La commande 1000 sera livrée à l'adresse 4
    ✅ La commande 1000 sera livrée par le transporteur 3
```

---

## 🎯 Relations: Les 3 Types

```
┌──────────────────────────────────────────────────────────┐
│  1:N (Un à Plusieurs)                                    │
│  1 client = N commandes                                  │
└──────────────────────────────────────────────────────────┘

    ps_customer (1)
    ├─ id_customer = 2 (Jean)
    └─ A BEAUCOUP DE
         │
         ├─ ps_order (N)
         │  ├─ id_order = 1000
         │  ├─ id_customer = 2  ← lien
         │  └─ ...
         │
         ├─ ps_order (N)
         │  ├─ id_order = 1001
         │  ├─ id_customer = 2  ← lien
         │  └─ ...
         │
         └─ ps_order (N)
            ├─ id_order = 1002
            ├─ id_customer = 2  ← lien
            └─ ...


┌──────────────────────────────────────────────────────────┐
│  N:M (Plusieurs à Plusieurs)                             │
│  N produits = M catégories                               │
│  (via table de liaison)                                  │
└──────────────────────────────────────────────────────────┘

    ps_category (M)
    ├─ Fruits
    ├─ Légumes
    └─ Baskets

    ps_product (N)
    ├─ Pomme
    ├─ Tomate
    └─ Banane

    ps_category_product (liaison)
    ├─ Pomme → Fruits
    ├─ Tomate → Légumes
    ├─ Tomate → Baskets  ← Une tomate dans 2 catégories!
    └─ Banane → Fruits


┌──────────────────────────────────────────────────────────┐
│  1:1 (Un à Un)                                           │
│  1 commande = 1 facture                                  │
└──────────────────────────────────────────────────────────┘

    ps_order
    ├─ id_order = 1000
    └─ A EXACTEMENT UNE
         │
         ▼
    ps_order_invoice
    ├─ id_invoice = 500
    ├─ id_order = 1000  ← lien unique
    └─ ...
```

---

## 📊 Tableau des Volumes Typiques

```
┌──────────────────────────┬────────────┬──────────────┐
│ Table                    │ Lignes     │ Croissance   │
├──────────────────────────┼────────────┼──────────────┤
│ ps_product               │ 50-5000    │ Lente        │
│ ps_customer              │ 100-100k   │ Rapide       │
│ ps_order                 │ 1k-1M      │ Très rapide  │
│ ps_order_detail          │ 5k-10M     │ Très rapide  │
│ ps_cart                  │ 100-10k    │ Rapide       │
│ ps_product_lang          │ 100-20k    │ Lente        │
│ ps_category              │ 10-1000    │ Lente        │
│ ps_stock_available       │ 100-50k    │ Rapide       │
└──────────────────────────┴────────────┴──────────────┘

MAINTENANCE:
✅ Archiver les anciennes commandes (> 2 ans)
✅ Indexer les colonnes fréquemment interrogées
✅ Supprimer les paniers abandonnés régulièrement
```

---

## 🧮 Calculs Typiques dans une Commande

```
PANIER AVANT COMMANDE:
├─ Article 1: 2x Sandwich @ 14.99€ = 29.98€ HT
├─ Article 2: 1x Salade @ 5.50€ = 5.50€ HT
└─ Sous-total: 35.48€ HT

CALCULS:
├─ Sous-total HT: 35.48€
├─ TVA (20%): 7.10€
├─ Sous-total TTC: 42.58€
├─ Livraison: 5.00€ HT
├─ Livraison TVA: 1.00€
├─ Livraison TTC: 6.00€
├─ Promo (code SAVE10): -4.26€ TTC
└─ TOTAL FINAL TTC: 44.32€

STOCKAGE ps_order:
├─ total_products: 35.48€ (HT)
├─ total_products_wt: 42.58€ (TTC)
├─ total_shipping: 6.00€ (TTC)
├─ total_tax: 8.10€ (TVA)
├─ total_discounts: 4.26€
└─ total_paid: 44.32€ (FINAL)

CHAQUE LIGNE = ps_order_detail:
├─ Sandwich:
│  ├─ product_quantity: 2
│  ├─ product_price: 14.99€ (unitaire HT)
│  ├─ product_total: 29.98€ (total HT)
│  └─ product_tax: 6.00€ (TVA pour cette ligne)
└─ Salade:
   ├─ product_quantity: 1
   ├─ product_price: 5.50€ (unitaire HT)
   ├─ product_total: 5.50€ (total HT)
   └─ product_tax: 1.10€ (TVA pour cette ligne)
```

---

## 💾 Indexes & Performance

```
AVEC INDEXES (Rapide):
Query: SELECT * FROM ps_order WHERE id_customer = 2
Time: 0.001ms  ✅

SANS INDEXES (Lent):
Query: SELECT * FROM ps_order WHERE id_customer = 2
Time: 50ms     ❌

INDEXES CRITIQUES:
├─ ps_order (id_customer)      → Chercher les commandes d'un client
├─ ps_order_detail (id_order)  → Articles d'une commande
├─ ps_cart_product (id_cart)   → Articles d'un panier
├─ ps_product_lang (id_product, id_lang) → Traductions
└─ ps_customer (email)         → Rechercher par email
```

---

## 🎓 Résumé Visuel

```
┌─────────────────────────────────────────────────────────┐
│              FLOW: Client → Commande                     │
└─────────────────────────────────────────────────────────┘

CLIENT ENREGISTRÉ                → ps_customer
         │
         ├─→ Adresses             → ps_address
         │
         ├─→ Crée panier          → ps_cart
         │    ├─ Ajoute produit 1  → ps_cart_product
         │    └─ Ajoute produit 2  → ps_cart_product
         │
         └─→ PAIE
              ├─ Crée commande     → ps_order
              ├─ Copie articles    → ps_order_detail (article 1)
              ├─ Copie articles    → ps_order_detail (article 2)
              ├─ Crée facture      → ps_order_invoice
              └─ Enregistre paie   → ps_order_payment

RÉSULTAT: Toute l'info dans LA BASE DE DONNÉES!
→ Retrouver la commande
→ Voir les articles
→ Changer l'état
→ Générer la facture
→ Tout vient de SQL!
```

---

**Créé le:** 6 mai 2026  
**Version:** 1.0
