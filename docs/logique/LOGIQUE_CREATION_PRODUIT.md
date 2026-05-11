# Logique de Création de Produit

## Vue d'ensemble
Le système permet la création complète d'un nouveau produit via un formulaire guidé, avec validation progressive, génération XML, soumission à PrestaShop, création du stock initial, et upload optionnel d'image.

---

## Concept Général

```
Formulaire vierge → Saisie utilisateur → Validation champ par champ
                                              ↓
                                    Validation complète
                                              ↓
                                    Génération XML
                                              ↓
                                    POST /products
                                              ↓
                                    Récupération ID créé
                                              ↓
                                    POST /stocks (quantité)
                                              ↓
                                    [Optionnel] POST /images
                                              ↓
                                    Message succès/erreur
```

---

## 🎯 Étape 1 : Initialisation du Formulaire

```
Ouverture page création → Charger options
                                ↓
                    Catégories disponibles
                    + Fabricants disponibles
                                ↓
                    Pré-sélectionner 1ère catégorie
                                ↓
                    Formulaire prêt
```

**Entrée** : Navigation vers formulaire de création
**Actions** :
1. Charger les catégories disponibles (parallèle)
2. Charger les fabricants disponibles (parallèle)
3. Parser et transformer les listes
4. Si catégories chargées : pré-sélectionner la première catégorie
5. Si fabricants chargés : proposer dans dropdown

**Sortie** :
- Formulaire initialisé
- Catégories disponibles
- Fabricants disponibles
- Première catégorie pré-sélectionnée

**Validation** :
- Au moins 1 catégorie chargée ✓

---

## 📝 Étape 2 : Structure et Remplissage du Formulaire

### Champs du Formulaire

```
┌─────────────────────────────────────────────┐
│ CRÉATION DE PRODUIT                         │
├─────────────────────────────────────────────┤
│                                             │
│ INFORMATIONS GÉNÉRALES                      │
│ ├─ Nom *                 [text input]       │
│ ├─ Référence *           [text input]       │
│ ├─ Catégorie *           [dropdown]         │
│ ├─ Fabricant             [dropdown]         │
│                                             │
│ TARIFICATION                                │
│ ├─ Prix HT *             [number input]     │
│ │   ↳ Aperçu: 100,00 € HT                  │
│ │   ↳ TTC: 120,00 €                        │
│ ├─ Poids                 [number input]     │
│                                             │
│ STOCK                                       │
│ ├─ Quantité initiale *   [number input]     │
│                                             │
│ DESCRIPTION                                 │
│ ├─ Description           [textarea]         │
│                                             │
│ STATUT                                      │
│ ├─ Actif                 [toggle] Oui/Non   │
│                                             │
│ MÉDIA                                       │
│ ├─ Image (optionnel)     [file input]       │
│                                             │
│ [Créer]  [Annuler]                         │
└─────────────────────────────────────────────┘
```

### État du Formulaire

L'application maintient l'état réactif de chaque champ :

```javascript
Formulaire {
  name: '',
  reference: '',
  price: '',
  weight: '',
  quantity: '',
  active: 1,        // Défaut: Actif
  description: '',
  id_manufacturer: '',
  id_category_default: ''
}

Images {
  imageFile: null   // File object si sélectionné
}

Erreurs {
  name: null,
  reference: null,
  price: null,
  weight: null,
  quantity: null,
  description: null,
  id_category_default: null
}
```

### Affichage Dynamique

**Prix HT → Calcul Automatique**:
```
Utilisateur saisit : 100
Affichage immédiat :
  - Prix HT : 100,00 €
  - Prix TTC : 120,00 € (calcul 20% TVA)
```

**Image Sélectionnée → Prévisuel**:
```
Utilisateur sélectionne fichier
  → Vérifier format (jpg/png/gif)
  → Créer URL prévisualisation
  → Afficher miniature
```

---

## ✅ Étape 3 : Validation Progressive

### 3.1 Validation Champ par Champ

Chaque champ est validé **indépendamment** lors de sa modification :

