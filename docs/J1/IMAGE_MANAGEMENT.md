# 🖼️ Gestion des Images - Guide Complet

## Vue d'Ensemble

Le système de gestion des images de **NewApp** suit une architecture en couches pour gérer les uploads, le stockage et l'affichage des images produits via l'API WebService PrestaShop 8.2.6.

```
Vue Component (Create.vue / Details.vue)
        ↓
Composable (useProductForm / useProductDetails)
        ↓
API Layer (api/images.js)
        ↓
HTTP Client (apiClient - Axios)
        ↓
PrestaShop WebService REST
        ↓
File System (Dossier /img/p/)
```

---

## 📋 Architecture Générale

### Couches Impliquées

1. **Vue Component** - Interface utilisateur
2. **Composable** - Logique métier et orchestration
3. **API Layer** - Communication avec PrestaShop
4. **Services** - Transformation et parsing des données XML
5. **Models** - Validation et sérialisation

---

## 🚀 Flux d'Upload d'Image (Création Produit)

### Étapes du Processus

```
1. Utilisateur sélectionne une image (Create.vue)
   ↓
2. Validation du fichier (Create.vue)
   - Format: jpg, jpeg, png, gif
   - Taille max: 5MB
   ↓
3. Aperçu dans le formulaire
   ↓
4. Soumission du produit (useProductForm.submitForm)
   ↓
5. Création du produit via API (/products)
   ↓
6. Récupération de l'ID du produit créé
   ↓
7. Upload de l'image via API (/images/products/{productId})
   ↓
8. Message de succès ou d'erreur
```

### Composant Vue: Create.vue

**Rôle**: Interface de création/édition de produit

```vue
<!-- Section Upload Image -->
<fieldset>
  <legend>🖼️ Image du produit</legend>
  <p class="section-info">Uploadez une image pour votre produit (optionnel)</p>
  
  <!-- Message d'erreur -->
  <div v-if="imageError" class="alert alert-error">
    <p>{{ imageError }}</p>
  </div>
  
  <!-- Input File -->
  <div class="form-group">
    <label for="image-file">Sélectionner une image</label>
    <input
      id="image-file"
      type="file"
      accept="image/jpg, image/jpeg, image/png, image/gif"
      :disabled="submitting || uploadingImage"
      @change="(e) => imageFile = e.target.files?.[0] || null"
    />
    <span class="label-text">
      {{ imageFile ? `✅ ${imageFile.name}` : 'Cliquez pour sélectionner une image' }}
    </span>
  </div>
  
  <!-- Aperçu Image -->
  <div v-if="imageFile" class="file-preview">
    <img :src="URL.createObjectURL(imageFile)" :alt="imageFile.name" />
  </div>
</fieldset>
```

**État Réactif**:
```javascript
imageFile,          // File object ou null
uploadingImage,     // boolean - état du chargement
imageError          // string|null - message d'erreur
```

---

## 🛠️ Composable: useProductForm

### Méthode uploadImage()

**Responsabilité**: Upload l'image sélectionnée pour un produit créé

```javascript
/**
 * Upload une image pour un produit créé
 * @private
 */
const uploadImage = async (newProductId) => {
  if (!imageFile.value) {
    console.log('[useProductForm.uploadImage] Pas d\'image à uploader')
    return
  }

  console.log(`[useProductForm.uploadImage] Début upload pour produit ${newProductId}`)
  
  try {
    uploadingImage.value = true
    imageError.value = null

    // Appel API
    const response = await uploadProductImage(newProductId, imageFile.value)
    console.log('[useProductForm.uploadImage] Réponse upload:', response.substring(0, 300))

    // Extraction optionnelle de l'ID image (pour logging)
    try {
      const xmlData = new DOMParser().parseFromString(response, 'text/xml')
      const imageIdElement = xmlData.querySelector('image > id')
      const imageId = imageIdElement ? imageIdElement.textContent : 'créée'
      console.log(`[useProductForm.uploadImage] Image ${imageId} uploadée avec succès`)
    } catch (parseErr) {
      console.log('[useProductForm.uploadImage] Impossible de parser l\'ID image')
    }

    // Réinitialiser le fichier
    imageFile.value = null
  } catch (err) {
    imageError.value = err.message
    console.error('[useProductForm.uploadImage] Erreur upload:', err.message)
    throw err
  } finally {
    uploadingImage.value = false
  }
}
```

### Méthode submitForm() - Intégration Image

**Responsabilité**: Orchestre la création du produit + upload image

