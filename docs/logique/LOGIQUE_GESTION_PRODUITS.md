# Logique de Gestion des Produits

## Vue d'ensemble
Le système gère l'ensemble du cycle de vie des produits : consultation, création, modification, suppression et gestion des données (prix, stocks, images, catégories).

---

## Concept Général

```
Produits PrestaShop ← API WebService → Application
                              ↓
                    Transformation XML
                              ↓
                         Affichage/Edition
```

---

## Données Principales

### Champs d'un Produit
- **Identification** : ID, Référence (unique)
- **Contenu** : Nom, Description
- **Tarification** : Prix HT, TVA (calculée 20%), Prix TTC
- **Stock** : Quantité disponible
- **Classification** : Catégorie, Fabricant
- **Physique** : Poids, Dimensions
- **Identifiants** : Code EAN13
- **Statut** : Actif/Inactif
- **Média** : Images (liste) + Image principale

---

## Flux Principaux

### 1️⃣ Consultation des Produits

```
Affichage liste → Chargement via API → Parse XML
                          ↓
                    Extraction parallèle:
                    - Données produits
                    - Stocks
                    - Catégories
                    - Images
                          ↓
                    Transformation en objets
                          ↓
                    Filtrage + Tri
                          ↓
                    Affichage tableau
```

**Entrée** : Requête de visualisation
**Actions** :
- Récupérer tous les produits en XML
- Récupérer les stocks de chaque produit
- Récupérer les noms des catégories
- Récupérer la première image de chaque produit
- Parser et transformer les données
- Appliquer filtres de recherche
- Trier selon critère (nom, prix, quantité)

**Sortie** : Liste de produits formatés et prêts à afficher

**Validation** :
- Au moins 1 produit chargé ✓
- Données cohérentes ✓

---

### 2️⃣ Consulter un Produit (Détails)

```
Clic sur produit → Chargement complet → Parse tous champs
                          ↓
            Récupération données associées:
            - Fabricant (avec image)
            - Catégories (liste complète)
            - Images (toutes)
            - Stock
                          ↓
            Construction objet détaillé
                          ↓
            Affichage fiche produit
```

**Entrée** : ID du produit
**Actions** :
1. Récupérer le produit complet (XML avec détails)
2. Récupérer les stocks du produit
3. Récupérer toutes les images du produit
4. Récupérer les catégories disponibles
5. Si fabricant : récupérer ses infos et image
6. Parser et assembler les données
7. Transformer en objet détaillé

