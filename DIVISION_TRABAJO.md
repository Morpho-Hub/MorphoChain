# 🎯 DIVISIÓN DE TRABAJO - MORPHOCHAIN BACKEND

## 📊 RESUMEN DE MODELOS CREADOS

Todos los modelos están listos en `backend/models/`:

✅ **user.js** - Usuarios (farmers, investors, admins)
✅ **farm.js** - Fincas/Plantaciones con referencia a NFTs
✅ **investment.js** - Inversiones con referencia blockchain
✅ **product.js** - Productos del marketplace
✅ **transaction.js** - Historial de transacciones on-chain y off-chain
✅ **impactMetrics.js** - Métricas de impacto ambiental y social

---

## 👨‍💻 PERSONA 1: BACKEND 2.0 (OFF-CHAIN)
**Tu colega se enfoca en la lógica de negocio tradicional y base de datos**

### 📋 CHECKLIST COMPLETA

#### **FASE 1: Setup y Configuración (2-3 días)**

- [ ] **1.1 Mejorar index.js**
  ```javascript
  // Agregar:
  - CORS configurado correctamente
  - Body parser (express.json())
  - Error handling middleware global
  - Rate limiting
  - Helmet para seguridad
  - Morgan para logging
  ```

- [ ] **1.2 Completar archivo .env**
  ```env
  # Variables necesarias:
  MONGODB_URI=mongodb://localhost:27017/morphochain
  JWT_SECRET=tu_jwt_secret_seguro
  GOOGLE_CLIENT_ID=tu_google_client_id
  PORT=5000
  NODE_ENV=development
  FRONTEND_URL=http://localhost:3000
  ```

- [ ] **1.3 Crear estructura de carpetas faltantes**
  ```
  backend/
  ├── config/
  │   └── database.js (configuración de MongoDB)
  ├── utils/
  │   ├── errorHandler.js
  │   └── apiResponse.js
  └── constants/
      └── messages.js
  ```

---

#### **FASE 2: Middlewares (1-2 días)**

- [ ] **2.1 Middleware de Autenticación**
  ```javascript
  // middlewares/auth.js
  - Verificar JWT token
  - Extraer usuario del token
  - Adjuntar user al req.user
  - Manejo de errores de token expirado
  ```

- [ ] **2.2 Middleware de Roles**
  ```javascript
  // middlewares/role.js
  - requireRole(['farmer', 'admin'])
  - Verificar si el usuario tiene el rol necesario
  ```

- [ ] **2.3 Middleware de Validación**
  ```javascript
  // middlewares/validation.js
  - Validar datos de entrada
  - Sanitizar inputs
  - Usar express-validator o Joi
  ```

- [ ] **2.4 Middleware de Error Handling**
  ```javascript
  // middlewares/errorHandler.js
  - Capturar todos los errores
  - Formatear respuestas de error
  - Logging de errores
  ```

---

#### **FASE 3: Controladores Core (3-4 días)**

- [ ] **3.1 Farm Controller** (`controllers/farmController.js`)
  ```javascript
  Funciones a implementar:
  
  - getAllFarms(req, res)
    • Query params: page, limit, status, cropType, country
    • Filtros y paginación
    • Populate owner information
  
  - getFarmById(req, res)
    • Obtener detalles completos de una finca
    • Incluir inversores, productos relacionados
    • Incrementar views
  
  - createFarm(req, res) [SOLO FARMER]
    • Validar que el usuario sea farmer
    • Crear finca en estado 'draft'
    • Retornar farmId para que Backend 3.0 cree el NFT
  
  - updateFarm(req, res) [SOLO OWNER]
    • Actualizar información
    • No permitir cambiar tokenId
  
  - deleteFarm(req, res) [SOLO OWNER/ADMIN]
    • Soft delete o hard delete
  
  - updateFarmTokenId(req, res) [INTERNAL]
    • Llamado por Backend 3.0 después de mint NFT
    • Actualizar campo tokenId
  
  - getFarmsByOwner(req, res)
    • Todas las fincas de un agricultor
  
  - getPublicFarms(req, res)
    • Solo fincas con status 'active'
  
  - addHarvest(req, res)
    • Agregar registro de cosecha
  
  - updateInvestmentProgress(req, res)
    • Actualizar currentInvestment cuando llega inversión
  ```

