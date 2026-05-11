/**
 * Validators - Utilitaires de validation
 */

/**
 * Valide une adresse email
 * @param {string} email - Email à valider
 * @returns {boolean} True si valide
 */
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Valide un prix
 * @param {number|string} price - Prix à valider
 * @returns {boolean} True si valide
 */
export function validatePrice(price) {
  const num = parseFloat(price)
  return !isNaN(num) && num >= 0
}

/**
 * Valide une quantité
 * @param {number|string} quantity - Quantité à valider
 * @returns {boolean} True si valide
 */
export function validateQuantity(quantity) {
  const num = parseInt(quantity)
  return !isNaN(num) && num > 0 && Number.isInteger(num)
}

/**
 * Valide un SKU/référence
 * @param {string} sku - SKU à valider
 * @returns {boolean} True si valide
 */
export function validateSKU(sku) {
  if (!sku) return false
  return sku.length >= 2 && sku.length <= 32
}

/**
 * Valide un nom de produit
 * @param {string} name - Nom à valider
 * @returns {boolean} True si valide
 */
export function validateProductName(name) {
  if (!name) return false
  return name.trim().length >= 2 && name.trim().length <= 255
}

/**
 * Valide une URL
 * @param {string} url - URL à valider
 * @returns {boolean} True si valide
 */
export function validateURL(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Valide un numéro de téléphone simple
 * @param {string} phone - Téléphone à valider
 * @returns {boolean} True si valide
 */
export function validatePhone(phone) {
  const regex = /^[\d\s\-\+\(\)]{10,}$/
  return regex.test(phone)
}

/**
 * Valide un fichier selon son type
 * @param {File} file - Fichier à valider
 * @param {array} allowedTypes - Types MIME autorisés
 * @param {number} maxSize - Taille maximale en bytes
 * @returns {object} {valid: boolean, error: string}
 */
export function validateFile(file, allowedTypes = [], maxSize = 5 * 1024 * 1024) {
  if (!file) {
    return { valid: false, error: 'Aucun fichier sélectionné' }
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { valid: false, error: `Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}` }
  }

  if (file.size > maxSize) {
    return { valid: false, error: `Fichier trop volumineux. Taille maximale: ${(maxSize / 1024 / 1024).toFixed(2)} MB` }
  }

  return { valid: true, error: '' }
}

/**
 * Valide un formulaire d'objet
 * @param {object} data - Données du formulaire
 * @param {object} rules - Règles de validation
 * @returns {object} {valid: boolean, errors: {fieldName: [errors]}}
 */
export function validateForm(data, rules) {
  const errors = {}
  let isValid = true

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field]
    const fieldErrors = []

    for (const rule of fieldRules) {
      const error = rule(value, field)
      if (error) {
        fieldErrors.push(error)
        isValid = false
      }
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors
    }
  }

  return { valid: isValid, errors }
}

/**
 * Générateurs de règles de validation
 */
export const validators = {
  required: (field = 'Ce champ') => (value) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${field} est requis`
    }
    return null
  },

  minLength: (min, field = 'Ce champ') => (value) => {
    if (value && value.length < min) {
      return `${field} doit contenir au moins ${min} caractères`
    }
    return null
  },

  maxLength: (max, field = 'Ce champ') => (value) => {
    if (value && value.length > max) {
      return `${field} ne doit pas dépasser ${max} caractères`
    }
    return null
  },

  email: () => (value) => {
    if (value && !validateEmail(value)) {
      return 'Email invalide'
    }
    return null
  },

  price: () => (value) => {
    if (value && !validatePrice(value)) {
      return 'Prix invalide'
    }
    return null
  },

  quantity: () => (value) => {
    if (value && !validateQuantity(value)) {
      return 'Quantité invalide'
    }
    return null
  },

  sku: () => (value) => {
    if (value && !validateSKU(value)) {
      return 'SKU invalide (2-32 caractères)'
    }
    return null
  },

  url: () => (value) => {
    if (value && !validateURL(value)) {
      return 'URL invalide'
    }
    return null
  }
}
