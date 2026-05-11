<template>
  <div class="frontoffice-layout">
    <header class="frontoffice-header">
      <div class="header-content">
        <router-link to="/" class="logo">
          📦 NewApp
        </router-link>
        <nav class="header-nav">
          <router-link to="/" class="nav-link">Accueil</router-link>
          <router-link to="/backoffice/login" class="btn-login">
            🔐 Administration
          </router-link>
        </nav>
      </div>
    </header>
    <main class="frontoffice-main">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Footer from './Footer.vue'
</script>

<style scoped>
.frontoffice-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.frontoffice-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 30px;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo:hover {
  color: #667eea;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #667eea;
}

.btn-login {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-login:hover {
  background-color: #5568d3;
}

.frontoffice-main {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 40px 30px;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 15px;
    height: 60px;
  }

  .header-nav {
    gap: 15px;
  }

  .btn-login {
    padding: 6px 12px;
    font-size: 12px;
  }

  .frontoffice-main {
    padding: 20px 15px;
  }
}
</style>