- [ ] **3.2 Product Controller** (`controllers/productController.js`)
  ```javascript
  Funciones a implementar:
  
  - getAllProducts(req, res)
    • Filtros: category, seller, farm, priceRange
    • Ordenar por: price, date, popularity
    • Solo productos con status 'active'
  
  - getProductById(req, res)
    • Detalles completos
    • Incrementar views
  
  - createProduct(req, res) [SOLO FARMER]
    • Crear producto en estado 'draft'
    • Validar que la farm pertenezca al seller
  
  - updateProduct(req, res) [SOLO OWNER]
    • Actualizar información y stock
  
  - deleteProduct(req, res) [SOLO OWNER/ADMIN]
  
  - updateProductListingId(req, res) [INTERNAL]
    • Llamado por Backend 3.0 después de listar en marketplace
  
  - getProductsBySeller(req, res)
  
  - getProductsByFarm(req, res)
  
  - reduceStock(req, res) [INTERNAL]
    • Llamado después de compra exitosa
  
  - updateProductRating(req, res)
  ```

- [ ] **3.3 User Controller** (`controllers/userController.js`)
  ```javascript
  Funciones a implementar:
  
  - getProfile(req, res)
    • Obtener perfil del usuario autenticado
  
  - updateProfile(req, res)
    • Actualizar información personal
    • Bio, phone, country, preferences
  
  - updateRole(req, res)
    • Cambiar rol de user a farmer o investor
    • Validaciones necesarias
  
  - getFarmerStats(req, res)
    • Estadísticas para dashboard de farmer
    • Total farms, investments received, products sold
  
  - getInvestorStats(req, res)
    • Estadísticas para dashboard de investor
    • Total invested, active investments, ROI
  
  - uploadProfilePicture(req, res)
    • Subir imagen (usar multer o servicio cloud)
  
  - getUserByWallet(req, res)
    • Buscar usuario por wallet address
  
  - updateTokenBalance(req, res) [INTERNAL]
    • Sincronizar balance desde blockchain
  ```

- [ ] **3.4 Dashboard Controller** (`controllers/dashboardController.js`)
  ```javascript
  Funciones a implementar:
  
  - getFarmerDashboard(req, res)
    • Resumen completo para farmer:
    • - Lista de farms con estado
    • - Inversiones recibidas
    • - Productos activos
    • - Ingresos totales
    • - Métricas de impacto
  
  - getInvestorDashboard(req, res)
    • Resumen completo para investor:
    • - Portfolio de inversiones
    • - ROI actual
    • - Distribuciones recibidas
    • - Farms en las que invirtió
    • - Métricas de impacto contribuido
  
  - getAdminDashboard(req, res)
    • Estadísticas globales de la plataforma
  ```

- [ ] **3.5 Investment Controller** (`controllers/investmentController.js`)
  ```javascript
  Funciones a implementar:
  
  - createInvestment(req, res) [INTERNAL]
    • Llamado por Backend 3.0 después de tx blockchain
    • Crear registro de inversión
    • Actualizar farm.currentInvestment
    • Actualizar user.investorData
  
  - getInvestmentById(req, res)
  
  - getInvestmentsByUser(req, res)
    • Todas las inversiones de un usuario
  
  - getInvestmentsByFarm(req, res)
    • Todos los inversores de una finca
  
  - addDistribution(req, res) [INTERNAL]
    • Agregar pago de dividendo
  
  - updateInvestmentStatus(req, res) [INTERNAL]
  ```

- [ ] **3.6 Transaction Controller** (`controllers/transactionController.js`)
  ```javascript
  Funciones a implementar:
  
  - createTransaction(req, res) [INTERNAL]
    • Crear registro de transacción
    • Llamado por Backend 3.0
  
  - getTransactionById(req, res)
  
  - getTransactionByHash(req, res)
    • Buscar por blockchain hash
  
  - getTransactionsByUser(req, res)
    • Historial de transacciones del usuario
  
  - getTransactionsByWallet(req, res)
  
  - updateTransactionStatus(req, res) [INTERNAL]
    • Actualizar estado cuando cambia en blockchain
  ```

