/**
 * Service de Transformation des Stocks
 * Transforme les données brutes de stocks en données formatées
 */

import { XMLParserService } from './XMLParserService'

export class StockService {
  /**
   * Parse la réponse API stocks
   * @param {string} xmlData - Données XML des stocks
   * @returns {Object} Map {idProduct: quantity}
   */
  static parseStocks(xmlData) {
    const stockMap = {}
    
    console.log('[StockService.parseStocks] XML reçu:', xmlData.substring(0, 300))
    
    XMLParserService.parseXML(xmlData, 'stock_available', (node) => {
      const idProduct = node.getElementsByTagName('id_product')[0]?.textContent
      const quantity = node.getElementsByTagName('quantity')[0]?.textContent || '0'
      
      console.log(`[StockService.parseStocks] Stock trouvé: id_product=${idProduct}, quantity=${quantity}`)
      
      if (idProduct) {
        stockMap[idProduct] = quantity
      }
      
      return { idProduct, quantity }
    })
    
    console.log('[StockService.parseStocks] Map finales:', stockMap)
    return stockMap
  }

  /**
   * Parse les stocks avec leurs IDs (utile pour update)
   * @param {string} xmlData - Donnees XML des stocks
   * @returns {Array} Liste d'entrees stock {id, id_product, quantity, ...}
   */
  static parseStockEntries(xmlData) {
    console.log('[StockService] parseStockEntries: debut parsing XML')
    try {
      const entries = XMLParserService.parseXML(xmlData, 'stock_available', (node) => {
        const getText = (tag) => node.getElementsByTagName(tag)[0]?.textContent || ''
        const entry = {
          id: getText('id'),
          id_product: getText('id_product'),
          id_product_attribute: getText('id_product_attribute') || '0',
          id_shop: getText('id_shop') || '1', // Défaut: shop 1
          id_shop_group: getText('id_shop_group') || '1', // Défaut: shop_group 1
          depends_on_stock: getText('depends_on_stock') || '0', // Défaut: ne dépend pas du stock
          out_of_stock: getText('out_of_stock') || '2', // Défaut: 2
          quantity: getText('quantity') || '0'
        }
        console.log('[StockService] Entry parsée:', entry)
        return entry
      })
      console.log(`[StockService] Total ${entries.length} stock(s) parsé(s)`)
      return entries
    } catch (err) {
      console.error('[StockService] Erreur lors du parsing des stocks:', err)
      return []
    }
  }

  /**
   * Génère le XML pour mettre à jour le stock
   * IMPORTANT: Doit inclure TOUS les champs requis par PrestaShop WebService
   * @param {Object} stockEntry - Entrée stock complète {id, id_product, id_product_attribute, id_shop, depends_on_stock, out_of_stock, quantity}
   * @param {number} newQuantity - Nouvelle quantité (optionnel, sinon utilise la quantité existante)
   * @returns {string} XML formaté avec TOUS les champs
   */
  static buildStockXml(stockEntry, newQuantity = null) {
    // Si newQuantity n'est pas fourni, utiliser la quantité existante
    const quantity = newQuantity !== null ? newQuantity : stockEntry.quantity
    
    console.log('[StockService.buildStockXml] Génération XML pour stock:', {
      id: stockEntry.id,
      id_product: stockEntry.id_product,
      id_product_attribute: stockEntry.id_product_attribute,
      id_shop: stockEntry.id_shop,
      quantity
    })
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
  <stock_available>
    <id>${stockEntry.id}</id>
    <id_product>${stockEntry.id_product}</id_product>
    <id_product_attribute>${stockEntry.id_product_attribute}</id_product_attribute>
    <id_shop>${stockEntry.id_shop}</id_shop>
    <id_shop_group>${stockEntry.id_shop_group || 0}</id_shop_group>
    <quantity>${quantity}</quantity>
    <depends_on_stock>${stockEntry.depends_on_stock}</depends_on_stock>
    <out_of_stock>${stockEntry.out_of_stock}</out_of_stock>
  </stock_available>
</prestashop>`
  }

  /**
   * Vérifie si le stock est bas
   * @param {number} quantity - Quantité
   * @param {number} threshold - Seuil (défaut: 5)
   * @returns {boolean}
   */
  static isLowStock(quantity, threshold = 5) {
    return quantity < threshold
  }

  /**
   * Formate la quantité pour l'affichage
   * @param {number} quantity - Quantité
   * @returns {string} Quantité formatée
   */
  static formatQuantity(quantity) {
    const q = parseInt(quantity)
    if (q === 0) return '0 (Rupture)'
    if (q < 5) return `${q} (Faible)`
    if (q > 100) return `${q} (Stock important)`
    return `${q}`
  }
}
