/**
 * Composable de Gestion des Produits
 * 
 * Gère la logique métier pour les produits:
 * - Récupération des produits et stocks
 * - Filtrage et tri des produits
 * - Création, modification, suppression de produits
 * - État réactif (loading, erreurs, succès)
 * 
 * Architecture: Composable = Controller (comme Spring Boot)
 * - Utilise l'API (Repository) pour les appels HTTP
 * - Utilise les Services pour la transformation des données
 * - Fournit l'état réactif aux composants Vue
 */

import { ref, computed } from 'vue'
import { getProducts, deleteProduct, createProduct, updateProduct, getProductImages } from '@/api/products'
import { getCategories } from '@/api/categories'
import { getStocks } from '@/api/stocks'
import { ProductService } from '@/services/products'
import { StockService, CategoryService } from '@/services'

export function useProducts() {
  // ============================================
  // ÉTAT RÉACTIF (Variables d'état)
  // ============================================
  
  /** @type {Ref<Array>} Tableau de tous les produits chargés */
  const products = ref([])
  
  /** @type {Ref<boolean>} Indicateur de chargement (true pendant les appels API) */
  const loading = ref(false)
  
  /** @type {Ref<string|null>} Message d'erreur si une opération échoue */
  const error = ref(null)
  
  /** @type {Ref<string|null>} Message de succès après une opération */
  const success = ref(null)
  
  /** @type {Ref<string>} Terme de recherche pour filtrer les produits */
  const searchQuery = ref('')
  
  /** @type {Ref<string>} Critère de tri ('name', 'price', 'quantity') */
  const sortBy = ref('name')
  
  /** @type {Ref<boolean>} Direction du tri (true = ascendant, false = descendant) */
  const sortAscending = ref(true)


  // ============================================
  // COMPUTED PROPERTIES (Propriétés calculées)
  // ============================================
  
  /**
   * Produits filtrés ET triés
   * Réactif: se met à jour automatiquement quand searchQuery, sortBy ou sortAscending changent
   * @returns {Array} Produits filtrés et triés
   */
  const filteredProducts = computed(() => {
    // 1. Filtrer par terme de recherche
    let result = ProductService.filterProducts(products.value, searchQuery.value)
    
    // 2. Trier le résultat
    result = ProductService.sortProducts(result, sortBy.value, sortAscending.value)
    
    return result
  })

  // ============================================
  // MÉTHODES PUBLIQUES
  // ============================================
  
  /**
   * Charge tous les produits depuis l'API
   * @async
   * @returns {Promise<void>}
   */
  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    success.value = null
    try {
      const [xmlData, stocksMap, categoriesMap] = await Promise.all([
        getProducts(),
        getStocks().then(data => StockService.parseStocks(data)).catch(() => ({})),
        getCategories().then(data => {
          const cats = CategoryService.parseCategories(data)
          const map = {}
          cats.forEach(cat => { map[cat.id] = cat.name })
          return map
        }).catch(() => ({}))
      ])
      
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlData, 'text/xml')
      const productElements = xmlDoc.getElementsByTagName('product')
      const productIds = Array.from(productElements).map(el => el.getElementsByTagName('id')[0]?.textContent).filter(Boolean)
      
      const imagesMap = await fetchProductImagesMap(productIds)
      const parsedProducts = ProductService.parseProducts(xmlData, stocksMap, categoriesMap, imagesMap)
      
      products.value = parsedProducts
    } catch (err) {
      error.value = err.message
      console.error('Erreur chargement produits:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Récupère les images pour tous les produits
   * @async
   * @private
   */
  const fetchProductImagesMap = async (productIds) => {
    const imagesMap = {}
    
    const imagePromises = productIds.map(async (productId) => {
      try {
        const xmlData = await getProductImages(productId)
        if (xmlData) {
          const parser = new DOMParser()
          const xmlDoc = parser.parseFromString(xmlData, 'text/xml')
          let images = xmlDoc.getElementsByTagName('image')
          if (images.length === 0) images = xmlDoc.getElementsByTagName('images')
          
          if (images.length > 0) {
            const imageId = images[0].getElementsByTagName('id')[0]?.textContent
            if (imageId) {
              imagesMap[productId] = ProductService.getImageUrl(imageId, 'medium_default')
            }
          }
        }
      } catch (err) {
        // Erreur silencieuse pour les images manquantes
      }
    })
    
    await Promise.all(imagePromises)
    return imagesMap
  }

  /**
   * Supprime un produit
   * @async
   * @param {number} id
   */
  const deleteProductById = async (id) => {
    loading.value = true
    error.value = null
    try {
      await deleteProduct(id)
      products.value = products.value.filter(p => p.id !== id)
      success.value = 'Produit supprimé avec succès'
      setTimeout(() => success.value = null, 3000)
    } catch (err) {
      error.value = err.message
      console.error('Erreur suppression produit:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    success,
    searchQuery,
    sortBy,
    sortAscending,
    filteredProducts,
    fetchProducts,
    deleteProductById,
    formatPrice: (price) => `${parseFloat(price).toFixed(2).replace('.', ',')} €`
  }
}
