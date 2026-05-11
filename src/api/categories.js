/**
 * API Catégories
 * Gestion des catégories PrestaShop
 */

import apiClient from './client'

/**
 * Récupère toutes les catégories
 * @param {string} display - Champs à afficher
 * @returns {Promise<string>} Données XML
 */
export const getCategories = async (display = 'full') => {
  try {
    const response = await apiClient.get(`/categories?display=${display}`)
    console.debug('Catégories chargées via API, nb catégories:', (response.data.match(/<category>/g) || []).length)
    return response.data
  } catch (error) {
    console.error('Erreur getCategories:', error.message)
    throw new Error(`Impossible de charger les catégories: ${error.message}`)
  }
}

/**
 * Récupère une catégorie spécifique
 * @param {number} id - ID de la catégorie
 * @returns {Promise<string>} Données XML
 */
export const getCategory = async (id) => {
  try {
    const response = await apiClient.get(`/categories/${id}?display=full`)
    return response.data
  } catch (error) {
    console.error('Erreur getCategory:', error.message)
    throw new Error(`Impossible de charger la catégorie: ${error.message}`)
  }
}

/**
 * Crée une nouvelle catégorie
 * @param {string} categoryXml - Données XML de la catégorie
 * @returns {Promise<string>} Réponse XML
 */
export const createCategory = async (categoryXml) => {
  try {
    const response = await apiClient.post('/categories', categoryXml)
    return response.data
  } catch (error) {
    console.error('Erreur createCategory:', error)
    throw new Error(`Impossible de créer la catégorie: ${error.message}`)
  }
}

/**
 * Met à jour une catégorie existante
 * @param {number} id - ID de la catégorie
 * @param {string} categoryXml - Données XML de la catégorie
 * @returns {Promise<string>} Réponse XML
 */
export const updateCategory = async (id, categoryXml) => {
  try {
    const response = await apiClient.put(`/categories/${id}`, categoryXml)
    return response.data
  } catch (error) {
    console.error('Erreur updateCategory:', error)
    throw new Error(`Impossible de mettre à jour la catégorie: ${error.message}`)
  }
}

/**
 * Supprime une catégorie
 * @param {number} id - ID de la catégorie
 * @returns {Promise<void>}
 */
export const deleteCategory = async (id) => {
  try {
    await apiClient.delete(`/categories/${id}`)
  } catch (error) {
    console.error('Erreur deleteCategory:', error)
    throw new Error(`Impossible de supprimer la catégorie: ${error.message}`)
  }
}
