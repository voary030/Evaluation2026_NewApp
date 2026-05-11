# 📊 Structure des Données - Référence

## 1. Format CSV d'Import

### Fichier 1: `produits.csv`

**Structure**:
```
date_produit,nom,reference,prix_ttc,taxe,categorie,prix_achat
01/12/2025,Tshirt,T_01,12.50,11.65%,Akanjo,8.00
02/05/2026,Pantalon,P_01,18.99,11.65%,Akanjo,12.00
08/05/2026,Casquette,C_03,5.00,5.60%,Accessoire,2.50
08/05/2026,Montre,M_02,56.00,5.60%,Accessoire,35.00
```

**Parsing JavaScript**:
```javascript
// Après parsing CSV
const produits = [
  {
    date_produit: '01/12/2025',
    nom: 'Tshirt',
    reference: 'T_01',
    prix_ttc: '12.50',
    taxe: '11.65%',
    categorie: 'Akanjo',
    prix_achat: '8.00'
  },
  // ...
]

// Conversion pour PrestaShop
for (const p of produits) {
  const taxeRate = parseFloat(p.taxe) / 100           // 0.1165
  const prixHT = parseFloat(p.prix_ttc) / (1 + taxeRate) // 12.50 / 1.1165 = 11.199
  
  const productXml = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop>
  <product>
    <name>
      <language id="1">${p.nom}</language>
    </name>
    <reference>${p.reference}</reference>
    <price>${prixHT.toFixed(2)}</price>
    <id_category_default>2</id_category_default>
    <active>1</active>
    <date_add>${convertDateFormat(p.date_produit)}</date_add>
  </product>
</prestashop>`
  
  // POST /products avec productXml
}
```

**Conversion Dates**:
```javascript
function convertDateFormat(frDate) {
  // Input: '01/12/2025'
  // Output: '2025-12-01 10:00:00'
  
  const [day, month, year] = frDate.split('/')
  return `${year}-${month}-${day} 10:00:00`
}
```

**Calculs Prix**:
```
Prix TTC = 12.50 €
Taxe = 11.65%

Prix HT = 12.50 / (1 + 0.1165)
        = 12.50 / 1.1165
        = 11.199 €
        ≈ 11.20 €

Vérification: 11.20 × 1.1165 = 12.4948 ≈ 12.50 ✓
```

---

### Fichier 2: `variantes.csv`

**Structure**:
```
reference,specificite,karazany,stock_initial,prix_vente_ttc
T_01,taille,ngoza,13,12.50
T_01,taille,kely,10,15.00
P_01,couleur,mainty,5,23.49
P_01,couleur,fotsy,3,18.99
C_03,,,10,
M_02,,,11,
```

**Parsing JavaScript**:
```javascript
const variantes = [
  {
    reference: 'T_01',
    specificite: 'taille',
    karazany: 'ngoza',
    stock_initial: '13',
    prix_vente_ttc: '12.50'
  },
  {
    reference: 'T_01',
    specificite: 'taille',
    karazany: 'kely',
    stock_initial: '10',
    prix_vente_ttc: '15.00'
  },
  // ...
]
```

**Logique**:
```javascript
// Grouper par référence
const byReference = {}
for (const v of variantes) {
  if (!byReference[v.reference]) {
    byReference[v.reference] = []
  }
  byReference[v.reference].push(v)
}

// Résultat:
{
  'T_01': [
    { specificite: 'taille', karazany: 'ngoza', stock_initial: 13, ... },
    { specificite: 'taille', karazany: 'kely', stock_initial: 10, ... }
  ],
  'P_01': [
    { specificite: 'couleur', karazany: 'mainty', stock_initial: 5, ... },
    { specificite: 'couleur', karazany: 'fotsy', stock_initial: 3, ... }
  ],
  'C_03': [
    { specificite: '', karazany: '', stock_initial: 10, prix_vente_ttc: '' }
  ],
  'M_02': [
    { specificite: '', karazany: '', stock_initial: 11, prix_vente_ttc: '' }
  ]
}
```

**Cas 1: Produit avec variantes** (T_01, P_01):
```
Créer attributs:
- Nom: "Taille" (id_attribute_group = ?)
  - Valeurs: "ngoza" (id = ?), "kely" (id = ?)
  
- Nom: "Couleur" (id_attribute_group = ?)
  - Valeurs: "mainty" (id = ?), "fotsy" (id = ?)

