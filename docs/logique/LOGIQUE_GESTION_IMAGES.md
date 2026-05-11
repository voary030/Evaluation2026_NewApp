# Logique de Gestion des Images

## Vue d'ensemble
Le système gère le cycle de vie complet des images de produits : upload, stockage, récupération et suppression via l'API WebService PrestaShop.

---

## Concept Général

```
Fichier local → Validation → Upload → Stockage PrestaShop
                                             ↓
                                      Organisation dossiers
                                             ↓
                                      Accès par URL
```

---

## Données et Formats

### Formats Acceptés
- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **GIF** (.gif)

### Limitations
- **Taille maximale** : 5 MB
- **Résolution** : Aucune limite imposée
- **Nombre** : Illimité par produit

### Formats de Livraison PrestaShop

Après upload, PrestaShop génère automatiquement plusieurs versions de chaque image :

| Format | Dimension | Usage |
|--------|-----------|-------|
| `small_default` | 98×98 px | Miniatures liste |
| `medium_default` | 245×245 px | Vignettes catégories |
| `large_default` | 570×570 px | Détails produit |
| `home` | 250×250 px | Page d'accueil |
| `cart` | 125×125 px | Panier |

---

## Flux d'Upload d'Image

### 1️⃣ Sélection du Fichier (Interface Utilisateur)

```
Clic input file → Sélection fichier → Validation côté client
                                              ↓
                          Format accepté? OUI → Aperçu affichage
                                    NON → Message erreur
```

**Entrée** : Fichier sélectionné par utilisateur
**Actions** :
1. Vérifier que un fichier est sélectionné
2. Extraire extension du fichier
3. Vérifier que l'extension est dans la liste acceptée
4. Créer aperçu prévisuel (URL.createObjectURL)
5. Afficher miniature dans formulaire

**Sortie** :
- Fichier en mémoire (imageFile ref)
- Prévisuel visible
- Message de confirmation ou erreur

**Validation** :
- Fichier sélectionné ✓
- Extension correcte ✓

---

### 2️⃣ Upload d'Image (Lors de la Création/Modification Produit)

```
Clic soumettre produit → Créer/Modifier produit
                                      ↓
                    [Si image sélectionnée]
                                      ↓
                    Validation fichier (taille)
                                      ↓
                    Créer FormData multipart
                                      ↓
                    POST /images/products/{productId}
                                      ↓
                    Réponse XML avec nouvel ID image
```

**Entrée** :
- ID du produit (créé ou existant)
- Fichier image sélectionné

**Actions** :
1. Valider fichier :
   - Format : jpg, jpeg, png, gif
   - Taille : ≤ 5 MB
   - Si erreur → Exception avec message

2. Créer FormData :
   ```
   FormData {
     image: File
   }
   ```

3. POST vers endpoint PrestaShop :
   ```
   POST /images/products/{productId}
   Content-Type: multipart/form-data
   Body: FormData
   ```

4. Parser réponse XML :
   - Extraire ID de l'image créée
   - Vérifier succès

**Sortie** :
- Image uploadée sur serveur PrestaShop
- ID image retourné
- Message de succès

**Erreurs** :
- Format invalide → Exception
- Fichier trop gros → Exception
- Réseau échoue → Exception
- API répond erreur → Exception

**Points clés** :
- Upload est **asynchrone**
- Si produit création + image échoue : produit reste créé (image non critique)
- Chaque upload crée **une** image (pas de batch)
- Utilisateur peut uploader plusieurs images séquentiellement

---

### 3️⃣ Récupération des Images d'un Produit

```
Affichage détail produit → Récupérer IDs images
                                      ↓
                    Pour chaque ID : Construire URL format
                                      ↓
                    Afficher images avec URLs
```

**Entrée** : ID du produit
**Actions** :
1. GET /images/products/{productId}
2. Parser XML de réponse
3. Extraire liste des IDs d'images
4. Pour chaque ID :
   - Construire URL de chaque format (small, medium, large)
   - Déterminer quelle image est la couverture (cover)
