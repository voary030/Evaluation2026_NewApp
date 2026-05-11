/**
 * Service d'Import des Produits
 * Étape 1: Importer les produits depuis un CSV
 * 
 * Utilise ProductService.buildProductXml() pour générer le XML correct
 * (même méthode que la création manuelle qui fonctionne)
 * 
 * CSV attendu avec colonnes:
 * - date_availability_produit
 * - nom
 * - reference
 * - prix_ttc
 * - Taxe
 * - categorie
 * - prix_achat
 */

import apiClient from '@/api/client'
import { ProductService } from '../products/ProductService'
import { Product } from '@/models/products/Product'

export class ProductImportService {
  /**
   * Lance l'import d'un CSV de produits
   * @param {Array} csvRows - Données du CSV parsées
   * @param {Function} onProgress - Callback de progression (current, total, message)
   * @returns {Promise<Object>} { success: number, failed: number, errors: Array }
   */
  static async importProducts(csvRows, onProgress = null) {
    const results = {
      success: 0,
      failed: 0,
      errors: [],
      categories: new Map(),
      products: new Map() // Cache des produits existants
    }

    const total = csvRows.length

    // ÉTAPE 0: Charger les catégories et produits existants UNE SEULE FOIS
    console.log('📂 Chargement des catégories existantes...')
    await this.loadExistingCategories(results.categories)
    
    console.log('📦 Chargement des produits existants...')
    await this.loadExistingProducts(results.products)

    for (let i = 0; i < total; i++) {
      try {
        const row = csvRows[i]
        
        // Valider la ligne
        if (!row.nom || !row.reference) {
          throw new Error('Nom ou référence manquants')
        }

        // Notifier progression
        if (onProgress) {
          onProgress(i + 1, total, `Traitement: ${row.reference}`)
        }

        // Vérifier si le produit existe déjà
        if (results.products.has(row.reference)) {
          console.log(`⏭️  Produit existant ignoré: ${row.reference}`)
          results.success++ // Compter comme succès (déjà présent)
          continue
        }

        // Étape 1: Gérer la catégorie
        const categoryId = await this.getOrCreateCategory(
          row.categorie || 'Uncategorized',
          results.categories
        )

        console.log(`📊 Ligne ${i + 1}: categoryId = ${categoryId}`)

        // Valider l'ID de catégorie
        if (!categoryId || isNaN(categoryId) || categoryId <= 0) {
          throw new Error(`Catégorie invalide: ID=${categoryId}`)
        }

        // Étape 2: Calculer le prix HT
        const priceTTC = parseFloat(row.prix_ttc || 0)
        const taxRate = parseFloat(row.Taxe || 20) // Défaut 20%
        const priceHT = this.calculatePriceHT(priceTTC, taxRate)

        // Étape 3: Créer le produit
        const productId = await this.createProduct({
          name: row.nom,
          reference: row.reference,
          price: priceHT,
          wholesale_price: parseFloat(row.prix_achat || 0),
          id_category_default: categoryId,
          date_add: row.date_availability_produit || new Date().toISOString().split('T')[0],
          active: 1
        })

        // Ajouter au cache
        results.products.set(row.reference, productId)
        results.success++

      } catch (error) {
        results.failed++
        results.errors.push({
          row: i + 1,
          reference: csvRows[i]?.reference,
          message: error.message
        })
        console.error(`❌ Erreur ligne ${i + 1}:`, error)
      }
    }

    return results
  }

  /**
   * Charge toutes les catégories existantes dans un cache
   * @param {Map} cache - Cache à remplir
   */
  static async loadExistingCategories(cache) {
    try {
      const response = await apiClient.get('/categories?display=[id,name]')
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(response.data, 'text/xml')
      
      const categories = xmlDoc.querySelectorAll('category')
      console.log(`✅ ${categories.length} catégories chargées`)
      
      categories.forEach(catNode => {
        const id = parseInt(catNode.querySelector('id')?.textContent || '0')
        const nameNode = catNode.querySelector('name > language')
        const name = nameNode?.textContent || ''
        
        if (id > 0 && name) {
          cache.set(name, id)
          console.log(`  - ${name} → ID ${id}`)
        }
      })
    } catch (error) {
      console.warn(`⚠️ Erreur chargement catégories:`, error.message)
    }
  }

