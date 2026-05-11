/**
 * Service de Transformation des Fabricants
 * Transforme les données brutes en objets fabricant formatés
 */

import { XMLParserService } from '../XMLParserService'
import { XMLNodeHelper } from '../XMLNodeHelper'
import { XMLBuilderService } from '../XMLBuilderService'
import { Manufacturer } from '@/models/manufacturers/Manufacturer'

export class ManufacturerService {
  /**
   * Parse la réponse API fabricants
   * @param {string} xmlData - Données XML des fabricants
   * @returns {Array} Tableau de fabricants formatés
   */
  static parseManufacturers(xmlData) {
    return XMLParserService.parseXML(xmlData, 'manufacturer', (node) => {
      return new Manufacturer({
        id: XMLNodeHelper.getText(node, 'id'),
        name: XMLNodeHelper.getLangText(node, 'name', 'Sans nom'),
        description: XMLNodeHelper.getLangText(node, 'description', ''),
        shortDescription: XMLNodeHelper.getLangText(node, 'short_description', ''),
        active: XMLNodeHelper.getBoolean(node, 'active') ? 1 : 0,
        dateAdd: XMLNodeHelper.getText(node, 'date_add', ''),
        dateUpd: XMLNodeHelper.getText(node, 'date_upd', '')
      })
    })
  }

  /**
   * Génère le chemin image du fabricant
   * @param {number} manufacturerId - ID du fabricant
   * @param {string} format - Format de l'image (par défaut medium_default)
   * @returns {string} Chemin de l'image
   */
  static getManufacturerImageUrl(manufacturerId, format = 'medium_default') {
    if (!manufacturerId) return null
    // PrestaShop fabrique les images dans /img/m/ directement avec l'ID
    return `/img/m/${manufacturerId}-${format}.jpg`
  }

  /**
   * Filtre les fabricants selon les critères
   * @param {Array} manufacturers - Tableau de fabricants
   * @param {string} query - Terme de recherche
   * @returns {Array} Fabricants filtrés
   */
  static filterManufacturers(manufacturers, query) {
    if (!query.trim()) return manufacturers

    const q = query.toLowerCase()
    return manufacturers.filter((manufacturer) =>
      manufacturer.name.toLowerCase().includes(q) || manufacturer.id.toString().includes(q)
    )
  }

  /**
   * Génère le XML pour créer/modifier un fabricant
   * @param {Object} manufacturer - Données du fabricant (ou instance Manufacturer)
   * @returns {string} XML formaté
   */
  static buildManufacturerXml(manufacturer) {
    const fieldConfig = {
      name: { multilingual: false }, // name n'est pas multilingue pour manufacturer
      description: { multilingual: true },
      short_description: { multilingual: true }
    }
    return XMLBuilderService.toXml(manufacturer, 'manufacturer', fieldConfig)
  }
}