| Champ | Type | Règles |
|-------|------|--------|
| **Nom** | Texte | Requis ✓<br>Min 3 caractères<br>Max 128 caractères |
| **Référence** | Texte | Requis ✓<br>Max 32 caractères<br>(Unique au niveau BDD, pas vérifié au upload) |
| **Prix HT** | Nombre | Requis ✓<br>≥ 0<br>Doit être nombre valide |
| **Poids** | Nombre | Optionnel<br>Si fourni : ≥ 0<br>Doit être nombre valide |
| **Quantité** | Entier | Requis ✓<br>≥ 0<br>Doit être entier |
| **Catégorie** | Sélection | Requise ✓<br>Une catégorie minimum |
| **Description** | Texte | Optionnel<br>Max 1024 caractères |
| **Statut** | Booléen | Valeur 0 ou 1 |
| **Fabricant** | Sélection | Optionnel |

### 3.2 Flux de Validation d'un Champ

```
Utilisateur modifie champ → Événement onChange
                                    ↓
                            Récupérer valeur
                                    ↓
                            Valider selon règles
                                    ↓
                        ├─ Valide? → Effacer message erreur
                        └─ Invalide? → Afficher message erreur
```

### 3.3 Validation Complète du Formulaire

Avant soumission, vérifier :
1. **Aucun champ requis vide**
   - Nom ≠ ''
   - Référence ≠ ''
   - Prix ≠ ''
   - Quantité ≠ ''
   - Catégorie ≠ ''

2. **Aucune erreur de validation**
   - Tous les champs qui ont des erreurs doivent être corrigés

3. **État du formulaire**
   ```
   isFormValid = (
     NO errors.name AND
     NO errors.reference AND
     NO errors.price AND
     NO errors.weight AND
     NO errors.quantity AND
     NO errors.description AND
     NO errors.id_category_default AND
     TOUTES required fields NE SONT PAS VIDES
   )
   ```

### 3.4 Messages d'Erreur

```
Champ: Nom
Erreur 1: "Le nom est requis"
Erreur 2: "Le nom doit contenir au minimum 3 caractères"
Erreur 3: "Le nom ne peut pas dépasser 128 caractères"

Champ: Référence
Erreur: "La référence ne peut pas dépasser 32 caractères"

Champ: Prix
Erreur 1: "Le prix est requis"
Erreur 2: "Le prix doit être un nombre valide"
Erreur 3: "Le prix ne peut pas être négatif"

Champ: Quantité
Erreur 1: "La quantité est requise"
Erreur 2: "La quantité doit être un nombre entier"
Erreur 3: "La quantité ne peut pas être négative"

Champ: Catégorie
Erreur: "La catégorie est requise"
```

---

## 🏗️ Étape 4 : Construction du XML

### 4.1 Processus

```
Données formulaire → Créer objet Product
                              ↓
                    Appliquer transformations
                    - Conversion types
                    - Génération link_rewrite
                    - Échappement XML
                              ↓
                    Générer XML structuré
                              ↓
                    XML prêt pour API
```

### 4.2 Transformation des Données

**Avant** (Formulaire JavaScript) :
```javascript
{
  name: "Mon Produit LED",
  reference: "LED-RGB-001",
  price: "99.99",
  weight: "0.5",
  quantity: "100",
  active: 1,
  description: "Ampoule LED RGB 10W",
  id_manufacturer: "5",
  id_category_default: "3"
}
```

**Après** (Modèle Product) :
```javascript
{
  id: null,                          // Sera assigné par PrestaShop
  name: "Mon Produit LED",
  reference: "LED-RGB-001",
  price: 99.99,                      // Nombre
  weight: 0.5,                       // Nombre
  quantity: 100,                     // Entier
  active: 1,                         // Booléen (0/1)
  description: "Ampoule LED RGB 10W",
  id_manufacturer: 5,                // Nombre
  id_category_default: 3,            // Nombre
  link_rewrite: "mon-produit-led"    // AUTO-GÉNÉRÉ
}
```

### 4.3 Génération de link_rewrite

C'est l'identifiant URL du produit (SEO-friendly) :

```
Processus:
1. Prendre le nom: "Mon Produit LED"
2. Convertir en minuscules: "mon produit led"
3. Remplacer espaces/caractères spéciaux par tirets: "mon-produit-led"
4. Supprimer tirets en début/fin: "mon-produit-led"
5. Résultat: "mon-produit-led"

Exemples:
"Chaussette Noire" → "chaussette-noire"
"T-Shirt (XL)" → "t-shirt-xl"
"Produit 100% Coton" → "produit-100-coton"
```

