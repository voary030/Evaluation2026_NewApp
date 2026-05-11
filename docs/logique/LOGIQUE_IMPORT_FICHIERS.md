# Logique d'Import de Fichiers

## Vue d'ensemble
Le système gère un flux d'import multi-étapes permettant aux utilisateurs de charger des données (CSV, Excel) et de les importer massivement dans PrestaShop.

---

## Concept Général

```
Utilisateur → Sélection fichier → Parse données → Mapping colonnes → Validation → Import → Rapport
```

---

## Étapes du Processus

### **Étape 1 : Sélection du Fichier**
- **Entrée** : Fichier sélectionné par l'utilisateur
- **Actions** :
  - Valider que le fichier existe
  - Nettoyer les messages d'erreur/succès précédents
  - Lancer le parsing du fichier
- **Sortie** : Données parsées extraites du fichier
- **Validation** : Fichier sélectionné ✓

---

### **Étape 2 : Parsing et Détection Automatique**
- **Entrée** : Fichier brut
- **Actions** :
  - Parser le fichier (extraire lignes et colonnes)
  - Détecter les colonnes présentes
  - Chercher si les noms de colonnes correspondent aux champs PrestaShop connus
  - Mapper automatiquement les colonnes détectées
- **Sortie** : 
  - Liste des données parsées
  - Mapping initial proposé
- **Validation** : Au moins 1 ligne de données ✓

---

### **Étape 3 : Mapping des Colonnes**
- **Entrée** : Colonnes du fichier + Champs PrestaShop disponibles
- **Actions** :
  - Afficher toutes les colonnes du fichier
  - Permettre à l'utilisateur de mapper chaque colonne vers un champ PrestaShop
  - Valider que les champs obligatoires sont mappés (nom, prix)
  - Permettre d'ignorer certaines colonnes
- **Sortie** : Correspondance complète fichier ↔ PrestaShop
- **Validation** : Champs requis (nom, prix) mappés ✓

---

### **Étape 4 : Transformation et Import**
- **Entrée** : Données parsées + Mapping validé
- **Actions** :
  1. Transformer les données selon le mapping
     - Pour chaque ligne : créer un objet avec clés PrestaShop
     - Utiliser le mapping comme correspondance
     - Ignorer les colonnes non mappées
  2. Lancer l'import massif
  3. Traiter produit par produit
  4. Suivre la progression (X/Y produits)
  5. Générer un rapport avec résultats

- **Sortie** : 
  - Rapport d'import (succès/échecs)
  - Progression en %
  - Message de confirmation
- **Validation** : Tous les produits traités ✓

---

## États et Transitions

```
État              Conditions d'accès          Actions possibles
─────────────────────────────────────────────────────────────
Initiale          Toujours                    → Étape 1
Fichier choisi    File sélectionné            → Étape 2
Données prêtes    File + données parsées      → Étape 3
Mapping validé    Champs requis mappés        → Étape 4 ou Retour
En cours d'import Validation OK               Progression affichée
Import terminé    Import complet              Rapport visible
```

---

## Données Principales

### Champs Disponibles (PrestaShop)
- Nom du produit
- Référence produit
- Prix
- Quantité en stock
- Description
- Fabricant
- Poids
- Code EAN
- Statut actif/inactif

### Mapping
- Type : Dictionnaire (fichier column → PrestaShop field)
- Propriété : Peut être vide (colonne ignorée)
- Utilisation : Transformer chaque ligne de données

---

## Flux Décisionnel

### Validation du Fichier
```
Fichier sélectionné ?
  → OUI : Parser + Extraire colonnes + Auto-mapper
  → NON : Erreur + Rester étape 1
```

### Validation du Mapping
```
Nom ET Prix mappés ?
  → OUI : Autoriser l'import
  → NON : Afficher erreur + Rester étape 3
```

### Traitement des Erreurs
```
Erreur lors du parsing ?
  → Afficher message + Réinitialiser fichier
  
Erreur lors de l'import ?
  → Afficher message + Conserver rapport partiel
  
Succès ?
  → Afficher nombre produits importés + Rapport détaillé
```

---

## Mécanismes de Contrôle

### Progression
- Suivi : Produit courant / Total produits
- Formule : (Courant / Total) × 100 = %
- Affichage : En temps réel pendant l'import

### Rapport Final
- Produits importés avec succès (liste)
- Produits échoués (liste avec erreurs)
- Nombre total traité

### Réinitialisation
- Vider toutes les données
- Réinitialiser tous les états
- Revenir à l'étape 1
- Permettre un nouvel import

---

## Invariants du Système

1. **Intégrité** : Une ligne ne peut être importée que si tous ses champs requis sont présents
2. **Atomicité** : Chaque produit est traité indépendamment
3. **Traçabilité** : Chaque erreur est enregistrée avec raison
4. **Progression** : Le compteur de progression est continu (0% → 100%)
5. **Cohérence** : Le mapping ne change pas durant l'import
