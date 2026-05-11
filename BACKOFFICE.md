# Backoffice - Documentation

## 📋 Vue d'ensemble

Le backoffice est une interface d'administration sécurisée pour gérer les données de l'application NewApp. Il nécessite une authentification et offre un tableau de bord centralisé pour accéder aux différents modules.

## 🔐 Authentification

### Accès au Backoffice

1. Cliquez sur le lien "🔐 Backoffice" dans la barre latérale (en rouge)
2. Vous serez redirigé vers la page de connexion: `/backoffice/login`

### Identifiants par défaut

L'application propose deux comptes de test:

| Rôle    | Identifiant | Mot de passe |
|---------|-------------|-------------|
| Admin   | `admin`     | `admin123`  |
| Manager | `manager`   | `manager123` |

Ces identifiants sont affichés sur la page de connexion et sont pré-remplis dans le formulaire pour faciliter les tests en développement.

## 🛡️ Protection des Routes

Le système de protection est basé sur les **gardes de route** (route guards). Voici comment cela fonctionne:

### Routes protégées

- `/backoffice` - Dashboard du backoffice (requiert authentification)

### Routes publiques

- `/backoffice/login` - Page de connexion (accessible sans authentification)
- Toutes les autres routes (`/`, `/produits`, `/categories`, etc.)

### Logique de protection

```javascript
// Dans src/router/index.js
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const isAuthenticated = AuthService.isAuthenticated()

  if (requiresAuth && !isAuthenticated) {
    // Redirection automatique vers login
    next({ name: 'backoffice-login' })
  } else if (to.name === 'backoffice-login' && isAuthenticated) {
    // Redirection vers dashboard si déjà connecté
    next({ name: 'backoffice-dashboard' })
  } else {
    next()
  }
})
```

## 🔄 Flux d'utilisation

### Connexion

1. L'utilisateur accède à `/backoffice/login`
2. Les champs identifiant et mot de passe sont pré-remplis avec les identifiants par défaut
3. L'utilisateur peut modifier ou garder les valeurs par défaut
4. Après soumission du formulaire, le système valide les credentials
5. Si valide, un token est généré et stocké dans localStorage
6. L'utilisateur est redirigé vers `/backoffice` (dashboard)

### Navigation

Depuis le dashboard, l'utilisateur peut accéder à:
- **Produits** - Gestion du catalogue
- **Catégories** - Gestion des catégories
- **Importer** - Import de données CSV
- **Réinitialiser** - Réinitialisation des données
- **Explorateur API** - Tests des requêtes API

### Déconnexion

L'utilisateur peut se déconnecter via le bouton "Se déconnecter" en haut à droite du dashboard. Cela:
- Supprime le token du localStorage
- Redirige vers la page de connexion

## 📁 Structure des fichiers

```
src/
├── components/
│   └── layout/
│       └── BackofficeLayout.vue          # Layout du backoffice
├── composables/
│   └── useAuth.js                         # Composable d'authentification
├── services/
│   └── AuthService.js                     # Service d'authentification
├── views/
│   └── Backoffice/
│       ├── Login.vue                      # Page de connexion
│       └── Dashboard.vue                  # Tableau de bord
└── router/
    └── index.js                           # Configuration des routes et des gardes
```

## 🔧 Services et Composables

### AuthService

Gère l'authentification au niveau du système:

```javascript
import { AuthService } from '@/services/AuthService'

// Connexion
await AuthService.login('admin', 'admin123')

// Vérifier si authentifié
const isAuth = AuthService.isAuthenticated()

// Récupérer l'utilisateur
const user = AuthService.getAuthUser()

// Déconnexion
AuthService.logout()
```

### useAuth Composable

Fournit l'authentification dans les composants Vue:

```javascript
import { useAuth } from '@/composables/useAuth'

const { user, isAuthenticated, login, logout, error, loading } = useAuth()
```

## 🎨 Layouts

### Layout Minimal (`minimal`)

Utilisé pour la page de connexion. Affiche uniquement le contenu sans barre latérale ni footer.

### BackofficeLayout

Layout spécifique au backoffice avec:
- Header avec titre "Backoffice"
- Informations de l'utilisateur
- Bouton de déconnexion
- Contenu principal

### Layout Standard

Layout par défaut avec:
- Barre latérale (Sidebar)
- Contenu principal
- Footer

## 🔍 Stockage des données

L'authentification utilise le **localStorage** du navigateur:

```javascript
// Clé: 'backoffice_auth'
// Valeur: JSON contenant {id, username, email, fullName, token, loginTime}
```

## ⚠️ Notes de sécurité

**⚠️ IMPORTANT**: Les identifiants et le stockage des tokens en localStorage sont pour le développement uniquement.

Pour une application en production, il est nécessaire:
1. **Backend API** - Authentification serveur avec sessions sécurisées
2. **HTTPS** - Chiffrement des communications
3. **Tokens JWT** - Avec expiration et refresh
4. **Secure cookies** - Au lieu de localStorage
5. **Validation côté serveur** - De toutes les permissions

## 🧪 Tests

Pour tester le système d'authentification:

1. Allez sur `/backoffice/login`
2. Les champs sont pré-remplis avec `admin` / `admin123`
3. Cliquez sur "Se connecter"
4. Vous devriez être redirigé vers `/backoffice` (dashboard)
5. Testez le bouton "Se déconnecter"
6. Vous devriez être redirigé vers la page de connexion

## 🚀 Évolutions futures

- Ajouter des rôles d'utilisateurs (Admin, Manager, etc.)
- Implémenter des permissions granulaires
- Ajouter des logs d'accès
- Intégrer une vraie API d'authentification
- Ajouter une réinitialisation de mot de passe
