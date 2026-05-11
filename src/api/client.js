import axios from 'axios'

const API_URL = import.meta.env.VITE_PS_API_URL
const API_KEY = import.meta.env.VITE_PS_API_KEY

// Authentification en base64
const authKey = btoa(API_KEY + ':')

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Basic ${authKey}`,
    'Content-Type': 'text/xml',
    'Accept': 'text/xml'
  }
})

// Intercepteur pour le debugging et la gestion d'erreurs
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('📡 Statut:', error.response.status)
      console.error('📡 Headers:', error.response.headers)
      console.error('📡 Corps de l\'erreur:', error.response.data)
      
      // Si c'est du XML, on essaye de l'extraire
      if (error.response.data && typeof error.response.data === 'string') {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(error.response.data, 'text/xml')
        const message = xmlDoc.querySelector('message')?.textContent
        if (message) console.error('📡 Message PrestaShop:', message)
      }
    } else {
      console.error('Erreur réseau:', error.message)
      console.error('API URL:', API_URL)
      console.error('Impossible de se connecter à PrestaShop')
    }
    return Promise.reject(error)
  }
)

export default apiClient
