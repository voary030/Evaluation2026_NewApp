/**
 * API Import de Fichiers
 * Gestion de l'import massif de produits
 */

import apiClient from './client'
import { FileImporterService, ProductService, StockService } from '@/services'
import { Product } from '@/models/products/Product'
import { createProduct } from './products'
import { getProductStock, updateStock } from './stocks'

/**
 * Crée/met à jour les données de langue d'un produit
 * NOTE: Plus utilisée - ProductService gère ça automatiquement
 * @deprecated
 */
const createProductLang = async (productId, product) => {
  // Fonction conservée pour compatibilité mais non utilisée
  console.warn('[import.createProductLang] Fonction dépréciée - ProductService gère la langue')
}

/**
 * Assigne un produit à une catégorie
 * NOTE: Plus utilisée - ProductService gère ça automatiquement
 * @deprecated
 */
const assignProductToCategory = async (productId, categoryId = 2) => {
  // Fonction conservée pour compatibilité mais non utilisée
  console.warn('[import.assignProductToCategory] Fonction dépréciée - ProductService gère la catégorie')
}


/**
 * Importe plusieurs produits avec gestion d'erreurs
 * @param {Object} product - Données du produit
 * @returns {Promise<Object>} {success: boolean, id: number, error: string}
 */
export const importSingleProduct = async (product) => {
  try {
    console.log(`[import.importSingleProduct] Création produit: ${product.name}`)

    // ÉTAPE 1: Créer un objet Product (exactement comme Create.vue)
    const productObj = new Product({
      id: null,
      name: product.name || '',
      reference: product.reference || '',
      price: parseFloat(product.price || 0),
      weight: parseFloat(product.weight || 0),
      quantity: parseInt(product.quantity || 0),
      active: 1,
      description: product.description || '',
      id_manufacturer: product.id_manufacturer || null,
      id_category_default: product.id_category_default || 2 // Catégorie par défaut: 2 (Home)
    })

    // ÉTAPE 2: Valider le produit
    if (!productObj.validate()) {
      throw new Error('Produit invalide: fields manquants')
    }

    // ÉTAPE 3: Construire le XML (exactement comme Create.vue via ProductService)
    const productXml = ProductService.buildProductXml(productObj)
    console.log(`[import.importSingleProduct] XML produit généré (${productXml.length} chars)`)

    // ÉTAPE 4: Créer le produit via API
    const response = await createProduct(productXml)
    console.log(`[import.importSingleProduct] Réponse reçue (${response.length} chars)`)

    // ÉTAPE 5: Parser la réponse pour obtenir l'ID
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(response, 'text/xml')
    const idNode = xmlDoc.querySelector('product > id')
    const newProductId = idNode?.textContent

    if (!newProductId) {
      throw new Error('Impossible de récupérer l\'ID du produit créé')
    }

    console.log(`[import.importSingleProduct] Produit créé avec ID: ${newProductId}`)

    // ÉTAPE 6: Mettre à jour le stock si quantity > 0
    const quantity = parseInt(product.quantity || 0)
    if (quantity > 0) {
      try {
        console.log(`[import.importSingleProduct] Mise à jour stock: id=${newProductId}, qty=${quantity}`)

        // Récupérer le stock du produit créé (filtrée par id_product)
        const stockResponse = await getProductStock(newProductId)

        // Parser les entrées - devrait y en avoir une seule maintenant
        const stockEntries = StockService.parseStockEntries(stockResponse)
        console.log(`[import.importSingleProduct] ${stockEntries.length} entrée(s) stock trouvée(s)`)

        if (stockEntries.length > 0) {
          const stockEntry = stockEntries[0]
          
          console.log(`[import.importSingleProduct] Entrée stock trouvée:`, stockEntry)
          
          // Valider les champs requis
          if (!stockEntry.id || !stockEntry.id_product) {
            console.error(`[import.importSingleProduct] Champs manquants:`, stockEntry)
            throw new Error('Stock invalide: id ou id_product manquant')
          }
          
          // Mettre à jour avec l'entrée COMPLÈTE et la nouvelle quantité
          console.log(`[import.importSingleProduct] Appel updateStock(entry, ${quantity})`)
          await updateStock(stockEntry, quantity)
          console.log(`[import.importSingleProduct] Stock mis à jour avec succès ✅`)
        } else {
          console.warn(`[import.importSingleProduct] Aucun stock trouvé pour produit ${newProductId}`)
        }
      } catch (stockErr) {
        console.error(`[import.importSingleProduct] Erreur stock:`, stockErr.message)
        // Ne pas bloquer - le produit a été créé
      }
    }

    return {
      success: true,
      id: newProductId,
      name: product.name
    }
  } catch (error) {
    console.error(`[import.importSingleProduct] Erreur complète:`, error)

    let errorMessage = error.message

    // Essayer d'extraire le message d'erreur PrestaShop si possible
    if (error.response?.data) {
      try {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(error.response.data, 'text/xml')
        const msgNode = xmlDoc.querySelector('error > message')
        if (msgNode) {
          errorMessage = msgNode.textContent
        }
      } catch (e) {
        // Continuer avec le message par défaut
      }
    }

    return {
      success: false,
      name: product.name,
      error: errorMessage
    }
  }
}

/**
 * Importe plusieurs produits avec gestion d'erreurs
 * @param {Array} products - Tableau de produits
 * @param {Function} onProgress - Callback de progression (index, total, result)
 * @returns {Promise<Object>} Rapport d'import
 */
export const importMultipleProducts = async (products, onProgress = null) => {
  const results = {
    total: products.length,
    successful: [],
    failed: [],
    errors: []
  }

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    
    // Appeler le callback de progression
    if (onProgress) {
      onProgress(i, products.length)
    }

    // Importer le produit
    const result = await importSingleProduct(product)

    if (result.success) {
      results.successful.push({
        index: i + 1,
        name: result.name,
        id: result.id
      })
    } else {
      results.failed.push({
        index: i + 1,
        name: result.name
      })
      results.errors.push({
        index: i + 1,
        name: result.name,
        error: result.error
      })
    }
  }

  return results
}

/**
 * Génère un rapport d'import formaté
 * @param {Object} results - Résultats de l'import
 * @returns {string} Rapport formaté
 */
export const generateImportReport = (results) => {
  let report = `
Import Report
=============
Total: ${results.total} produit(s)
Réussi: ${results.successful.length}
Échoué: ${results.failed.length}
`

  if (results.errors.length > 0) {
    report += `\nErreurs:\n`
    results.errors.forEach(err => {
      report += `  Ligne ${err.index}: ${err.name} - ${err.error}\n`
    })
  }

  return report
}
