<template>
  <div>
    <h1>Accueil</h1>
    <p>Bienvenue dans l'application NewApp</p>
    <nav>
      <ul>
        <li><router-link to="/produits">Produits</router-link></li>
        <li><router-link to="/categories">Catégories</router-link></li>
        <li><router-link to="/import">Importer</router-link></li>
        <li><router-link to="/reset">Réinitialiser</router-link></li>
        <li><router-link to="/api-explorer">Explorateur API</router-link></li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
</script>
