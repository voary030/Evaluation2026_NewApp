import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ProduitsIndex from '../views/Produits/Index.vue'
import ProduitsDetails from '../views/Produits/Details.vue'
import ProduitsCreate from '../views/Produits/Create.vue'
import CategoriesIndex from '../views/Categories/Index.vue'
import FileImporter from '../views/FileImporter.vue'
import DataReset from '../views/DataReset.vue'
import ApiExplorer from '../views/ApiExplorer.vue'
import BackofficeLogin from '../views/Backoffice/Login.vue'
import BackofficeDashboard from '../views/Backoffice/Dashboard.vue'
import { AuthService } from '../services/AuthService'

const routes = [
  // Routes publiques
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: 'Accueil', requiresAuth: false }
  },

  // Routes du backoffice (pages protégées)
  {
    path: '/backoffice/login',
    name: 'backoffice-login',
    component: BackofficeLogin,
    meta: { title: 'Connexion', requiresAuth: false, layout: 'minimal' }
  },
  {
    path: '/backoffice',
    name: 'backoffice-dashboard',
    component: BackofficeDashboard,
    meta: { title: 'Tableau de bord', requiresAuth: true }
  },
  {
    path: '/backoffice/produits',
    name: 'backoffice-produits',
    component: ProduitsIndex,
    meta: { title: 'Produits', requiresAuth: true }
  },
  {
    path: '/backoffice/produits/create',
    name: 'backoffice-produit-create',
    component: ProduitsCreate,
    meta: { title: 'Créer un produit', requiresAuth: true }
  },
  {
    path: '/backoffice/produits/:id/edit',
    name: 'backoffice-produit-edit',
    component: ProduitsCreate,
    meta: { title: 'Modifier un produit', requiresAuth: true }
  },
  {
    path: '/backoffice/produits/:id',
    name: 'backoffice-produit-details',
    component: ProduitsDetails,
    meta: { title: 'Produit', requiresAuth: true }
  },
  {
    path: '/backoffice/categories',
    name: 'backoffice-categories',
    component: CategoriesIndex,
    meta: { title: 'Catégories', requiresAuth: true }
  },
  {
    path: '/backoffice/import',
    name: 'backoffice-import',
    component: FileImporter,
    meta: { title: 'Importer', requiresAuth: true }
  },
  {
    path: '/backoffice/reset',
    name: 'backoffice-reset',
    component: DataReset,
    meta: { title: 'Réinitialiser', requiresAuth: true }
  },
  {
    path: '/backoffice/api-explorer',
    name: 'backoffice-api-explorer',
    component: ApiExplorer,
    meta: { title: 'Explorateur API', requiresAuth: true }
  },

  // Redirect pour les routes invalides
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Guard de protection des routes - Authentification
router.beforeEach((to, from, next) => {
  // Vérifier si la route nécessite une authentification
  const requiresAuth = to.meta.requiresAuth
  const isAuthenticated = AuthService.isAuthenticated()

  if (requiresAuth && !isAuthenticated) {
    // Rediriger vers la page de login si non authentifié
    next({ name: 'backoffice-login' })
  } else if (to.name === 'backoffice-login' && isAuthenticated) {
    // Si l'utilisateur est déjà connecté et essaie d'accéder à login, le rediriger au dashboard
    next({ name: 'backoffice-dashboard' })
  } else {
    next()
  }
})

// Mise à jour du titre de la page
router.afterEach((to) => {
  document.title = `${to.meta.title} | NewApp` || 'NewApp'
})

export default router