- [ ] **3.7 Impact Metrics Controller** (`controllers/impactMetricsController.js`)
  ```javascript
  Funciones a implementar:
  
  - getMetricsByUser(req, res)
    • Métricas de impacto de un usuario
  
  - getMetricsByFarm(req, res)
    • Métricas de impacto de una finca
  
  - getPlatformMetrics(req, res)
    • Métricas globales de la plataforma
  
  - createMetrics(req, res)
    • Crear o actualizar métricas
  
  - calculateImpactScore(req, res)
    • Calcular score general
  ```

---

#### **FASE 4: Rutas (1 día)**

- [ ] **4.1 Crear todas las rutas**
  ```javascript
  // routes/farmRoutes.js
  // routes/productRoutes.js
  // routes/userRoutes.js
  // routes/dashboardRoutes.js
  // routes/investmentRoutes.js
  // routes/transactionRoutes.js
  // routes/impactRoutes.js
  ```

- [ ] **4.2 Registrar rutas en index.js**
  ```javascript
  app.use('/api/auth', authRoutes);
  app.use('/api/farms', farmRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/investments', investmentRoutes);
  app.use('/api/transactions', transactionRoutes);
  app.use('/api/impact', impactRoutes);
  ```

---

#### **FASE 5: Servicios Auxiliares (2 días)**

- [ ] **5.1 Email Service** (mejorar el existente)
  ```javascript
  // services/emailService.js
  - sendWelcomeEmail(user)
  - sendInvestmentConfirmation(investment)
  - sendHarvestNotification(farm)
  - sendDistributionNotification(distribution)
  ```

- [ ] **5.2 Upload Service**
  ```javascript
  // services/uploadService.js
  - uploadImage(file)
  - deleteImage(url)
  - Usar Cloudinary o AWS S3
  ```

- [ ] **5.3 Analytics Service**
  ```javascript
  // services/analyticsService.js
  - calculateFarmerStats(userId)
  - calculateInvestorStats(userId)
  - calculatePlatformStats()
  - generateReport(type, filters)
  ```

- [ ] **5.4 Notification Service**
  ```javascript
  // services/notificationService.js
  - sendNotification(userId, type, data)
  - In-app notifications
  ```

---

#### **FASE 6: Testing y Documentación (2 días)**

- [ ] **6.1 Testing con Postman/Thunder Client**
  - Crear colección de requests
  - Probar todos los endpoints
  - Verificar autenticación y roles

- [ ] **6.2 Documentación API**
  - Documentar todos los endpoints
  - Request/Response examples
  - Códigos de error

---

## 🚀 PERSONA 2: BACKEND 3.0 (ON-CHAIN) - TÚ
**Te enfocas en la integración blockchain con Thirdweb**

### 📋 CHECKLIST COMPLETA

#### **FASE 1: Setup Thirdweb (1 día)**

- [ ] **1.1 Instalar dependencias**
  ```bash
  # Backend
  cd backend
  npm install @thirdweb-dev/sdk ethers dotenv
  
  # Frontend
  cd ../client
  npm install thirdweb @thirdweb-dev/react @thirdweb-dev/chains
  ```

- [ ] **1.2 Configurar variables de entorno**
  ```env
  # backend/.env - agregar:
  THIRDWEB_SECRET_KEY=tu_secret_key
  WALLET_PRIVATE_KEY=tu_private_key (para transacciones del backend)
  BLOCKCHAIN_NETWORK=sepolia
  MORPHOCOIN_ADDRESS=0x6e81...421c
  PLANTATION_MANAGER_ADDRESS=0xef67...ba00
  MORPHO_MARKETPLACE_ADDRESS=0x35ac...7d66
  ```

- [ ] **1.3 Extraer ABIs de los contratos**
  - Ir a Thirdweb dashboard
  - Copiar ABI de cada contrato
  - Crear archivos:
    ```
    backend/contracts/abis/MorphoCoin.json
    backend/contracts/abis/PlantationManager.json
    backend/contracts/abis/MorphoMarketplace.json
    ```

