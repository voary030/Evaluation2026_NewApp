/**
 * Service d'Import de Fichiers
 * Parse et transforme les fichiers CSV, JSON, XML
 */

export class FileImporterService {
  /**
   * Parse un fichier CSV
   * Support automatique de différents séparateurs: , ; \t
   * @param {string} csvContent - Contenu CSV
   * @returns {Array} Tableau d'objets
   */
  static parseCSV(csvContent) {
    const lines = csvContent.trim().split('\n')
    if (lines.length === 0) throw new Error('Fichier CSV vide')

    // Auto-détecter le séparateur (,  ; ou \t)
    const firstLine = lines[0]
    let separator = ','
    
    if (firstLine.includes(';')) {
      separator = ';'
    } else if (firstLine.includes('\t')) {
      separator = '\t'
    }

    // Première ligne = headers
    const headers = firstLine.split(separator).map(h => h.trim())
    const rows = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue // Ignorer les lignes vides
      
      const values = line.split(separator).map(v => v.trim())
      const row = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ''
      })
      rows.push(row)
    }

    return rows
  }

  /**
   * Parse un fichier JSON
   * @param {string} jsonContent - Contenu JSON
   * @returns {Array} Tableau d'objets
   */
  static parseJSON(jsonContent) {
    try {
      const data = JSON.parse(jsonContent)
      if (Array.isArray(data)) return data
      if (typeof data === 'object') return [data]
      throw new Error('JSON invalide: doit être un objet ou un tableau')
    } catch (err) {
      throw new Error(`Erreur parsing JSON: ${err.message}`)
    }
  }

  /**
   * Parse un fichier XML
   * @param {string} xmlContent - Contenu XML
   * @param {string} itemNodeName - Nom du nœud item ('product', 'category', etc.)
   * @returns {Array} Tableau d'objets
   */
  static parseXML(xmlContent, itemNodeName = 'product') {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml')

    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('XML invalide')
    }

    const items = []
    const itemNodes = xmlDoc.getElementsByTagName(itemNodeName)

    for (let node of itemNodes) {
      const item = {}
      for (let child of node.children) {
        item[child.tagName] = child.textContent
      }
      items.push(item)
    }

    return items
  }

  /**
   * Détecte et parse le type de fichier
   * @param {File} file - Fichier à parser
   * @returns {Promise<Array>} Données parsées
   */
  static async parseFile(file) {
    const ext = file.name.split('.').pop().toLowerCase()
    const content = await file.text()

    switch (ext) {
      case 'csv':
        return this.parseCSV(content)
      case 'json':
        return this.parseJSON(content)
      case 'xml':
        return this.parseXML(content)
      default:
        throw new Error(`Format non supporté: .${ext}`)
    }
  }

  /**
   * Génère un XML PrestaShop pour un produit
   * Note: quantity est gérée séparément via ps_stock_available
   * Inclut l'assignement à la catégorie par défaut
   * @param {Object} product - Données produit
   * @returns {string} XML formaté
   */
  static buildProductXml(product) {
    const name = this.escapeXml(product.name || '')
    const price = parseFloat(product.price || 0)
    const reference = this.escapeXml(product.reference || '')
    const description = this.escapeXml(product.description || '')

    return `  <product>
    <name>
      <language id="1">${name}</language>
    </name>
    <price>${price}</price>
    <reference>${reference}</reference>
    <description>
      <language id="1">${description}</language>
    </description>
    <active>1</active>
    <show_price>1</show_price>
    <available_for_order>1</available_for_order>
    <indexed>1</indexed>
    <associations>
      <categories>
        <category>
          <id>2</id>
        </category>
      </categories>
    </associations>
  </product>`
  }

  /**
   * Extrait la quantité d'un produit (pour mise à jour stock séparée)
   * @param {Object} product - Données produit
   * @returns {number} Quantité
   */
  static getProductQuantity(product) {
    return parseInt(product.quantity || 0)
  }

  /**
   * Génère un XML PrestaShop complet pour importer des produits
   * @param {Array} products - Tableau de produits
   * @returns {string} XML complet
   */
  static buildProductsXml(products) {
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error('Aucun produit à importer')
    }

    const productXmls = products.map(p => this.buildProductXml(p)).join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
${productXmls}
</prestashop>`
  }

  /**
   * Échappe les caractères XML
   * @param {string} str - Chaîne à échapper
   * @returns {string} Chaîne échappée
   */
  static escapeXml(str) {
    if (!str) return ''
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  /**
   * Valide les colonnes requises pour les produits
   * @param {Array} data - Données
   * @param {Array} requiredColumns - Colonnes requises
   * @returns {Object} {isValid: boolean, errors: []}
   */
  static validateProductData(data, requiredColumns = ['name', 'price']) {
    const errors = []

    if (!Array.isArray(data) || data.length === 0) {
      errors.push('Aucune donnée à valider')
      return { isValid: false, errors }
    }

    // Vérifier les colonnes requises
    const firstRow = data[0]
    const missingColumns = requiredColumns.filter(col => !(col in firstRow))
    if (missingColumns.length > 0) {
      errors.push(`Colonnes manquantes: ${missingColumns.join(', ')}`)
    }

    // Vérifier les prix valides
    data.forEach((row, index) => {
      if (row.price && isNaN(parseFloat(row.price))) {
        errors.push(`Ligne ${index + 2}: prix invalide "${row.price}"`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Obtient les colonnes détectées
   * @param {Array} data - Données parsées
   * @returns {Array} Liste des colonnes
   */
  static getColumns(data) {
    if (!Array.isArray(data) || data.length === 0) return []
    return Object.keys(data[0])
  }

  /**
   * Mappe les colonnes du fichier aux colonnes PrestaShop
   * @param {Array} data - Données parsées
   * @param {Object} mapping - Map {fileColumn: prestashopField}
   * @returns {Array} Données remappées
   */
  static mapColumns(data, mapping) {
    return data.map(row => {
      const mapped = {}
      Object.entries(mapping).forEach(([fileCol, psField]) => {
        if (fileCol in row) {
          mapped[psField] = row[fileCol]
        }
      })
      return mapped
    })
  }
}
