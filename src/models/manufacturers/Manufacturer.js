/**
 * Modèle Manufacturer - Logique Métier Fabricant
 * À implémenter selon les besoins
 */

export class Manufacturer {
  constructor(data = {}) {
    this.id = data.id || null
    this.name = data.name || 'Sans nom'
    this.active = data.active === 1 ? 1 : 0
  }
}
