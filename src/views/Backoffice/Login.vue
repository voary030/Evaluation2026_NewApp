<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="login-title">Backoffice</h1>
      <p class="login-subtitle">Connexion à l'administration</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Identifiant:</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            placeholder="Entrez votre identifiant"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe:</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Entrez votre mot de passe"
            class="form-input"
            required
          />
        </div>

        <button
          type="submit"
          class="btn-login"
          :disabled="loading"
        >
          {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
        </button>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>

      <!-- Identifiants par défaut pour le développement -->
      <div class="default-credentials">
        <p class="credentials-title">Identifiants par défaut (développement):</p>
        <div class="credentials-list">
          <div class="credential-item">
            <strong>Admin:</strong>
            <p>Identifiant: <code>admin</code></p>
            <p>Mot de passe: <code>admin123</code></p>
          </div>
          <div class="credential-item">
            <strong>Manager:</strong>
            <p>Identifiant: <code>manager</code></p>
            <p>Mot de passe: <code>manager123</code></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login, error, loading } = useAuth()

const form = ref({
  username: 'admin',      // Valeur par défaut
  password: 'admin123'    // Valeur par défaut
})

const handleLogin = async () => {
  try {
    await login(form.value.username, form.value.password)
    // Rediriger vers le dashboard
    router.push({ name: 'backoffice-dashboard' })
  } catch (err) {
    // L'erreur est gérée par le composable
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.login-box {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  padding: 40px;
  width: 100%;
  max-width: 450px;
}

.login-title {
  margin: 0 0 5px 0;
  font-size: 28px;
  font-weight: 700;
  color: #333;
  text-align: center;
}

.login-subtitle {
  margin: 0 0 30px 0;
  font-size: 14px;
  color: #666;
  text-align: center;
}

.login-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-login {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  margin-top: 15px;
  padding: 12px;
  background-color: #fee;
  color: #c33;
  border: 1px solid #fcc;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
}

.default-credentials {
  padding-top: 20px;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 20px;
  margin-top: 20px;
}

.credentials-title {
  margin: 0 0 12px 0;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
}

.credentials-list {
  display: flex;
  gap: 12px;
  flex-direction: column;
}

.credential-item {
  font-size: 12px;
  color: #555;
}

.credential-item strong {
  display: block;
  margin-bottom: 4px;
  color: #333;
}

.credential-item p {
  margin: 4px 0;
}

.credential-item code {
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  color: #333;
}
</style>
