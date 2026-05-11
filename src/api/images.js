/**
 * API Images Produits
 * Gestion des uploads et récupération des images produits
 */

import apiClient from './client'

/**
 * Upload une image pour un produit
 * @param {number} productId - ID du produit
 * @param {File} imageFile - Fichier image à uploader
 * @returns {Promise<string>} Réponse XML avec ID de l'image créée
 */
export const uploadProductImage = async (productId, imageFile) => {
  try {
    console.log(`[API.images.uploadProductImage] Début upload pour produit ${productId}`)
    
    // Valider le fichier
    if (!imageFile) {
      throw new Error('Aucun fichier sélectionné')
    }
    
    // Formats acceptés
    const acceptedFormats = ['jpg', 'jpeg', 'png', 'gif']
    const fileExtension = imageFile.name.split('.').pop().toLowerCase()
    
    if (!acceptedFormats.includes(fileExtension)) {
      throw new Error(`Format non accepté. Acceptés: ${acceptedFormats.join(', ')}`)
    }
    
    // Validation de la taille (max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024 // 5MB
    if (imageFile.size > maxSizeBytes) {
      throw new Error('Fichier trop volumineux (max 5MB)')
    }
    
    // Créer FormData pour le multipart
    const formData = new FormData()
    formData.append('image', imageFile)
    
    console.log(`[API.images.uploadProductImage] Fichier: ${imageFile.name}, taille: ${imageFile.size} bytes`)
    
    // POST avec Content-Type: multipart/form-data
    // Important: ne pas spécifier Content-Type, axios/browser le fera automatiquement
    const response = await apiClient.post(
      `/images/products/${productId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    
    console.log('[API.images.uploadProductImage] Réponse reçue:', response.data.substring(0, 300))
    
    return response.data
  } catch (error) {
    console.error('[API.images.uploadProductImage] Erreur:', error.message)
    throw new Error(`Impossible d'uploader l'image: ${error.message}`)
  }
}

/**
 * Récupère les images d'un produit
 * @param {number} productId - ID du produit
 * @returns {Promise<string>} Données XML des images
 */
export const getProductImages = async (productId) => {
  try {
    console.log(`[API.images.getProductImages] Récupération des images pour produit ${productId}`)
    
    const response = await apiClient.get(`/images/products/${productId}?display=[id,id_product,cover,position]`)
    
    console.log('[API.images.getProductImages] Réponse reçue:', response.data.substring(0, 300))
    
    return response.data
  } catch (error) {
    console.error('[API.images.getProductImages] Erreur:', error.message)
    throw new Error(`Impossible de charger les images: ${error.message}`)
  }
}

/**
 * Supprime une image produit
 * @param {number} productId - ID du produit
 * @param {number} imageId - ID de l'image à supprimer
 * @returns {Promise<void>}
 */
export const deleteProductImage = async (productId, imageId) => {
  try {
    console.log(`[API.images.deleteProductImage] Suppression image ${imageId} du produit ${productId}`)
    
    await apiClient.delete(`/images/products/${productId}/${imageId}`)
    
    console.log('[API.images.deleteProductImage] Image supprimée')
  } catch (error) {
    console.error('[API.images.deleteProductImage] Erreur:', error.message)
    throw new Error(`Impossible de supprimer l'image: ${error.message}`)
  }
}

/**
 * Définit une image comme image de couverture
 * @param {number} productId - ID du produit
 * @param {number} imageId - ID de l'image
 * @returns {Promise<string>} Réponse XML
 */
export const setCoverImage = async (productId, imageId) => {
  try {
    console.log(`[API.images.setCoverImage] Définir image ${imageId} comme couverture pour produit ${productId}`)
    
    const imageXml = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop>
  <image>
    <id>${imageId}</id>
    <id_product>${productId}</id_product>
    <cover>1</cover>
  </image>
</prestashop>`
    
    const response = await apiClient.put(`/images/products/${productId}/${imageId}`, imageXml)
    
    console.log('[API.images.setCoverImage] Réponse reçue:', response.data.substring(0, 300))
    
    return response.data
  } catch (error) {
    console.error('[API.images.setCoverImage] Erreur:', error.message)
    throw new Error(`Impossible de définir l'image de couverture: ${error.message}`)
  }
}
