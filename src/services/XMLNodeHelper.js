/**
 * XML Node Helper
 * Utilitaires pour extraire les données des nœuds XML PrestaShop
 * 
 * Élimine la duplication de code entre les services
 * (ProductService, CategoryService, ManufacturerService, etc.)
 */

import { XMLParserService } from './XMLParserService'

export class XMLNodeHelper {
  /**
   * Extrait le texte d'une balise XML
   * @param {Element} node - Nœud parent
   * @param {string} tag - Nom de la balise
   * @param {string} defaultValue - Valeur par défaut si absent
   * @returns {string} Texte extrait
   */
  static getText(node, tag, defaultValue = '') {
    return node.getElementsByTagName(tag)[0]?.textContent || defaultValue
  }

  /**
   * Extrait le texte multilingue d'une balise XML (première langue)
   * @param {Element} node - Nœud parent
   * @param {string} tag - Nom de la balise
   * @param {string} defaultValue - Valeur par défaut si absent
   * @returns {string} Texte extrait
   */
  static getLangText(node, tag, defaultValue = '') {
    const tagNode = node.getElementsByTagName(tag)[0]
    if (!tagNode) return defaultValue
    const text = XMLParserService.getLanguageText(tagNode)
    return text || defaultValue
  }

  /**
   * Extrait les IDs des éléments associés (catégories, images, etc.)
   * depuis la section <associations>
   * @param {Element} node - Nœud produit/catégorie
   * @param {string} tagName - Nom de l'association (category, image, etc.)
   * @returns {Array<string>} Liste des IDs
   */
  static getAssociationIds(node, tagName) {
    const associations = node.getElementsByTagName('associations')
    if (associations.length === 0) return []
    
    const items = associations[0].getElementsByTagName(tagName)
    return Array.from(items)
      .map((item) => item.getElementsByTagName('id')[0]?.textContent)
      .filter(Boolean)
  }

  /**
   * Extrait un seul ID d'association
   * @param {Element} node - Nœud parent
   * @param {string} tagName - Nom de l'association
   * @param {number} index - Index de l'élément (défaut: 0)
   * @returns {string|null} ID ou null
   */
  static getAssociationId(node, tagName, index = 0) {
    const ids = this.getAssociationIds(node, tagName)
    return ids[index] || null
  }

  /**
   * Extrait un nombre (prix, poids, etc.)
   * @param {Element} node - Nœud parent
   * @param {string} tag - Nom de la balise
   * @param {number} defaultValue - Valeur par défaut si absent
   * @returns {number} Nombre extrait
   */
  static getNumber(node, tag, defaultValue = 0) {
    const value = this.getText(node, tag, defaultValue.toString())
    return parseFloat(value) || defaultValue
  }

  /**
   * Extrait un entier (ID, quantité, etc.)
   * @param {Element} node - Nœud parent
   * @param {string} tag - Nom de la balise
   * @param {number} defaultValue - Valeur par défaut si absent
   * @returns {number} Entier extrait
   */
  static getInt(node, tag, defaultValue = 0) {
    const value = this.getText(node, tag, defaultValue.toString())
    return parseInt(value) || defaultValue
  }

  /**
   * Extrait un booléen (active, etc.)
   * @param {Element} node - Nœud parent
   * @param {string} tag - Nom de la balise
   * @returns {boolean} Booléen extrait (true si '1', false sinon)
   */
  static getBoolean(node, tag) {
    return this.getText(node, tag) === '1'
  }

  /**
   * Extrait et mappe une liste d'IDs vers leurs noms (via une map)
   * Utile pour convertir IDs en noms (catégories, fabricants, etc.)
   * @param {Element} node - Nœud parent
   * @param {string} tagName - Nom de l'association
   * @param {Object} idNameMap - Map {id: name}
   * @returns {Array<string>} Liste des noms
   */
  static getAssociationNames(node, tagName, idNameMap = {}) {
    return this.getAssociationIds(node, tagName)
      .map((id) => idNameMap[id])
      .filter(Boolean)
  }

  /**
   * Extrait le nom d'une association unique (par map)
   * @param {Element} node - Nœud parent
   * @param {string} tag - Nom de la balise de l'ID
   * @param {Object} idNameMap - Map {id: name}
   * @param {string} defaultValue - Valeur par défaut
   * @returns {string} Nom extrait
   */
  static getAssociationName(node, tag, idNameMap = {}, defaultValue = '-') {
    const id = this.getText(node, tag)
    return id && idNameMap[id] ? idNameMap[id] : defaultValue
  }

  /**
   * Extrait un ID d'image et génère l'URL via ProductService
   * @param {Element} node - Nœud parent
   * @param {Function} getImageUrlFn - Fonction pour générer URL (ProductService.getImageUrl)
   * @param {string} format - Format d'image (medium_default, large_default, etc.)
   * @returns {string|null} URL de l'image ou null
   */
  static getImageUrl(node, getImageUrlFn, format = 'medium_default') {
    const imageIds = this.getAssociationIds(node, 'image')
    if (imageIds.length === 0) return null
    
    const imageId = imageIds[0]
    return imageId ? getImageUrlFn(imageId, format) : null
  }

  /**
   * Extrait une liste d'URLs d'images
   * @param {Element} node - Nœud parent
   * @param {Function} getImageUrlFn - Fonction pour générer URL
   * @param {string} format - Format d'image
   * @returns {Array<string>} Liste des URLs
   */
  static getImageUrls(node, getImageUrlFn, format = 'medium_default') {
    return this.getAssociationIds(node, 'image')
      .map((imageId) => getImageUrlFn(imageId, format))
      .filter(Boolean)
  }
}
