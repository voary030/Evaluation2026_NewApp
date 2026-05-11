<template>
  <div id="app" class="app-container">
    <Sidebar />
    <div class="main-content">
      <router-view class="page-content" />
      <Footer />
    </div>
  </div>
</template>

<script setup>
import Sidebar from './components/layout/Sidebar.vue'
import Footer from './components/layout/Footer.vue'
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #f5f7fa;
  color: #333;
}

.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 250px; /* Largeur de la sidebar */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-content {
  flex: 1;
  padding: 30px;
}
</style>