---

#### **FASE 2: Servicio Blockchain Base (2 días)**

- [ ] **2.1 Crear BlockchainService**
  ```javascript
  // services/blockchainService.js
  
  class BlockchainService {
    constructor() {
      this.sdk = null;
      this.morphoCoin = null;
      this.plantationManager = null;
      this.marketplace = null;
    }
    
    async initialize() {
      // Inicializar SDK con private key del backend
      this.sdk = ThirdwebSDK.fromPrivateKey(
        process.env.WALLET_PRIVATE_KEY,
        process.env.BLOCKCHAIN_NETWORK
      );
      
      // Cargar contratos
      this.morphoCoin = await this.sdk.getContract(
        process.env.MORPHOCOIN_ADDRESS
      );
      
      this.plantationManager = await this.sdk.getContract(
        process.env.PLANTATION_MANAGER_ADDRESS
      );
      
      this.marketplace = await this.sdk.getContract(
        process.env.MORPHO_MARKETPLACE_ADDRESS
      );
    }
    
    // Método helper para manejar errores blockchain
    async executeTransaction(transaction, description) {
      try {
        console.log(\`Executing: \${description}\`);
        const result = await transaction;
        console.log(\`Success: \${description}\`, result);
        return { success: true, result };
      } catch (error) {
        console.error(\`Error: \${description}\`, error);
        return { success: false, error: error.message };
      }
    }
  }
  
  export const blockchainService = new BlockchainService();
  ```

- [ ] **2.2 Inicializar en index.js**
  ```javascript
  // En backend/index.js
  import { blockchainService } from './services/blockchainService.js';
  
  // Después de conectar MongoDB
  await blockchainService.initialize();
  console.log('Blockchain service initialized');
  ```

---

#### **FASE 3: Servicios por Contrato (3-4 días)**

- [ ] **3.1 MorphoCoin Service**
  ```javascript
  // services/morphoCoinService.js
  
  Funciones a implementar:
  
  - getBalance(walletAddress)
    • Obtener balance de MorphoCoin de una wallet
  
  - getTotalSupply()
    • Total supply del token
  
  - transfer(from, to, amount)
    • Transferir tokens (si el backend tiene permisos)
  
  - approve(spender, amount)
    • Aprobar gasto de tokens
  
  - getAllowance(owner, spender)
    • Ver cuánto puede gastar un spender
  
  - getTokenInfo()
    • Nombre, símbolo, decimales del token
  ```

- [ ] **3.2 Plantation Service**
  ```javascript
  // services/plantationService.js
  
  Funciones a implementar:
  
  - mintPlantation(farmData, ownerWallet)
    • Crear NFT de plantación
    • farmData: { name, description, metadata }
    • Retornar: tokenId
  
  - getPlantation(tokenId)
    • Obtener datos del NFT
    • Owner, metadata, etc.
  
  - transferPlantation(tokenId, fromWallet, toWallet)
    • Transferir ownership del NFT
  
  - getPlantationsByOwner(ownerWallet)
    • Todos los NFTs de un owner
  
  - updatePlantationMetadata(tokenId, newMetadata)
    • Actualizar metadata si es posible
  
  - getPlantationHistory(tokenId)
    • Historial de transfers
  ```

- [ ] **3.3 Marketplace Service**
  ```javascript
  // services/marketplaceService.js
  
  Funciones a implementar:
  
  - listProduct(productData, sellerWallet)
    • Listar producto en marketplace
    • productData: { price, quantity, productId }
    • Retornar: listingId
  
  - buyProduct(listingId, buyerWallet, quantity)
    • Comprar producto
    • Retornar: transactionHash
  
  - cancelListing(listingId, sellerWallet)
    • Cancelar un listing
  
  - getActiveListing(listingId)
    • Obtener detalles de un listing
  
  - getActiveListings()
    • Todos los listings activos
  
  - getListingsBySeller(sellerWallet)
    • Listings de un vendedor
  
  - updateListingPrice(listingId, newPrice)
    • Actualizar precio
  ```

