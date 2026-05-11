<template>
  <div class="home-container">
    <section class="hero">
      <h1>Bienvenue chez NewApp</h1>
      <p>Découvrez nos produits de qualité</p>
    </section>

    <section class="products-section">
      <h2>🛍️ Nos produits</h2>
      <div class="products-grid">
        <div class="product-placeholder">
          <div class="placeholder-icon">📦</div>
          <p>Les produits s'afficheront ici</p>
        </div>
      </div>
    </section>

    <section class="info-section">
      <div class="info-card">
        <h3>🏠 Accueil</h3>
        <p>Page d'accueil avec affichage des produits disponibles</p>
      </div>
      <div class="info-card">
        <h3>🛒 Panier</h3>
        <p>Gestion du panier et validation de la commande</p>
      </div>
      <div class="info-card">
        <h3>📋 Mes commandes</h3>
        <p>Suivi des commandes et états de paiement</p>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home-container {
  padding: 0;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 30px;
  text-align: center;
  margin: -40px -30px 40px -30px;
}

.hero h1 {
  margin: 0 0 15px 0;
  font-size: 42px;
  font-weight: 700;
}

.hero p {
  margin: 0;
  font-size: 18px;
  opacity: 0.95;
}

.products-section {
  margin-bottom: 50px;
}

.products-section h2 {
  margin: 0 0 30px 0;
  font-size: 28px;
  color: #333;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-placeholder {
  background: white;
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  color: #999;
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.info-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 50px;
}

.info-card {
  background: white;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.info-card:hover {
  transform: translateY(-4px);
}

.info-card h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
}

.info-card p {
  margin: 0;
  color: #666;
  font-size: 14px;
}
</style>
