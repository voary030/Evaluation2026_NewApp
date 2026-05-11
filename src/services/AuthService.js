/**
 * Service d'Authentification
 * Gere la connexion, deconnexion et les tokens
 */

import apiClient from '@/api/client'
import { XMLParserService } from '@/services/XMLParserService'

const STORAGE_KEY = 'backoffice_auth'

export class AuthService {

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
    const email = username

    if (!email || !password) {
      throw new Error('Identifiants invalides')
    }

    const adminAuth = await this.loginAdmin(email, password)
    const apiAuth = await this.validateWebservice()

    const authData = {
      email,
      adminToken: adminAuth.adminToken,
      permissions: apiAuth.permissions,
      employee: apiAuth.employee,
      loginTime: new Date().toISOString()
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData))
    return authData
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
  static async loginAdmin(email, password) {
    const adminBaseUrl = this.getAdminBaseUrl()
    const url = `${adminBaseUrl}/index.php?controller=AdminLogin&ajax=1`

    const body = new URLSearchParams({
      email,
      passwd: password,
      submitLogin: '1',
      ajax: '1',
      stay_logged_in: '1',
      redirect: 'AdminDashboard'
    })

    let response
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body,
        credentials: 'include'
      })
    } catch (error) {
      throw new Error('Connexion impossible')
    }

    if (!response.ok) {
      throw new Error('Identifiants invalides')
    }

    const text = await response.text()
    const token = this.extractAdminToken(text)

    if (!token) {
      throw new Error('Token introuvable')
    }

    return { adminToken: token }
  }

  static getAdminBaseUrl() {
    const baseUrl = import.meta.env.VITE_PRESTASHOP_ADMIN_BASE_URL

    if (!baseUrl) {
      throw new Error('Config admin manquante')
    }

    return baseUrl.replace(/\/$/, '')
  }

  static extractAdminToken(responseText) {
    let token = null

    try {
      const json = JSON.parse(responseText)
      if (json && typeof json.redirect === 'string') {
        token = this.extractTokenFromUrl(json.redirect)
      }
    } catch (error) {
      // ignore json parse errors
    }

    if (!token) {
      token = this.extractTokenFromUrl(responseText)
    }

    return token
  }

  static extractTokenFromUrl(text) {
    const match = text.match(/token=([a-zA-Z0-9]+)/)
    return match ? match[1] : null
  }

  static async validateWebservice() {
    try {
      const [permissionsResponse, employeeResponse] = await Promise.all([
        apiClient.get('products?limit=1'),
        apiClient.get('employees?display=full&limit=1')
      ])

      const permissions = this.parsePermissions(permissionsResponse.data)
      const employees = XMLParserService.parseXML(employeeResponse.data, 'employee')
      const employee = employees[0]

      if (!permissions.length) {
        throw new Error('Permissions introuvables')
      }

      if (!employee) {
        throw new Error('Employe introuvable')
      }

      return { permissions, employee }
    } catch (error) {
      throw new Error('Cle API invalide')
    }
  }

  static parsePermissions(xmlString) {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml')
    const apiNode = xmlDoc.getElementsByTagName('api')[0]

    if (!apiNode) {
      return []
    }

    return Array.from(apiNode.children).map((node) => node.tagName)
  }
}

export default AuthService
