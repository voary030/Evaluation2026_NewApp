/**
 * Service de Transformation des Produits
 * Transforme les données brutes en objets produit formatés
 */

import { XMLParserService } from '../XMLParserService'
import { XMLNodeHelper } from '../XMLNodeHelper'
import { XMLBuilderService } from '../XMLBuilderService'
import { Product } from '@/models/products/Product'

export class ProductService {
  /**
   * Parse la réponse API produits
   * @param {string} xmlData - Données XML des produits
   * @param {Object} stocksMap - Map des stocks {idProduct: quantity}
   * @param {Object} categoriesMap - Map des catégories {idCategory: name}
   * @param {Object} imagesMap - Map des images {idProduct: imageUrl}
   * @returns {Array} Tableau de produits formatés
   */
  static parseProducts(xmlData, stocksMap = {}, categoriesMap = {}, imagesMap = {}) {
    return XMLParserService.parseXML(xmlData, 'product', (node) => {
      const id = XMLNodeHelper.getText(node, 'id')
      const priceHT = XMLNodeHelper.getNumber(node, 'price')
      const categoryId = XMLNodeHelper.getText(node, 'id_category_default')

      // Chercher l'image via imagesMap en priorité
      let imageUrl = imagesMap[id] || null

      // Si pas d'image, chercher dans les associations du produit
      if (!imageUrl) {
        const imageIds = XMLNodeHelper.getAssociationIds(node, 'image')
        if (imageIds.length > 0) {
          imageUrl = this.getImageUrl(imageIds[0])
        }
      }

      return new Product({
        id,
        name: XMLNodeHelper.getLangText(node, 'name', 'Sans nom'),
        price: priceHT,
        reference: XMLNodeHelper.getText(node, 'reference', '-'),
        quantity: parseInt(stocksMap[id] || '0'),
        weight: XMLNodeHelper.getNumber(node, 'weight'),
        active: XMLNodeHelper.getBoolean(node, 'active') ? 1 : 0,
        category: XMLNodeHelper.getAssociationName(node, 'id_category_default', categoriesMap, '-'),
        image: imageUrl
      })
    })
  }

  /**
   * Génère le chemin image PrestaShop en fonction de l'ID d'image
   * PrestaShop organise les images dans une hiérarchie de dossiers :
   * - IDs 1-9: /img/p/{id}/{id}-{format}.jpg
   * - IDs 10+: /img/p/{d1}/{d2}/{id}-{format}.jpg
   * où d1 = Math.floor(id/10) % 10 et d2 = id % 10
   * @param {number} imageId - ID de l'image
   * @param {string} format - Format de l'image (par défaut medium_default)
   * @returns {string} Chemin de l'image
   */
  static getImageUrl(imageId, format = 'medium_default') {
    if (!imageId) return null
    const d1 = Math.floor(imageId / 10) % 10
    const d2 = imageId % 10
    const basePath = d1 === 0 ? imageId : `${d1}/${d2}`
    return `/img/p/${basePath}/${imageId}-${format}.jpg`
  }

  /**
   * Calcule le prix TTC en appliquant une TVA de 20%
   * Note: Le calcul réel devrait récupérer le groupe de TVA du produit,
   * mais 20% est un défaut courant en France
   * @param {number} priceHT - Prix HT
   * @returns {number} Prix TTC
   */
  static calculatePriceTTC(priceHT) {
    return priceHT * 1.20 // TVA 20%
  }

  /**
   * Filtre les produits selon les critères
   * @param {Array} products - Tableau de produits
   * @param {string} query - Terme de recherche
   * @returns {Array} Produits filtrés
   */
  static filterProducts(products, query) {
    if (!query.trim()) return products
    
    const q = query.toLowerCase()
    return products.filter(product =>
      product.name.toLowerCase().includes(q) ||
      product.id.toString().includes(q) ||
      product.reference.toLowerCase().includes(q)
    )
  }

  /**
   * Formate le prix pour l'affichage
   * @param {number} price - Prix
   * @returns {string} Prix formaté "12,50 €"
   */
  static formatPrice(price) {
    return parseFloat(price).toFixed(2).replace('.', ',') + ' €'
  }

  /**
   * Génère le XML pour créer/modifier un produit
   * Respecte la structure PrestaShop avec tous les champs requis et optionnels
   * @param {Object} product - Données du produit (ou instance Product)
   * @returns {string} XML formaté
   */
  static buildProductXml(product) {
    const data = typeof product.toJSON === 'function' ? product.toJSON() : product
    const ignored = ['category', 'image', 'quantity', 'categories', 'images']

    const buildLinkRewrite = (value) => {
      if (!value) return ''
      return String(value)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    if (!data.link_rewrite && data.name) {
      data.link_rewrite = buildLinkRewrite(data.name)
    }

    const fieldsXml = Object.entries(data)
      .filter(([key]) => !ignored.includes(key) && data[key] !== null && data[key] !== undefined)
      .map(([key, value]) => {
        if (['name', 'description', 'meta_description', 'meta_keywords', 'meta_title', 'link_rewrite'].includes(key)) {
          return `<${key}><language id="1">${XMLBuilderService.escapeXml(value)}</language></${key}>`
        }
        return `<${key}>${XMLBuilderService.escapeXml(value)}</${key}>`
      })
      .join('\n    ')

    const associationsXml = data.id_category_default
      ? `<associations>
      <categories>
        <category>
          <id>${XMLBuilderService.escapeXml(data.id_category_default)}</id>
        </category>
      </categories>
    </associations>`
      : ''

    const bodyXml = [fieldsXml, associationsXml].filter(Boolean).join('\n    ')

    return `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
  <product>
    ${bodyXml}
  </product>
</prestashop>`
  }

  /**
   * Récupère la couleur de badge pour le stock
   * @param {number} quantity - Quantité
   * @returns {Object} {backgroundColor, color}
   */
  static getStockBadgeColor(quantity) {
    if (quantity > 10) return { bg: '#4caf50', text: 'white' } // Vert
    if (quantity > 0) return { bg: '#ff9800', text: 'white' }  // Orange
    return { bg: '#f44336', text: 'white' }                    // Rouge
  }

  /**
   * Trie les produits selon un critère
   * @param {Array} products - Tableau de produits
   * @param {string} sortBy - 'name' | 'price' | 'quantity'
   * @param {boolean} ascending - Ordre croissant?
   * @returns {Array} Produits triés
   */
  static sortProducts(products, sortBy = 'name', ascending = true) {
    const sorted = [...products]
    sorted.sort((a, b) => {
      const aVal = a[sortBy]
      const bVal = b[sortBy]
      
      if (typeof aVal === 'string') {
        return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      
      return ascending ? aVal - bVal : bVal - aVal
    })
    
    return sorted
  }
}