**Flux lors de la création**:
```javascript
// 1. Valider le formulaire
if (!validateForm()) {
  error.value = 'Veuillez corriger les erreurs du formulaire'
  return false
}

// 2. Créer le produit
const response = await createProduct(productXml)
const xmlData = new DOMParser().parseFromString(response, 'text/xml')
const newProductId = xmlData.querySelector('product > id')?.textContent

// 3. Mettre à jour le stock
if (newProductId) {
  await updateProductStock(newProductId, qty)
  
  // 4. Upload l'image SI présente
  if (imageFile.value) {
    try {
      await uploadImage(newProductId)
      success.value = `Produit créé avec succès! Image uploadée.`
    } catch (imageErr) {
      // Erreur image non critique - produit déjà créé
      imageError.value = `Produit créé, mais erreur image: ${imageErr.message}`
      success.value = `Produit créé! (Erreur image: ${imageErr.message})`
    }
  }
}
```

**Points Clés**:
- L'upload d'image est **asynchrone** après la création du produit
- Si l'upload échoue, le produit reste créé (non critique)
- L'erreur image s'affiche mais ne bloque pas le flux

---

## 📡 API Layer: api/images.js

### Fonction: uploadProductImage()

**Rôle**: Envoyer l'image au serveur PrestaShop

```javascript
/**
 * Upload une image pour un produit
 * @param {number} productId - ID du produit
 * @param {File} imageFile - Fichier image à uploader
 * @returns {Promise<string>} Réponse XML avec ID de l'image créée
 */
export const uploadProductImage = async (productId, imageFile) => {
  try {
    // 1. Validation du fichier
    if (!imageFile) {
      throw new Error('Aucun fichier sélectionné')
    }
    
    // 2. Validation format
    const acceptedFormats = ['jpg', 'jpeg', 'png', 'gif']
    const fileExtension = imageFile.name.split('.').pop().toLowerCase()
    
    if (!acceptedFormats.includes(fileExtension)) {
      throw new Error(`Format non accepté. Acceptés: ${acceptedFormats.join(', ')}`)
    }
    
    // 3. Validation taille (max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024 // 5MB
    if (imageFile.size > maxSizeBytes) {
      throw new Error('Fichier trop volumineux (max 5MB)')
    }

    // 4. Créer FormData pour multipart
    const formData = new FormData()
    formData.append('image', imageFile)

    // 5. POST vers PrestaShop
    const response = await apiClient.post(
      `/images/products/${productId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    return response.data
  } catch (error) {
    console.error('[API.images.uploadProductImage] Erreur:', error.message)
    throw new Error(`Impossible d'uploader l'image: ${error.message}`)
  }
}
```

**Validations**:
- ✅ Fichier requis
- ✅ Format: jpg, jpeg, png, gif seulement
- ✅ Taille max: 5MB
- ✅ Content-Type: multipart/form-data

---

## 🔄 Récupération et Affichage des Images

### Composable: useProductDetails

**Rôle**: Charger et afficher les images d'un produit

#### Fonction: parseImageIds()

```javascript
/**
 * Extrait les IDs d'images depuis les données XML de produit
 * @param {string} xmlData - XML des images du produit
 * @returns {Array<string>} Liste des IDs d'images
 */
const parseImageIds = (xmlData) => {
  if (!xmlData) return []
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlData, 'text/xml')
  const imageNodes = xmlDoc.getElementsByTagName('image')
  return Array.from(imageNodes)
    .map((node) => node.getElementsByTagName('id')[0]?.textContent)
    .filter(Boolean)
}
```

#### Fonction: buildProductDetails()

```javascript
/**
 * Transforme les données XML d'un produit en objet JavaScript formaté
 * @param {string} productXml - XML du produit
 * @param {Object} quantityMap - Map des quantités
 * @param {Object} categoriesMap - Map des catégories
 * @param {string} imagesXml - XML des images du produit
 * @returns {Object} Objet produit formaté
 */
const buildProductDetails = (productXml, quantityMap, categoriesMap, imagesXml) => {
  const imageIdsFromApi = parseImageIds(imagesXml)

  // ... parsing produit ...

  const imageIds = imageIdsFromApi.length > 0 ? imageIdsFromApi : associationImageIds
  
  // Image principale (première de la liste)
  const imageMain = imageIds.length > 0
    ? ProductService.getImageUrl(imageIds[0], 'large_default')
    : null
  
  // Liste des images miniatures
  const imageList = imageIds.map((imageId) => 
    ProductService.getImageUrl(imageId, 'medium_default')
  )

  return {
    // ... autres propriétés ...
    imageMain,
    images: imageList
  }
}
```

### Composant Vue: Details.vue

**Affichage des images**:

```vue
<section class="card images-card">
  <h2>Images</h2>
  
  <!-- Image principale -->
  <div v-if="product.imageMain" class="image-main">
    <img :src="product.imageMain" :alt="product.name" />
  </div>
  <div v-else class="muted">Aucune image disponible</div>
  
  <!-- Miniatures -->
  <div v-if="product.images && product.images.length > 1" class="image-thumbs">
    <img
      v-for="img in product.images"
      :key="img"
      :src="img"
      :alt="product.name"
      class="thumb"
    />
  </div>
