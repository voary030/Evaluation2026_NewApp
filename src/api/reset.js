/**
 * API Réinitialisation des Données
 * Gestion complète de la suppression et réinitialisation des données PrestaShop
 */

import apiClient from './client'
import { getProducts } from './products'

/**
 * Récupère tous les produits pour les supprimer
 * @returns {Promise<Array>} Liste de tous les produits
 */
export const getAllProductIds = async () => {
  try {
    console.log('[API.reset.getAllProductIds] Récupération de tous les produits')
    
    const response = await apiClient.get('/products?display=[id,name]')
    
    console.log('[API.reset.getAllProductIds] Réponse reçue:', response.data.substring(0, 300))
    
    // Parser les IDs des produits
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(response.data, 'text/xml')
    const productNodes = xmlDoc.querySelectorAll('product > id')
    
    const ids = Array.from(productNodes).map(node => node.textContent)
    console.log(`[API.reset.getAllProductIds] ${ids.length} produit(s) trouvé(s)`)
    
    return ids
  } catch (error) {
    console.error('[API.reset.getAllProductIds] Erreur:', error.message)
    throw new Error(`Impossible de récupérer les produits: ${error.message}`)
  }
}

/**
 * Supprime UN produit
 * @param {number} productId - ID du produit à supprimer
 * @returns {Promise<void>}
 */
export const deleteProduct = async (productId) => {
  try {
    console.log(`[API.reset.deleteProduct] Suppression du produit ${productId}`)
    
    await apiClient.delete(`/products/${productId}`)
    
    console.log(`[API.reset.deleteProduct] Produit ${productId} supprimé ✅`)
  } catch (error) {
    console.error(`[API.reset.deleteProduct] Erreur produit ${productId}:`, error.message)
    throw new Error(`Impossible de supprimer le produit ${productId}: ${error.message}`)
  }
}

/**
 * Supprime TOUS les produits avec callback de progression
 * @param {Function} onProgress - Callback (current, total)
 * @returns {Promise<Object>} Rapport de suppression
 */
export const deleteAllProducts = async (onProgress = null) => {
  try {
    console.log('[API.reset.deleteAllProducts] DÉBUT - Suppression complète')
    
    // ÉTAPE 1: Récupérer tous les IDs
    const productIds = await getAllProductIds()
    const total = productIds.length
    
    console.log(`[API.reset.deleteAllProducts] ${total} produit(s) à supprimer`)
    
    if (total === 0) {
      return {
        success: true,
        deleted: 0,
        errors: [],
        message: 'Aucun produit à supprimer'
      }
    }
    
    // ÉTAPE 2: Supprimer chaque produit
    const errors = []
    let deleted = 0
    
    for (let i = 0; i < productIds.length; i++) {
      const productId = productIds[i]
      
      if (onProgress) {
        onProgress(i, total)
      }
      
      try {
        await deleteProduct(productId)
        deleted++
      } catch (err) {
        console.error(`[API.reset.deleteAllProducts] Erreur suppression ${productId}:`, err.message)
        errors.push({
          productId,
          error: err.message
        })
      }
    }
    
    // ÉTAPE 3: Confirmation finale
    if (onProgress) {
      onProgress(total, total)
    }
    
    console.log(`[API.reset.deleteAllProducts] Suppression terminée: ${deleted}/${total}`)
    
    return {
      success: errors.length === 0,
      deleted,
      failed: errors.length,
      errors,
      message: `Suppression terminée: ${deleted}/${total} produit(s) supprimé(s)`
    }
  } catch (error) {
    console.error('[API.reset.deleteAllProducts] Erreur complète:', error.message)
    return {
      success: false,
      deleted: 0,
      errors: [{ error: error.message }],
      message: `Erreur lors de la suppression: ${error.message}`
    }
  }
}

/**
 * Réinitialisation via API WebService
 * - Supprime tous les produits (FK en cascade automatique)
 * @param {Function} onProgress - Callback (step, message)
 * @returns {Promise<Object>} Rapport complet
 */
export const performCompleteReset = async (onProgress = null) => {
  try {
    const report = {
      success: true,
      steps: [],
      message: ''
    }
    
    // Supprimer les produits via API WebService
    if (onProgress) onProgress(1, 'Suppression des produits via API WebService...')
    console.log('[API.reset.performCompleteReset] Suppression des produits')
    
    const deleteReport = await deleteAllProducts((current, total) => {
      if (onProgress) {
        const percent = Math.round((current / total) * 100)
        onProgress(1, `Suppression: ${current}/${total} (${percent}%)`)
      }
    })
    
    report.steps.push({
      name: 'Suppression des produits',
      ...deleteReport
    })
    
    if (!deleteReport.success && deleteReport.deleted === 0) {
      report.success = false
      report.message = 'Erreur lors de la suppression des produits'
      return report
    }
    
    // Message final
    report.message = `✅ Réinitialisation effectuée!\n${deleteReport.message}`
    
    if (onProgress) onProgress(2, report.message)
    
    return report
  } catch (error) {
    console.error('[API.reset.performCompleteReset] Erreur:', error.message)
    return {
      success: false,
      steps: [],
      message: `Erreur réinitialisation: ${error.message}`
    }
  }
}
