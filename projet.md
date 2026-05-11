# 📋 NewApp - Récapitulatif du Projet

## 🎯 Vue d'ensemble

**NewApp** est une application Vue 3 SPA qui sert de frontend pour PrestaShop v8.2.6 avec deux interfaces distinctes:
- **Backoffice** (administration protégée par authentification)
- **Frontoffice** (site client public)

**Statut actuel**: Backoffice fonctionnel, Frontoffice en cours de développement.

---

## 📂 Structure du Projet

```
NewApp/
├── src/
│   ├── api/                           # Services API
│   │   ├── client.js                  # Axios client avec parseur XML
│   │   ├── ProductService.js
│   │   ├── StockService.js
│   │   ├── CategoryService.js
│   │   └── XMLParserService.js        # Conversion XML → JavaScript
│   ├── services/
│   │   └── AuthService.js             # Authentification (dual-layer)
│   ├── composables/
│   │   └── useAuth.js                 # Hook Vue pour auth
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BackofficeLayout.vue   # Sidebar + header (protégé)
│   │   │   ├── FrontofficeLayout.vue  # Simple header (public)
│   │   │   └── Sidebar.vue
│   │   └── ...
│   ├── views/
│   │   ├── Backoffice/
│   │   │   ├── Login.vue              # Formulaire email/password
│   │   │   └── Dashboard.vue          # Cartes des modules
│   │   ├── Produits/
│   │   │   ├── Index.vue
│   │   │   ├── Create.vue
│   │   │   └── Details.vue
│   │   ├── Home.vue                   # Page d'accueil frontoffice
│   │   ├── DataImporter.vue           # Import 3 CSV + 1 ZIP
│   │   └── DataReset.vue              # Réinitialisation données
│   ├── router/
│   │   └── index.js                   # Routes + guards
│   ├── App.vue                        # Rendu conditionnel des layouts
│   └── main.js
├── .env                               # Variables d'environnement
├── vite.config.js                     # Config dev + proxies
└── package.json
```

---

## 🔐 Système d'Authentification

### Flux de connexion (Dual-Layer)

```
Utilisateur → Formulaire Login.vue
              ↓
        AuthService.login(email, password)
              ↓
    [ÉTAPE 1] POST /admin{token}/index.php?controller=AdminLogin
              - Récupère: admin token
              ↓
    [ÉTAPE 2] GET /api (avec clé API WebService)
              - Valide: permissions, employee
              ↓
    Session stockée en localStorage:
    {
      email,
      adminToken,
      permissions,
      employee: { firstname, lastname },
      loginTime
    }
```

### Fichiers clés
- [AuthService.js](src/services/AuthService.js) — `login()`, `logout()`, `isAuthenticated()`
- [useAuth.js](src/composables/useAuth.js) — Hook Vue pour composants
- [router/index.js](src/router/index.js) — Guard `beforeEach` pour protéger routes

---

## 🛣️ Routes de l'Application

### Routes Publiques
| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | Home.vue | Accueil frontoffice (liste produits) |
| `/backoffice/login` | Login.vue | Connexion backoffice |

### Routes Backoffice (Protégées ✔️)
| Route | Composant | Description |
|-------|-----------|-------------|
| `/backoffice` | Dashboard.vue | Tableau de bord |
| `/backoffice/produits` | Produits/Index.vue | Liste des produits |
| `/backoffice/produits/create` | Produits/Create.vue | Créer produit |
| `/backoffice/produits/:id` | Produits/Details.vue | Détails produit |
| `/backoffice/categories` | Categories/... | Gestion catégories |
| `/backoffice/import` | DataImporter.vue | Import (3 CSV + 1 ZIP) |
| `/backoffice/reset` | DataReset.vue | Réinitialiser données |
| `/backoffice/api-explorer` | APIExplorer.vue | Testeur API |

**Protection**: Redirection vers `/backoffice/login` si non authentifié.

---

## 🎨 Layouts

| Nom | Routes | Éléments |
|-----|--------|---------|
| **Backoffice** | `/backoffice/*` (sauf login) | Sidebar (250px) + Header + Contenu |
| **Frontoffice** | `/` | Header simple + Footer + Contenu |
| **Login** | `/backoffice/login` | Formulaire centré (minimal) |

**Sidebar** visible uniquement si authentifié.  
**Header** affiche email utilisateur + bouton déconnexion en backoffice.

---

## ⚙️ Configuration

### .env
```env
VITE_PS_API_URL=/api
VITE_PS_API_KEY=bxC84VD4fbTzndsNPHWDiCOi1ZWkhyDh
VITE_PRESTASHOP_ADMIN_BASE_URL=/admin850fwun0l1kmrqi5hw6
```

### vite.config.js (Proxies CORS)
```javascript
proxy: {
  '/api': {
    target: 'http://localhost/EVAL',
    changeOrigin: true
  },
  '/admin*': {
    target: 'http://localhost/EVAL',
    changeOrigin: true
  },
  '/img': {
    target: 'http://localhost/EVAL',
    changeOrigin: true
  }
}
```
