# Logique d'Authentification - newApp

## 🎯 Vue d'ensemble

Le système d'authentification newApp est **double-couche** :
1. **Admin BackOffice** : Authentification via email/password
2. **WebService API** : Validation de la clé API PrestaShop

Ces deux couches fonctionnent en parallèle pour créer une session sécurisée.

---

## 🔄 Flux Principal d'Authentification

```
┌─────────────────────────────────────────────────────┐
│ Utilisateur ouvre l'app                             │
└─────────────────────────┬───────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────────┐
         │ Guard vérifie:                 │
         │ - Route requiert auth?         │
         │ - Session existe?              │
         └────────────────┬───────────────┘
                          │
                ┌─────────┴──────────┐
                │                    │
            Oui │                    │ Non
                ▼                    ▼
        ┌─────────────────┐  ┌──────────────────┐
        │ Restaurer       │  │ Rediriger vers   │
        │ session         │  │ /login           │
        │ existante       │  └──────────────────┘
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Formulaire      │
        │ Connexion       │
        └────────┬────────┘
                 │
                 │ Utilisateur soumet:
                 │ - email
                 │ - password
                 ▼
        ┌─────────────────┐
        │ ÉTAPE 1:        │
        │ Auth AdminBO    │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ ÉTAPE 2:        │
        │ Auth WebService │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Session créée   │
        │ Permissions     │
        │ chargées        │
        └────────┬────────┘
                 │
                 ▼
        Rediriger vers
        destination finale
```

---

## 📋 Étape 1 : Authentification Admin BackOffice

### Objectif
Vérifier que l'utilisateur est un administrateur légitime du BackOffice PrestaShop

### Entrée
- `email` : Email de l'administrateur
- `password` : Mot de passe de l'administrateur

### Processus

```
1. Récupérer l'URL du BackOffice depuis .env.local
   - Variable: VITE_PRESTASHOP_ADMIN_BASE_URL
   - Format normalisé (sans slash de fin)

2. Construire URL de connexion
   - Endpoint: /index.php?controller=AdminLogin&ajax=1
   - Paramètres:
     * email
     * password (passwd)
     * submitLogin=1
     * ajax=1
     * stay_logged_in=1
     * redirect=AdminDashboard

3. Envoyer requête POST au BackOffice
   - Méthode: POST (formulaire URL-encoded)
   - Credentials: Inclus (withCredentials: true)

4. Parser la réponse
   - Rechercher le token admin dans l'URL de redirection
   - Format du token: ?token=abc123...

5. Extraire token admin
   - Utilisé pour futures interactions BackOffice
```

### Sortie
```
{
  email: "itu@gmail.com",
  adminToken: "abc123xyz...",
  createdAt: timestamp
}
```

### Gestion des erreurs
```
Erreur                  → Code                  → Message utilisateur
─────────────────────────────────────────────────────────────────
Email/password invalide → INVALID_CREDENTIALS   → "Identifiants invalides"
Env manquant           → MISSING_ADMIN_ENV     → "Config admin manquante"
Réseau échoue          → NETWORK_ERROR         → "Connexion impossible"
Token non trouvé       → TOKEN_MISSING         → "Token introuvable"
```

---

## 🔐 Étape 2 : Validation WebService API

### Objectif
Vérifier que la clé API WebService est valide et récupérer les permissions

### Entrée
- `apiUrl` : URL de base de l'API PrestaShop (depuis .env.local)
- `apiKey` : Clé d'authentification WebService (depuis .env.local)

### Processus

```
1. Créer client HTTP avec credentials API
   - Authentication: Basic (apiKey:)
   - Format: Authorization: Basic base64(apiKey:)

2. Effectuer 2 requêtes parallèles
   A) GET /
      - Objectif: Récupérer la liste des permissions disponibles
      - Retour: Racine API avec endpoints accessibles
   
   B) GET /employees?display=full&limit=1
      - Objectif: Récupérer l'employé/admin courant
      - Données: firstname, lastname, email, etc.

3. Parser les réponses
   A) Extraire permissions
      - Lire les noms des enfants du nœud <api>
      - Chaque enfant = une permission (ex: "products", "customers")
   
   B) Extraire données employé
      - Première entrée employé trouvée

4. Valider résultats
   - Au moins 1 permission retournée?
   - Au moins 1 employé retourné?
```

### Sortie
```
{
  apiUrl: "https://localhost/EVAL/api",
  apiKey: "ABCD1234...",
  employee: {
    firstname: "Admin",
    lastname: "User",
    email: "itu@gmail.com",
    ...autres champs
  },
  permissions: ["products", "customers", "orders", ...]
}
```

