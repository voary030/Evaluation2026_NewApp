/**
 * API Endpoints Helper
 * Facilite l'accès aux endpoints PrestaShop disponibles
 */

import apiEndpoints from '@/assets/api-endpoints.json'

// Récupère tous les endpoints par catégorie
export const getAllEndpoints = () => {
  const endpoints = {}
  Object.entries(apiEndpoints.api.categories).forEach(([category, data]) => {
    endpoints[category] = data.endpoints
  })
  return endpoints
}

// Récupère une liste plate de tous les endpoints
export const getEndpointsList = () => {
  const list = []
  Object.entries(apiEndpoints.api.categories).forEach(([categoryKey, category]) => {
    Object.entries(category.endpoints).forEach(([name, endpoint]) => {
      list.push({
        name,
        description: endpoint.description,
        methods: endpoint.methods,
        category: category.title,
        categoryKey,
        url: `${apiEndpoints.api.baseUrl}/${name}`
      })
    })
  })
  return list
}

// Recherche d'endpoints
export const searchEndpoints = (query) => {
  const list = getEndpointsList()
  const q = query.toLowerCase()
  return list.filter(endpoint =>
    endpoint.name.toLowerCase().includes(q) ||
    endpoint.description.toLowerCase().includes(q)
  )
}

// Récupère les endpoints d'une catégorie spécifique
export const getEndpointsByCategory = (categoryKey) => {
  if (apiEndpoints.api.categories[categoryKey]) {
    return apiEndpoints.api.categories[categoryKey].endpoints
  }
  return {}
}