---

#### **FASE 4: Controlador Blockchain (2 días)**

- [ ] **4.1 Crear blockchainController.js**
  ```javascript
  // controllers/blockchainController.js
  
  import { plantationService } from '../services/plantationService.js';
  import { morphoCoinService } from '../services/morphoCoinService.js';
  import { marketplaceService } from '../services/marketplaceService.js';
  import { Farm, Transaction } from '../models/index.js';
  
  Endpoints a implementar:
  
  - POST /api/blockchain/mint-farm
    • Recibir farmId de MongoDB
    • Mint NFT en PlantationManager
    • Actualizar farm en MongoDB con tokenId
    • Crear Transaction record
  
  - GET /api/blockchain/farm/:tokenId
    • Obtener datos del NFT
  
  - POST /api/blockchain/invest
    • Procesar inversión en blockchain
    • Crear Investment en MongoDB
    • Crear Transaction
    • Actualizar Farm.currentInvestment
  
  - POST /api/blockchain/list-product
    • Recibir productId
    • Listar en marketplace
    • Actualizar Product con listingId
  
  - POST /api/blockchain/buy-product
    • Comprar producto
    • Reducir stock en MongoDB
    • Crear Transaction
  
  - GET /api/blockchain/wallet/:address/balance
    • Balance de MorphoCoin
  
  - GET /api/blockchain/wallet/:address/portfolio
    • Todas las plantations (NFTs) del wallet
    • Todas las inversiones
  
  - POST /api/blockchain/transfer-farm
    • Transferir NFT de plantación
  
  - GET /api/blockchain/transaction/:hash
    • Verificar estado de transacción en blockchain
  ```

---

#### **FASE 5: Frontend - Integración Thirdweb (3-4 días)**

- [ ] **5.1 Setup ThirdwebProvider**
  ```typescript
  // client/app/providers.tsx
  import { ThirdwebProvider } from 'thirdweb/react';
  
  export function Providers({ children }) {
    return (
      <ThirdwebProvider
        clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
        activeChain="sepolia"
      >
        {children}
      </ThirdwebProvider>
    );
  }
  ```

- [ ] **5.2 Crear Web3Context**
  ```typescript
  // client/contexts/Web3Context.tsx
  
  - Estado de wallet conectada
  - Balance de MorphoCoin
  - Funciones para conectar/desconectar
  - Sincronización con backend
  ```

- [ ] **5.3 Crear hooks custom**
  ```typescript
  // client/hooks/useContract.ts
  // client/hooks/useMorphoCoin.ts
  // client/hooks/usePlantation.ts
  // client/hooks/useMarketplace.ts
  
  Hooks para interactuar fácilmente con contratos
  ```

- [ ] **5.4 Componentes Web3**
  ```typescript
  // src/atoms/ConnectWalletButton.tsx
  - Botón para conectar wallet
  - Display de wallet address
  
  // src/atoms/TokenBalance.tsx
  - Mostrar balance de MorphoCoin
  
  // src/molecules/TransactionStatus.tsx
  - Mostrar estado de transacciones
  - Loading, success, error
  
  // src/molecules/ApproveTokens.tsx
  - Aprobar gasto de tokens antes de operación
  ```

- [ ] **5.5 Integrar en páginas existentes**
  ```typescript
  // app/finca/[id]/page.tsx
  - Botón "Invertir" que use blockchain
  
  // app/mercado/page.tsx
  - Botón "Comprar" que use marketplace
  
  // app/perfil/page.tsx
  - Mostrar balance de tokens
  - Mostrar NFTs owned
  ```

---

#### **FASE 6: Sincronización Backend 2.0 ↔ 3.0 (2-3 días)**

- [ ] **6.1 Webhooks o Event Listeners**
  ```javascript
  // services/blockchainListener.js
  
  - Escuchar eventos del blockchain
  - Cuando hay una transacción nueva, actualizar MongoDB
  - Eventos: Transfer, Purchase, Investment, etc.
  ```

