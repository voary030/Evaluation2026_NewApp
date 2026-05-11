/**
 * Validateur de schéma produit PrestaShop
 */

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationWarning {
  field: string;
  message: string;
}

export class ProductValidator {
  /**
   * Liste des champs obligatoires
   */
  private static readonly REQUIRED_FIELDS = [
    'price'
  ];

  /**
   * Liste des champs fortement recommandés
   */
  private static readonly RECOMMENDED_FIELDS = [
    'id_category_default',
    'name',
    'active'
  ];

  /**
   * Formats de validation
   */
  private static readonly FORMAT_PATTERNS: Record<string, RegExp> = {
    isUnsignedId: /^\d+$/,
    isPrice: /^\d+(\.\d{1,2})?$/,
    isReference: /^[a-zA-Z0-9\-_]+$/,
    isEan13: /^\d{13}$/,
    isIsbn: /^[\d\-]+$/,
    isUpc: /^\d{12}$/,
    isMpn: /^[a-zA-Z0-9\-]+$/,
    isLinkRewrite: /^[a-z0-9\-]+$/i
  };

  /**
   * Enums de validation
   */
  private static readonly ENUMS: Record<string, string[]> = {
    visibility: ['both', 'catalog', 'search', 'none'],
    condition: ['new', 'used', 'refurbished']
  };

  /**
   * Valide un objet produit
   */
  static validate(product: Record<string, any>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Vérifier les champs obligatoires
    for (const field of this.REQUIRED_FIELDS) {
      if (!(field in product) || product[field] === null || product[field] === undefined || product[field] === '') {
        errors.push({
          field,
          message: `Le champ "${field}" est obligatoire`,
          value: product[field]
        });
      }
    }

    // Vérifier les champs recommandés
    for (const field of this.RECOMMENDED_FIELDS) {
      if (!(field in product) || product[field] === null || product[field] === undefined || product[field] === '') {
        warnings.push({
          field,
          message: `Le champ "${field}" est fortement recommandé`
        });
      }
    }

    // Valider le prix si présent
    if (product.price !== undefined) {
      this.validatePrice(product.price, errors);
    }

    // Valider les références si présentes
    if (product.reference !== undefined) {
      this.validateReference(product.reference, 'reference', 64, errors);
    }
    if (product.supplier_reference !== undefined) {
      this.validateReference(product.supplier_reference, 'supplier_reference', 64, errors);
    }

    // Valider les codes si présents
    if (product.ean13 !== undefined) {
      this.validateEan13(product.ean13, errors);
    }
    if (product.isbn !== undefined) {
      this.validateIsbn(product.isbn, errors);
    }
    if (product.upc !== undefined) {
      this.validateUpc(product.upc, errors);
    }

    // Valider les dimensions si présentes
    if (product.width !== undefined) {
      this.validateUnsignedFloat(product.width, 'width', errors);
    }
    if (product.height !== undefined) {
      this.validateUnsignedFloat(product.height, 'height', errors);
    }
    if (product.depth !== undefined) {
      this.validateUnsignedFloat(product.depth, 'depth', errors);
    }
    if (product.weight !== undefined) {
      this.validateUnsignedFloat(product.weight, 'weight', errors);
    }

    // Valider la visibilité si présente
    if (product.visibility !== undefined) {
      this.validateEnum(product.visibility, 'visibility', this.ENUMS.visibility, errors);
    }

    // Valider la condition si présente
    if (product.condition !== undefined && typeof product.condition === 'string') {
      this.validateEnum(product.condition, 'condition', this.ENUMS.condition, errors);
    }

    // Valider les longueurs maximales
    this.validateMaxSizes(product, errors);

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Valide le prix
   */
  private static validatePrice(price: any, errors: ValidationError[]): void {
    if (typeof price !== 'number' && typeof price !== 'string') {
      errors.push({
        field: 'price',
        message: 'Le prix doit être un nombre',
        value: price
      });
      return;
    }

    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice) || numPrice < 0) {
      errors.push({
        field: 'price',
        message: 'Le prix doit être un nombre positif',
        value: price
      });
    }
  }

  /**
   * Valide une référence
   */
  private static validateReference(value: any, fieldName: string, maxSize: number, errors: ValidationError[]): void {
    if (typeof value !== 'string') {
      errors.push({
        field: fieldName,
        message: `${fieldName} doit être une chaîne de caractères`,
        value
      });
      return;
    }

    if (value.length > maxSize) {
      errors.push({
        field: fieldName,
        message: `${fieldName} ne doit pas dépasser ${maxSize} caractères`,
        value
      });
    }
  }

  /**
   * Valide un EAN13
   */
  private static validateEan13(value: any, errors: ValidationError[]): void {
    const strValue = String(value);
    if (!/^\d{13}$/.test(strValue)) {
      errors.push({
        field: 'ean13',
        message: 'EAN13 doit contenir exactement 13 chiffres',
        value
      });
    }
  }

  /**
   * Valide un ISBN
   */
  private static validateIsbn(value: any, errors: ValidationError[]): void {
    const strValue = String(value);
    if (!/^[\d\-]{10,}$/.test(strValue)) {
      errors.push({
        field: 'isbn',
        message: 'ISBN invalide',
        value
      });
    }
  }

  /**
   * Valide un UPC
   */
  private static validateUpc(value: any, errors: ValidationError[]): void {
    const strValue = String(value);
    if (!/^\d{12}$/.test(strValue)) {
      errors.push({
        field: 'upc',
        message: 'UPC doit contenir exactement 12 chiffres',
        value
      });
    }
  }

  /**
   * Valide un nombre décimal positif
   */
  private static validateUnsignedFloat(value: any, fieldName: string, errors: ValidationError[]): void {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num) || num < 0) {
      errors.push({
        field: fieldName,
        message: `${fieldName} doit être un nombre positif`,
        value
      });
    }
  }

  /**
   * Valide une énumération
   */
  private static validateEnum(value: any, fieldName: string, allowedValues: string[], errors: ValidationError[]): void {
    if (!allowedValues.includes(String(value))) {
      errors.push({
        field: fieldName,
        message: `${fieldName} doit être l'une des valeurs suivantes: ${allowedValues.join(', ')}`,
        value
      });
    }
  }

  /**
   * Valide les longueurs maximales
   */
  private static validateMaxSizes(product: Record<string, any>, errors: ValidationError[]): void {
    const maxSizes: Record<string, number> = {
      reference: 64,
      supplier_reference: 64,
      ean13: 13,
      isbn: 32,
      upc: 12,
      mpn: 40,
      location: 255,
      unity: 255,
      meta_title: 255,
      meta_description: 512,
      meta_keywords: 255,
      link_rewrite: 128,
      redirect_type: 255
    };

    for (const [field, maxSize] of Object.entries(maxSizes)) {
      if (field in product && product[field] !== null && product[field] !== undefined) {
        const value = String(product[field]);
        if (value.length > maxSize) {
          errors.push({
            field,
            message: `${field} ne doit pas dépasser ${maxSize} caractères (actuellement: ${value.length})`,
            value: product[field]
          });
        }
      }
    }
  }

  /**
   * Obtient les champs requis
   */
  static getRequiredFields(): string[] {
    return [...this.REQUIRED_FIELDS];
  }

  /**
   * Obtient les champs recommandés
   */
  static getRecommendedFields(): string[] {
    return [...this.RECOMMENDED_FIELDS];
  }

  /**
   * Vérifie si un champ est requis
   */
  static isFieldRequired(fieldName: string): boolean {
    return this.REQUIRED_FIELDS.includes(fieldName);
  }

  /**
   * Vérifie si un champ est recommandé
   */
  static isFieldRecommended(fieldName: string): boolean {
    return this.RECOMMENDED_FIELDS.includes(fieldName);
  }

  /**
   * Crée un produit vide avec les champs par défaut
   */
  static createEmptyProduct(): Record<string, any> {
    return {
      price: 0,
      active: true,
      visibility: 'both',
      available_for_order: true,
      show_price: true,
      show_condition: false,
      indexed: true,
      on_sale: false,
      online_only: false,
      quantity_discount: false,
      low_stock_alert: false,
      is_virtual: false,
      advanced_stock_management: false,
      associations: {
        categories: [],
        images: [],
        combinations: [],
        product_option_values: [],
        product_features: [],
        tags: [],
        stock_availables: [],
        attachments: [],
        accessories: [],
        product_bundle: []
      }
    };
  }
}