</section>
```

---

## 🔗 Flux Complet de Récupération

### Étapes:

```
1. Charger le produit (getProduct)
   ↓
2. Charger les images (getProductImages)
   ↓
3. Parser les IDs d'images
   ↓
4. Construire les URLs d'images
   - Format principal: large_default (affichage détail)
   - Format miniatures: medium_default (galerie)
   ↓
5. Retourner l'objet produit avec imageMain + images[]
   ↓
6. Afficher dans Details.vue
```

### Formats d'Image PrestaShop

**Disponibles**:
- `small_default` - Petite image
- `medium_default` - Image moyenne (galerie)
- `large_default` - Grande image (affichage détail)
- `home_default` - Image d'accueil
- `cart_default` - Image panier

**Utilisés dans NewApp**:
- `large_default` - Image principale dans Details.vue
- `medium_default` - Miniatures/galerie

---

## 🛍️ Listing: Index.vue

### Affichage des Miniatures

```vue
<!-- Colonne Image -->
<img :src="getImageUrl(product.imageMain)" :alt="product.name" class="product-thumb" />
```

**Fonction ProductService.getImageUrl()**:
```javascript
export const getImageUrl = (imageId, format = 'medium_default') => {
  return `${API_BASE_URL}/images/products/${imageId}/${format}`
}
```

---

## 📌 API Endpoints

### Upload Image

**Endpoint**: `POST /images/products/{productId}`

**Corps**: FormData avec fichier image

**Format**:
```
Content-Type: multipart/form-data
image: [File object]
```

**Réponse**: XML avec ID image créée
```xml
<?xml version="1.0" encoding="UTF-8"?>
<prestashop>
  <image>
    <id>1234</id>
    <id_product>567</id_product>
    <cover>1</cover>
  </image>
</prestashop>
```

### Récupérer Images d'un Produit

**Endpoint**: `GET /images/products/{productId}`

**Query Parameters**:
```
display=[id,id_product,cover,position]
```

**Réponse**: XML avec liste des images
```xml
<?xml version="1.0" encoding="UTF-8"?>
<prestashop>
  <images>
    <image>
      <id>1234</id>
      <id_product>567</id_product>
      <cover>1</cover>
      <position>0</position>
    </image>
    <image>
      <id>1235</id>
      <id_product>567</id_product>
      <cover>0</cover>
      <position>1</position>
    </image>
  </images>
</prestashop>
```

### Supprimer une Image

**Endpoint**: `DELETE /images/products/{productId}/{imageId}`

### Définir Image de Couverture

**Endpoint**: `PUT /images/products/{productId}/{imageId}`

**Corps**: XML
```xml
<?xml version="1.0" encoding="UTF-8"?>
<prestashop>
  <image>
    <id>1234</id>
    <id_product>567</id_product>
    <cover>1</cover>
  </image>
</prestashop>
```

---

## 🔧 Service: ProductService

### Fonction: getImageUrl()

**Rôle**: Construire l'URL complète pour une image

```javascript
export const getImageUrl = (imageId, format = 'medium_default') => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost/api'
  return `${apiBaseUrl}/images/products/${imageId}/${format}`
}
```

**Exemples**:
```javascript
// Image principale
ProductService.getImageUrl(1234, 'large_default')
// → http://localhost/api/images/products/1234/large_default

// Miniature
ProductService.getImageUrl(1234, 'medium_default')
// → http://localhost/api/images/products/1234/medium_default
```

---

## 🎯 Cas d'Usage

### 1. Créer un Produit avec Image

```javascript
// 1. Utilisateur remplit le formulaire
formData.name = 'Mon Produit'
formData.price = 29.99
imageFile.value = selectedFile

// 2. Clique sur "Créer"
await submitForm()

// 3. Composable:
//    a. Crée le produit → ID reçu
//    b. Met à jour le stock
//    c. Upload l'image avec le nouvel ID
//    d. Affiche le succès

