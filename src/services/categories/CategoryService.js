/**
 * Service de Transformation des Catégories
 * Transforme les données brutes en objets catégorie formatés
 */

import { XMLParserService } from '../XMLParserService'
import { XMLNodeHelper } from '../XMLNodeHelper'
import { XMLBuilderService } from '../XMLBuilderService'
import { Category } from '@/models/categories/Category'

export class CategoryService {
  /**
   * Parse la réponse API catégories
   * @param {string} xmlData - Données XML des catégories
   * @returns {Array} Tableau de catégories formatées
   */
  static parseCategories(xmlData) {
    return XMLParserService.parseXML(xmlData, 'category', (node) => {
      return new Category({
        id: XMLNodeHelper.getText(node, 'id'),
        name: XMLNodeHelper.getLangText(node, 'name', 'Sans nom'),
        description: XMLNodeHelper.getLangText(node, 'description', ''),
        active: XMLNodeHelper.getBoolean(node, 'active') ? 1 : 0
      })
    })
  }

  /**
   * Filtre les catégories selon les critères
   * @param {Array} categories - Tableau de catégories
   * @param {string} query - Terme de recherche
   * @returns {Array} Catégories filtrées
   */
  static filterCategories(categories, query) {
    if (!query.trim()) return categories
    
    const q = query.toLowerCase()
    return categories.filter(category =>
      category.name.toLowerCase().includes(q) ||
      category.id.toString().includes(q)
    )
  }

  /**
   * Génère le XML pour créer/modifier une catégorie
   * @param {Object} category - Données de la catégorie (ou instance Category)
   * @returns {string} XML formaté
   */
  static buildCategoryXml(category) {
    const fieldConfig = {
      name: { multilingual: true },
      description: { multilingual: true }
    }
    return XMLBuilderService.toXml(category, 'category', fieldConfig)
  }
}