  /**
   * Charge tous les produits existants (par référence)
   * @param {Map} cache - Cache à remplir {reference: id}
   */
  static async loadExistingProducts(cache) {
    try {
      const response = await apiClient.get('/products?display=[id,reference]')
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(response.data, 'text/xml')
      
      const products = xmlDoc.querySelectorAll('product')
      console.log(`✅ ${products.length} produits existants chargés`)
      
      products.forEach(prodNode => {
        const id = parseInt(prodNode.querySelector('id')?.textContent || '0')
        const ref = prodNode.querySelector('reference')?.textContent || ''
        
        if (id > 0 && ref) {
          cache.set(ref, id)
        }
      })
    } catch (error) {
      console.warn(`⚠️ Erreur chargement produits existants:`, error.message)
    }
  }

  /**
   * Récupère ou crée une catégorie
   * @param {string} categoryName - Nom de la catégorie
   * @param {Map} cache - Cache des catégories
   * @returns {Promise<number>} ID de la catégorie
   */
  static async getOrCreateCategory(categoryName, cache) {
    // Vérifier le cache d'abord
    if (cache.has(categoryName)) {
      const id = cache.get(categoryName)
      console.log(`📂 Catégorie trouvée: ${categoryName} (ID: ${id})`)
      return id
    }

    console.log(`📂 Catégorie non trouvée: ${categoryName}. Création...`)

    try {
      const newCategoryId = await this.createCategory(categoryName)
      cache.set(categoryName, newCategoryId)
      return newCategoryId
    } catch (error) {
      console.error(`❌ Erreur création catégorie "${categoryName}":`, error.message)
      throw error
    }
  }

