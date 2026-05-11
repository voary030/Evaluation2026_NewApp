/**
 * Routes du Backoffice
 * Centralisé les noms des routes protégées
 */

export const BACKOFFICE_ROUTES = {
  LOGIN: 'backoffice-login',
  DASHBOARD: 'backoffice-dashboard',
  PRODUITS: 'backoffice-produits',
  PRODUITS_CREATE: 'backoffice-produit-create',
  PRODUITS_EDIT: 'backoffice-produit-edit',
  PRODUITS_DETAILS: 'backoffice-produit-details',
  CATEGORIES: 'backoffice-categories',
  IMPORT: 'backoffice-import',
  RESET: 'backoffice-reset',
  API_EXPLORER: 'backoffice-api-explorer'
}

export const BACKOFFICE_PATHS = {
  LOGIN: '/backoffice/login',
  DASHBOARD: '/backoffice',
  PRODUITS: '/backoffice/produits',
  PRODUITS_CREATE: '/backoffice/produits/create',
  PRODUITS_EDIT: (id) => `/backoffice/produits/${id}/edit`,
  PRODUITS_DETAILS: (id) => `/backoffice/produits/${id}`,
  CATEGORIES: '/backoffice/categories',
  IMPORT: '/backoffice/import',
  RESET: '/backoffice/reset',
  API_EXPLORER: '/backoffice/api-explorer'
}
