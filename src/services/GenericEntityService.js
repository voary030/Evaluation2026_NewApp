/**
 * Generic Entity Service
 * CRUD abstrait pour éviter la duplication entre les composables
 * 
 * Pattern:
 * - delete() → Appelle l'API de suppression et retourne le résultat
 * - create() → Appelle l'API de création
 * - update() → Appelle l'API de modification
 * - showMessage() → Affiche un message de succès temporaire
 * 
 * Utilisé par useProducts, useCategories, etc.
 */

export class GenericEntityService {
  /**
   * Supprime une entité et gère les états
   * 
   * @async
   * @param {Function} deleteApi - Fonction API de suppression (id) => Promise
   * @param {number|string} id - ID de l'entité
   * @param {Object} refs - Refs réactives {loading, error, success, entities}
   * @param {Object} options - Options additionnelles
   * @returns {Promise<boolean>} true si succès, false si erreur
   */
  static async delete(deleteApi, id, refs, options = {}) {
    const {
      successMessage = 'Entité supprimée avec succès',
      errorPrefix = 'Erreur suppression:',
      updateList = null
    } = options

    refs.loading.value = true
    refs.error.value = null

    try {
      await deleteApi(id)

      // Mise à jour optimiste du tableau local si fourni
      if (updateList && refs.entities?.value) {
        refs.entities.value = refs.entities.value.filter((e) => e.id !== id)
      }

      // Afficher le succès temporairement
      refs.success.value = successMessage
      setTimeout(() => (refs.success.value = null), 3000)

      return true
    } catch (err) {
      refs.error.value = `${errorPrefix} ${err.message}`
      console.error(errorPrefix, err)
      return false
    } finally {
      refs.loading.value = false
    }
  }

  /**
   * Crée une entité et gère les états
   * 
   * @async
   * @param {Function} createApi - Fonction API de création (xml) => Promise
   * @param {string} xml - Données XML de l'entité
   * @param {Object} refs - Refs réactives {loading, error, success}
   * @param {Function} reloadFn - Fonction pour recharger la liste (optionnel)
   * @param {Object} options - Options additionnelles
   * @returns {Promise<boolean>} true si succès, false si erreur
   */
  static async create(createApi, xml, refs, reloadFn = null, options = {}) {
    const {
      successMessage = 'Entité créée avec succès',
      errorPrefix = 'Erreur création:'
    } = options

    refs.loading.value = true
    refs.error.value = null

    try {
      await createApi(xml)

      refs.success.value = successMessage
      setTimeout(() => (refs.success.value = null), 3000)

      // Recharger la liste si fourni
      if (reloadFn) {
        await reloadFn()
      }

      return true
    } catch (err) {
      refs.error.value = `${errorPrefix} ${err.message}`
      console.error(errorPrefix, err)
      return false
    } finally {
      refs.loading.value = false
    }
  }

  /**
   * Modifie une entité et gère les états
   * 
   * @async
   * @param {Function} updateApi - Fonction API de modification (id, xml) => Promise
   * @param {number|string} id - ID de l'entité
   * @param {string} xml - Données XML actualisées
   * @param {Object} refs - Refs réactives {loading, error, success}
   * @param {Function} reloadFn - Fonction pour recharger la liste (optionnel)
   * @param {Object} options - Options additionnelles
   * @returns {Promise<boolean>} true si succès, false si erreur
   */
  static async update(updateApi, id, xml, refs, reloadFn = null, options = {}) {
    const {
      successMessage = 'Entité mise à jour avec succès',
      errorPrefix = 'Erreur mise à jour:'
    } = options

    refs.loading.value = true
    refs.error.value = null

    try {
      await updateApi(id, xml)

      refs.success.value = successMessage
      setTimeout(() => (refs.success.value = null), 3000)

      // Recharger la liste si fourni
      if (reloadFn) {
        await reloadFn()
      }

      return true
    } catch (err) {
      refs.error.value = `${errorPrefix} ${err.message}`
      console.error(errorPrefix, err)
      return false
    } finally {
      refs.loading.value = false
    }
  }

  /**
   * Gère un appel API générique avec états
   * Utile pour fetch, fetch avancés, etc.
   * 
   * @async
   * @param {Function} apiFn - Fonction API qui retourne des données
   * @param {Object} refs - Refs réactives {loading, error, success}
   * @param {Object} options - Options additionnelles
   * @returns {Promise<any>} Données retournées par l'API
   */
  static async call(apiFn, refs, options = {}) {
    const {
      loadingMessage = null,
      successMessage = null,
      errorPrefix = 'Erreur:'
    } = options

    refs.loading.value = true
    refs.error.value = null

    try {
      const result = await apiFn()

      if (successMessage) {
        refs.success.value = successMessage
        setTimeout(() => (refs.success.value = null), 3000)
      }

      return result
    } catch (err) {
      refs.error.value = `${errorPrefix} ${err.message}`
      console.error(errorPrefix, err)
      throw err
    } finally {
      refs.loading.value = false
    }
  }

  /**
   * Vérifie si une entité peut être modifiée (n'a pas d'erreurs bloquantes)
   * @param {Object} entity - Objet entité
   * @returns {Object} {valid: boolean, errors: string[]}
   */
  static validateEntity(entity) {
    const errors = []

    if (!entity) {
      errors.push('Entité vide')
    }

    if (!entity.id) {
      errors.push('ID manquant')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Crée une copie profonde d'une entité pour édition
   * (évite de modifier l'original avant confirmation)
   * @param {Object} entity - Entité source
   * @returns {Object} Copie profonde
   */
  static cloneEntity(entity) {
    return JSON.parse(JSON.stringify(entity))
  }

  /**
   * Compare deux entités et retourne les changements
   * @param {Object} original - Version originale
   * @param {Object} modified - Version modifiée
   * @returns {Object} {changed: boolean, diff: {field: {from, to}}}
   */
  static diffEntity(original, modified) {
    const diff = {}
    let changed = false

    Object.keys(modified).forEach((key) => {
      if (original[key] !== modified[key]) {
        diff[key] = {
          from: original[key],
          to: modified[key]
        }
        changed = true
      }
    })

    return { changed, diff }
  }
}
