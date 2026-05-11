/**
 * Constants - Couleurs et Énumerations
 * Centralisé pour éviter les redondances
 */

/**
 * Couleurs des badges de stock
 * Logique:
 * - HIGH (>10): Vert (stock important)
 * - LOW (1-10): Orange (stock faible)
 * - EMPTY (0): Rouge (rupture)
 */
export const STOCK_COLORS = {
  HIGH: { bg: '#4caf50', text: 'white' },
  LOW: { bg: '#ff9800', text: 'white' },
  EMPTY: { bg: '#f44336', text: 'white' }
}

/**
 * Couleurs des badges d'état (Actif/Inactif)
 */
export const STATUS_COLORS = {
  ACTIVE: { bg: '#e8f5e9', color: '#2e7d32' },
  INACTIVE: { bg: '#ffebee', color: '#c62828' }
}

/**
 * Couleurs des alertes (Info, Succès, Erreur, Avertissement)
 */
export const ALERT_COLORS = {
  ERROR: { bg: '#ffebee', color: '#c62828' },
  INFO: { bg: '#e3f2fd', color: '#1565c0' },
  SUCCESS: { bg: '#e8f5e9', color: '#2e7d32' },
  WARNING: { bg: '#fff3e0', color: '#e65100' }
}

/**
 * Libellés de stock
 * @param {number} quantity - Quantité en stock
 * @returns {string} Libellé formaté
 */
export function getStockLabel(quantity) {
  if (quantity === 0) return 'Rupture'
  if (quantity < 5) return 'Faible'
  if (quantity > 100) return 'Important'
  return 'OK'
}

/**
 * Retourne la couleur du badge selon la quantité
 * @param {number} quantity - Quantité en stock
 * @returns {Object} {bg, text}
 */
export function getStockBadgeColor(quantity) {
  if (quantity > 10) return STOCK_COLORS.HIGH
  if (quantity > 0) return STOCK_COLORS.LOW
  return STOCK_COLORS.EMPTY
}

/**
 * Retourne la couleur du badge d'état
 * @param {boolean} active - Si l'entité est active
 * @returns {Object} {bg, color}
 */
export function getStatusBadgeColor(active) {
  return active ? STATUS_COLORS.ACTIVE : STATUS_COLORS.INACTIVE
}

/**
 * Retourne la couleur de l'alerte
 * @param {string} type - Type d'alerte (error, info, success, warning)
 * @returns {Object} {bg, color}
 */
export function getAlertColor(type = 'info') {
  return ALERT_COLORS[type.toUpperCase()] || ALERT_COLORS.INFO
}
