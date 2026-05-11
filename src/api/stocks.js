/**
 * API Stocks
 * Gestion des stocks et disponibilités
 */

import apiClient from './client'
import { StockService } from '@/services'

/**
 * Récupère tous les stocks disponibles
 * @returns {Promise<string>} Données XML
 */
export const getStocks = async () => {
  try {
    const response = await apiClient.get('/stock_availables?display=[id,id_product,id_product_attribute,id_shop,id_shop_group,quantity,depends_on_stock,out_of_stock]')
    return response.data
  } catch (error) {
    console.error('Erreur getStocks:', error.message)
    throw new Error(`Impossible de charger les stocks: ${error.message}`)
  }
}

/**
 * Récupère le stock d'un produit spécifique
 * @param {number} productId - ID du produit
 * @returns {Promise<string>} Données XML avec données complètes
 */
export const getProductStock = async (productId) => {
  try {
    console.log(`[API.stocks.getProductStock] Récupération du stock pour le produit ${productId}`)
    
    // IMPORTANT: Filtrer par id_product pour avoir JUSTE ce produit
    const response = await apiClient.get(`/stock_availables?filter[id_product]=${productId}&display=[id,id_product,id_product_attribute,id_shop,id_shop_group,quantity,depends_on_stock,out_of_stock]`)
    
    console.log(`[API.stocks.getProductStock] Réponse brute (${response.data.length} chars):`, response.data.substring(0, 500))
    
    return response.data
  } catch (error) {
    console.error(`[API.stocks.getProductStock] Erreur:`, error.message)
    throw new Error(`Impossible de charger le stock du produit: ${error.message}`)
  }
}

/**
 * Récupère une entrée stock COMPLÈTE par son ID
 * @param {number} stockId - ID du stock_available
 * @returns {Promise<string>} Données XML complètes pour ce stock
 */
export const getStockById = async (stockId) => {
  try {
    console.log(`[API.stocks.getStockById] Récupération de l'entrée stock ${stockId}`)
    
    // GET directement par ID pour avoir les données complètes
    const response = await apiClient.get(`/stock_availables/${stockId}`)
    
    console.log(`[API.stocks.getStockById] Réponse reçue:`, response.data.substring(0, 300))
    
    return response.data
  } catch (error) {
    console.error(`[API.stocks.getStockById] Erreur:`, error.message)
    throw new Error(`Impossible de charger le stock ${stockId}: ${error.message}`)
  }
}

/**
 * Met à jour la quantité en stock avec TOUS les champs requis
 * @param {Object} stockEntry - Entrée stock complète avec tous les champs
 * @param {number} newQuantity - Nouvelle quantité
 * @returns {Promise<string>} Réponse XML
 */
export const updateStock = async (stockEntry, newQuantity) => {
  try {
    console.log(`[API.stocks.updateStock] Mise à jour du stock: id=${stockEntry.id}, quantity=${newQuantity}`)
    
    // Générer le XML avec TOUS les champs
    const stockXml = StockService.buildStockXml(stockEntry, newQuantity)
    
    console.log('[API.stocks.updateStock] XML envoyé:', stockXml)
    
    const response = await apiClient.put(`/stock_availables/${stockEntry.id}`, stockXml)
    
    console.log('[API.stocks.updateStock] Réponse reçue:', response.data.substring(0, 300))
    
    return response.data
  } catch (error) {
    console.error('[API.stocks.updateStock] Erreur:', error.message)
    throw new Error(`Impossible de mettre à jour le stock: ${error.message}`)
  }
}
