📋 Logique Essentielle de l'Import - Sans Détails Techniques
🔄 Vue d'ensemble du processus
text

Étape 1: IMPORTER PRODUITS
    ↓
Étape 2: IMPORTER VARIANTES (attributs + combinaisons + stock)
    ↓
Étape 3: IMPORTER CLIENTS
    ↓
Étape 4: IMPORTER COMMANDES (avec réservation stock)
    ↓
Étape 5: IMPORTER IMAGES

📦 1. IMPORT PRODUITS
Objectif

Créer chaque produit avec ses informations de base
Source CSV
Colonne	Contenu
date_availability_produit	Date disponibilité
nom	Nom du produit
reference	Code unique produit
prix_ttc	Prix TTC
Taxe	Taux TVA
categorie	Catégorie produit
prix_achat	Prix d'achat
Actions à réaliser

1.1 - Gérer la catégorie

    Chercher si catégorie existe déjà par son nom

    Si non trouvée → créer nouvelle catégorie

    Récupérer l'ID de la catégorie

1.2 - Calculer le prix HT
text

prix_HT = prix_TTC / (1 + taux_TVA/100)

1.3 - Créer le produit

    Champ reference = reference unique

    Champ price = prix_HT calculé

    Champ id_category_default = ID catégorie récupéré

    Champ wholesale_price = prix_achat

    Champ date_add = date_availability_produit

    Champ active = 1 (activé)

Tables/API utilisées
Opération	API Endpoint	Table associée
Rechercher catégorie	GET /categories	ps_category
Créer catégorie	POST /categories	ps_category + ps_category_lang
Créer produit	POST /products	ps_product + ps_product_lang
🔧 2. IMPORT VARIANTES (Attributs + Combinaisons + Stock)
Objectif

Pour chaque produit avec variantes, créer les différentes déclinaisons
Source CSV
Colonne	Contenu	Rôle
reference	Code produit parent	Lier à produit existant
specificité	Type de variante	"taille" ou "couleur"
karazany	Valeur spécifique	"ngoza", "kely", "mainty", "fotsy"
stock_initial	Quantité physique	Stock réel en entrepôt
prix_vente_ttc	Prix TTC variante	Si vide = même prix que produit
Actions à réaliser

2.1 - Traiter les cas spéciaux

    Si specificité et karazany sont vides → produit simple, passer à l'import suivant

    Sinon → produit avec variantes

2.2 - Créer ou récupérer le groupe d'attributs (specificité)

    Chercher si groupe existe par son nom ("taille", "couleur")

    Si non → créer nouveau groupe d'attributs

2.3 - Créer ou récupérer l'attribut dans le groupe (karazany)

    Chercher si attribut existe avec ce nom dans ce groupe

    Si non → créer nouvel attribut lié au groupe

2.4 - Calculer la différence de prix
text

prix_HT_variante = prix_vente_ttc / (1 + taux_TVA/100)
différence_prix = prix_HT_variante - prix_HT_produit

2.5 - Créer la combinaison

    Lier la combinaison au produit parent

    Associer le(s) attribut(s) créés

    Appliquer la différence de prix

    Générer une référence unique (reference_produit + valeur_attribut)

2.6 - Enregistrer le stock pour cette combinaison

    physical_quantity = stock_initial (stock physique réel)

    quantity = stock_initial (stock disponible = physique - réservé)

    reserved_quantity = 0

    Lier à la combinaison créée

Tables/API utilisées
Opération	API Endpoint	Table associée
Gérer groupe attributs	GET/POST /product_option_groups	ps_attribute_group
Gérer attributs	GET/POST /product_option_values	ps_attribute + ps_attribute_group
Créer combinaison	POST /combinations	ps_product_attribute + ps_product_attribute_combination
Gérer stock combinaison	GET/POST/PUT /stock_availables	ps_stock_available
👤 3. IMPORT CLIENTS
Objectif

Créer ou retrouver chaque client et son adresse
Source CSV
Colonne	Contenu
nom	Nom client
email	Email unique
pwd	Mot de passe (à hacher)
adresse	Adresse de livraison
Actions à réaliser

3.1 - Rechercher client existant

    Chercher par email

    Si trouvé → récupérer ID client, passer à l'étape 3.3

3.2 - Créer nouveau client si non trouvé

    Créer compte client avec nom, email, mot de passe (attention: PrestaShop attend un hash spécifique)

    Activer le compte

3.3 - Créer l'adresse

    Lier l'adresse au client

    Définir pays par défaut (id_country = 1 pour pays par défaut)

    Remplir les informations d'adresse

Tables/API utilisées
Opération	API Endpoint	Table associée
Gérer clients	GET/POST /customers	ps_customer
Gérer adresses	POST /addresses	ps_address
🛒 4. IMPORT COMMANDES (avec gestion stock)
Objectif