### Gestion des erreurs
```
Erreur              → Code              → Récupération
──────────────────────────────────────────────────────
Clé API invalide   → 401 Unauthorized  → Message d'erreur
Env manquant       → MISSING_API_KEY   → Logs dev
Réseau échoue      → NETWORK_ERROR     → Retry ou fallback
```

---

## 💾 Étape 3 : Création & Stockage de Session

### Objectif
Créer une session valide et la persister pour permettre la restauration

### Architecture de Session

```
┌─────────────────────────────────────────┐
│ Session Admin (localStorage)            │ ← Persistant
├─────────────────────────────────────────┤
│ - email                                 │
│ - adminToken                            │
│ - createdAt                             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Session API (sessionStorage)            │ ← Temporaire
├─────────────────────────────────────────┤
│ - apiUrl                                │
│ - apiKey                                │
│ - employee                              │
│ - permissions                           │
│ - createdAt                             │
│ - expiresAt (TTL: 8h)                   │
└─────────────────────────────────────────┘
```

### Stockage Technique
- **Admin Session** : localStorage (survit fermeture navigateur)
- **API Session** : sessionStorage (encodé Base64 + JSON)
- **Encodage** : btoa/atob pour obfuscation basique

### TTL (Time To Live)
- **API Session** : 8 heures
- **Expiration** : Automatique, détection à la lecture

---

## 🔄 Restauration de Session

### Quand
- Au démarrage de l'app
- À chaque navigation si pas encore restaurée

### Processus

```
1. Vérifier si restauration déjà effectuée
   - Flag: hasRestored
   - Évite double restauration

2. Chercher session admin stockée
   - Lire localStorage avec clé EVAL-admin-session
   - Si absent → Pas authentifié

3. Chercher session API stockée
   - Lire sessionStorage avec clé EVAL-session
   - Vérifier expiration (createdAt + 8h > now?)
   - Si expiré → Supprimer et re-valider

4. Re-valider session API auprès du serveur
   - Refaire GET / + GET /employees
   - Vérifier que les credentials fonctionnent
   - Mettre à jour permissions

5. Restaurer l'état applicatif
   - Stocker session/employee/permissions en état global
   - Initialiser client HTTP avec credentials
```

### Résultat
- ✅ **Succès** : Utilisateur reste connecté après fermeture navigateur
- ❌ **Échec** : Redirection vers /login

---

## 🛡️ Permissions & Contrôle d'Accès

### Architecture

```
┌─────────────────────────────────────────────┐
│ Permissions (Array de strings)              │
├─────────────────────────────────────────────┤
│ ["products", "customers", "orders",         │
│  "cart_rules", "vouchers", ...]             │
└─────────────────────────────────────────────┘
```

### Utilisation

```
Route 1:
  meta: { requiresAuth: true, permission: "products" }
  → Vérifier que "products" est dans permissions

Route 2:
  meta: { requiresAuth: true, permission: ["products", "orders"] }
  → Vérifier que TOUS les éléments sont présents
```

### Vérification de Permission

```
Logique:
1. Permission requise = undefined?
   → Accès automatique ✅

2. Permission = string?
   → Chercher dans array permissions
   → Présent? ✅ Absent? ❌

3. Permission = array?
   → Vérifier TOUS les éléments
   → Tous présents? ✅ Un absent? ❌
```

### Gestion des Accès Refusés

```
Requête sans permission
        │
        ▼
Guard détecte manque permission
        │
        ▼
Redirection vers /dashboard
avec query: ?forbidden=1
```

---

## 🚪 Gestion de Déconnexion

### Processus

```
1. Utilisateur clique "Déconnexion"

2. Logout Admin BackOffice
   - Appel: POST /logout avec adminToken
   - Invalide la session BackOffice côté serveur

3. Supprimer sessions stockées
   - Effacer localStorage (EVAL-admin-session)
   - Effacer sessionStorage (EVAL-session)

4. Réinitialiser état global
   - session = null
   - employee = null
   - permissions = []
   - adminSession = null

5. Détruire client HTTP
   - Effacer références credentials

6. Rediriger vers /login
```

---

## 📌 Guards de Routage

### Quand activé
Avant chaque navigation de route

### Vérifications effectuées

```
1. Route requiert authentification?
   meta.requiresAuth !== false
   
2. Session restaurée?
   Si non → Effectuer restauration
   
3. Utilisateur authentifié?
   adminSession doit exister
   → Sinon redirection /login?redirect=...

4. Utilisateur a permission requise?
   meta.permission spécifié?
   → Vérifier dans permissions
   → Sinon redirection /dashboard?forbidden=1

5. Cas spécial: /login
   Si authentifié et route=/login
   → Redirection /dashboard
```