// 4. Utilisateur redirigé vers la liste ou détails
```

### 2. Modifier un Produit (Édition)

**État actuel**: Les images ne sont pas modifiables en édition
- Les images existantes restent
- Nouvelles images non gérées en édition

```javascript
// L'upload d'image ne se déclenche qu'en création
const submitForm = async () => {
  // ...
  if (isEditMode) {
    await updateProduct(productId, productXml)
    // Pas d'upload image
  } else {
    const newId = await createProduct(productXml)
    await uploadImage(newId)  // ← Seulement en création
  }
}
```

### 3. Afficher les Détails d'un Produit

```javascript
const loadProduct = async (productId) => {
  // 1. Charger en parallèle
  const [productXml, stockXml, categoriesXml, imagesXml] = await Promise.all([
    getProduct(productId),
    getStocks(),
    getCategories(),
    getProductImages(productId)  // ← Récupérer les images
  ])

  // 2. Parser et construire
  const product = buildProductDetails(productXml, quantityMap, categoriesMap, imagesXml)

  // 3. product.imageMain et product.images[] prêts
  return product
}
```

---

## ⚠️ Gestion des Erreurs

### Erreurs d'Upload

```javascript
const uploadImage = async (newProductId) => {
  try {
    uploadingImage.value = true
    imageError.value = null
    
    await uploadProductImage(newProductId, imageFile.value)
    imageFile.value = null  // Réinitialiser
  } catch (err) {
    imageError.value = err.message  // Affiche l'erreur
    throw err  // Remonte l'erreur
  } finally {
    uploadingImage.value = false
  }
}
```

### Erreurs Possibles

```
❌ "Aucun fichier sélectionné"
❌ "Format non accepté. Acceptés: jpg, jpeg, png, gif"
❌ "Fichier trop volumineux (max 5MB)"
❌ "Impossible d'uploader l'image: [erreur serveur]"
❌ "Impossible de charger les images: [erreur serveur]"
```

### Gestion Non-Critique

L'erreur d'upload d'image ne bloque pas la création du produit:
```javascript
if (imageFile.value) {
  try {
    await uploadImage(newProductId)
    success.value = `Produit créé! Image uploadée.`
  } catch (imageErr) {
    // Erreur image non critique
    success.value = `Produit créé! (Erreur image: ${imageErr.message})`
  }
}
```

---

## 📊 Diagramme de l'État

```
┌─────────────────────────────────────┐
│    Sélection Image (Create.vue)     │
└────────────┬────────────────────────┘
             ↓
     imageFile = File
     ↓
┌─────────────────────────────────────┐
│      Validation + Aperçu             │
├─────────────────────────────────────┤
│ - Format (jpg, jpeg, png, gif)      │
│ - Taille (max 5MB)                  │
│ - Affichage URL.createObjectURL()   │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│    Soumission Formulaire             │
├─────────────────────────────────────┤
│ submitForm() → validation            │
│          ↓                           │
│      Créer produit                   │
│          ↓                           │
│    Mettre à jour stock               │
│          ↓                           │
│    Upload image (SI présente)        │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│   uploadingImage = true              │
│   imageError = null                  │
│   uploadProductImage(id, file)       │
└────────────┬────────────────────────┘
             ↓
  ✅ Succès       ❌ Erreur
   ↓              ↓
imageFile = null  imageError = message
uploadingImage=F  uploadingImage=F
```

---

## 📝 Résumé des Fichiers

| Fichier | Responsabilité |
|---------|-----------------|
| `src/api/images.js` | Upload, récupération, suppression images via API |
| `src/composables/products/useProductForm.js` | Logique upload + orchestration création |
| `src/composables/products/useProductDetails.js` | Récupération + parsing images pour affichage |
| `src/views/Produits/Create.vue` | Interface upload image |
| `src/views/Produits/Details.vue` | Affichage images produit |
| `src/views/Produits/Index.vue` | Miniatures dans liste |
| `src/services/products/ProductService.js` | URL image + utilitaires |

---

## 🚀 Points Clés

✅ **Upload Asynchrone**: L'image s'upload APRÈS la création du produit

✅ **Erreur Non-Critique**: Si l'upload échoue, le produit reste créé

✅ **Validation Client**: Format et taille vérifiés avant envoi

✅ **Formats Multiples**: PrestaShop génère automatiquement small, medium, large

✅ **Gestion Parallèle**: Produit + stock + images en parallèle lors du détail

✅ **Parsing XML**: IDs images extraits du XML PrestaShop

✅ **Aperçu Temps Réel**: URL temporaire avec `URL.createObjectURL()`

---

## 🔄 Flux d'Intégration Future

**Si vous voulez ajouter**:

### Modification d'Images en Édition
```javascript
// Dans useProductForm.submitForm()
if (isEditMode && imageFile.value) {
  await uploadImage(productId)
}
```

### Suppression d'Images
```javascript
export const deleteProductImage = async (productId, imageId) => {
  await apiClient.delete(`/images/products/${productId}/${imageId}`)
}
```

### Définir Image de Couverture
```javascript
const setCoverImage = async (productId, imageId) => {
  const imageXml = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop>
  <image>
    <id>${imageId}</id>
    <id_product>${productId}</id_product>
    <cover>1</cover>
  </image>
</prestashop>`
  
  await apiClient.put(`/images/products/${productId}/${imageId}`, imageXml)
}
```

---

**Document mis à jour**: 11 mai 2026

