<template>
  <div id="app">
    <!-- Layout minimal pour la page de login du backoffice -->
    <template v-if="route.meta.layout === 'minimal'">
      <router-view class="page-content" />
    </template>

    <!-- Layout standard pour le backoffice authentifié -->
    <template v-else-if="isBackofficeRoute && isAuthenticated">
      <BackofficeLayout>
        <router-view class="page-content" />
      </BackofficeLayout>
    </template>

    <!-- Layout frontoffice pour les pages publiques -->
    <template v-else>
      <FrontofficeLayout>
        <router-view class="page-content" />
      </FrontofficeLayout>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import FrontofficeLayout from './components/layout/FrontofficeLayout.vue'
import BackofficeLayout from './components/layout/BackofficeLayout.vue'
import { AuthService } from './services/AuthService'

const route = useRoute()
const isAuthenticated = computed(() => AuthService.isAuthenticated())
const isBackofficeRoute = computed(() => route.path.startsWith('/backoffice'))
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #f5f7fa;
  color: #333;
}

#app {
  width: 100%;
  min-height: 100vh;
}

.page-content {
  flex: 1;
}
</style>