5. Assembler liste des images avec URLs

**Sortie** :
- Liste d'URLs des images
- Identification de l'image de couverture
- Position/ordre des images

**Format URL retourné** :
```
/img/p/{d1}/{d2}/{id}-{format}.jpg

Exemple pour ID 123, format medium_default :
/img/p/2/3/123-medium_default.jpg
```

---

### 4️⃣ Suppression d'une Image

```
Clic suppression image → Confirmation demandée
                                      ↓
                    DELETE /images/products/{productId}/{imageId}
                                      ↓
                    Fichier supprimé PrestaShop
                                      ↓
                    Tous les formats supprimés
```

**Entrée** :
- ID du produit
- ID de l'image à supprimer

**Actions** :
1. Demander confirmation utilisateur
2. DELETE /images/products/{productId}/{imageId}
3. PrestaShop supprime :
   - Image d'origine
   - Tous les formats générés (small, medium, large, etc.)
4. Mettre à jour affichage

**Sortie** :
- Image et tous ses formats supprimés
- Interface actualisée

---

## Stockage et Organisation

### Hiérarchie PrestaShop

PrestaShop stocke les images à l'emplacement : `/img/p/`

Les images sont organisées en sous-dossiers selon l'ID :

```
/img/p/
├── 1/
│   ├── 1-small_default.jpg
│   ├── 1-medium_default.jpg
│   ├── 1-large_default.jpg
│   └── ...
├── 2/
│   └── ...
├── 1/2/
│   ├── 12-small_default.jpg
│   ├── 12-medium_default.jpg
│   └── ...
├── 2/3/
│   ├── 123-small_default.jpg
│   ├── 123-medium_default.jpg
│   ├── 123-large_default.jpg
│   └── ...
```

### Logique d'Organisation

```
Pour ID image = 123 :
  d1 = floor(123 / 10) % 10 = 2
  d2 = 123 % 10 = 3
  Chemin : /img/p/2/3/

Pour ID image = 5 :
  d1 = floor(5 / 10) % 10 = 0
  d2 = 5 % 10 = 5
  Chemin : /img/p/5/  (d1 = 0, donc pas de sous-dossier d1)
```

### Génération de Formats

À chaque upload, PrestaShop génère automatiquement :

1. **Image originale** : Stockée en version standard
2. **small_default** : 98×98 px, JPG optimisé
3. **medium_default** : 245×245 px, JPG optimisé
4. **large_default** : 570×570 px, JPG optimisé
5. **Autres formats** : home, cart, etc.

Tous les formats sont dérivés de l'original uploadé.

---

## États et Cycles de Vie

### État d'une Image

```
État           Entrée                    → État suivant
────────────────────────────────────────────────────────
Non existante  Aucune                    → Upload
En attente     Fichier sélectionné       → Upload en cours
En cours       POST lancé                → Uploadée ou Erreur
Uploadée       Réponse 200 OK            → Affichée
Erreur         Exception                 → Non existante (reset)
Supprimée      DELETE lancé              → Non existante
```

### Problèmes Courants

| Problème | Cause | Solution |
|----------|-------|----------|
| Format non accepté | Extension invalide | Reconvertir en JPEG/PNG/GIF |
| Fichier trop gros | > 5 MB | Réduire résolution ou compression |
| Upload échoue | Réseau, serveur occupé | Réessayer |
| Pas d'image générée | ID produit invalide | Vérifier ID produit |
| Mauvaises dimensions | Résolution d'entrée | PrestaShop redimensionne auto |

---

## Flux d'Intégration Complète

### Création Produit avec Image

```
1. Utilisateur saisit données produit + sélectionne image
                ↓
2. Validation formulaire (sauf image, optionnelle)
                ↓
3. POST /products (créer produit)
                ↓
4. Récupérer ID produit de réponse XML
                ↓
5. SI image sélectionnée :
     5a. Validation fichier
     5b. POST /images/products/{productId}
     5c. SI erreur image : Log warning, continuer
                ↓
6. Afficher succès (produit créé, image optionnelle)
```