Créer combinaisons (POST /combinations):
Pour T_01:
  {
    id_product: 123,
    attributes: [
      { id: id_taille_ngoza },
      { id: id_taille_kely }
    ],
    reference: "T_01-ngoza" (ou T_01),
    ean13: "",
    wholesale_price: 0,
    price: 1.30 (12.50 - 11.20 = 1.30 TTC de markup),
    weight: 0,
    unit_price_impact: 1.30,
    minimal_quantity: 1,
    quantity: 13,
    low_stock_level: 0,
    low_stock_alert: 0,
    available_now: "In stock",
    available_later: "In stock"
  }
```

**Cas 2: Produit sans variantes** (C_03, M_02):
```
Pas de variantes = pas de combinaisons
Juste mettre à jour le stock du produit:
- Quantité: 10 pour C_03, 11 pour M_02
```

---

### Fichier 3: `clients.csv`

**Structure**:
```
date,nom,email,pwd,adresse,achat,etat
09/05/2026,Rakoto,rakoto@yopmail.com,XvzsX5O0!GBD0uXQ,Andoharanofotsy,"[("T_01",3,"ngoza")]",en attente paiement à la livraison
16/04/2026,Rajao,rajao1970@yopmail.com,BAC?UoxjQIW;Na8ix,Analakely,"[("T_01",2,"kely"),("C_03",1,"")]",paiement accepté
07/05/2026,Rakoto,rakoto@yopmail.com,XvzsX5O0!GBD0uXQ,Andoharanofotsy,"[("T_01",1,"kely")]",erreur de paiement
```

**Parsing achat (liste de tuples)**:

```javascript
// Achat: [("T_01",3,"ngoza")]
// Signifie: 3 unités de T_01 (variante taille ngoza)

function parseAchat(achatString) {
  // achatString = '[("T_01",3,"ngoza")]'
  
  // Regex pour extraire les tuples
  const regex = /\("([^"]+)",(\d+),"([^"]*)"\)/g
  const items = []
  let match
  
  while ((match = regex.exec(achatString)) !== null) {
    items.push({
      reference: match[1],    // T_01
      quantite: parseInt(match[2]),  // 3
      variante: match[3]      // ngoza
    })
  }
  
  return items
}

// Résultat:
[
  { reference: 'T_01', quantite: 3, variante: 'ngoza' },
  { reference: 'C_03', quantite: 1, variante: '' },
  // ...
]
```

**Parsing client**:

```javascript
const clients = [
  {
    date: '09/05/2026',
    nom: 'Rakoto',
    email: 'rakoto@yopmail.com',
    pwd: 'XvzsX5O0!GBD0uXQ',
    adresse: 'Andoharanofotsy',
    achat: '[("T_01",3,"ngoza")]',
    etat: 'en attente paiement à la livraison'
  },
  // ...
]

