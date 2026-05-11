/**
 * Formatters - Utilitaires de formatage
 */

/**
 * Formate une taille de fichier en unité lisible
 * @param {number} bytes - Taille en bytes
 * @returns {string} Taille formatée
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Formate un prix avec devise
 * @param {number} price - Prix à formater
 * @param {string} currency - Code devise (EUR, USD, etc.)
 * @returns {string} Prix formaté
 */
export function formatPrice(price, currency = 'EUR') {
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency
  })
  return formatter.format(parseFloat(price))
}

/**
 * Formate une date au format localisé
 * @param {string|Date} date - Date à formater
 * @param {boolean} includeTime - Inclure l'heure
 * @returns {string} Date formatée
 */
export function formatDate(date, includeTime = false) {
  const dateObj = new Date(date)
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  return dateObj.toLocaleDateString('fr-FR', options)
}

/**
 * Coupe un texte à une longueur donnée avec ellipse
 * @param {string} text - Texte à découper
 * @param {number} maxLength - Longueur maximale
 * @returns {string} Texte découpé
 */
export function truncate(text, maxLength = 50) {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

/**
 * Echappe les caractères spéciaux XML
 * @param {string} str - Chaîne à échapper
 * @returns {string} Chaîne échappée
 */
export function escapeXml(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Désechappe les caractères spéciaux XML
 * @param {string} str - Chaîne échappée
 * @returns {string} Chaîne désechappée
 */
export function unescapeXml(str) {
  if (!str) return ''
  return str
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
}

/**
 * Capitalise la première lettre
 * @param {string} str - Chaîne à capitaliser
 * @returns {string} Chaîne capitalisée
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convertit un texte en slug
 * @param {string} text - Texte à convertir
 * @returns {string} Slug généré
 */
export function toSlug(text) {
  if (!text) return ''
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