Créer la commande et réserver le stock
Source CSV
Colonne	Contenu
date	Date commande
nom	Nom client
email	Email client
achat	Liste des produits commandés
etat	Statut commande
Structure du champ "achat"
text

[("REFERENCE";QUANTITE;"VARIANTE"), ("REFERENCE";QUANTITE;"VARIANTE")]
Exemple: [("T_01";3;"ngoza"), ("C_03";1;"")]

Actions à réaliser

4.1 - Récupérer le client

    Chercher client par email

    Récupérer son ID client

4.2 - Analyser le panier
Pour chaque ligne de commande:

    Extraire référence produit

    Extraire quantité

    Extraire variante (si présente, vide pour produit simple)

    Trouver ID produit et ID combinaison correspondants

4.3 - Créer le panier

    Créer un nouveau panier pour le client

    Ajouter chaque produit avec sa quantité

4.4 - RÉSERVER LE STOCK (étape critique)
Pour chaque produit commandé:

    Récupérer le stock actuel

    Ajouter la quantité commandée au reserved_quantity

    Mettre à jour quantity = physical_quantity - nouvelle réservation

4.5 - Créer la commande

    Transformer le panier en commande finale

    Appliquer la date de commande

    Définir le mode de paiement ("paiement à la livraison")

4.6 - Appliquer le statut
Statut CSV	ID Statut PrestaShop
en attente paiement à la livraison	1 (En attente)
paiement accepté	2 (Payée)
erreur de paiement	8 (Erreur paiement)
Tables/API utilisées
Opération	API Endpoint	Table associée
Gérer panier	POST /carts	ps_cart + ps_cart_product
Gérer commande	POST /orders	ps_orders + ps_order_detail
Mettre à jour statut	PUT /order_histories	ps_order_history
Gérer réservation stock	PUT /stock_availables	ps_stock_available
🖼️ 5. IMPORT IMAGES
Objectif

Associer les images aux produits
Source

Fichier ZIP contenant des images nommées par référence produit
Exemple: T_01.jpg, P_01.png
Actions à réaliser

5.1 - Extraire le ZIP

    Lire chaque fichier image dans l'archive

5.2 - Associer au bon produit

    Extraire le nom du fichier sans extension = référence produit

    Trouver l'ID produit correspondant à cette référence

5.3 - Uploader l'image

    Envoyer l'image au produit

    Pour la première image d'un produit, la définir comme image de couverture

Tables/API utilisées
Opération	API Endpoint	Table associée
Upload image	POST /images/products/{id}	ps_image + ps_image_shop
Définir couverture	PUT /images/products/{id}/cover	ps_image (is_cover champ)
📊 SYNTHÈSE DES TABLES UTILISÉES
Pour les produits
Table	Rôle
ps_category	Catégories
ps_category_lang	Noms catégories multilingues
ps_product	Produits
ps_product_lang	Noms produits multilingues
Pour les variantes
Table	Rôle
ps_attribute_group	Groupes d'attributs (taille,couleur)
ps_attribute	Valeurs attributs (ngoza,kely)
ps_product_attribute	Combinaisons produits
ps_product_attribute_combination	Lien combinaison → attributs
ps_stock_available	Gestion stock (critique)
Pour clients & commandes
Table	Rôle
ps_customer	Comptes clients
ps_address	Adresses livraison
ps_cart	Paniers temporaires
ps_cart_product	Lignes panier
ps_orders	Commandes finales
ps_order_detail	Détails commandes
ps_order_history	Historique statuts
🔄 FLUX DONNÉES CRITIQUES
Gestion du stock (point le plus important)
text

IMPORT initial:
physical_quantity = stock_initial
quantity = physical_quantity
reserved_quantity = 0

LORS D'UNE COMMANDE "en attente":
reserved_quantity = reserved_quantity + quantité_commandée
quantity = physical_quantity - nouvelle_reservation

LORS D'UNE COMMANDE "payée" ou "erreur":
Si erreur: reversed (reservation annulée)
Si payée: physical_quantity = physical_quantity - quantité_commandée
         reserved_quantity = reserved_quantity - quantité_commandée

Relation produit ↔ combinaison
text

Produit simple:
stock_available relié à id_product uniquement (id_product_attribute = 0)

Produit avec variante:
stock_available relié à id_product + id_product_attribute (spécifique à chaque combinaison)

⚠️ POINTS DE VIGILANCE

    Dates : Utiliser le format AAAA-MM-JJ pour PrestaShop

    Mot de passe client : PrestaShop attend un hash spécifique (ne pas envoyer en clair)

    Stock : Ne jamais utiliser les champs "quantity" dans ps_product ou ps_product_attribute (obsolètes)

    Prix : L'API PrestaShop attend toujours le prix HT, jamais le TTC

    Séparation des étapes : L'import des produits doit être terminé avant celui des variantes