  /**
   * Crée une nouvelle catégorie
   * @param {string} name - Nom de la catégorie
   * @param {number} parentId - ID de la catégorie parente (défaut: 2 pour "Home")
   * @returns {Promise<number>} ID de la catégorie créée
   */
  static async createCategory(name, parentId = 2) {
    console.log(`📂 Création catégorie: ${name} (parent: ${parentId})`)
    
    const categoryXml = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
  <category>
    <id><![CDATA[]]></id>
    <id_parent>${parentId}</id_parent>
    <name>
      <language id="1"><![CDATA[${this.escapeXml(name)}]]></language>
    </name>
    <link_rewrite>
      <language id="1"><![CDATA[${this.slugify(name)}]]></language>
    </link_rewrite>
    <description>
      <language id="1"><![CDATA[]]></language>
    </description>
    <active>1</active>
    <is_shop_default>1</is_shop_default>
  </category>
</prestashop>`

    try {
      const response = await apiClient.post('/categories', categoryXml)
      console.log('📡 Réponse création catégorie:', response.data.substring(0, 300))
      
      const newId = this.extractIdFromResponse(response.data)
      
      if (!newId || newId <= 0) {
        throw new Error(`ID catégorie invalide retourné: ${newId}`)
      }

      console.log(`✅ Catégorie créée avec ID: ${newId}`)
      return newId

    } catch (error) {
      console.error(`❌ Erreur création catégorie "${name}":`, error.message)
      console.error('📡 Réponse complète:', error.response?.data)
      throw error
    }
  }

  /**
   * Crée un produit
   * @param {Object} productData - Données du produit
   * @returns {Promise<number>} ID du produit créé
   */
  static async createProduct(productData) {
    // Validation: id_category_default doit être un nombre valide
    const categoryId = parseInt(productData.id_category_default)
    if (isNaN(categoryId) || categoryId <= 0) {
      throw new Error(`ID catégorie invalide: ${productData.id_category_default}`)
    }

    console.log(`📦 Création produit: ${productData.reference} (catégorie: ${categoryId})`)

    try {
      // CRÉER UNE INSTANCE PRODUCT (exactement comme Create.vue)
      const product = new Product({
        id: null,
        name: productData.name,
        reference: productData.reference,
        price: productData.price,
        wholesale_price: productData.wholesale_price || 0,
        weight: productData.weight || 0,
        quantity: 0, // Stock géré séparément
        active: productData.active || 1,
        description: '',
        id_manufacturer: null,
        id_category_default: categoryId,
        date_add: this.formatDate(productData.date_add)
      })

      // VALIDER LE PRODUIT
      if (!product.validate()) {
        const errors = product.getErrors()
        throw new Error(`Produit invalide: ${errors.join(', ')}`)
      }

      // GÉNÉRER LE XML avec ProductService.buildProductXml()
      const productXml = ProductService.buildProductXml(product)
      console.log(`📤 XML généré (${productXml.length} chars)`)

      // CRÉER VIA API
      const response = await apiClient.post('/products', productXml)
      console.log('📡 Réponse création produit:', response.data.substring(0, 300))

      // EXTRAIRE L'ID
      const productId = this.extractIdFromResponse(response.data)

      if (!productId || productId <= 0) {
        throw new Error(`ID produit invalide retourné: ${productId}`)
      }

      console.log(`✅ Produit créé avec ID: ${productId} (ref: ${productData.reference})`)
      return productId

    } catch (error) {
      console.error(`❌ Erreur création produit "${productData.reference}":`, error.message)
      console.error('📡 Réponse erreur:', error.response?.data)
      throw error
    }
  }

  /**
   * Calcule le prix HT à partir du prix TTC
   * @param {number} priceTTC - Prix TTC
   * @param {number} taxRate - Taux de TVA (ex: 20 pour 20%)
   * @returns {number} Prix HT
   */
  static calculatePriceHT(priceTTC, taxRate) {
    if (taxRate === 0) return priceTTC
    const coeff = 1 + (taxRate / 100)
    return Math.round((priceTTC / coeff) * 100) / 100 // Arrondir à 2 décimales
  }

  /**
   * Convertit un titre en slug (pour link_rewrite)
   * @param {string} text - Texte à convertir
   * @returns {string} Slug
   */
  static slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[\s_-]+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+|-+$/g, '')
      .substring(0, 128)
  }

  /**
   * Extrait l'ID depuis une réponse XML PrestaShop
   * @param {string} xmlData - Réponse XML
   * @returns {number} ID extrait (0 si non trouvé)
   */
  static extractIdFromResponse(xmlData) {
    if (!xmlData) return 0
    
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlData, 'text/xml')
    
    // Chercher le nœud ID à différentes profondeurs
    let idNode = xmlDoc.querySelector('id')
    
    if (idNode && idNode.textContent) {
      const id = parseInt(idNode.textContent.trim())
      return isNaN(id) ? 0 : id
    }
    
    // Si pas trouvé, parser l'XML manuellement (plus robuste)
    const match = xmlData.match(/<id[^>]*>(\d+)<\/id>/i)
    return match ? parseInt(match[1]) : 0
  }

  /**
   * Échappe les caractères XML
   * @param {string} text - Texte à échapper
   * @returns {string} Texte échappé
   */
  static escapeXml(text) {
    if (!text) return ''
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  /**
   * Formate une date en AAAA-MM-JJ
   * @param {string} dateStr - Date en string
   * @returns {string} Date formatée
   */
  static formatDate(dateStr) {
    if (!dateStr) {
      return new Date().toISOString().split('T')[0]
    }
    try {
      const date = new Date(dateStr)
      if (isNaN(date)) {
        return new Date().toISOString().split('T')[0]
      }
      return date.toISOString().split('T')[0]
    } catch {
      return new Date().toISOString().split('T')[0]
    }
  }
}