/**
 * Validateur de schéma multilangue
 */
export class MultiLanguageValidator {
  /**
   * Valide un objet multilangue
   */
  static validate(
    value: Record<number, string> | Record<string, string>,
    fieldName: string,
    maxSize?: number
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (typeof value !== 'object' || value === null) {
      errors.push({
        field: fieldName,
        message: `${fieldName} doit être un objet multilangue`,
        value
      });
      return errors;
    }

    const entries = Object.entries(value);
    if (entries.length === 0) {
      errors.push({
        field: fieldName,
        message: `${fieldName} doit avoir au moins une langue`,
        value
      });
      return errors;
    }

    for (const [langId, text] of entries) {
      if (typeof text !== 'string') {
        errors.push({
          field: `${fieldName}[${langId}]`,
          message: `La valeur pour la langue ${langId} doit être une chaîne de caractères`,
          value: text
        });
        continue;
      }

      if (text.trim().length === 0) {
        errors.push({
          field: `${fieldName}[${langId}]`,
          message: `La valeur pour la langue ${langId} ne doit pas être vide`,
          value: text
        });
      }

      if (maxSize && text.length > maxSize) {
        errors.push({
          field: `${fieldName}[${langId}]`,
          message: `La valeur pour la langue ${langId} ne doit pas dépasser ${maxSize} caractères`,
          value: text
        });
      }
    }

    return errors;
  }
}

export default ProductValidator;
