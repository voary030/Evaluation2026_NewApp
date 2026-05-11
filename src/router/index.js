import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ProduitsIndex from '../views/Produits/Index.vue'
import ProduitsDetails from '../views/Produits/Details.vue'
import ProduitsCreate from '../views/Produits/Create.vue'
import CategoriesIndex from '../views/Categories/Index.vue'
import FileImporter from '../views/FileImporter.vue'
import DataReset from '../views/DataReset.vue'
import ApiExplorer from '../views/ApiExplorer.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: 'Accueil' }
  },
  {
    path: '/produits',
    name: 'produits',
    component: ProduitsIndex,
    meta: { title: 'Produits' }
  },
  {
    path: '/produits/create',
    name: 'produit-create',
    component: ProduitsCreate,
    meta: { title: 'Créer un produit' }
  },
  {
    path: '/produits/:id/edit',
    name: 'produit-edit',
    component: ProduitsCreate,
    meta: { title: 'Modifier un produit' }
  },
  {
    path: '/produits/:id',
    name: 'produit-details',
    component: ProduitsDetails,
    meta: { title: 'Produit' }
  },
  {
    path: '/categories',
    name: 'categories',
    component: CategoriesIndex,
    meta: { title: 'Catégories' }
  },
  {
    path: '/import',
    name: 'import',
    component: FileImporter,
    meta: { title: 'Importer' }
  },
  {
    path: '/reset',
    name: 'reset',
    component: DataReset,
    meta: { title: 'Réinitialiser' }
  },
  {
    path: '/api-explorer',
    name: 'api-explorer',
    component: ApiExplorer,
    meta: { title: 'Explorateur API' }
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

// Mise à jour du titre de la page
router.afterEach((to) => {
  document.title = `${to.meta.title} | NewApp` || 'NewApp'
})

export default router