<template>
  <div class="backoffice-layout">
    <Sidebar />
    <div class="backoffice-main">
      <div class="backoffice-header">
        <div class="header-content">
          <div>
            <h1 class="brand">Tableau de bord administrateur</h1>
            <span class="user-welcome">{{ user?.fullName }}</span>
          </div>
          <button @click="handleLogout" class="btn-logout">
            <span>🚪</span> Déconnexion
          </button>
        </div>
      </div>
      <div class="backoffice-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import Sidebar from './Sidebar.vue'

const router = useRouter()
const { user, logout } = useAuth()

const handleLogout = () => {
  logout()
  router.push({ name: 'backoffice-login' })
}
</script>

<style scoped>
.backoffice-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.backoffice-main {
  flex: 1;
  margin-left: 250px;
  display: flex;
  flex-direction: column;
}

.backoffice-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
}

.header-content > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.brand {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.user-welcome {
  font-size: 13px;
  color: #666;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-logout:hover {
  background-color: #c82333;
}

.backoffice-body {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}
</style>
