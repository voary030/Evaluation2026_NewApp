# Structure de NewApp

```
NewApp/
├── .env
├── .gitignore
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── docs/
│   ├── INDEX.md
│   ├── data/
│   │   ├── prestashop_2026-05-05_163855.sql
│   │   └── test-products.csv
│   ├── exercises/
│   │   └── SQL_EXERCISES.md
│   ├── guides/
│   │   ├── ECOMMERCE_CONCEPTS.md
│   │   └── GUIDE_DEMARRAGE.md
│   └── references/
│       ├── DATABASE.md
│       ├── DATABASE_VISUAL.md
│       ├── listeApi.md
│       └── README.md
├── index.html
├── jsconfig.json
├── node_modules/
├── package-lock.json
├── package.json
├── public/
│   └── favicon.ico
├── README.md
├── src/
│   ├── App.vue
│   ├── main.js
│   ├── assets/
│   │   └── api-endpoints.json
│   ├── components/
│   │   ├── ApiExplorer.vue
│   │   ├── DataReset.vue
│   │   ├── FileImporter.vue
│   │   └── ProductList.vue
│   ├── router/
│   │   └── index.js
│   └── services/
│       ├── apiHelper.js
│       ├── healthcheck.js
│       └── prestashopApi.js
├── vite.config.js
└── node_modules/ (dépendances npm)
```

## Description des dossiers principaux

### 📁 `.vscode/`
Configuration VS Code du projet
- `extensions.json` - Extensions recommandées
- `settings.json` - Paramètres de l'éditeur

### 📁 `docs/`
Documentation et ressources du projet
- **data/** - Fichiers de données (SQL, CSV)
- **exercises/** - Exercices SQL
- **guides/** - Guides d'utilisation et concepts
- **references/** - Documentation technique

### 📁 `public/`
Ressources publiques accessibles en production
- `favicon.ico` - Icône du site

### 📁 `src/`
Code source Vue.js

#### Sous-dossiers de `src/`
- **assets/** - Ressources statiques (JSON, images, etc.)
- **components/** - Composants Vue réutilisables
  - `ApiExplorer.vue` - Explorateur API
  - `DataReset.vue` - Réinitialisation des données
  - `FileImporter.vue` - Importateur de fichiers
  - `ProductList.vue` - Liste des produits
- **router/** - Configuration de routage Vue
- **services/** - Services et utilitaires API
  - `apiHelper.js` - Helper pour les appels API
  - `healthcheck.js` - Vérification de santé du serveur
  - `prestashopApi.js` - Client API PrestaShop

### 📄 Fichiers racine
- `.env` - Variables d'environnement
- `.gitignore` - Fichiers ignorés par Git
- `index.html` - Point d'entrée HTML
- `jsconfig.json` - Configuration JavaScript
- `package.json` - Dépendances npm et scripts
- `package-lock.json` - Verrouillage des versions
- `README.md` - Documentation principale
- `vite.config.js` - Configuration du bundler Vite
