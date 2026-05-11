<template>
  <div class="dashboard-container">
    <h1 class="page-title">Tableau de bord administrateur</h1>
    <p class="page-description">Bienvenue {{ user.fullName }}! Sélectionnez un module pour commencer.</p>

    <div class="dashboard-grid">
      <!-- Carte: Produits -->
      <div class="dashboard-card">
        <div class="card-icon">📦</div>
        <h3>Produits</h3>
        <p class="card-description">Gérer les produits du catalogue</p>
        <router-link to="/backoffice/produits" class="btn-card">Accéder</router-link>
      </div>

      <!-- Carte: Catégories -->
      <div class="dashboard-card">
        <div class="card-icon">📂</div>
        <h3>Catégories</h3>
        <p class="card-description">Gérer les catégories</p>
        <router-link to="/backoffice/categories" class="btn-card">Accéder</router-link>
      </div>

      <!-- Carte: Import -->
      <div class="dashboard-card">
        <div class="card-icon">📥</div>
        <h3>Importer</h3>
        <p class="card-description">Importer des données CSV</p>
        <router-link to="/backoffice/import" class="btn-card">Accéder</router-link>
      </div>

      <!-- Carte: Réinitialiser -->
      <div class="dashboard-card">
        <div class="card-icon">🔄</div>
        <h3>Réinitialiser</h3>
        <p class="card-description">Réinitialiser les données</p>
        <router-link to="/backoffice/reset" class="btn-card">Accéder</router-link>
      </div>

      <!-- Carte: Explorateur API -->
      <div class="dashboard-card">
        <div class="card-icon">🔍</div>
        <h3>Explorateur API</h3>
        <p class="card-description">Tester les requêtes API</p>
        <router-link to="/backoffice/api-explorer" class="btn-card">Accéder</router-link>
      </div>

      <!-- Carte: Informations -->
      <div class="dashboard-card info-card">
        <div class="card-icon">ℹ️</div>
        <h3>Informations</h3>
        <div class="info-details">
          <p><strong>Utilisateur:</strong> {{ user.username }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Connecté depuis:</strong> {{ formatLoginTime(user.loginTime) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()

const formatLoginTime = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleString('fr-FR')
}
</script>

<style scoped>
.dashboard-container {
  padding: 0;
  background-color: transparent;
  min-height: 100%;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.page-description {
  margin: 0 0 30px 0;
  font-size: 14px;
  color: #666;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.dashboard-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.dashboard-card h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.card-description {
  margin: 0 0 16px 0;
  font-size: 13px;
  color: #666;
  flex-grow: 1;
}

.btn-card {
  display: inline-block;
  padding: 10px 16px;
  background-color: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  transition: background-color 0.3s;
  text-align: center;
}

.btn-card:hover {
  background-color: #5568d3;
}

.info-card {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
}

.info-details {
  font-size: 13px;
  color: #555;
}

.info-details p {
  margin: 8px 0;
}

.info-details strong {
  color: #333;
}
</style>
