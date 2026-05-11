/**
 * API Produits
 * Gestion complète des produits PrestaShop
 */

import apiClient from './client'

/**
 * Récupère tous les produits avec détails
 * @param {string} display - Champs à afficher (ex: '[id,name,price]' ou 'full')
 * @returns {Promise<string>} Données XML
 */
export const getProducts = async (display = 'full') => {
  try {
    // Utiliser display=full pour récupérer toutes les infos y compris les associations (images)
    const response = await apiClient.get(`/products?display=${display}`)
    console.debug('Produits chargés via API, nb produits:', (response.data.match(/<product>/g) || []).length)
    return response.data
  } catch (error) {
    console.error('Erreur getProducts:', error.message)
    throw new Error(`Impossible de charger les produits: ${error.message}`)
  }
}

/**
 * Récupère un produit spécifique avec tous ses détails
 * @param {number} id - ID du produit
 * @returns {Promise<string>} Données XML
 */
export const getProduct = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}?display=full`)
    return response.data
  } catch (error) {
    console.error('Erreur getProduct:', error.message)
    throw new Error(`Impossible de charger le produit: ${error.message}`)
  }
}

/**
 * Crée un nouveau produit
 * @param {string} productXml - Données XML du produit
 * @returns {Promise<string>} Réponse XML
 */
export const createProduct = async (productXml) => {
  try {
    console.log('[API.products.createProduct] XML envoyé:', productXml.substring(0, 300))
    
    const response = await apiClient.post('/products', productXml)
    
    console.log('[API.products.createProduct] Réponse reçue:', response.data.substring(0, 300))
    
    return response.data
  } catch (error) {
    console.error('[API.products.createProduct] Erreur:', error)
    throw new Error(`Impossible de créer le produit: ${error.message}`)
  }
}

/**
 * Met à jour un produit existant
 * @param {number} id - ID du produit
 * @param {string} productXml - Données XML du produit
 * @returns {Promise<string>} Réponse XML
 */
export const updateProduct = async (id, productXml) => {
  try {
    const response = await apiClient.put(`/products/${id}`, productXml)
    return response.data
  } catch (error) {
    console.error('Erreur updateProduct:', error)
    throw new Error(`Impossible de mettre à jour le produit: ${error.message}`)
  }
}

/**
 * Supprime un produit
 * @param {number} id - ID du produit
 * @returns {Promise<void>}
 */
export const deleteProduct = async (id) => {
  try {
    await apiClient.delete(`/products/${id}`)
  } catch (error) {
    console.error('Erreur deleteProduct:', error)
    throw new Error(`Impossible de supprimer le produit: ${error.message}`)
  }
}

/**
 * Récupère le schéma vierge pour les produits
 * @returns {Promise<string>} Données XML du schéma
 */
export const getProductSchema = async () => {
  try {
    const response = await apiClient.get('/products?schema=blank')
    return response.data
  } catch (error) {
    console.error('Erreur getProductSchema:', error)
    throw new Error(`Impossible de charger le schéma produit: ${error.message}`)
  }
}

/**
 * Récupère toutes les images d'un produit
 * @param {number} productId - ID du produit
 * @returns {Promise<string>} Données XML des images
 */
export const getProductImages = async (productId) => {
  try {
    // Essayer différentes URLs possibles
    const urls = [
      `/images/products/${productId}`,
      `/api/images?filter[id_product]=${productId}`,
      `/api/images/products/${productId}`
    ]
    
    for (const url of urls) {
      try {
        const response = await apiClient.get(url)
        if (response.data && response.data.includes('image')) {
          return response.data
        }
      } catch (err) {
        continue
      }
    }
    
    return null
  } catch (error) {
    console.error('Erreur getProductImages:', error.message)
    return null
  }
}