- [ ] **6.2 Endpoints de sincronización**
  ```javascript
  - POST /api/sync/farm/:farmId
    • Sincronizar farm con blockchain
  
  - POST /api/sync/user/:wallet
    • Sincronizar balance y NFTs
  
  - POST /api/sync/transaction/:hash
    • Sincronizar estado de transacción
  ```

---

#### **FASE 7: Testing y Debug (2 días)**

- [ ] **7.1 Probar flujos completos**
  - Crear farm → Mint NFT → Listar
  - Invertir en farm → Transacción blockchain → Record en DB
  - Listar producto → Comprar → Reducir stock

- [ ] **7.2 Manejo de errores**
  - Gas insuficiente
  - Transacción rechazada
  - Wallet no conectada
  - Saldo insuficiente

---

## 🔄 PUNTOS DE INTEGRACIÓN CRÍTICOS

### **1. Crear Farm con NFT**
```
PERSONA 1 (2.0):
→ Usuario crea farm
→ POST /api/farms
→ Guarda en MongoDB
→ Retorna { farmId, owner }

PERSONA 2 (3.0):
→ POST /api/blockchain/mint-farm
→ Body: { farmId, owner }
→ Mint NFT
→ Retorna { tokenId, transactionHash }

PERSONA 1 (2.0):
→ PUT /api/farms/:farmId/tokenId
→ Actualiza farm.tokenId
→ farm.status = 'active'
```

### **2. Invertir en Farm**
```
PERSONA 2 (3.0):
→ Usuario hace inversión
→ POST /api/blockchain/invest
→ Transacción blockchain
→ Retorna { txHash, amount, tokenId }

PERSONA 1 (2.0):
→ POST /api/investments (llamado interno)
→ Crea Investment en MongoDB
→ Actualiza Farm.currentInvestment
→ Actualiza User.investorData
→ Envía email de confirmación
```

### **3. Comprar Producto**
```
PERSONA 2 (3.0):
→ Usuario compra producto
→ POST /api/blockchain/buy-product
→ Transacción en marketplace
→ Retorna { txHash, productId, quantity }

PERSONA 1 (2.0):
→ PUT /api/products/:id/stock (llamado interno)
→ Reduce stock
→ Crea Transaction
→ Actualiza Product.soldQuantity
```

---

## 📊 TIMELINE ESTIMADO

### Semana 1
- **Persona 1**: Setup + Middlewares + Iniciar Controladores
- **Persona 2**: Setup Thirdweb + BlockchainService Base

### Semana 2
- **Persona 1**: Completar Controladores + Rutas
- **Persona 2**: Servicios por Contrato + Controller Blockchain

### Semana 3
- **Persona 1**: Servicios Auxiliares + Testing
- **Persona 2**: Frontend Integration + Hooks

### Semana 4
- **Ambos**: Integración + Testing de flujos completos + Debug

---

## 🚨 CONVENCIONES IMPORTANTES

### **Comunicación entre Backend 2.0 y 3.0**

1. **Backend 3.0 SIEMPRE llama a Backend 2.0** después de transacciones blockchain
2. **Usar endpoints internos** con auth especial para comunicación entre backends
3. **Todos los registros MongoDB** deben tener referencias blockchain (tokenId, txHash, etc.)
4. **Backend 2.0 NO debe llamar a contratos** directamente, solo Backend 3.0

### **Formato de respuestas**
```javascript
// Success
{
  success: true,
  data: { ... },
  message: "Operación exitosa"
}

// Error
{
  success: false,
  error: "Mensaje de error",
  code: "ERROR_CODE"
}
```

---

## ✅ PRÓXIMOS PASOS INMEDIATOS

**PERSONA 1 (Tu colega):**
1. Empezar con FASE 1: Setup y mejoras de index.js
2. Crear middlewares básicos
3. Empezar con Farm Controller

**PERSONA 2 (Tú):**
1. Extraer ABIs de los contratos de Thirdweb
2. Instalar dependencias de Thirdweb
3. Crear BlockchainService base

---

¿Tienes alguna duda sobre las tareas? ¿Necesitas más detalles en alguna sección específica?