**Points clés** :
- Image est **indépendante** du produit
- Si image échoue, produit est déjà créé
- Pas de rollback de produit si image échoue
- Utilisateur peut ajouter image ultérieurement

### Modification Produit avec Image

```
1. Charger produit existant (inclut images actuelles)
                ↓
2. Utilisateur modifie données et/ou ajoute image
                ↓
3. PUT /products/{id} (mettre à jour)
                ↓
4. SI nouvelle image sélectionnée :
     4a. POST /images/products/{id}
                ↓
5. Afficher succès (produit mis à jour, image ajoutée)
```

---

## Validation et Gestion d'Erreurs

### Validations Côté Client

```javascript
Format valide?
  ├─ OUI → Taille < 5MB?
  │         ├─ OUI → Créer aperçu → Afficher ✓
  │         └─ NON → Erreur "Fichier trop gros"
  └─ NON → Erreur "Format invalide"
```

### Validations Côté Serveur (PrestaShop)

- Format du fichier
- Dimensions minimales
- Antivirus (si configuré)
- Espace disque disponible

### Messages d'Erreur

| Erreur | Message | Action |
|--------|---------|--------|
| Format invalide | "Format non accepté. Acceptés: jpg, jpeg, png, gif" | Resélectionner fichier |
| Trop gros | "Fichier trop volumineux (max 5MB)" | Réduire fichier |
| Upload échoue | "Impossible d'uploader l'image: [détail]" | Réessayer ou contacter support |
| Réseau | "Erreur réseau" | Vérifier connexion |

---

## Algorithmes Clés

### Construction URL Image

```
Entrée: imageId (nombre), format (string)

d1 = floor(imageId / 10) % 10
d2 = imageId % 10

SI d1 === 0 :
  chemin = /img/p/{imageId}/
SINON :
  chemin = /img/p/{d1}/{d2}/

URL = chemin + imageId + "-" + format + ".jpg"

Exemple: imageId=123, format="medium_default"
  d1 = floor(123/10) % 10 = 2
  d2 = 123 % 10 = 3
  URL = /img/p/2/3/123-medium_default.jpg
```

### Nettoyage de Fichier

```
Extension = fichier.name.split('.').pop().toLowerCase()
SI Extension IN [jpg, jpeg, png, gif] :
  ✓ Valide
SINON :
  ✗ Invalide
```

### Contrôle de Taille

```
maxBytes = 5 * 1024 * 1024 (5 MB)
SI fichier.size > maxBytes :
  ✗ Rejeté
SINON :
  ✓ Accepté
```

---

## Invariants du Système

1. **Indépendance** : Image peut exister sans produit temporairement
2. **Intégrité** : Si upload échoue, aucune donnée corrompue
3. **Atomicité** : Chaque upload est un fait atomique
4. **Traçabilité** : Chaque erreur est tracée et affichée
5. **Retrouvabilité** : ID image toujours récupérable de PrestaShop
6. **Pérennité** : Image uploadée persiste jusqu'à suppression explicite
7. **Accessibilité** : Image toujours accessible par URL directe après upload

---

## Performance et Optimisation

### Approche Parallèle

Lors du chargement de la liste des produits :
- Les images sont récupérées en **parallèle** (Promise.all)
- Chaque produit a son appel image indépendant
- Les erreurs d'image ne bloquent pas les autres produits

```javascript
// Récupérer images en parallèle
const imagePromises = productIds.map(id => 
  getProductImages(id).catch(err => null)
)
const images = await Promise.all(imagePromises)
```

### Cache Implicite

- URL image est **cacheable** côté navigateur
- PrestaShop met en cache les formats générés
- Rechargement page = Images depuis cache navigateur

---

## Dépendances

- **Produit** : Image dépend d'un produit existant
- **API PrestaShop** : Dépend de la disponibilité API WebService
- **Espace disque** : Dépend de l'espace sur serveur
- **Formats** : Dépend des formats générés par PrestaShop