---

## ⚙️ Configuration Requise (.env.local)

```
VITE_PRESTASHOP_ADMIN_BASE_URL
  ↳ URL du BackOffice
  ↳ Format: https://localhost/EVAL/admin850fwun...
  ↳ Usage: Authentification admin

VITE_PRESTASHOP_API_BASE_URL
  ↳ URL de base API WebService
  ↳ Format: https://localhost/EVAL/api
  ↳ Usage: Requêtes API

VITE_PRESTASHOP_API_KEY
  ↳ Clé WebService API PrestaShop
  ↳ Format: Chaîne hexadécimale
  ↳ Usage: Authentication Basic Auth
```

---

## 🔗 Composants Interconnectés

### Pile Technologique

```
Vue Router
    ↓
Guards (guards.js)
    ↓
Auth Store (Pinia) ← useAuth (composable)
    ↓
Services Auth
├── adminAuthService.js (BackOffice login/logout)
└── authService.js (WebService validation)
    ↓
xmlClient (HTTP client avec credentials)
```

### Flux de Données

```
Component (LoginView)
    │
    ├→ useAuth() → accès store
    │
    └→ store.login({email, password})
         │
         ├→ adminAuthService.loginAdmin()
         │
         ├→ authService.validateApiKey()
         │
         └→ State update + initXmlClient()
```

---

## 🚨 Scénarios de Récupération d'Erreur

### Scénario 1 : Credentials Admin Invalides
```
Utilisateur saisit: itu@gmail.com / wrongpassword

1. Appel loginAdmin() → Retour erreur 401
2. Code: INVALID_CREDENTIALS
3. Message: "Identifiants invalides."
4. Action: Formulaire reste ouvert → Utilisateur peut réessayer
```

### Scénario 2 : Session Expire
```
Utilisateur connecté depuis 9h (> TTL de 8h)

1. Tentative d'accès API
2. sessionStorage expiré
3. Guard détecte expiration
4. Appel verifyStoredSession()
5. Réauthentification si admin session valide
6. Sinon: Redirection /login
```

### Scénario 3 : Env Manquant
```
.env.local incomplet

1. Au login: Erreur MISSING_ENV
2. Message: "Configuration manquante..."
3. Dev check: Console logs avec détails
4. Action: Admin doit configurer env
```

### Scénario 4 : API Key Invalide
```
VITE_PRESTASHOP_API_KEY incorrecte

1. Admin auth réussie
2. validateApiKey() échoue (401)
3. Logout admin (rollback)
4. Code: INVALID_API_KEY
5. Message utilisateur approprié
```

---

## 📊 Diagramme d'État

```
┌──────────────────┐
│  Non Authentifié │ (Démarrage)
└────────┬─────────┘
         │
         ├─ Guard détecte: /login required
         │
         ▼
┌──────────────────────────────┐
│ Restauration Session         │
├──────────────────────────────┤
│ Chercher admin + API session │
└─────┬──────────────┬─────────┘
      │ Trouvé       │ Non trouvé
      ▼              ▼
   Valide?      À /login
   ├ Oui↓       (renvoie utilisateur)
   │           
   ▼
┌──────────────────────────────┐
│ Authentifié & Autorisé       │
├──────────────────────────────┤
│ - Session active             │
│ - Permissions chargées       │
│ - Client HTTP initialisé     │
└──────────────────────────────┘
   │
   └─ Access denied?
      (manque permission)
      └→ /dashboard?forbidden=1
```

---

## 🔑 Points Clés à Retenir

1. **Double authentification** : Admin + API (validation croisée)
2. **Session persistante** : Survit fermeture navigateur (localStorage)
3. **TTL de 8h** : API session expire automatiquement
4. **Permissions granulaires** : Contrôle par ressource (products, customers...)
5. **Guards proactifs** : Restauration avant chaque navigation
6. **Erreurs gérées** : Messages utilisateur contextuels
7. **Rollback intégré** : Si API échoue, logout admin effectué
8. **Client HTTP centralisé** : Une seule instance avec credentials

---

## 📝 Résumé Technique

| Aspect | Détail |
|--------|--------|
| **Types Session** | Admin (localStorage) + API (sessionStorage) |
| **TTL API** | 8 heures |
| **Encodage Session** | Base64 + JSON |
| **Authentification** | Basic Auth (API) + Token (Admin) |
| **Permissiosn** | Array de strings |
| **Guards** | Restauration + Vérification auth + Vérification permission |
| **Erreurs** | Codes spécifiques + Messages localisés |
| **Déconnexion** | Logout BackOffice + Suppression stockages |
