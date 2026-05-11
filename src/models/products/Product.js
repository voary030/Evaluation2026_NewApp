/**
 * Modèle Product - Logique Métier Produit
 * 
 * Contient:
 * - Propriétés calculées (priceFormatted, priceTTC, isActive, etc.)
 * - Méthodes de validation
 * - Méthodes de transformation
 */

export class Product {
  constructor(data = {}) {
    // Données brutes
    this.id = data.id || null
    this.name = data.name || 'Sans nom'
    this.reference = data.reference || '-'
    this.price = parseFloat(data.price) || 0
    this.weight = parseFloat(data.weight) || 0
    this.quantity = parseInt(data.quantity) || 0
    this.active = data.active === 1 ? 1 : 0
    this.category = data.category || '-'
    this.image = data.image || null
    
    // Champs optionnels pour création/modification API
    this.description = data.description || ''
    this.id_manufacturer = data.id_manufacturer || null
    this.id_category_default = data.id_category_default || null
    this.id_supplier = data.id_supplier || null
    this.id_tax_rules_group = data.id_tax_rules_group || null
    this.ean13 = data.ean13 || ''
    this.state = data.state || 1
  }

  /**
   * Prix TTC (Prix HT × 1.20 TVA 20%)
   * @readonly
   */
  get priceTTC() {
    return this.price * 1.2
  }

  /**
   * Prix HT formaté (ex: "12,50 €")
   * @readonly
   */
  get priceFormatted() {
    return `${this.price.toFixed(2).replace('.', ',')} €`
  }

  /**
   * Prix TTC formaté (ex: "15,00 €")
   * @readonly
   */
  get priceTTCFormatted() {
    return `${this.priceTTC.toFixed(2).replace('.', ',')} €`
  }

  /**
   * Si produit est actif
   * @readonly
   */
  get isActive() {
    return this.active === 1
  }

  /**
   * Libellé d'état (Actif/Inactif)
   * @readonly
   */
  get stateLabel() {
    return this.isActive ? 'Actif' : 'Inactif'
  }

  /**
   * Si stock est faible (<= 10)
   * @readonly
   */
  get isLowStock() {
    return this.quantity > 0 && this.quantity <= 10
  }

  /**
   * Si en rupture de stock
   * @readonly
   */
  get isOutOfStock() {
    return this.quantity === 0
  }

  /**
   * Si stock important (> 100)
   * @readonly
   */
  get isHighStock() {
    return this.quantity > 100
  }

  /**
   * Libellé de stock (Rupture, Faible, OK, Important)
   * @readonly
   */
  get stockLabel() {
    if (this.quantity === 0) return 'Rupture'
    if (this.quantity < 5) return 'Très faible'
    if (this.quantity <= 10) return 'Faible'
    if (this.quantity > 100) return 'Important'
    return 'OK'
  }

  /**
   * Poids formaté (ex: "1,5 kg")
   * @readonly
   */
  get weightFormatted() {
    if (!this.weight || this.weight === 0) return '-'
    return `${this.weight.toFixed(2).replace('.', ',')} kg`
  }

  /**
   * Peut être supprimé? (Seulement si en rupture)
   * @readonly
   */
  get canDelete() {
    return this.quantity === 0
  }

  /**
   * Valide les données du produit
   * @returns {Object} {valid: boolean, errors: string[]}
   */
  validate() {
    const errors = []

    if (!this.name || this.name === 'Sans nom') {
      errors.push('Nom du produit requis')
    }

    if (this.price < 0) {
      errors.push('Prix ne peut pas être négatif')
    }

    if (this.quantity < 0) {
      errors.push('Quantité ne peut pas être négative')
    }

    if (this.weight < 0) {
      errors.push('Poids ne peut pas être négatif')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Retourne un clone profond du produit
   * @returns {Product} Copie du produit
   */
  clone() {
    return new Product({ ...this })
  }

  /**
   * Retourne les données pour l'API
   * @returns {Object} Données API
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      reference: this.reference,
      price: this.price,
      weight: this.weight,
      // NOTE: quantity is managed via stock_available endpoint, not product property
      active: this.active,
      category: this.category,
      image: this.image,
      description: this.description,
      id_manufacturer: this.id_manufacturer,
      id_category_default: this.id_category_default,
      id_supplier: this.id_supplier,
      id_tax_rules_group: this.id_tax_rules_group,
      ean13: this.ean13,
      state: this.state
    }
  }

  /**
   * Crée un Product depuis des données brutes
   * @static
   * @param {Object} data - Données brutes
   * @returns {Product} Instance Product
   */
  static fromData(data) {
    return new Product(data)
  }

  /**
   * Crée plusieurs Products
   * @static
   * @param {Array} dataArray - Tableau de données
   * @returns {Array} Tableau de Product
   */
  static fromArray(dataArray) {
    return Array.isArray(dataArray) ? dataArray.map(d => new Product(d)) : []
  }
}
