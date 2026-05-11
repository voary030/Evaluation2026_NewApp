/**
 * Composable d'authentification
 * Fournit les fonctions et l'état d'authentification
 */

import { ref, computed } from 'vue'
import { AuthService } from '@/services/AuthService'

export const useAuth = () => {
  const user = ref(AuthService.getAuthUser())
  const error = ref(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => AuthService.isAuthenticated())

  const login = async (username, password) => {
    try {
      loading.value = true
      error.value = null
      const authUser = await AuthService.login(username, password)
      user.value = authUser
      return authUser
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    AuthService.logout()
    user.value = null
    error.value = null
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    error,
    loading
  }
}
