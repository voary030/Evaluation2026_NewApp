/**
 * API Index - Exporte toutes les fonctions API
 * Point d'entrée unique pour tous les appels API
 */

// Client axios partagé
export { default as apiClient } from './client'

// Produits
export {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductSchema,
  getProduct,
  getProductImages
} from './products'

// Catégories
export {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategorySchema
} from './categories'

// Fabricants
export {
  getManufacturers,
  getManufacturer,
  getManufacturerImage,
  createManufacturer,
  updateManufacturer,
  deleteManufacturer
} from './manufacturers'

// Clients
export {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerSchema
} from './customers'

// Stocks
export {
  getStocks,
  getProductStock,
  updateStock
} from './stocks'

// Import
export {
  importSingleProduct,
  importMultipleProducts,
  generateImportReport
} from './import'

// Utilitaires
export { searchEndpoints, getEndpointsList, getEndpointsByCategory } from './apiHelper'
