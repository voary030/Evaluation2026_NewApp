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
        <li>
          <router-link to="/produits" exact-active-class="active">
            🛍️ Produits
          </router-link>
        </li>
        <li>
          <router-link to="/categories" exact-active-class="active">
            📁 Catégories
          </router-link>
        </li>
        <li>
          <router-link to="/import" exact-active-class="active">
            ⬇️ Importer
          </router-link>
        </li>
        <li>
          <router-link to="/api-explorer" exact-active-class="active">
            🔍 API Explorer
          </router-link>
        </li>
        <li>
          <router-link to="/reset" exact-active-class="active" class="danger">
            ⚠️ Réinitialiser
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
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
</style>