### 4.4 Génération du XML

**Structure générale** :
```xml
<?xml version="1.0" encoding="UTF-8"?>
<prestashop>
  <product>
    <name>
      <language id="1">Mon Produit LED</language>
    </name>
    <reference>LED-RGB-001</reference>
    <price>99.99</price>
    <weight>0.5</weight>
    <active>1</active>
    <description>
      <language id="1">Ampoule LED RGB 10W</language>
    </description>
    <link_rewrite>
      <language id="1">mon-produit-led</language>
    </link_rewrite>
    <id_manufacturer>5</id_manufacturer>
    <id_category_default>3</id_category_default>
    
    <associations>
      <categories>
        <category>
          <id>3</id>
        </category>
      </categories>
    </associations>
  </product>
</prestashop>
```

**Règles** :
- Textes multilingues : Enveloppé dans `<language id="1">` (Français)
- Nombres : Sans guillemets, formats décimaux avec points
- Caractères spéciaux XML : Échappés (&lt;, &gt;, &amp;, etc.)
- Associations : Dans balise `<associations>`
- Champs optionnels : Incluent même s'ils sont vides

---

## 🚀 Étape 5 : Création du Produit

### 5.1 Envoi à PrestaShop

```
POST /products
Content-Type: application/xml
Body: [XML généré]
        ↓
        ↓ Serveur traite
        ↓
Réponse 200 OK
Body: XML avec ID assigné
        ↓
        ↓ Extraction ID
        ↓
ID produit créé: 12345
```

### 5.2 Réponse API

**Format** :
```xml
<?xml version="1.0" encoding="UTF-8"?>
<prestashop>
  <product>
    <id>12345</id>
    <name>
      <language id="1">Mon Produit LED</language>
    </name>
    ...autres champs...
  </product>
</prestashop>
```

**Extraction de l'ID** :
```
Parser XML → Chercher <product>
                ↓
          Chercher <id>
                ↓
          Lire textContent
                ↓
          ID = 12345
```

### 5.3 Gestion d'Erreurs lors de la Création

```
Erreur API?
  ├─ Format XML invalide → "Impossible de créer le produit"
  ├─ Référence dupliquée → "Référence déjà existante"
  ├─ Réseau échoue → "Erreur de connexion"
  └─ Serveur en erreur → "Erreur serveur (500)"
        ↓
        Message d'erreur affiché
        Formulaire reste ouvert (non réinitialisé)
        Utilisateur peut corriger et réessayer
```

---

## 📦 Étape 6 : Création du Stock Initial

### 6.1 Flux

```
Produit créé (ID = 12345)
        ↓
    Récupérer le stock existant
    GET /stocks?filter[id_product]=12345
        ↓
    Parser entrées stock
        ↓
    Mettre à jour avec nouvelle quantité
    PUT /stocks/{id_stock}
        ↓
    Stock mis à jour ✓
```

### 6.2 Modèle Stock

Chaque produit a une entrée stock. Données requises :

```
Entrée Stock {
  id: 10001,
  id_product: 12345,
  id_product_attribute: 0,  // Pour variantes
  id_warehouse: 1,
  id_shop: 1,
  quantity: 100,            // La quantité à mettre à jour
  physical_quantity: 100,
  reserved_quantity: 0
}
```

### 6.3 Processus Détaillé

```
1. Récupérer stock du produit créé
   → GET /stocks?filter[id_product]=12345
   
2. Parser réponse XML
   → Extraire entrée stock (devrait être 1 seule)
   
3. Valider entrée stock
   → Si pas d'entrée: ERREUR
   → Si entrée invalide: ERREUR
   
4. Mettre à jour quantité
   → Conserver tous les champs existants
   → Modifier quantity = saisie utilisateur
   
5. Envoyer mise à jour
   → PUT /stocks/{id_stock}
   → Body: XML avec nouvelle quantité
   
6. Valider succès
   → Réponse 200 OK → Stock mis à jour ✓
   → Erreur? → Log warning, continuer
```

### 6.4 Points Clés

