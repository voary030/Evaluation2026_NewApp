/**
 * Service de Parsing XML PrestaShop
 * Transforme les données XML en objets JavaScript
 */

export class XMLParserService {
  /**
   * Parse une réponse XML PrestaShop en objet
   * @param {string} xmlString - Données XML
   * @param {string} nodeName - Nom du nœud principal ('product', 'category', etc.)
   * @param {Function} mapper - Fonction de transformation personnalisée
   * @returns {Array} Tableau d'objets parsés
   */
  static parseXML(xmlString, nodeName, mapper = null) {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml')
    
    // Vérifier les erreurs de parsing
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('Erreur de parsing XML')
    }
    
    const nodes = xmlDoc.getElementsByTagName(nodeName)
    const results = []
    
    for (let node of nodes) {
      const data = mapper ? mapper(node) : this.extractNodeData(node)
      results.push(data)
    }
    
    return results
  }

  /**
   * Extrait les données d'un nœud XML
   * @param {Element} node - Nœud XML
   * @returns {Object} Objet avec toutes les données
   */
  static extractNodeData(node) {
    const data = {}
    
    for (let child of node.children) {
      const tag = child.tagName
      const languageNodes = child.getElementsByTagName('language')
      
      if (languageNodes.length > 0) {
        // Pour les champs multilingues, prendre le premier langue
        data[tag] = languageNodes[0]?.textContent || child.textContent
      } else {
        data[tag] = child.textContent
      }
    }
    
    return data
  }

  /**
   * Extrait la première valeur de langage d'un nœud
   * @param {Element} node - Nœud contenant les langues
   * @returns {string} Texte de la première langue
   */
  static getLanguageText(node) {
    if (!node) return ''
    const languageNodes = node.getElementsByTagName('language')
    return languageNodes.length > 0 ? languageNodes[0].textContent : node.textContent
  }
}
