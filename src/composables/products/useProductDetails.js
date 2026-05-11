/**
 * Composable de Gestion des Details d'un Produit
 * 
 * Gère la logique métier pour afficher les détails d'un seul produit:
 * - Récupération du produit complet avec fabricant et images
 * - Parsing XML et transformation des données
 * - Orchestration des appels API
 * - État réactif (loading, erreurs)
 * 
 * Architecture: Composable = Controller (comme Spring Boot)
 * - Utilise l'API (Repository) pour les appels HTTP
 * - Utilise les Services pour la transformation des données
 * - Fournit l'état réactif aux composants Vue
 */

import { ref } from 'vue'
import { getProduct, getProductImages } from '@/api/products'
import { getStocks } from '@/api/stocks'
import { getCategories } from '@/api/categories'
import { getManufacturer, getManufacturerImage } from '@/api/manufacturers'
import { ProductService } from '@/services/products'
import { StockService, CategoryService, ManufacturerService, XMLParserService } from '@/services'

export function useProductDetails() {
  // ============================================
  // ÉTAT RÉACTIF
  // ============================================
  const product = ref(null)
  const manufacturer = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // ============================================
  // FONCTIONS UTILITAIRES PRIVÉES
  // ============================================

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

  /**
   * Extrait les IDs d'associations (catégories, images) depuis un nœud produit
   * @param {Element} node - Nœud XML du produit
   * @param {string} tagName - Nom de l'association (category, image, etc.)
   * @returns {Array<string>} Liste des IDs
   */
  const extractAssociationIds = (node, tagName) => {
    const associations = node.getElementsByTagName('associations')
    if (associations.length === 0) return []
    const items = associations[0].getElementsByTagName(tagName)
    return Array.from(items)
      .map((item) => item.getElementsByTagName('id')[0]?.textContent)
      .filter(Boolean)
  }

  /**
   * Extrait l'ID d'image depuis le XML des images du fabricant
   * @param {string} xmlData - XML des images du fabricant
   * @returns {string|null} ID de l'image ou null
   */
  const parseManufacturerImageId = (xmlData) => {
    if (!xmlData) return null
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlData, 'text/xml')
    const imageNode = xmlDoc.getElementsByTagName('image')[0]
    return imageNode?.getElementsByTagName('id')[0]?.textContent || null
  }

  /**
   * Transforme les données XML d'un fabricant en objet JavaScript
   * @param {string} manufacturerXml - XML du fabricant
   * @param {string} manufacturerImageId - ID de l'image du fabricant
   * @returns {Object} Objet fabricant formaté
   */
  const buildManufacturerDetails = (manufacturerXml, manufacturerImageId) => {
    const parsed = XMLParserService.parseXML(manufacturerXml, 'manufacturer', (node) => {
      const id = node.getElementsByTagName('id')[0]?.textContent
      const nameNode = node.getElementsByTagName('name')[0]
      const descNode = node.getElementsByTagName('description')[0]
      const shortDescNode = node.getElementsByTagName('short_description')[0]
      const activeNode = node.getElementsByTagName('active')[0]

      const imageUrl = manufacturerImageId
        ? ManufacturerService.getManufacturerImageUrl(manufacturerImageId)
        : ManufacturerService.getManufacturerImageUrl(id)

      return {
        id,
        name: XMLParserService.getLanguageText(nameNode) || 'Sans nom',
        description: XMLParserService.getLanguageText(descNode) || '',
        shortDescription: XMLParserService.getLanguageText(shortDescNode) || '',
        active: activeNode?.textContent === '1',
        image: imageUrl
      }
    })

    return parsed[0] || null
  }

  /**
   * Transforme les données XML d'un produit en objet JavaScript formaté
   * @param {string} productXml - XML du produit
   * @param {Object} quantityMap - Map des quantités en stock {idProduct: quantity}
   * @param {Object} categoriesMap - Map des catégories {idCategory: name}
   * @param {string} imagesXml - XML des images du produit
   * @returns {Object} Objet produit formaté
   */
  const buildProductDetails = (productXml, quantityMap, categoriesMap, imagesXml) => {
    const imageIdsFromApi = parseImageIds(imagesXml)

    const parsed = XMLParserService.parseXML(productXml, 'product', (node) => {
      const getText = (tag) => node.getElementsByTagName(tag)[0]?.textContent || ''
      const getLangText = (tag) => {
        const tagNode = node.getElementsByTagName(tag)[0]
        return XMLParserService.getLanguageText(tagNode)
      }

      const id = getText('id')
      const priceHT = parseFloat(getText('price') || '0')
      const categoryId = getText('id_category_default')
      const manufacturerId = getText('id_manufacturer')
      const associationCategoryIds = extractAssociationIds(node, 'category')
      const associationImageIds = extractAssociationIds(node, 'image')

      const imageIds = imageIdsFromApi.length > 0 ? imageIdsFromApi : associationImageIds
      const imageMain = imageIds.length > 0
        ? ProductService.getImageUrl(imageIds[0], 'large_default')
        : null
      const imageList = imageIds.map((imageId) => ProductService.getImageUrl(imageId, 'medium_default'))

      const categories = associationCategoryIds
        .map((catId) => categoriesMap[catId])
        .filter(Boolean)

      return {
        id,
        name: getLangText('name') || 'Sans nom',
        reference: getText('reference') || '-',
        manufacturer: getText('manufacturer_name') || '-',
        manufacturerId,
        price: priceHT,
        priceTTC: ProductService.calculatePriceTTC(priceHT),
        weight: parseFloat(getText('weight') || '0'),
        active: getText('active') === '1',
        dateAdd: getText('date_add'),
        dateUpd: getText('date_upd'),
        quantity: parseInt(quantityMap[id] || '0'),
        categoryDefault: categoriesMap[categoryId] || '-',
        categories,
        imageMain,
        images: imageList
      }
    })

    return parsed[0] || null
  }

  // ============================================
  // MÉTHODES PUBLIQUES
  // ============================================

  /**
   * Charge les détails complets d'un produit
   * 
   * Flux:
   * 1. Récupère produit, stocks, catégories et images en parallèle
   * 2. Transforme les données via les fonctions de parsing
   * 3. Si fabricant existe, récupère ses détails en parallèle
   * 4. Stocke dans l'état réactif
   * 
   * @async
   * @param {number|string} productId - ID du produit à charger
   * @returns {Promise<void>}
   */
  const loadProduct = async (productId) => {
    if (!productId) return
    loading.value = true
    error.value = null
    product.value = null
    manufacturer.value = null

    try {
      // Étape 1: Charger le produit avec tous ses détails en parallèle
      const [productXml, stockXml, categoriesXml, imagesXml] = await Promise.all([
        getProduct(productId),
        getStocks(),
        getCategories(),
        getProductImages(productId)
      ])

      // Étape 2: Préparer les maps pour l'enrichissement des données
      const categories = CategoryService.parseCategories(categoriesXml)
      const categoriesMap = {}
      categories.forEach((cat) => {
        categoriesMap[cat.id] = cat.name
      })

      const quantityMap = StockService.parseStocks(stockXml)

      // Étape 3: Transformer les données du produit
      const parsedProduct = buildProductDetails(productXml, quantityMap, categoriesMap, imagesXml)

      if (!parsedProduct) {
        throw new Error('Produit introuvable')
      }

      product.value = parsedProduct

      // Étape 4: Charger les détails du fabricant s'il existe
      if (parsedProduct.manufacturerId) {
        try {
          const [manufacturerXml, manufacturerImageXml] = await Promise.all([
            getManufacturer(parsedProduct.manufacturerId),
            getManufacturerImage(parsedProduct.manufacturerId)
          ])

          const manufacturerImageId = parseManufacturerImageId(manufacturerImageXml)
          const parsedManufacturer = buildManufacturerDetails(manufacturerXml, manufacturerImageId)
          manufacturer.value = parsedManufacturer
        } catch (err) {
          // Le fabricant n'est pas critique, continuer même s'il ne charge pas
          console.debug('Erreur chargement fabricant:', err.message)
        }
      }
    } catch (err) {
      error.value = err.message || 'Erreur lors du chargement du produit'
      console.error('Erreur chargement produit details:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Formate un prix pour l'affichage (ex: 12,50 €)
   * @param {number} price - Prix en nombre
   * @returns {string} Prix formaté avec symbole €
   */
  const formatPrice = (price) => {
    const value = parseFloat(price || '0')
    return `${value.toFixed(2).replace('.', ',')} €`
  }

  /**
   * Formate une date pour l'affichage (ex: 05/05/2026)
   * @param {string} value - Date ISO
   * @returns {string} Date formatée ou la valeur originale
   */
  const formatDate = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString('fr-FR')
  }

  // ============================================
  // EXPORT DES FONCTIONS ET ÉTATS
  // ============================================

  return {
    // État réactif
    product,          // Données du produit chargé
    manufacturer,     // Données du fabricant (optionnel)
    loading,          // Indicateur de chargement
    error,            // Message d'erreur

    // Méthodes publiques
    loadProduct,      // Charger un produit par son ID
    formatPrice,      // Formater le prix
    formatDate        // Formater la date
  }
}
