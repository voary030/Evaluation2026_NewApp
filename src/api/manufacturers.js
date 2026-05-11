/**
 * API Fabricants
 * Gestion des fabricants PrestaShop
 */

import apiClient from './client'

/**
 * Récupère tous les fabricants
 * @param {string} display - Champs à afficher
 * @returns {Promise<string>} Données XML
 */
export const getManufacturers = async (display = 'full') => {
  try {
    const response = await apiClient.get(`/manufacturers?display=${display}`)
    console.debug('Fabricants chargés via API, nb fabricants:', (response.data.match(/<manufacturer>/g) || []).length)
    return response.data
  } catch (error) {
    console.error('Erreur getManufacturers:', error.message)
    throw new Error(`Impossible de charger les fabricants: ${error.message}`)
  }
}

/**
 * Récupère un fabricant spécifique
 * @param {number} id - ID du fabricant
 * @returns {Promise<string>} Données XML
 */
export const getManufacturer = async (id) => {
  try {
    const response = await apiClient.get(`/manufacturers/${id}?display=full`)
    return response.data
  } catch (error) {
    console.error('Erreur getManufacturer:', error.message)
    throw new Error(`Impossible de charger le fabricant: ${error.message}`)
  }
}

/**
 * Récupère l'image d'un fabricant
 * @param {number} manufacturerId - ID du fabricant
 * @returns {Promise<string>} Données XML de l'image
 */
export const getManufacturerImage = async (manufacturerId) => {
  try {
    const response = await apiClient.get(`/manufacturers/${manufacturerId}/image`)
    return response.data
  } catch (error) {
    console.error('Erreur getManufacturerImage:', error.message)
    return null
  }
}

/**
 * Crée un nouveau fabricant
 * @param {string} manufacturerXml - Données XML du fabricant
 * @returns {Promise<string>} Réponse XML
 */
export const createManufacturer = async (manufacturerXml) => {
  try {
    const response = await apiClient.post('/manufacturers', manufacturerXml)
    return response.data
  } catch (error) {
    console.error('Erreur createManufacturer:', error)
    throw new Error(`Impossible de créer le fabricant: ${error.message}`)
  }
}

/**
 * Met à jour un fabricant existant
 * @param {number} id - ID du fabricant
 * @param {string} manufacturerXml - Données XML du fabricant
 * @returns {Promise<string>} Réponse XML
 */
export const updateManufacturer = async (id, manufacturerXml) => {
  try {
    const response = await apiClient.put(`/manufacturers/${id}`, manufacturerXml)
    return response.data
  } catch (error) {
    console.error('Erreur updateManufacturer:', error)
    throw new Error(`Impossible de mettre à jour le fabricant: ${error.message}`)
  }
}

/**
 * Supprime un fabricant
 * @param {number} id - ID du fabricant
 * @returns {Promise<void>}
 */
export const deleteManufacturer = async (id) => {
  try {
    await apiClient.delete(`/manufacturers/${id}`)
  } catch (error) {
    console.error('Erreur deleteManufacturer:', error)
    throw new Error(`Impossible de supprimer le fabricant: ${error.message}`)
  }
}
