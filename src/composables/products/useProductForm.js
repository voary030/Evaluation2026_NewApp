/**
 * Composable de Formulaire Produit
 * 
 * Gère la logique du formulaire de création/modification:
 * - État réactif du formulaire
 * - Validation des champs
 * - Soumission et appels API
 * - Gestion des erreurs
 */

import { ref, computed, reactive } from 'vue'
import { createProduct, updateProduct, getProduct } from '@/api/products'
import { updateStock, getProductStock } from '@/api/stocks'
import { uploadProductImage } from '@/api/images'
import { getCategories } from '@/api/categories'
import { getManufacturers } from '@/api/manufacturers'
import { ProductService } from '@/services/products'
import { Product } from '@/models/products/Product'
import { XMLNodeHelper } from '@/services/XMLNodeHelper'
import { XMLParserService } from '@/services/XMLParserService'
import { StockService, CategoryService, ManufacturerService } from '@/services'

export function useProductForm(productId = null) {
  // ============================================
  // ÉTAT DU FORMULAIRE
  // ============================================
  
  const isEditMode = !!productId
  const loading = ref(false)
  const submitting = ref(false)
  const error = ref(null)
  const success = ref(null)
  const loadingOptions = ref(false)
  const categories = ref([])
  const manufacturers = ref([])
  const imageFile = ref(null)
  const uploadingImage = ref(false)
  const imageError = ref(null)
  
  // Données du formulaire (utiliser reactive pour un objet)
  const formData = reactive({
    name: '',
    reference: '',
    price: '',
    weight: '',
    quantity: '',
    active: 1,
    description: '',
    id_manufacturer: '',
    id_category_default: ''
  })

  // Erreurs de validation
  const errors = reactive({
    name: null,
    reference: null,
    price: null,
    weight: null,
    quantity: null,
    description: null,
    id_category_default: null
  })

  // ============================================
  // CHAMPS REQUIS
  // ============================================
  
  const requiredFields = ['name', 'price', 'reference', 'quantity', 'id_category_default']

  // ============================================
  // COMPUTED
  // ============================================

  const hasErrors = computed(() => {
    return Object.values(errors).some(err => err !== null)
  })

  const isFormValid = computed(() => {
    return !hasErrors.value && requiredFields.every(field => {
      const value = formData[field]
      return value !== null && value !== '' && value !== undefined
    })
  })

  const formattedPrice = computed(() => {
    const price = parseFloat(formData.price)
    return isNaN(price) ? '0,00 €' : `${price.toFixed(2).replace('.', ',')} €`
  })

  const formattedPriceTTC = computed(() => {
    const price = parseFloat(formData.price) * 1.2
    return isNaN(price) ? '0,00 €' : `${price.toFixed(2).replace('.', ',')} €`
  })

  // ============================================
  // MÉTHODES DE VALIDATION
  // ============================================

  const validateField = (fieldName, value) => {
    let error = null

    switch (fieldName) {
      case 'name':
        if (!value || value.trim().length === 0) {
          error = 'Le nom est requis'
        } else if (value.length < 3) {
          error = 'Le nom doit contenir au minimum 3 caractères'
        } else if (value.length > 128) {
          error = 'Le nom ne peut pas dépasser 128 caractères'
        }
        break

      case 'reference':
        if (!value || value.trim().length === 0) {
          error = 'La référence est requise'
        } else if (value.length > 32) {
          error = 'La référence ne peut pas dépasser 32 caractères'
        }
        break

      case 'price':
        if (value === '' || value === null) {
          error = 'Le prix est requis'
        } else {
          const price = parseFloat(value)
          if (isNaN(price)) {
            error = 'Le prix doit être un nombre valide'
          } else if (price < 0) {
            error = 'Le prix ne peut pas être négatif'
          }
        }
        break

      case 'weight':
        if (value !== '' && value !== null && value !== undefined) {
          const weight = parseFloat(value)
          if (isNaN(weight)) {
            error = 'Le poids doit être un nombre valide'
          } else if (weight < 0) {
            error = 'Le poids ne peut pas être négatif'
          }
        }
        break

      case 'quantity':
        if (value === '' || value === null) {
          error = 'La quantité est requise'
        } else {
          const qty = parseInt(value)
          if (isNaN(qty)) {
            error = 'La quantité doit être un nombre entier'
          } else if (qty < 0) {
            error = 'La quantité ne peut pas être négative'
          }
        }
        break

      case 'description':
        if (value && value.length > 1024) {
          error = 'La description ne peut pas dépasser 1024 caractères'
        }
        break

      case 'id_category_default':
        if (!value) {
          error = 'La catégorie est requise'
        }
        break
    }

    errors[fieldName] = error
    return !error
  }

  const validateForm = () => {
    let isValid = true

    for (const fieldName of Object.keys(formData)) {
      if (!validateField(fieldName, formData[fieldName])) {
        isValid = false
      }
    }

    return isValid
  }

  // ============================================
  // MÉTHODES PRIVÉES
  // ============================================

  /**
   * Charge les options du formulaire (categories, fabricants)
   * @private
   */
  const loadOptions = async () => {
    try {
      loadingOptions.value = true

      const [categoriesXml, manufacturersXml] = await Promise.all([
        getCategories(),
        getManufacturers()
      ])

      categories.value = CategoryService.parseCategories(categoriesXml)
      manufacturers.value = ManufacturerService.parseManufacturers(manufacturersXml)

      if (!isEditMode && !formData.id_category_default && categories.value.length > 0) {
        formData.id_category_default = categories.value[0].id
      }
    } catch (err) {
      console.error('Erreur chargement options produit:', err)
    } finally {
      loadingOptions.value = false
    }
  }

  /**
   * Charge les données du produit en mode édition
   * @private
   */
  const loadProductData = async () => {
    if (!isEditMode) return

    try {
      loading.value = true
      error.value = null

      // Charger le produit + le stock en parallèle
      const [xmlData, stockXml] = await Promise.all([
        getProduct(productId),
        getProductStock(productId)
      ])

      // Parser le produit
      const products = XMLParserService.parseXML(xmlData, 'product', (node) => {
        return {
          id: XMLNodeHelper.getText(node, 'id'),
          name: XMLNodeHelper.getLangText(node, 'name'),
          reference: XMLNodeHelper.getText(node, 'reference'),
          price: XMLNodeHelper.getNumber(node, 'price'),
          weight: XMLNodeHelper.getNumber(node, 'weight'),
          quantity: '0', // ⚠️ Sera écrasée par le stock juste après
          active: XMLNodeHelper.getBoolean(node, 'active') ? 1 : 0,
          description: XMLNodeHelper.getLangText(node, 'description') || '',
          id_manufacturer: XMLNodeHelper.getText(node, 'id_manufacturer') || '',
          id_category_default: XMLNodeHelper.getText(node, 'id_category_default') || ''
        }
      })

      if (products.length > 0) {
        const product = products[0]
        Object.assign(formData, product)
        console.log('[useProductForm.loadProductData] Produit chargé:', formData)
      }

      // Parser le stock et mettre à jour quantity
      try {
        const stockEntries = StockService.parseStockEntries(stockXml)
        console.log('[useProductForm.loadProductData] Entrées stock parsées:', stockEntries)
        
        if (stockEntries.length > 0) {
          formData.quantity = stockEntries[0].quantity
          console.log(`[useProductForm.loadProductData] Stock chargé: ${formData.quantity} unités`)
        } else {
          formData.quantity = '0'
          console.warn('[useProductForm.loadProductData] Aucun stock trouvé, quantity = 0')
        }
      } catch (stockErr) {
        console.warn('[useProductForm.loadProductData] Erreur parsing stock:', stockErr.message)
        formData.quantity = '0'
      }
    } catch (err) {
      error.value = `Impossible de charger le produit: ${err.message}`
      console.error('Erreur loadProductData:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Construit le XML pour l'envoi à l'API
   * @private
   */
  const buildProductXml = () => {
    const product = new Product({
      id: productId || null,
      name: formData.name,
      reference: formData.reference,
      price: parseFloat(formData.price),
      weight: parseFloat(formData.weight) || 0,
      quantity: parseInt(formData.quantity),
      active: formData.active,
      description: formData.description,
      id_manufacturer: formData.id_manufacturer || null,
      id_category_default: formData.id_category_default || null
    })

    return ProductService.buildProductXml(product)
  }

  // ============================================
  // MÉTHODES PUBLIQUES
  // ============================================

  /**
   * Initialise le formulaire
   */
  const initForm = async () => {
    await loadOptions()
    if (isEditMode) {
      await loadProductData()
    }
  }

  /**
   * Réinitialise le formulaire aux valeurs par défaut
   */
  const resetForm = () => {
    formData.name = ''
    formData.reference = ''
    formData.price = ''
    formData.weight = ''
    formData.quantity = ''
    formData.active = 1
    formData.description = ''
    formData.id_manufacturer = ''
    formData.id_category_default = ''

    // Réinitialiser les erreurs
    Object.keys(errors).forEach(field => {
      errors[field] = null
    })

    error.value = null
    success.value = null

    if (categories.value.length > 0) {
      formData.id_category_default = categories.value[0].id
    }
  }

  /**
   * Traite la validation d'un champ
   */
  const handleFieldChange = (fieldName) => {
    validateField(fieldName, formData[fieldName])
  }

  /**
   * Met a jour le stock d'un produit
   * @private
   */
  const updateProductStock = async (id, quantity) => {
    console.log(`[useProductForm.updateProductStock] Début: id_produit=${id}, quantité=${quantity}`)
    
    try {
      // 1. Récupérer le stock du produit spécifique (filtré par id_product)
      const stockXml = await getProductStock(id)
      console.log(`[useProductForm.updateProductStock] XML stock reçu pour produit ${id}:`, stockXml.substring(0, 300))
      
      // 2. Parser les entrées
      const entries = StockService.parseStockEntries(stockXml)
      console.log(`[useProductForm.updateProductStock] Entrées parsées (${entries.length}):`, entries)
      
      if (entries.length === 0) {
        console.warn(`[useProductForm.updateProductStock] Aucun stock trouvé pour produit ${id}`)
        return
      }

      // 3. La première (et devrait être la seule) entrée
      const target = entries[0]
      console.log(`[useProductForm.updateProductStock] Entrée cible trouvée:`, target)
      
      if (!target || !target.id) {
        console.warn(`[useProductForm.updateProductStock] Entrée stock invalide pour produit ${id}`)
        return
      }
      
      // 4. Vérifier que les champs requis sont présents
      if (!target.id_product || !target.id_shop) {
        console.error(`[useProductForm.updateProductStock] Champs manquants dans l'entrée stock:`, target)
        throw new Error('Données de stock incomplètes: id_product ou id_shop manquant')
      }
      
      // 5. Mettre à jour le stock en envoyant l'entrée COMPLÈTE avec la nouvelle quantité
      console.log(`[useProductForm.updateProductStock] Mise à jour du stock_available avec l'entrée complète`)
      await updateStock(target, quantity)
      console.log(`[useProductForm.updateProductStock] Stock mis à jour avec succès ✅`)
    } catch (err) {
      console.error(`[useProductForm.updateProductStock] Erreur:`, err.message)
      throw err
    }
  }

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

      const response = await uploadProductImage(newProductId, imageFile.value)
      console.log('[useProductForm.uploadImage] Réponse upload:', response.substring(0, 300))

      // Extraire l'ID de l'image créée (optionnel, pour logging)
      try {
        const xmlData = new DOMParser().parseFromString(response, 'text/xml')
        const imageIdElement = xmlData.querySelector('image > id')
        const imageId = imageIdElement ? imageIdElement.textContent : 'créée'
        console.log(`[useProductForm.uploadImage] Image ${imageId} uploadée avec succès`)
      } catch (parseErr) {
        console.log('[useProductForm.uploadImage] Impossible de parser l\'ID image, mais upload réussi')
      }

      // Réinitialiser le fichier image après upload
      imageFile.value = null
    } catch (err) {
      imageError.value = err.message
      console.error('[useProductForm.uploadImage] Erreur upload:', err.message)
      throw err
    } finally {
      uploadingImage.value = false
    }
  }

  /**
   * Soumet le formulaire pour créer/modifier un produit
   */
  const submitForm = async () => {
    error.value = null
    success.value = null

    // Valider le formulaire
    if (!validateForm()) {
      error.value = 'Veuillez corriger les erreurs du formulaire'
      return false
    }

    try {
      submitting.value = true

      // Construire le XML
      const productXml = buildProductXml()
      console.log('[useProductForm.submitForm] XML produit:', productXml.substring(0, 300))

      // Envoyer à l'API
      if (isEditMode) {
        console.log(`[useProductForm.submitForm] Mode édition: mise à jour produit ${productId}`)
        await updateProduct(productId, productXml)
        try {
          const qty = parseInt(formData.quantity) || 0
          console.log(`[useProductForm.submitForm] Mise à jour du stock: id=${productId}, qty=${qty}`)
          await updateProductStock(productId, qty)
        } catch (stockErr) {
          console.warn('[useProductForm.submitForm] Erreur lors de la mise à jour du stock:', stockErr.message)
        }
        success.value = `Produit "${formData.name}" modifié avec succès!`
      } else {
        console.log('[useProductForm.submitForm] Mode création: création produit')
        // Créer le produit
        const response = await createProduct(productXml)
        console.log('[useProductForm.submitForm] Réponse création produit:', response.substring(0, 300))
        
        // Extraire l'ID du produit créé
        const xmlData = new DOMParser().parseFromString(response, 'text/xml')
        const idElement = xmlData.querySelector('product > id')
        const newProductId = idElement ? idElement.textContent : null
        console.log(`[useProductForm.submitForm] ID produit créé: ${newProductId}`)

        // Mettre à jour le stock (meme si quantite = 0)
        if (newProductId) {
          try {
            const qty = parseInt(formData.quantity) || 0
            console.log(`[useProductForm.submitForm] Mise à jour du stock: id=${newProductId}, qty=${qty}`)
            await updateProductStock(newProductId, qty)
            console.log(`[useProductForm.submitForm] Stock mis à jour avec succès`)
          } catch (stockErr) {
            // Erreur stock non critique - le produit a été créé
            console.warn('[useProductForm.submitForm] Erreur lors de la mise à jour du stock:', stockErr.message)
          }

          // Upload l'image si présente
          if (imageFile.value) {
            try {
              console.log('[useProductForm.submitForm] Début upload image')
              await uploadImage(newProductId)
              success.value = `Produit "${formData.name}" créé avec succès! Image uploadée.`
            } catch (imageErr) {
              // Erreur image non critique - le produit a été créé
              imageError.value = `Produit créé, mais erreur image: ${imageErr.message}`
              console.warn('[useProductForm.submitForm] Erreur lors du upload image:', imageErr.message)
              success.value = `Produit "${formData.name}" créé avec succès! (Erreur image: ${imageErr.message})`
            }
          } else {
            success.value = `Produit "${formData.name}" créé avec succès!${newProductId ? ` (ID: ${newProductId})` : ''}`
          }
        }

        resetForm()
      }

      return true
    } catch (err) {
      error.value = err.message || 'Une erreur est survenue lors de la sauvegarde'
      console.error('[useProductForm.submitForm] Erreur complète:', err)
      return false
    } finally {
      submitting.value = false
    }
  }

  // Initialiser le formulaire (options + edition)
  initForm()

  return {
    // État
    isEditMode,
    loading,
    submitting,
    error,
    success,
    loadingOptions,
    formData,
    errors,
    categories,
    manufacturers,
    imageFile,
    uploadingImage,
    imageError,

    // Computed
    hasErrors,
    isFormValid,
    formattedPrice,
    formattedPriceTTC,

    // Méthodes
    initForm,
    resetForm,
    handleFieldChange,
    submitForm,
    validateField,
    uploadImage
  }
}