**Sortie** : Objet produit complet avec :
- Tous les champs du produit
- Fabricant (nom, description, image)
- Catégories (liste des catégories du produit)
- Images (liste d'URLs)
- Stock courant
- Données calculées (prix TTC)

**Validation** :
- Produit existe ✓
- Toutes associations chargées ✓

---

### 3️⃣ Créer un Produit

```
Formulaire vierge → Saisie utilisateur → Validation
        ↓
    Construction XML
        ↓
    POST /products
        ↓
    Extraction ID créé
        ↓
    Créer stock initial (POST /stocks)
        ↓
    [Si image] Upload image (POST /images/products/{id})
        ↓
    Message succès
```

**Entrée** : Données du formulaire + optionnel: fichier image
**Actions** :
1. **Valider champs** :
   - Nom : requis, 3-128 caractères
   - Référence : requis, max 32 caractères, unique
   - Prix : requis, positif
   - Quantité : requis, entier positif
   - Catégorie : requise
   - Description : optionnelle
   - Poids : optionnel, positif si fourni
   - Fabricant : optionnel
   - Statut actif : booléen

2. **Générer XML** :
   - Construire structure XML PrestaShop
   - Tous les champs optionnels doivent être présents (même vides)
   - Textes multilingues : envelopper dans balises `<language>`
   - Associations : ajouter catégorie dans `<associations>`

3. **Créer produit** :
   - POST /products
   - Récupérer ID du produit créé de la réponse

4. **Initialiser stock** :
   - POST /stocks avec ID produit
   - Quantité = saisie utilisateur

5. **Upload image** (si fourni) :
   - Validation : format jpg/png/gif/jpeg, max 5MB
   - POST /images/products/{id}
   - Si erreur : produit reste créé, message d'avertissement

**Sortie** : 
- Produit créé (ID)
- Stock initialisé
- Image uploadée (optionnel)
- Message de succès

**Erreurs** :
- Validation échouée → Rester en édition, afficher erreurs
- Création échouée → Afficher erreur, réinitialiser formulaire
- Stock échoué → Produit créé, avertissement stock
- Image échouée → Produit créé, avertissement image (non bloquant)

---

### 4️⃣ Modifier un Produit

```
Clic éditer → Charger données actuelles → Pré-remplir formulaire
        ↓
    Saisie modifications
        ↓
    Validation
        ↓
    PUT /products/{id}
        ↓
    [Si stock modifié] PUT /stocks/{id}
        ↓
    [Si image ajoutée] Upload image
        ↓
    Message succès
```

**Entrée** : ID du produit à modifier + champs modifiés
**Actions** :
1. Charger données actuelles du produit
2. Pré-remplir le formulaire
3. Permettre modifications
4. Valider (même règles que création)
5. Générer XML des modifications
6. PUT /products/{id}
7. Si quantité change : PUT /stocks/{id}
8. Si nouvelle image : Upload

**Sortie** :
- Produit mis à jour
- Stock mis à jour (si changé)
- Image ajoutée (optionnel)
- Message de succès

---

### 5️⃣ Supprimer un Produit

```
Clic supprimer → Confirmation demandée
        ↓
    DELETE /products/{id}
        ↓
    Produit supprimé
        ↓
    Actualiser liste
```

**Entrée** : ID du produit
**Actions** :
1. Demander confirmation
2. DELETE /products/{id}
3. Supprimer produit de la liste locale
4. Afficher message succès

**Sortie** : Produit supprimé

---

## États et Validation

### Validation des Champs

| Champ | Type | Validation |
|-------|------|-----------|
| Nom | Texte | Requis, 3-128 car |
| Référence | Texte | Requis, max 32 car, unique |
| Prix | Nombre | Requis, ≥ 0 |
| Poids | Nombre | Optionnel, ≥ 0 |
| Quantité | Entier | Requis, ≥ 0 |
| Catégorie | Sélection | Requise |
| Statut | Booléen | 0 ou 1 |
| Description | Texte | Optionnelle |
| Fabricant | Sélection | Optionnel |

### États de Chargement

```
État          Condition
─────────────────────────────────
Chargement    Appel API en cours
Chargé        Données reçues et parsées
Erreur        API en échec
Édition       Formulaire ouvert
Envoi         Formulaire en cours de soumission
Succès        Opération terminée
```

---

## Transformations de Données

### De XML → JavaScript

**Entrée** :
```xml
<product>
  <id>123</id>
  <name>
    <language id="1">Mon Produit</language>
  </name>
  <price>99.99</price>
  <reference>REF123</reference>
  ...
</product>
```

**Processus** :
1. Parser XML
2. Extraire champs texte simple : id, price, reference
3. Extraire textes multilingues : prendre langue ID=1
4. Extraire associations : catégories, images, fabricant
5. Créer objet JavaScript structuré
6. Calculer données dérivées : prix TTC, image URL

**Sortie** :
```javascript
{
  id: 123,
  name: "Mon Produit",
  reference: "REF123",
  price: 99.99,
  priceTTC: 119.99,
  quantity: 50,
  category: "Électronique",
  image: "/img/p/1/2/123-medium_default.jpg",
  active: 1
}
```

### Génération XML → PrestaShop

**Entrée** : Objet produit JavaScript

**Processus** :
1. Pour chaque champ :
   - Si texte multilingue : envelopper avec `<language id="1">`
   - Si nombre : traiter en nombre
   - Si booléen : convertir en 0/1
   - Échapper caractères spéciaux XML
2. Ajouter associations (catégories)
3. Générer ID auto-réwrite basé sur le nom

**Sortie** : XML prêt pour PrestaShop

---

## Algorithmes Clés

### Calcul Prix TTC
```
Prix TTC = Prix HT × (1 + TVA%)
Exemple: 100€ HT × 1.20 = 120€ TTC (TVA 20%)
```

### Construction URL Image
```
Logique PrestaShop :
- ID 1-9 : /img/p/{id}/{id}-{format}.jpg
- ID 10+: /img/p/{d1}/{d2}/{id}-{format}.jpg
  où d1 = floor(id / 10) % 10
      d2 = id % 10

Exemple: ID 123
  d1 = floor(123/10) % 10 = 12 % 10 = 2
  d2 = 123 % 10 = 3
  → /img/p/2/3/123-medium_default.jpg
```

### Filtrage Produits
```
Critères: Nom OR Référence OR ID (contient terme recherche)
Casse: Insensible
Exemple: Recherche "led"
  → "LED RGB", "REF_LED", "Produit 123" (si ID match)
```

### Tri Produits
```
Critères possibles:
- Nom (alphabétique)
- Prix (numérique)
- Quantité (numérique)

Ordre: Ascendant (A→Z, 0→9) ou Descendant
```

---

## Invariants du Système

1. **Unicité** : Chaque produit a une référence unique
2. **Intégrité** : Produit = Données + Stock + Au moins 1 catégorie
3. **Cohérence** : Stock toujours synchronisé avec données produit
4. **Traçabilité** : Chaque erreur est enregistrée et affichée
5. **Résilience** : Image manquante ne bloque pas l'affichage produit
6. **Atomicité** : Chaque opération (créer/modifier/supprimer) est complète

---

## Dépendances

- **Catégories** : Un produit est toujours lié à une catégorie
- **Stocks** : Chaque produit a une entrée stock (peut être 0)
- **Images** : Optionnel, mais recommandé
- **Fabricant** : Optionnel
- **TVA** : Fixée à 20% par défaut (peut être amélioré)
