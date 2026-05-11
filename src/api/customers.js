/**
 * API Clients
 * Gestion complète des clients PrestaShop
 */

import apiClient from './client'

/**
 * Récupère tous les clients
 * @returns {Promise<string>} Données XML
 */
export const getCustomers = async () => {
  try {
    const response = await apiClient.get('/customers?display=[id,firstname,lastname,email]')
    return response.data
  } catch (error) {
    console.error('Erreur getCustomers:', error.message)
    throw new Error(`Impossible de charger les clients: ${error.message}`)
  }
}

/**
 * Crée un nouveau client
 * @param {string} customerXml - Données XML du client
 * @returns {Promise<string>} Réponse XML
 */
export const createCustomer = async (customerXml) => {
  try {
    const response = await apiClient.post('/customers', customerXml)
    return response.data
  } catch (error) {
    console.error('Erreur createCustomer:', error)
    throw new Error(`Impossible de créer le client: ${error.message}`)
  }
}

/**
 * Met à jour un client existant
 * @param {number} id - ID du client
 * @param {string} customerXml - Données XML du client
 * @returns {Promise<string>} Réponse XML
 */
export const updateCustomer = async (id, customerXml) => {
  try {
    const response = await apiClient.put(`/customers/${id}`, customerXml)
    return response.data
  } catch (error) {
    console.error('Erreur updateCustomer:', error)
    throw new Error(`Impossible de mettre à jour le client: ${error.message}`)
  }
}

/**
 * Supprime un client
 * @param {number} id - ID du client
 * @returns {Promise<void>}
 */
export const deleteCustomer = async (id) => {
  try {
    await apiClient.delete(`/customers/${id}`)
  } catch (error) {
    console.error('Erreur deleteCustomer:', error)
    throw new Error(`Impossible de supprimer le client: ${error.message}`)
  }
}

/**
 * Récupère le schéma vierge pour les clients
 * @returns {Promise<string>} Données XML du schéma
 */
export const getCustomerSchema = async () => {
  try {
    const response = await apiClient.get('/customers?schema=blank')
    return response.data
  } catch (error) {
    console.error('Erreur getCustomerSchema:', error)
    throw new Error(`Impossible de charger le schéma client: ${error.message}`)
  }
}
