<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>📦 NewApp</h2>
    </div>
    <nav class="sidebar-nav">
      <ul>
        <li>
          <router-link to="/" exact-active-class="active">
            🏠 Accueil
          </router-link>
        </li>
        <li class="backoffice-link">
          <router-link :to="isAuthenticated ? '/backoffice' : '/backoffice/login'" exact-active-class="active">
            🔐 Backoffice
          </router-link>
        </li>

        <!-- Pages du backoffice (visibles uniquement si authentifié) -->
        <template v-if="isAuthenticated">
          <li class="nav-divider"></li>
          <li>
            <router-link to="/backoffice/produits" exact-active-class="active">
              📦 Produits
            </router-link>
          </li>
          <li>
            <router-link to="/backoffice/categories" exact-active-class="active">
              📁 Catégories
            </router-link>
          </li>
          <li>
            <router-link to="/backoffice/import" exact-active-class="active">
              📥 Importer
            </router-link>
          </li>
          <li>
            <router-link to="/backoffice/reset" exact-active-class="active" class="danger">
              🔄 Réinitialiser
            </router-link>
          </li>
          <li>
            <router-link to="/backoffice/api-explorer" exact-active-class="active">
              🔍 API Explorer
            </router-link>
          </li>
        </template>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { AuthService } from '@/services/AuthService'
import { computed } from 'vue'

const isAuthenticated = computed(() => AuthService.isAuthenticated())
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  padding: 20px;
  background-color: #1a252f;
  text-align: center;
  border-bottom: 1px solid #34495e;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #ecf0f1;
}

.sidebar-nav {
  padding: 20px 0;
  flex-grow: 1;
}

.sidebar-nav ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: 5px;
}

.sidebar-nav a {
  display: block;
  padding: 12px 20px;
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.sidebar-nav a:hover {
  background-color: #34495e;
  color: white;
  padding-left: 25px;
}

.sidebar-nav a.active {
  background-color: #3498db;
  color: white;
  border-left: 4px solid #2980b9;
}

.sidebar-nav a.danger:hover {
  background-color: #e74c3c;
}

.sidebar-nav a.danger.active {
  background-color: #c0392b;
  border-left: 4px solid #a53125;
}

.backoffice-link a {
  background-color: #e74c3c !important;
  color: white !important;
  border-top: 2px solid #c0392b;
  border-bottom: 2px solid #c0392b;
  margin-bottom: 10px;
  font-weight: 600;
}

.backoffice-link a:hover {
  background-color: #c0392b !important;
}

.nav-divider {
  height: 1px;
  background-color: #34495e;
  margin: 10px 0;
}
</style>
