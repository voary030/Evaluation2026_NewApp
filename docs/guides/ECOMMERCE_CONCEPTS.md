# 🛍️ Concepts E-Commerce dans PrestaShop - Guide Complet

## 📚 Table des Matières
1. [Fondamentaux](#fondamentaux)
2. [Les 3 Piliers](#piliers)
3. [Cycles de Vie](#cycles)
4. [Processus Complet](#processus)
5. [Modèle de Données](#modeles)
6. [Cas d'Usage](#cas-usage)

---

## 🎯 Fondamentaux {#fondamentaux}

### Qu'est-ce que l'E-Commerce?

L'e-commerce c'est **vendre des produits en ligne**. Mais c'est bien plus qu'ça!

```
AVANT (Magasin Physique)          APRÈS (E-Commerce)
├─ Produits en rayon       →      ├─ Produits en ligne
├─ Clients en face         →      ├─ Clients derrière écran
├─ Paiement caisse         →      ├─ Paiement sécurisé
├─ Facture papier          →      ├─ Facture PDF
└─ Livraison manuelle      →      └─ Gestion logistique
```

### Les Acteurs Principaux

```
┌─────────────┐
│   PRODUITS  │ = Ce qu'on vend
└─────────────┘
       ▲
       │
       └─────────────────────┐
                             │
                    ┌────────▼────────┐
                    │   PANIER        │ = Données temporaires
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   COMMANDE      │ = Données définitives
                    └────────┬────────┘
                             │
       ┌─────────────────────┴──────────────────┐
       │                                        │
       ▼                                        ▼
┌────────────────┐                      ┌─────────────┐
│   CLIENTS      │                      │   LIVRAISON │
│ (qui achètent) │                      │ (où ça va)  │
└────────────────┘                      └─────────────┘
```

---

## 🏢 Les 3 Piliers {#piliers}

### 1️⃣ PRODUITS - Ce qu'on Vend

#### 📦 Qu'est-ce qu'un Produit?

**Définition:** Article physique ou numérique disponible à la vente

**Exemple: Sandwich Pain Complet**
```
┌─────────────────────────────┐
│ PRODUIT: Sandwich           │
├─────────────────────────────┤
│ ID: 5                       │
│ Référence: SAND-001         │
│ Nom: Sandwich Pain Complet  │
│ Description: ...            │
│ Prix: 14.99€                │
│ Stock: 150 unités           │
│ Poids: 0.250 kg             │
│ Dimensions: 25x10x7 cm      │
│ Catégorie: Sandwichs        │
│ Fournisseur: Boulangerie X  │
│ État: Actif                 │
└─────────────────────────────┘
```

#### 🔑 Informations Essentielles

```
DONNÉES OBLIGATOIRES:
├─ Nom (au moins 1 langue)
├─ Prix
├─ Catégorie
└─ Stock (si géré)

DONNÉES OPTIONNELLES:
├─ Description courte/longue
├─ Images
├─ Tags
├─ Attributs (couleur, taille)
├─ Poids/Dimensions
├─ Références (EAN, ISBN, UPC)
├─ Fournisseur
└─ Marque
```

#### 🌐 Multi-Langue & Multi-Shop

```
MÊME PRODUIT, DIFFÉRENTS CONTEXTES:

┌─ Français (id_lang=1)
│  ├─ Nom: "Sandwich Pain Complet"
│  └─ Description: "Excellent sandwich..."
│
├─ English (id_lang=2)
│  ├─ Nom: "Whole Wheat Sandwich"
│  └─ Description: "Great sandwich..."
│
└─ Español (id_lang=3)
   ├─ Nom: "Sándwich Pan Integral"
   └─ Description: "Excelente sándwich..."

PRIX PAR BOUTIQUE:
├─ Boutique 1 (Paris): 14.99€
├─ Boutique 2 (Lyon): 15.99€
└─ Boutique 3 (Online): 13.99€
```

#### 📊 Variantes & Attributs

```
PRODUIT: T-Shirt

Attributs possibles:
├─ Couleur: Bleu, Rouge, Noir
├─ Taille: S, M, L, XL
└─ Matière: Coton, Polyester

RÉSULTAT: 12 COMBINAISONS (3 x 4 x 1)

Bleu-S-Coton    → Référence: TSHIRT-001
Bleu-M-Coton    → Référence: TSHIRT-002
Bleu-L-Coton    → Référence: TSHIRT-003
...
```

#### 💰 Pricing Strategy

```
PRIX DE BASE: 100€

RÉDUCTIONS POSSIBLES:
├─ Prix spécifique: 90€ (sur unité)
├─ Remise quantité: -10% si 10+ pcs
├─ Code promo: -15% avec CODE15
├─ Prix groupe: 85€ pour groupe VIP
└─ Prix fournisseur: 50€ (coût)

TARIFICATION FINALE:
Price = Base - Reductions + Tax
```

---

### 2️⃣ CLIENTS - Qui Achète

#### 👤 Qu'est-ce qu'un Client?

**Définition:** Personne qui achète ou peut acheter

#### Cycle de Vie Client

```
PROSPECT
   │ (Visite site)
   ▼
VISITEUR ANONYME
   │ (Crée compte)
   ▼
UTILISATEUR ENREGISTRÉ
   │ (Première commande)
   ▼
CLIENT ACTIF
   │ (Plusieurs commandes)
   ▼
CLIENT FIDÈLE
   │ (VIP, remises spéciales)
   ▼
CLIENT INACTIF (si pas achat depuis 1 an)
```

#### 📋 Données Client

```
PROFIL OBLIGATOIRE:
├─ Email (UNIQUE - pas de doublon)
├─ Mot de passe (hashé pour sécurité)
├─ Prénom
└─ Nom

PROFIL OPTIONNEL:
├─ Genre (M/F)
├─ Date de naissance
├─ Numéro de téléphone
├─ Company
├─ VAT number (N° TVA intra-communautaire)
└─ Note personnelle (admin)

COMPORTEMENT:
├─ Date inscription
├─ Dernière visite
├─ Nombre de commandes
├─ Total dépensé
├─ Newsletter (inscrit Y/N)
└─ État compte (actif/bloqué)
```

#### 👨‍👩‍👧 Groupe Client

```
CATÉGORISATION:

Guest (Visiteurs)
├─ Pas de compte
├─ Livraison rapide seulement
└─ Pas de fidélité

Customer (Clients normaux)
├─ Compte enregistré
├─ Historique d'achats
├─ Remises applicables
└─ Newsletter possible

VIP (Clients premium)
├─ Remises spéciales
├─ Livraison gratuite toujours
├─ Support prioritaire
└─ Accès produits exclusifs

Business (Clients B2B)
├─ Commandes en gros
├─ Tarifs négociés
├─ Paiements à 30 jours
└─ Contacts multiples
```

#### 📍 Adresses Client

```
UN CLIENT = PLUSIEURS ADRESSES

Exemple: Jean Dupont

┌─ ADRESSE 1 (Livraison principale)
│  ├─ 123 Rue de Paris
│  ├─ 75001 PARIS
│  └─ France
│
├─ ADRESSE 2 (Facturation)
│  ├─ 456 Rue de Lyon
│  ├─ 69000 LYON
│  └─ France
│
├─ ADRESSE 3 (Maison de campagne)
│  ├─ 789 Route de Provence
│  ├─ 13000 AIX
│  └─ France
│
└─ Chaque commande = 1 adresse livraison + 1 adresse facturation

IMPORTANT:
- Même personne
- Adresses différentes
- Historique par adresse
```

---

### 3️⃣ COMMANDES - Qui Achète Quoi

#### 🛒 De la Visite à la Commande

```
ÉTAPE 1: CONSULTATION
├─ Client visite le site
├─ Consulte les produits
└─ Lit les descriptions

ÉTAPE 2: SÉLECTION
├─ Clique "Ajouter au panier"
├─ Le produit va dans ps_cart
├─ Peut ajouter plusieurs articles
└─ Peut modifier quantités

ÉTAPE 3: PANIER
├─ Revoit les articles
├─ Applique code promo
├─ Voit le total
└─ Peut continuer shopping

ÉTAPE 4: CHECKOUT
├─ Choix adresse livraison
├─ Choix adresse facturation
├─ Choix transporteur
├─ Choix méthode paiement
└─ Revue finale

ÉTAPE 5: PAIEMENT
├─ Transaction sécurisée
├─ Confirmation du paiement
├─ Le panier se vide
└─ Création de la COMMANDE

ÉTAPE 6: POST-ACHAT
├─ Commande créée (ps_order)
├─ Articles sauvegardés (ps_order_detail)
├─ Email de confirmation
├─ Logistique lancée
└─ Client reçoit le colis
```

#### 📦 Structure d'une Commande

```
┌─────────────────────────────────────────┐
│  COMMANDE #1000                         │
├─────────────────────────────────────────┤
│ Client: Jean Dupont (jean@email.com)    │
│ Date: 2026-05-06 14:30:00               │
│ État: En cours de préparation           │
│                                         │
│ ADRESSE LIVRAISON:                      │
│ 123 Rue de Paris                        │
│ 75001 PARIS, France                     │
│                                         │
│ ADRESSE FACTURATION:                    │
│ 456 Rue de Lyon                         │
│ 69000 LYON, France                      │
│                                         │
│ TRANSPORTEUR: La Poste                  │
│ PAIEMENT: Carte Bancaire                │
│                                         │
├─────────────────────────────────────────┤
│ ARTICLES:                               │
├─────────────────────────────────────────┤
│ 1. Sandwich Pain Complet x2 = 29.98€    │
│ 2. Salade Verte x1 = 5.50€              │
│ 3. Bouteille Eau x3 = 4.50€             │
│                                         │
├─────────────────────────────────────────┤
│ Sous-total HT: 39.98€                   │
│ TVA (20%): 7.996€                       │
│ Sous-total TTC: 47.976€                 │
│                                         │
│ Livraison: 5.00€ TTC                    │
│ Code SAVE10: -4.80€                     │
│                                         │
│ TOTAL: 48.176€                          │
└─────────────────────────────────────────┘
```

#### 🔄 États de Commande

```
ÉTAT INITIAL: "Nouvelle"
(Commande vient d'être créée)
   │
   ├─→ Si paiement rejeté → "Paiement rejeté"
   │   └─→ Client relance paiement ou annule
   │
   ├─→ Si paiement accepté → "Paiement accepté"
   │   │
   │   ├─→ Si en rupture → "Attente réappro"
   │   │   └─→ En attente stock
   │   │
   │   └─→ Si stock OK → "Préparation"
   │       │
   │       ├─→ "Prêt pour envoi"
   │       │
   │       └─→ "Expédiée"
   │           │
   │           ├─→ "Partiellement livrée"
   │           │
   │           └─→ "LIVRÉE" ✅
   │
   └─→ À tout moment → "Annulée" ❌
```

#### 💳 Paiement

```
TYPES DE PAIEMENT:

1. Carte Bancaire
   ├─ Visa
   ├─ Mastercard
   └─ Amex

2. Portefeuille Digital
   ├─ PayPal
   ├─ Apple Pay
   └─ Google Pay

3. Virement Bancaire
   ├─ Virement simple
   └─ Virement récurrent

4. Paiement à la Livraison
   ├─ Espèces à la réception
   └─ Chèque à la réception

5. Paiement en Plusieurs Fois
   ├─ 2x, 3x, 4x
   └─ Via partenaire (Oney, Cofidis)

FLUX DE PAIEMENT:
┌─────────────────────┐
│ Données bancaires   │
│ + montant           │
│ + commande ID       │
└──────────┬──────────┘
           │
    ┌──────▼──────┐
    │ PrestaShop  │
    │ + Provider  │
    └──────┬──────┘
           │
    ┌──────▼────────┐
    │ Banque        │ (vérification)
    └──────┬────────┘
           │
    ┌──────▼─────────────────┐
    │ ✅ Approuvé             │
    │ ou                      │
    │ ❌ Rejeté               │
    └────────────────────────┘
```

#### 📊 Calcul Montants

```
COMMANDE: 2 Sandwich + 1 Salade + Livraison

SANDWICH: 14.99€ HT × 2 = 29.98€ HT
SALADE: 5.50€ HT × 1 = 5.50€ HT
─────────────────────────────
TOTAL PRODUITS: 35.48€ HT

TVA 20%: 35.48 × 0.20 = 7.096€
─────────────────────────────
TOTAL PRODUITS TTC: 42.576€

LIVRAISON: 5.00€ HT
TVA LIVRAISON (20%): 1.00€
LIVRAISON TTC: 6.00€

PROMO (code SAVE10): -10% = -4.26€

─────────────────────────────
TOTAL FINAL: 42.576 + 6.00 - 4.26 = 44.316€

STOCKÉ EN BASE:
├─ total_products: 35.48 (HT)
├─ total_products_wt: 42.576 (TTC)
├─ total_shipping: 6.00 (TTC)
├─ total_tax: 8.096 (montant TVA)
├─ total_discounts: 4.26 (remises)
└─ total_paid: 44.316 (FINAL)
```

#### 📄 Documents Associés

```
UNE COMMANDE = PLUSIEURS DOCUMENTS:

1. BON DE COMMANDE (Order)
   ├─ Facture du client
   └─ Référence pour client

2. FACTURE (Invoice)
   ├─ Document légal
   ├─ Montants HT/TTC
   ├─ Numéro légal
   └─ Pour comptabilité

3. BON DE LIVRAISON (Delivery Note)
   ├─ Pour le transporteur
   ├─ Liste des articles
   └─ Poids/Dimensions

4. BON D'AVOIR (Credit Slip)
   ├─ Si retour/annulation
   ├─ Remboursement
   └─ Raison du retour

5. EMAIL DE CONFIRMATION
   ├─ Reçu automatique
   ├─ Détails commande
   └─ Lien suivi
```

---

## 🔄 Cycles de Vie {#cycles}

### Cycle Produit

```
┌─ CRÉATION
│  ├─ Infos de base
│  ├─ Prix
│  ├─ Images
│  └─ Stock initial
│
├─ ACTIF
│  ├─ Visible en boutique
│  ├─ Peut être commandé
│  └─ Stock géré automatiquement
│
├─ RÉAPPRO (si rupture)
│  ├─ Marquer comme "attente réappro"
│  ├─ Les nouveaux clients ne peuvent pas commander
│  └─ Les anciens peuvent passer commande
│
├─ INACTIF (temporaire)
│  ├─ Peut être réactivé
│  ├─ Données conservées
│  └─ Non visible aux clients
│
└─ SUPPRESSION (définitif)
   ├─ Données conservées en historique
   ├─ Les commandes restent
   └─ Impossible de réactiver
```

### Cycle Client

```
┌─ INSCRIPTION
│  ├─ Email + mot de passe
│  ├─ Email de confirmation
│  └─ Peut maintenant commander
│
├─ ACHAT (premier)
│  ├─ Commande créée
│  ├─ Devient "client"
│  └─ Entre dans statistiques
│
├─ FIDÉLITÉ
│  ├─ Plusieurs achats
│  ├─ Peut être promu VIP
│  ├─ Accumule points
│  └─ Reçoit offres spéciales
│
├─ INACTIVITÉ (optionnel)
│  ├─ Pas d'achat depuis X mois
│  ├─ Peut recevoir email relance
│  └─ Possible suppression de compte
│
└─ SUPPRESSION (RGPD)
   ├─ Données anonymisées
   ├─ Commandes conservées
   └─ Impossible de récupérer
```

### Cycle Stock

```
AJOUT DE STOCK:
├─ Achat fournisseur
├─ +100 unités
└─ Stock = 150

VENTE:
├─ Commande passée
├─ -2 unités
└─ Stock = 148

RETOUR CLIENT:
├─ Client retourne produit
├─ +1 unité
└─ Stock = 149

REMISE PROMO:
├─ Réduction temporaire
├─ Stock physique inchangé
└─ Stock = 149 toujours

RUPTURE:
├─ Stock = 0
├─ Article non commandable
└─ "Attente réappro"

SURSTOCK:
├─ Stock > seuil normal
├─ Possibilité réduction prix
└─ À écouler vite
```

---

## 🔀 Processus Complet {#processus}

### De l'Achat à la Livraison

```
JOUR 1 - CLIENT ACHÈTE

10:00 - Cliente: "Je veux un sandwich!"
       └─ Va sur e-commerce
       └─ Ajoute 2x Sandwich Pain Complet au panier
       └─ Panier = {produit_id: 5, qty: 2}

10:15 - Cliente: "Je paie!"
       └─ Rentre adresse de livraison: 123 Rue de Paris
       └─ Choisit La Poste
       └─ Carte bancaire
       └─ Paiement accepté ✅
       └─ Commande créée: #1000

10:16 - Email de confirmation envoyé
       └─ "Votre commande #1000 est confirmée"

───────────────────────────────────────────────

JOUR 1-2 - PRÉPARATION

11:00 - Magasinier: "Préparer commande #1000"
       └─ Prend 2 sandwichs du rayon
       └─ Vérifie qualité
       └─ Pèse (0.5 kg)

14:00 - État commande → "Prêt pour envoi"
       └─ Emballage réalisé
       └─ Étiquette d'envoi imprimée

───────────────────────────────────────────────

JOUR 2 - LOGISTIQUE

08:00 - La Poste récupère le colis
       └─ Scan d'envoi
       └─ Commande → "Expédiée"
       └─ Email: "Votre colis est en route"
       └─ Numéro de suivi fourni

───────────────────────────────────────────────

JOUR 3 - LIVRAISON

14:30 - Cliente reçoit le colis
       └─ Facteur sonne
       └─ Signature de réception
       └─ Commande → "Livrée" ✅
       └─ Email: "Votre colis a été livré"

16:00 - Cliente satisfaite
       └─ Paie 29.98€ (déjà payé à la commande)
       └─ Peut laisser avis
       └─ Peut récommander

───────────────────────────────────────────────

DONNÉES GÉNÉRÉES:

ps_order:
├─ id_order: 1000
├─ id_customer: 15
├─ id_address_delivery: 23
├─ total_paid: 29.98€
├─ current_state: 12 (Livrée)
└─ date_add: 2026-05-06 10:16:00

ps_order_detail:
├─ id_order: 1000
├─ product_name: "Sandwich Pain Complet"
├─ product_quantity: 2
├─ product_price: 14.99€
└─ product_total: 29.98€

ps_order_payment:
├─ id_order: 1000
├─ payment_method: "Carte Bancaire"
├─ amount: 29.98€
└─ date_add: 2026-05-06 10:15:00

ps_order_carrier:
├─ id_order: 1000
├─ id_carrier: 2 (La Poste)
└─ tracking_number: "AB123456789CD"
```

---

## 📊 Modèle de Données {#modeles}

### Relations Clés

```
┌─────────────────────┐
│  ps_product         │ (1)
│ - id_product        │
│ - reference         │
│ - price             │
└─────────┬───────────┘
          │
          │ 1:N
          │
          ▼
┌─────────────────────────┐
│  ps_category_product    │ (N)
│ - id_product (FK)       │
│ - id_category (FK)      │
└─────────┬───────────────┘
          │
          │ N:M
          │
          ▼
┌─────────────────────┐
│  ps_category        │ (M)
│ - id_category       │
│ - id_parent         │
└─────────────────────┘


┌─────────────────────┐
│  ps_customer        │ (1)
│ - id_customer       │
│ - email             │
└─────────┬───────────┘
          │
          │ 1:N
          │
          ▼
┌─────────────────────┐
│  ps_order           │ (N)
│ - id_order          │
│ - id_customer (FK)  │
└─────────┬───────────┘
          │
          │ 1:N
          │
          ▼
┌──────────────────────┐
│  ps_order_detail     │ (N)
│ - id_order_detail    │
│ - id_order (FK)      │
│ - id_product (FK)    │
└──────────────────────┘
```

### Attributs Clés par Entité

#### Product
```
Obligatoires:
├─ id_product (PK)
├─ name (via product_lang)
├─ price (via product_shop)
└─ active

Optionnels:
├─ description
├─ images
├─ ean13 (code-barre)
├─ weight
├─ dimensions
└─ manufacturer_id
```

#### Customer
```
Obligatoires:
├─ id_customer (PK)
├─ email (UNIQUE)
├─ passwd (hashé)
├─ firstname
└─ lastname

Optionnels:
├─ birthday
├─ id_gender
├─ newsletter
└─ date_add
```

#### Order
```
Obligatoires:
├─ id_order (PK)
├─ id_customer (FK)
├─ id_address_delivery (FK)
├─ id_address_invoice (FK)
├─ total_paid
└─ current_state

Optionnels:
├─ payment_method
├─ id_carrier (FK)
├─ secure_key
└─ secure_key_version
```

---

## 💼 Cas d'Usage {#cas-usage}

### Cas 1: Nouveau Client

```
SCÉNARIO: Marie s'inscrit et fait sa 1ère commande

ÉTAPE 1: Inscription
├─ Va sur /register
├─ Email: marie@email.com
├─ Mot de passe: ****
├─ Prénom: Marie
├─ Nom: Dupont
└─ Crée compte → INSERT ps_customer

ÉTAPE 2: Première Visite
├─ Consulte les produits
├─ Ajoute "Sandwich Pain Complet" x3 au panier
├─ Applique code "BIENVENUE10" (-10%)
└─ Total panier: 40.47€

ÉTAPE 3: Commande
├─ Adresse livraison: 123 Rue de Paris, 75001
├─ Adresse facturation: même
├─ Transporteur: La Poste
├─ Paiement: Carte Bancaire
└─ Commande créée #1000

RÉSULTAT EN BD:
├─ ps_customer: 1 nouvelle ligne
├─ ps_address: 1 nouvelle adresse
├─ ps_cart: 1 panier créé
├─ ps_cart_product: 3 articles
├─ ps_order: 1 nouvelle commande
└─ ps_order_detail: 3 lignes articles
```

### Cas 2: Client Récurrent

```
SCÉNARIO: Jean recommande comme tous les mois

ÉTAPE 1: Login
├─ Se connecte avec email/password
├─ Historique de 12 commandes précédentes
├─ Total dépensé: 500€
└─ Client VIP: OUI

ÉTAPE 2: Panier Express
├─ "Récommander" son dernier panier
├─ Ajoute même articles
├─ Automatiquement -15% (VIP)
└─ Peut modifier avant paiement

ÉTAPE 3: Livraison Express
├─ Adresse de livraison pré-remplie
├─ Pas de frais de port (VIP)
├─ Livreur habituel
└─ Commande #1001

RÉSULTAT:
├─ Processus accéléré
├─ Remise VIP appliquée
├─ Expérience fluide
└─ Client satisfait
```

### Cas 3: Retour & Remboursement

```
SCÉNARIO: Cliente retourne 1 article de la commande #1000

ÉTAPE 1: Demande Retour
├─ Contacte support
├─ Raison: "Pas assez frais"
├─ Demande remboursement
└─ RMA (Return Merchandise Authorization) créée

ÉTAPE 2: Logistique Retour
├─ Cliente reçoit étiquette retour
├─ Envoie le colis à l'adresse de retour
├─ Article reçu au magasin
└─ État: "Retourné"

ÉTAPE 3: Remboursement
├─ Article vérifié
├─ Conforme: OUI
├─ Bon d'avoir créé: #BON-100
├─ Montant: 14.99€
└─ Remboursement du client

DONNÉES:
├─ ps_order: état change → "Partiellement remboursée"
├─ ps_order_slip: créé avec montant
├─ ps_product_shop: quantité +1 (retour stock)
└─ Historique conservé
```

### Cas 4: Gestion des Stocks

```
SCÉNARIO: Stock du Sandwich baisse, réappro nécessaire

JOUR 1: Vente Élevée
├─ Stock début jour: 200 unités
├─ Ventes jour: 180 unités
├─ Stock fin jour: 20 unités
└─ ALERTE: Stock faible!

JOUR 2: Commande Fournisseur
├─ Commande fournisseur: 500 unités
├─ Prévision livraison: 3 jours
├─ Article marqué: "Attente réappro"
├─ Nouveaux clients: impossible de commander
└─ Clients enregistrés: restent possibles

JOUR 4: Livraison Fournisseur
├─ 500 unités reçues
├─ Vérification qualité
├─ Entrée en stock
├─ Stock = 320 unités
├─ Article → "Disponible" de nouveau
└─ Paniers en attente: notification envoyée

RÉSULTAT:
├─ Stock toujours > 0
├─ Pas de rupture définitive
├─ Clients heureux
└─ Revenus continus
```

### Cas 5: Analyses & Reporting

```
SCÉNARIO: Manager veut connaître les performances

QUESTION 1: "Quel est notre chiffre d'affaires ce mois?"
RÉPONSE:
SELECT SUM(total_paid) FROM ps_order 
WHERE MONTH(date_add) = 5;
RÉSULTAT: 45,678.90€

QUESTION 2: "Qui sont nos top 5 clients?"
RÉPONSE:
SELECT c.email, COUNT(*), SUM(o.total_paid) 
FROM ps_customer c 
JOIN ps_order o USING(id_customer)
GROUP BY c.id_customer 
ORDER BY SUM(o.total_paid) DESC LIMIT 5;
RÉSULTAT: 
├─ client1@email.com: 8 cmd, 2500€
├─ client2@email.com: 5 cmd, 1800€
...

QUESTION 3: "Quel produit se vend le mieux?"
RÉPONSE:
SELECT product_name, SUM(product_quantity) 
FROM ps_order_detail 
GROUP BY product_name 
ORDER BY SUM(product_quantity) DESC;
RÉSULTAT:
├─ Sandwich Pain Complet: 500 unités
├─ Salade Verte: 350 unités
...

DÉCISIONS:
├─ Augmenter stock Sandwich
├─ Envoyer offre aux top clients
├─ Promouvoir Sandwichs
└─ Relancer autres produits
```

---

## 🎯 Concepts Avancés

### Promotions & Remises

```
TYPE 1: Réduction Globale
├─ -10% sur toute commande > 50€
├─ Valable du 1er au 30 mai
├─ Pour tous les clients
└─ Automatique appliquée

TYPE 2: Code Promo
├─ Code: "SAVE15"
├─ Réduction: -15%
├─ Valable: 10 utilisations restantes
├─ À saisir dans le panier
└─ Client doit connaître le code

TYPE 3: Remise Quantité
├─ 1-5: prix normal
├─ 6-10: -5%
├─ 11-20: -10%
├─ 21+: -15%
└─ Automatique selon quantité

TYPE 4: Remise Client
├─ Groupe VIP: -20% permanent
├─ Basé sur groupe client
├─ Appliqué partout
└─ Sauf articles exclut

TYPE 5: Remise Fournisseur
├─ Si achat 100+ unités
├─ Fournisseur négocie
├─ Prix d'achat baisse
└─ Marge gérée
```

### Gestion Multilingue

```
MÊME PRODUIT, PLUSIEURS LANGUES:

┌─ Français (id_lang=1)
│  ├─ Nom: "Sandwich Pain Complet"
│  ├─ Description: "Frais, savoureux..."
│  └─ Meta: "Sandwich bio paris"
│
├─ English (id_lang=2)
│  ├─ Nom: "Whole Wheat Sandwich"
│  ├─ Description: "Fresh, tasty..."
│  └─ Meta: "Whole wheat sandwich paris"
│
└─ Español (id_lang=3)
   ├─ Nom: "Sándwich de Pan Integral"
   ├─ Description: "Fresco, sabroso..."
   └─ Meta: "Sándwich de pan integral paris"

CLIENT FRANÇAIS:
├─ Voit tout en Français
├─ Id_lang = 1
└─ Tous les textes changent

CLIENT ANGLOPHONE:
├─ Voit tout en English
├─ Id_lang = 2
└─ Tous les textes changent
```

### Attribution & Variantes

```
T-SHIRT ROUGE TAILLE M = COMBINAISON

Produit: T-Shirt
├─ Attribut 1: Couleur
│  ├─ Bleu
│  ├─ Rouge
│  └─ Noir
│
├─ Attribut 2: Taille
│  ├─ S
│  ├─ M
│  ├─ L
│  └─ XL
│
└─ Total combinaisons: 3 × 4 = 12

CHAQUE COMBINAISON:
├─ Référence propre: TSHIRT-ROUGE-M
├─ SKU: TS-R-M
├─ Stock propre: 25 unités
├─ Images propres (optionnel)
├─ Prix (peut varier)
└─ Poids (peut varier)

RÉSULTAT:
Même produit "T-Shirt"
├─ 12 variantes
├─ 12 stocks différents
├─ 12 références
└─ 1 page produit
```

---

## 📌 Résumé Visuel

```
        PRODUIT CONSULTÉ
              │
              ▼
         AJOUT AU PANIER
              │
              ▼
         PANIER (ps_cart)
              │
        ┌─────┴─────┐
        │           │
        ▼           ▼
   MODIFIER   COMMANDER
        │           │
        └─────┬─────┘
              │
              ▼
        CHECKOUT (adresse, transport, paiement)
              │
              ▼
        PAIEMENT (Approuvé/Rejeté)
              │
        ┌─────┴─────┐
        │           │
   ✅ APPROUVÉ   ❌ REJETÉ
        │           │
        ▼           ▼
    COMMANDE   PAIEMENT REJETÉ
   (ps_order)  (retry ou abandon)
        │
        ▼
   PRÉPARATION
   (Magasinier)
        │
        ▼
   EXPÉDITION
   (Transporteur)
        │
        ▼
   LIVRAISON
   (Cliente)
        │
        ▼
   SATISFAIT
   (Possible retour)
```

---

## 🎓 À Retenir

### Les 3 Piliers
1. **PRODUITS** = Ce qu'on vend (identité)
2. **CLIENTS** = Qui achète (relation)
3. **COMMANDES** = Qui achète quoi (transaction)

### Les 3 Tables Essentielles
1. **ps_product** = Catalogue
2. **ps_customer** = Clients
3. **ps_order** = Historique ventes

### Le Flux Clé
```
Consulter → Ajouter panier → Commander → Payer → Livrer
```

### L'Objectif Final
```
Client Satisfait → Revient → Fidélité → Croissance
```

---

**Créé le:** 6 mai 2026  
**Version:** 1.0  
**Pour:** Évaluation J0 - Comprendre E-Commerce