- **Requête de base** : Inclure tous les champs existants, modifier juste `quantity`
- **Erreur non-critique** : Si stock échoue, produit est déjà créé
- **Quantité = 0 acceptée** : Produit peut être créé sans stock

---

## 🖼️ Étape 7 : Upload d'Image (Optionnel)

### 7.1 Flux

```
Utilisateur a sélectionné image?
  ├─ NON → Ignorer, passer au succès
  └─ OUI :
      ├─ Valider format (jpg/png/gif)
      ├─ Valider taille (≤ 5 MB)
      ├─ Créer FormData
      ├─ POST /images/products/{id}
      ├─ Réponse XML avec ID image
      └─ Image uploadée ✓
```

### 7.2 Validation du Fichier

```
Fichier sélectionné?
  ├─ NON → Ignorer
  └─ OUI :
      ├─ Extension en minuscules: .jpg, .jpeg, .png, .gif
      ├─ Taille: < 5 MB (5242880 bytes)
      └─ VALIDE? → Continuer
         INVALIDE? → Exception, message erreur image
```

### 7.3 Processus d'Upload

```
1. Valider fichier
   Si erreur → Exception
   
2. Créer FormData
   FormData {
     image: File
   }
   
3. POST /images/products/{productId}
   Headers: Content-Type: multipart/form-data
   
4. Attendre réponse
   
5. Parser réponse XML
   Si succès → ID image retourné
   Si erreur → Exception
   
6. Afficher succès ou avertissement
```

### 7.4 Points Clés

- **Asynchrone** : Upload se fait APRÈS création produit
- **Non-critique** : Si image échoue, produit reste créé
- **Un fichier** : Un seul upload par soumission formulaire
- **Conversion automatique** : PrestaShop génère les différents formats

---

## 💬 Étape 8 : Messages de Feedback

### 8.1 Pendant le Processus

```
États visuels:
┌────────────────────────────────┐
│ Chargement options...          │ ← Au démarrage
│ [Formulaire grisé]             │
└────────────────────────────────┘

├─ Options chargées → [Formulaire actif]

┌────────────────────────────────┐
│ Validation...                  │ ← Lors de changement champ
│ ❌ Erreur: "Nom requis"         │
└────────────────────────────────┘

┌────────────────────────────────┐
│ Création produit en cours...    │ ← Au submit
│ [Bouton Créer désactivé]       │
└────────────────────────────────┘
```

### 8.2 Messages de Succès

**Création réussie sans image** :
```
✅ Produit "Mon Produit LED" créé avec succès! (ID: 12345)
```

**Création réussie avec image** :
```
✅ Produit "Mon Produit LED" créé avec succès! Image uploadée.
```

**Création réussie, image échouée** :
```
⚠️ Produit "Mon Produit LED" créé avec succès! 
   (Erreur image: Fichier trop volumineux - max 5MB)
```

### 8.3 Messages d'Erreur

**Validation formulaire** :
```
❌ Veuillez corriger les erreurs du formulaire
```

**Création produit échouée** :
```
❌ Impossible de créer le produit: Référence déjà existante
```

**Stock échoué** :
```
⚠️ Produit créé mais erreur stock: Données stock incomplètes
```

**Image échouée** :
```
⚠️ Impossible d'uploader l'image: Format invalide
```

---

## 🔄 Étape 9 : Réinitialisation Après Succès

Après succès de création, le formulaire est vidé :

```
Avant:
┌────────────────────────────────┐
│ Nom: Mon Produit LED           │
│ Prix: 99.99                    │
│ Catégorie: Électronique        │
└────────────────────────────────┘

Après succès:
┌────────────────────────────────┐
│ Nom: [vide]                    │
│ Prix: [vide]                   │
│ Catégorie: [Première cat.]     │
│ Image: [aucune]                │
└────────────────────────────────┘

Message succès affiché 3-5 secondes
↓
Utilisateur peut créer nouveau produit OU revenir
```

---

## 📊 États et Transitions

