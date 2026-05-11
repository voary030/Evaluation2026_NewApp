/**
 * Service d'Authentification
 * Gère la connexion, déconnexion et les tokens
 */

const STORAGE_KEY = 'backoffice_auth'

export class AuthService {
  /**
   * Utilisateurs par défaut (en production, cela viendrait d'une API)
   */
  static DEFAULT_USERS = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      email: 'admin@example.com',
      fullName: 'Administrateur'
    },
    {
      id: 2,
      username: 'manager',
      password: 'manager123',
      email: 'manager@example.com',
      fullName: 'Gestionnaire'
    }
  ]

  /**
   * Récupère l'utilisateur actuellement connecté
   * @returns {Object|null}
   */
  static getAuthUser() {
    const auth = localStorage.getItem(STORAGE_KEY)
    return auth ? JSON.parse(auth) : null
  }

  /**
   * Vérifie si l'utilisateur est connecté
   * @returns {boolean}
   */
  static isAuthenticated() {
    return this.getAuthUser() !== null
  }

  /**
   * Connexion utilisateur
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Object>}
   */
  static async login(username, password) {
    return new Promise((resolve, reject) => {
      // Simulation d'une requête API
      setTimeout(() => {
        const user = this.DEFAULT_USERS.find(
          u => u.username === username && u.password === password
        )

        if (user) {
          const authData = {
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            token: this.generateToken(),
            loginTime: new Date().toISOString()
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(authData))
          resolve(authData)
        } else {
          reject(new Error('Identifiants invalides'))
        }
      }, 500)
    })
  }

  /**
   * Déconnexion utilisateur
   */
  static logout() {
    localStorage.removeItem(STORAGE_KEY)
  }

  /**
   * Génère un token simple
   * @returns {string}
   */
  static generateToken() {
    return 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
  }

  /**
   * Valide le token
   * @param {string} token
   * @returns {boolean}
   */
  static validateToken(token) {
    const auth = this.getAuthUser()
    return auth && auth.token === token
  }
}

export default AuthService