// Création cliente PrestaShop
for (const c of clients) {
  // 1. Chercher client par email
  const existingCustomer = await findCustomerByEmail(c.email)
  
  if (existingCustomer) {
    customerId = existingCustomer.id
  } else {
    // 2. Créer client
    const customerXml = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop>
  <customer>
    <firstname>${c.nom.split(' ')[0]}</firstname>
    <lastname>${c.nom.split(' ')[1] || ''}</lastname>
    <email>${c.email}</email>
    <passwd>${hashPassword(c.pwd)}</passwd>
    <active>1</active>
    <date_add>${convertDateFormat(c.date)}</date_add>
  </customer>
</prestashop>`
    
    const response = await createCustomer(customerXml)
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(response, 'text/xml')
    customerId = xmlDoc.querySelector('customer > id')?.textContent
  }
  
  // 3. Créer adresse
  const addressXml = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop>
  <address>
    <id_customer>${customerId}</id_customer>
    <firstname>${c.nom.split(' ')[0]}</firstname>
    <lastname>${c.nom.split(' ')[1] || ''}</lastname>
    <address1>${c.adresse}</address1>
    <city>Antananarivo</city>
    <postcode>101</postcode>
    <id_country>132</id_country>
    <active>1</active>
  </address>
</prestashop>`
    
    await createAddress(addressXml)
  
  // 4. Créer commande
  const items = parseAchat(c.achat)
  
  const cartXml = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop>
  <cart>
    <id_customer>${customerId}</id_customer>
    <id_address_delivery>${/* addressId */}</id_address_delivery>
    <id_currency>1</id_currency>
  </cart>
</prestashop>`
    
    const cartResponse = await createCart(cartXml)
    const cartId = new DOMParser()
      .parseFromString(cartResponse, 'text/xml')
      .querySelector('cart > id')?.textContent
  
  // 5. Ajouter articles au panier
  for (const item of items) {
    const product = await findProductByReference(item.reference)
    
    // Trouver la combinaison si variante
    let combinationId = null
    if (item.variante) {
      combinationId = await findCombination(product.id, item.variante)
    }
    
    const cartProductXml = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop>
  <cart_product>
    <id_cart>${cartId}</id_cart>
    <id_product>${product.id}</id_product>
    <id_product_attribute>${combinationId || 0}</id_product_attribute>
    <quantity>${item.quantite}</quantity>
  </cart_product>
</prestashop>`
    
    await createCartProduct(cartProductXml)
  }
  
  // 6. Créer commande à partir du panier
  const orderXml = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop>
  <order>
    <id_customer>${customerId}</id_customer>
    <id_cart>${cartId}</id_cart>
    <id_address_delivery>${/* addressId */}</id_address_delivery>
    <id_address_invoice>${/* addressId */}</id_address_invoice>
    <id_currency>1</id_currency>
    <id_payment_method>5</id_payment_method>
    <total_paid>42.50</total_paid>
    <total_paid_real>42.50</total_paid_real>
    <total_products>42.50</total_products>
    <total_products_wt>42.50</total_products_wt>
    <current_state>${mapState(c.etat)}</current_state>
    <date_add>${convertDateFormat(c.date)}</date_add>
  </order>
</prestashop>`
    
    await createOrder(orderXml)
}

function mapState(etatString) {
  // Mapping états
  const states = {
    'en attente paiement à la livraison': '1',
    'paiement accepté': '2',
    'erreur de paiement': '6',
    'annulé': '6'
  }
  return states[etatString] || '1'
}

function hashPassword(pwd) {
  // PrestaShop utilise MD5 par défaut
  // En NodeJS: require('crypto').createHash('md5').update(pwd).digest('hex')
  // En front: ne pas hasher ici, envoyer au serveur pour hasher
  return pwd
}
```

---

## 2. Format ZIP Images

### Structure `images.zip`

```
images.zip
├── C_03.png         → Produit C_03 (Casquette)
├── M_02.jpeg        → Produit M_02 (Montre)
├── P_01.png         → Produit P_01 (Pantalon)
└── T_01.png         → Produit T_01 (Tshirt)
```

**Extraction et Upload**:

```javascript
import JSZip from 'jszip'

async function importImages(zipFile) {
  const zip = new JSZip()
  const zipContent = await zip.loadAsync(zipFile)
  
  for (const filename of Object.keys(zipContent.files)) {
    if (filename.endsWith('/')) continue
    
    // Exemple: filename = 'T_01.png'
    const reference = filename.split('.')[0]  // 'T_01'
    
    // 1. Trouver le produit par référence
    const product = await findProductByReference(reference)
    if (!product) {
      console.warn(`Produit ${reference} non trouvé`)
      continue
    }
    
    // 2. Récupérer le contenu du fichier
    const imageBlob = await zipContent.files[filename].async('blob')
    const imageFile = new File([imageBlob], filename, { type: 'image/png' })
    
    // 3. Upload l'image
    try {
      const response = await uploadProductImage(product.id, imageFile)
      console.log(`Image ${filename} uploadée pour produit ${product.id}`)
    } catch (err) {
      console.error(`Erreur upload ${filename}:`, err.message)
    }
  }
}
```

---

## 3. Format XML PrestaShop - Exemples

### Créer Produit

**Request**: `POST /products`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<prestashop>
  <product>
    <id></id>
    <id_manufacturer></id_manufacturer>
    <id_supplier></id_supplier>
    <reference>T_01</reference>
    <supplier_reference></supplier_reference>
    <name>
      <language id="1">Tshirt</language>
    </name>
    <description>
      <language id="1"></language>
    </description>
    <price>11.20</price>
    <wholesale_price></wholesale_price>
    <on_sale>0</on_sale>
    <online_only>0</online_only>
    <ean13></ean13>
    <id_category_default>2</id_category_default>
    <active>1</active>
    <date_add>2025-12-01 10:00:00</date_add>
  </product>
</prestashop>
```

**Response**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<prestashop>
  <product>
    <id>123</id>
    <id_manufacturer></id_manufacturer>
    <!-- ... -->
    <name>
      <language id="1">Tshirt</language>
    </name>
    <!-- ... -->
  </product>
</prestashop>
```

### Créer Combinaison

**Request**: `POST /combinations`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<prestashop>
  <combination>
    <id_product>123</id_product>
    <reference>T_01</reference>
    <supplier_reference></supplier_reference>
    <ean13></ean13>
    <wholesale_price>0</wholesale_price>
    <price>1.30</price>
    <unit_price_impact>1.30</unit_price_impact>
    <minimal_quantity>1</minimal_quantity>
    <quantity>13</quantity>
    <available_now>In stock</available_now>
    <available_later>In stock</available_later>
    <attributes>
      <attribute>
        <id>5</id>
      </attribute>
    </attributes>
  </combination>
</prestashop>
```

### Créer Commande

**Request**: `POST /orders`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<prestashop>
  <order>
    <id_customer>456</id_customer>
    <id_cart>789</id_cart>
    <id_currency>1</id_currency>
    <id_address_delivery>100</id_address_delivery>
    <id_address_invoice>100</id_address_invoice>
    <current_state>1</current_state>
    <total_paid>37.50</total_paid>
    <total_paid_real>37.50</total_paid_real>
    <total_products>37.50</total_products>
    <total_products_wt>37.50</total_products_wt>
    <date_add>2026-05-09 10:00:00</date_add>
  </order>
</prestashop>
```

### Modifier État Commande

**Request**: `PUT /orders/1001`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<prestashop>
  <order>
    <id>1001</id>
    <current_state>2</current_state>
  </order>
</prestashop>
```

---

## 4. SessionStorage - Structure Panier

### Format Panier

```javascript
// sessionStorage.getItem('newapp_cart')
{
  items: [
    {
      key: "T_01_ngoza",           // reference_variante
      reference: "T_01",
      name: "Tshirt",
      variante: "ngoza",           // spécificité
      quantity: 3,
      priceTTC: 12.50,             // Prix TTC par unité
      priceHT: 11.20,              // Prix HT par unité
      subtotal: 37.50              // quantity × priceTTC
    },
    {
      key: "C_03_",
      reference: "C_03",
      name: "Casquette",
      variante: "",
      quantity: 1,
      priceTTC: 5.00,
      priceHT: 4.73,
      subtotal: 5.00
    }
  ],
  total: 42.50,
  lastUpdated: 1715329200000
}
```

---

## 5. Données Résultantes après Import

### Produits Créés

| ID | Référence | Nom | Prix HT | Prix TTC | Catégorie | Stock |
|----|-----------|-----|---------|----------|-----------|-------|
| 123 | T_01 | Tshirt | 11.20 | 12.50 | Akanjo | - |
| 124 | P_01 | Pantalon | 16.97 | 18.99 | Akanjo | - |
| 125 | C_03 | Casquette | 4.73 | 5.00 | Accessoire | 10 |
| 126 | M_02 | Montre | 53.01 | 56.00 | Accessoire | 11 |

### Variantes Créées

| ID Produit | Référence | Variante | Valeur | Stock | Prix TTC |
|-----------|-----------|----------|--------|-------|----------|
| 123 | T_01 | Taille | ngoza | 13 | 12.50 |
| 123 | T_01 | Taille | kely | 10 | 15.00 |
| 124 | P_01 | Couleur | mainty | 5 | 23.49 |
| 124 | P_01 | Couleur | fotsy | 3 | 18.99 |

### Clients Créés

| ID | Email | Nom |
|----|-------|-----|
| 456 | rakoto@yopmail.com | Rakoto |
| 457 | rajao1970@yopmail.com | Rajao |

### Commandes Créées

| ID | Client | Date | Articles | Total | État |
|----|--------|------|----------|-------|------|
| 1001 | 456 (Rakoto) | 09/05/2026 | T_01(ngoza)×3 | 37.50 | En attente paiement |
| 1002 | 457 (Rajao) | 16/04/2026 | T_01(kely)×2, C_03×1 | 45.99 | Paiement accepté |
| 1003 | 456 (Rakoto) | 07/05/2026 | T_01(kely)×1 | 15.00 | Erreur paiement |

---

## 6. Validation Données

### Règles de Validation

```javascript
// Produits
- nom: min 3, max 128 caractères
- reference: unique, alphanumériques + tirets
- prix_ttc: > 0
- taxe: 0-100%

// Variantes
- stock_initial: >= 0
- prix_vente_ttc: > 0 (optionnel si prix_produit)

// Clients
- email: format valide, unique
- pwd: min 8 caractères
- adresse: min 5 caractères

// Commandes
- achat: liste non vide
- quantite: > 0
- etat: dans la liste prédéfinie
```

---

**Document créé**: 11 mai 2026
**Version**: 1.0