```
État            Condition                    Actions possibles
─────────────────────────────────────────────────────────────────
Init            Page ouverte                 Charger options

Options         Catégories + Fabricants      Remplir formulaire
chargés         chargés

Édition         Utilisateur saisit           Valider champs
                                            Afficher erreurs

Validation      Clic "Créer"                Valider complet
complète        Formulaire valide           Soumettre

Création        XML envoyé                   Attendre réponse
en cours        API en traitement

Création        ID produit reçu              Créer stock
réussie         Produit existe               + Upload image

Stock mis       Quantité mise à jour         + Éventuellement upload
à jour                                       image

Image            Fichier uploadsuccess      Afficher succès
uploadée

Erreur          Exception à tout moment      Afficher erreur
                                            Laisser corriger
```

---

## 🛡️ Invariants et Contraintes

### Invariants

1. **Atomicité Produit** : Soit tout créé, soit rien
2. **Unicité Référence** : Impossible de créer 2 produits avec même référence
3. **Catégorie Requise** : Tout produit doit avoir une catégorie
4. **Stock Obligatoire** : Après création, le produit doit avoir une entrée stock
5. **Pas de Mutation** : Les données du formulaire ne peuvent pas être modifiées pendant la soumission
6. **Ordre d'Opérations** : Produit créé avant stock, stock avant image
7. **Récupération d'ID** : L'ID produit doit être extrait de la réponse
8. **Rollback Partiel** : Si stock/image échouent, produit reste créé

### Contraintes

- **Limitation Texte** :
  - Nom : min 3, max 128
  - Référence : max 32
  - Description : max 1024

- **Limitation Nombre** :
  - Prix : ≥ 0
  - Poids : ≥ 0 (optionnel)
  - Quantité : ≥ 0

- **Format** :
  - XML bien formé exigé
  - Caractères XML doivent être échappés
  - Multilingue : obligatoirement `<language id="1">`

- **Ressources** :
  - Image : max 5 MB
  - Formats : jpg, jpeg, png, gif

---

## 🔀 Combinaisons de Scénarios

### Succès Total
```
1. Validation ✓
2. Création produit ✓
3. Création stock ✓
4. Upload image (si présent) ✓
Result: Succès complet, formulaire réinitialisé
```

### Succès Partiel (Image échouée)
```
1. Validation ✓
2. Création produit ✓
3. Création stock ✓
4. Upload image ❌
Result: Produit créé, avertissement image
```

### Succès Partiel (Stock échoué)
```
1. Validation ✓
2. Création produit ✓
3. Création stock ❌
Result: Produit créé sans stock initial
```

### Échec Complet (Validation)
```
1. Validation ❌
Result: Message erreur, formulaire reste ouvert
```

### Échec Complet (Création Produit)
```
1. Validation ✓
2. Création produit ❌
Result: Message erreur, formulaire reste ouvert
```

---

## 🎮 Interactions Utilisateur

### Flux Utilisateur Standard

```
1. Cliquer "Créer Produit"
   → Page ouvre, options se chargent

2. Remplir Nom
   → Validation immédiate
   → Si erreur : rouge + message d'erreur

3. Remplir Référence
   → Validation immédiate

4. Sélectionner Catégorie
   → Déjà pré-remplie, peut changer

5. Remplir Prix
   → Affichage calcul TTC en temps réel

6. Remplir Quantité
   → Validation immédiate

7. [Optionnel] Sélectionner Image
   → Affichage prévisuel

8. Cliquer "Créer"
   → Validation complète
   → Envoi données
   → Affichage progression
   → Message succès/erreur

9. Formulaire réinitialisé
   → Prêt pour nouveau produit
```

### Flux Correction d'Erreur

```
1. Remplir formulaire
2. Cliquer "Créer"
3. ❌ Erreur: "Nom requis"
4. Cliquer sur champ Nom
5. Taper: "Mon Produit"
   → Message d'erreur disparaît
   → Champ devient valide
6. Cliquer "Créer" à nouveau
7. ✅ Succès
```

---

## 📈 Performance et Optimisations

### Chargements Parallèles

```
Catégories ─────┐
Fabricants ─────┤→ Promise.all() → Tous les deux chargés
                │
        Temps total: max(catégories, fabricants)
```

### Validations Efficaces

- **Validation locale** : Sans appel API (immédiat)
- **Pas de double validation** : Validation lors du changement + avant submit
- **Messages cachés** : Erreurs affichées uniquement si champ modifié

### Transformation Minimaliste

- Un seul parsing XML
- Une seule génération XML
- Conversion types juste-à-temps
