/**
 * Service de Construction XML - Générique
 * Élimine la duplication de buildXml dans ProductService, CategoryService, ManufacturerService
 * 
 * Pattern:
 * - toXml(entity, entityName, fieldConfig) → Génère XML pour toute entité
 * - _buildFields() → Construit les champs XML
 * - escapeXml() → Échappe caractères spéciaux
 */

export class XMLBuilderService {
  /**
   * Construit le XML pour une entité
   * 
   * @param {Object} entity - L'entité (instance Product, Category, etc. ou objet)
   * @param {string} entityName - Nom de l'entité XML (product, category, manufacturer)
   * @param {Object} fieldConfig - Config des champs {fieldName: {multilingual: true/false}}
   * @param {number} languageId - ID de la langue (défaut 1)
   * @returns {string} XML formaté
   * 
   * @example
   * const product = { id: 1, name: 'Laptop', price: 100 }
   * const fieldConfig = { name: { multilingual: true } }
   * const xml = XMLBuilderService.toXml(product, 'product', fieldConfig)
   */
  static toXml(entity, entityName, fieldConfig = {}, languageId = 1) {
    // Récupérer les données (si c'est une instance avec toJSON(), sinon utiliser l'objet)
    const data = typeof entity.toJSON === 'function' ? entity.toJSON() : entity

    // Construire les champs XML
    const fieldsXml = this._buildFields(data, fieldConfig, languageId)

    // Retourner le XML complet
    return `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
  <${entityName}>
    ${fieldsXml}
  </${entityName}>
</prestashop>`
  }

  /**
   * Construit les champs XML
   * 
   * @private
   * @param {Object} data - Données de l'entité
   * @param {Object} fieldConfig - Configuration des champs
   * @param {number} languageId - ID de la langue
   * @returns {string} Champs XML formatés
   */
  static _buildFields(data, fieldConfig, languageId) {
    return Object.entries(data)
      .map(([key, value]) => {
        // Skip null/undefined
        if (value === null || value === undefined) return ''

        // Si c'est un champ multilingue (name, description, etc.)
        if (fieldConfig[key]?.multilingual) {
          return `<${key}><language id="${languageId}">${this.escapeXml(value)}</language></${key}>`
        }

        // Sinon, c'est un champ simple (id, price, active, etc.)
        return `<${key}>${this.escapeXml(value)}</${key}>`
      })
      .filter(Boolean) // Enlever les chaînes vides
      .join('\n    ')
  }

  /**
   * Échappe les caractères spéciaux XML
   * 
   * @private
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
   * Builder fluide pour XML avec syntaxe élégante
   * 
   * @example
   * XMLBuilderService
   *   .builder('product')
   *   .add('name', 'Laptop', {multilingual: true})
   *   .add('price', 100)
   *   .add('active', 1)
   *   .build()
   */
  static builder(entityName, languageId = 1) {
    return new XMLBuilder(entityName, languageId)
  }
}

/**
 * Classe XMLBuilder - Interface fluide pour construction XML
 * @private
 */
class XMLBuilder {
  constructor(entityName, languageId = 1) {
    this.entityName = entityName
    this.languageId = languageId
    this.fields = []
  }

  /**
   * Ajoute un champ au XML
   * 
   * @param {string} key - Clé du champ
   * @param {any} value - Valeur du champ
   * @param {Object} config - Config {multilingual: true/false}
   * @returns {XMLBuilder} Pour chaînage fluide
   */
  add(key, value, config = {}) {
    if (value !== null && value !== undefined) {
      if (config.multilingual) {
        this.fields.push(
          `<${key}><language id="${this.languageId}">${XMLBuilderService.escapeXml(value)}</language></${key}>`
        )
      } else {
        this.fields.push(`<${key}>${XMLBuilderService.escapeXml(value)}</${key}>`)
      }
    }
    return this
  }

  /**
   * Construit le XML final
   * @returns {string} XML formaté
   */
  build() {
    const fieldsXml = this.fields.join('\n    ')
    return `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
  <${this.entityName}>
    ${fieldsXml}
  </${this.entityName}>
</prestashop>`
  }
}
