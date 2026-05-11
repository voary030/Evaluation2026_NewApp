/**
 * Composable d'Import de Fichiers
 * Gère l'upload, parsing, mapping et import massif de produits
 */

import { ref, computed, reactive } from 'vue'
import { FileImporterService } from '@/services'
import { importMultipleProducts, importSingleProduct } from '@/api/import'

export function useFileImport() {
  // ============================================
  // ÉTAT DU COMPOSABLE
  // ============================================

  const file = ref(null)
  const parsedData = ref([])
  const loading = ref(false)
  const error = ref(null)
  const success = ref(null)
  const importProgress = ref(0)
  const importReport = ref(null)
  const step = ref(1)

  // Mapping des colonnes (clé: nom colonne fichier, valeur: champ PrestaShop)
  const columnMapping = reactive({})

  // ============================================
  // CHAMPS PRESTASHOP DISPONIBLES
  // ============================================

  const prestashopFields = [
    'name',
    'reference',
    'price',
    'quantity',
    'description',
    'id_manufacturer',
    'weight',
    'ean13',
    'active'
  ]

  // ============================================
  // COMPUTED
  // ============================================

  const columns = computed(() => {
    return parsedData.value.length > 0 ? Object.keys(parsedData.value[0]) : []
  })

  const rowCount = computed(() => {
    return parsedData.value.length
  })

  const isStep1Valid = computed(() => {
    return file.value !== null
  })

  const isStep2Valid = computed(() => {
    return parsedData.value.length > 0
  })

  const isStep3Valid = computed(() => {
    // Vérifier que les champs requis (name, price) sont mappés
    const mappedValues = Object.values(columnMapping)
    return mappedValues.includes('name') && mappedValues.includes('price')
  })

  // ============================================
  // MÉTHODES
  // ============================================

  /**
   * Gère la sélection du fichier
   */
  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) return

    error.value = null
    success.value = null

    try {
      loading.value = true
      file.value = selectedFile

      console.log(`[useFileImport.handleFileSelect] Fichier sélectionné: ${selectedFile.name}`)

      // Parser le fichier
      parsedData.value = await FileImporterService.parseFile(selectedFile)

      console.log(`[useFileImport.handleFileSelect] ${parsedData.value.length} ligne(s) parsée(s)`)

      // Auto-mapper les colonnes si les noms correspondent
      const autoMap = {}
      columns.value.forEach(col => {
        const lowerCol = col.toLowerCase()
        if (prestashopFields.includes(lowerCol)) {
          autoMap[col] = lowerCol
        }
      })
      
      // Mettre à jour le mapping avec les colonnes détectées
      Object.assign(columnMapping, autoMap)

      // Aller à l'étape 2 (aperçu)
      step.value = 2
    } catch (err) {
      error.value = `Erreur parsing fichier: ${err.message}`
      console.error('[useFileImport.handleFileSelect] Erreur:', err)
      file.value = null
    } finally {
      loading.value = false
    }
  }

  /**
   * Met à jour le mapping d'une colonne
   */
  const updateColumnMapping = (fileCol, psField) => {
    columnMapping[fileCol] = psField
    console.log(`[useFileImport.updateColumnMapping] ${fileCol} → ${psField || '(ignoré)'}`)
  }

  /**
   * Retourne les données mappées (transformées selon le mapping)
   */
  const getMappedData = () => {
    return parsedData.value.map(row => {
      const mapped = {}
      Object.entries(columnMapping).forEach(([fileCol, psField]) => {
        if (psField) {
          mapped[psField] = row[fileCol] || ''
        }
      })
      return mapped
    })
  }

  /**
   * Navigation entre les étapes
   */
  const goToStep3 = () => {
    if (isStep1Valid.value) {
      step.value = 3
    }
  }

  const goToStep4 = () => {
    if (isStep3Valid.value) {
      step.value = 4
      importProgress.value = 0
      importReport.value = null
    }
  }

  const goBack = () => {
    if (step.value > 1) {
      step.value -= 1
    }
  }

  /**
   * Lance l'import des produits
   */
  const importProducts = async () => {
    error.value = null
    success.value = null
    importReport.value = null

    if (!isStep3Valid.value) {
      error.value = 'Mapping invalide'
      return
    }

    try {
      loading.value = true

      // Récupérer les données mappées
      const mappedData = getMappedData()

      console.log(`[useFileImport.importProducts] Début import de ${mappedData.length} produit(s)`)

      // Lancer l'import avec callback de progression
      importReport.value = await importMultipleProducts(mappedData, (current, total) => {
        importProgress.value = (current / total) * 100
        console.log(`[useFileImport.importProducts] Progression: ${current}/${total}`)
      })

      // Afficher le rapport final
      success.value = `✅ Import terminé: ${importReport.value.successful.length}/${mappedData.length} produit(s) importé(s)`

      console.log('[useFileImport.importProducts] Rapport final:', importReport.value)
    } catch (err) {
      error.value = `Erreur import: ${err.message}`
      console.error('[useFileImport.importProducts] Erreur:', err)
    } finally {
      loading.value = false
      importProgress.value = 100
    }
  }

  /**
   * Réinitialise l'import
   */
  const resetImport = () => {
    file.value = null
    parsedData.value = []
    Object.keys(columnMapping).forEach(key => delete columnMapping[key])
    loading.value = false
    error.value = null
    success.value = null
    importProgress.value = 0
    importReport.value = null
    step.value = 1

    console.log('[useFileImport.resetImport] Import réinitialisé')
  }

  // ============================================
  // RETOUR PUBLIC
  // ============================================

  return {
    // État
    file,
    parsedData,
    loading,
    error,
    success,
    importProgress,
    importReport,
    step,
    columnMapping,

    // Computed
    columns,
    rowCount,
    prestashopFields,
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,

    // Méthodes
    handleFileSelect,
    goToStep3,
    goToStep4,
    goBack,
    updateColumnMapping,
    getMappedData,
    importProducts,
    resetImport
  }
}
