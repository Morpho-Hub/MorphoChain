# Manual Técnico - MorphoChain PoC

## Tabla de Contenidos

1. [Descripción](#descripción)
2. [Objetivos de la PoC](#objetivos-de-la-poc)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Componentes Principales](#componentes-principales)
5. [Funcionalidades Implementadas](#funcionalidades-implementadas)
6. [Conclusiones](#conclusiones)
7. [Recomendaciones](#recomendaciones)

---

## Descripción

**MorphoChain** es una prueba de concepto de plataforma de finanzas regenerativas agrícolas que conecta productores agrícolas con inversores utilizando tecnología blockchain.

### Propuesta de Valor

- **Para Agricultores**: Acceso a financiamiento mediante tokenización de sus fincas
- **Para Inversores**: Inversión transparente en agricultura regenerativa con trazabilidad blockchain
- **Para la Plataforma**: Marketplace de productos agrícolas con impacto medible

### Tecnología Central

La PoC utiliza blockchain (Ethereum Sepolia Testnet) para garantizar:
- Transparencia en transacciones
- Trazabilidad de inversiones
- Propiedad verificable mediante NFTs

---

## Objetivos de la PoC

Esta prueba de concepto busca **validar la viabilidad técnica** de:

1. **Conexión de Wallets Web3**
   - Autenticación mediante wallet Ethereum
   - Integración con Google OAuth (Thirdweb)

2. **Tokenización de Fincas**
   - Registro de fincas como NFTs en blockchain
   - Asociación de metadata (ubicación, cultivo, métricas)

3. **Sistema de Inversión**
   - Compra de tokens que representan participación en fincas
   - Registro de transacciones en blockchain y base de datos

4. **Marketplace Básico**
   - Listado de productos agrícolas
   - Compra con tokens MORPHO

5. **Dashboard de Impacto**
   - Visualización de métricas ambientales (CO2, agua, biodiversidad)
   - Tracking de inversiones y retornos

**Alcance Limitado**: Esta PoC NO incluye funcionalidades completas de producción como distribución automática de dividendos, verificación de datos por terceros, o integración con oráculos.

---

## Instalación y Configuración

### Requisitos Mínimos

- Node.js 18+
- MongoDB (local o Atlas)
- Cuenta Thirdweb (para credenciales)

### Instalación Rápida

**Backend**
```bash
cd backend
npm install
cp .env.example .env  # Configurar variables
npm run dev           # Puerto 5000
```

**Frontend**
```bash
cd client
npm install
cp .env.example .env.local  # Configurar variables
npm run dev                 # Puerto 3000
```

### Variables de Entorno Esenciales

**Backend (.env)**
```env
MONGODB_URI=tu_mongodb_uri
JWT_SECRET=tu_secreto
THIRDWEB_SECRET_KEY=tu_key
WALLET_PRIVATE_KEY=tu_private_key

# Contratos en Sepolia
MORPHOCOIN_ADDRESS=0xa0943426e598d223852023e7879d92c704791e62
PLANTATION_MANAGER_ADDRESS=0xde4822ea001c21f8dbd5d37c290808d877e9166f
MORPHO_MARKETPLACE_ADDRESS=0x7eaa1f39cfbb0a128a7cdf5a74c3e0c6378b6b9b
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=tu_client_id
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Verificación

1. Backend: `curl http://localhost:5000/api/blockchain/health`
2. Frontend: Abrir `http://localhost:3000`
3. Conectar wallet y verificar balance

---

## Componentes Principales

### 1. Frontend (Next.js + React)

**Páginas Clave**
- `/`: Landing page informativa
- `/login-register`: Autenticación con wallet
- `/investor-dashboard`: Dashboard de inversor (portfolio, ROI)
- `/panel-agricultor`: Dashboard de agricultor (fincas, productos)
- `/mercado`: Marketplace de productos
- `/inversion`: Compra de tokens de fincas

**Tecnologías**
- Next.js 16 (App Router)
- React 19
- Thirdweb (wallets y contratos)
- Tailwind CSS
- Recharts (gráficos)

### 2. Backend (Node.js + Express)

**API REST**
- `/api/auth`: Autenticación (wallet/tradicional)
- `/api/farms`: CRUD de fincas
- `/api/investments`: Gestión de inversiones
- `/api/products`: Marketplace
- `/api/blockchain`: Interacciones blockchain
- `/api/dashboard`: Datos agregados

**Base de Datos (MongoDB)**
- `users`: Usuarios (agricultores, inversores)
- `farms`: Fincas registradas
- `investments`: Inversiones realizadas
- `products`: Productos en marketplace
- `transactions`: Histórico de transacciones

**Tecnologías**
- Express 5
- MongoDB + Mongoose
- Ethers.js (blockchain)
- JWT (autenticación)

### 3. Blockchain (Ethereum Sepolia)

**Smart Contracts Desplegados**

| Contrato | Dirección | Propósito |
|----------|-----------|-----------|
| **MorphoCoin** | `0xa094...1e62` | Token ERC-20 de la plataforma |
| **PlantationManager** | `0xde48...166f` | NFTs de fincas |
| **MorphoMarketplace** | `0x7eaa...6b9b` | Marketplace descentralizado |

**Red**: Sepolia Testnet (Chain ID: 11155111)

---

## Funcionalidades Implementadas

### Funcionalidades Operativas (Conectadas a Blockchain)

#### 1. Autenticación con Wallet

**Flujo**:
1. Usuario hace clic en "Conectar Wallet"
2. Thirdweb muestra opciones (Google, MetaMask, etc.)
3. Al conectar, se verifica si el usuario existe en BD
4. Si no existe, se solicita onboarding (nombre, email, rol)
5. Se crea usuario y se genera token JWT

**Archivos**: `client/contexts/AuthContext.tsx`, `backend/controllers/authController.js`

#### 2. Registro de Fincas (NFT)

**Flujo**:
1. Agricultor completa formulario con datos de finca
2. Backend crea registro en MongoDB
3. Backend llama a `PlantationManager.registerPlantation()`
4. Se mintea NFT con tokenId único
5. Finca queda disponible para inversión

**Estado**: FUNCIONAL (conectado a Sepolia)

**Archivos**: `client/app/panel-agricultor`, `backend/controllers/farmController.js`

#### 3. Inversión en Fincas

**Flujo**:
1. Inversor selecciona finca y cantidad de tokens
2. Sistema verifica balance de MORPHO
3. Se ejecuta `morphoCoin.transfer()` en blockchain
4. Al confirmar transacción, se registra inversión en BD
5. Se actualiza portfolio del inversor

**Estado**: FUNCIONAL (transacciones reales en Sepolia)

**Archivos**: `client/app/inversion`, `backend/controllers/investmentController.js`

#### 4. Consulta de Balances

**Operativo**:
- Balance de ETH
- Balance de tokens MORPHO
- Sincronización automática

**Endpoints**: `/api/blockchain/eth/balance/:address`, `/api/blockchain/token/balance/:address`

### Funcionalidades Simuladas (Solo Base de Datos)

Estas funcionalidades están implementadas pero NO ejecutan transacciones blockchain reales:

#### 1. Marketplace de Productos

**Estado Actual**:
- Creación de productos: Solo BD
- Compra de productos: Simulada (no ejecuta contrato MorphoMarketplace)
- Pago en MORPHO: Registrado en BD, no transferido on-chain

**Razón**: Reducir costos de gas en testnet durante pruebas

**Archivos**: `client/app/mercado`, `backend/controllers/productController.js`

#### 2. Distribución de Dividendos

**Estado Actual**: Solo registro en BD

**Implementación Futura**: Smart contract con distribución automática

#### 3. Métricas de Impacto

**Estado Actual**:
- Ingreso manual en formularios
- Almacenamiento en MongoDB
- Visualización en dashboards

**Verificación**: No hay validación blockchain u oráculos externos

### Dashboards

#### Dashboard Inversor
- Portfolio de inversiones
- Gráficos de ROI
- Métricas de impacto personal
- Historial de transacciones

**Datos**: Combinación de MongoDB + consultas blockchain para balances

#### Dashboard Agricultor
- Lista de fincas creadas
- Productos en marketplace
- Inversiones recibidas
- Estadísticas de ventas

**Datos**: Principalmente MongoDB

---

## Tecnologías Utilizadas

### Stack Principal

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Frontend** | Next.js | 16.0.1 |
| | React | 19.2.0 |
| | Thirdweb | 5.111.9 |
| | Tailwind CSS | 4 |
| **Backend** | Node.js | ES Modules |
| | Express | 5.1.0 |
| | MongoDB | 6.20.0 |
| | Ethers.js | 5.8.0 |
| **Blockchain** | Ethereum Sepolia | Testnet |
| | Solidity | Contratos ERC-20/NFT |

### Integraciones Clave

**Thirdweb**: SDK que simplifica:
- Conexión de múltiples wallets
- Firma de transacciones
- Interacción con contratos
- Autenticación social (Google OAuth)

**MongoDB**: Base de datos para:
- Caché de datos blockchain (reducir consultas)
- Información de usuarios
- Metadata de fincas y productos

---

## Integración Blockchain

### Arquitectura Híbrida

```
┌─────────────────────────────────────────┐
│           BLOCKCHAIN (Sepolia)          │
│  - Transacciones de tokens              │
│  - NFTs de fincas                       │
│  - Propiedad verificable                │
└──────────────┬──────────────────────────┘
               │
               │ Sincronización
               │
┌──────────────▼──────────────────────────┐
│           BASE DE DATOS (MongoDB)       │
│  - Perfiles de usuario                  │
│  - Metadata de fincas                   │
│  - Histórico de transacciones           │
│  - Métricas de impacto                  │
└─────────────────────────────────────────┘
```

**Ventajas**:
- Blockchain: Transparencia y seguridad
- MongoDB: Velocidad y flexibilidad
- Combinación: Mejor experiencia de usuario

### Contratos Inteligentes

#### MorphoCoin (ERC-20)

**Funciones Utilizadas en la PoC**:
- `balanceOf(address)`: Consultar balance
- `transfer(to, amount)`: Transferir tokens
- `approve(spender, amount)`: Aprobar gasto (para marketplace futuro)

**Uso**: Moneda de la plataforma para inversiones

#### PlantationManager (NFT)

**Funciones Utilizadas**:
- `registerPlantation(owner, metadata)`: Crear NFT de finca
- `getPlantation(tokenId)`: Consultar información

**Uso**: Cada finca es un NFT único que representa propiedad

#### MorphoMarketplace

**Estado**: Desplegado pero NO utilizado activamente en esta PoC

**Uso Futuro**: Compra/venta descentralizada de productos

### Flujo de Inversión (Ejemplo Real)

```
1. Inversor conecta wallet → Thirdweb
2. Selecciona finca "Café Premium" → Frontend
3. Ingresa 1000 MORPHO → Validación de balance
4. Confirma transacción → Wallet popup
5. Se ejecuta morphoCoin.transfer() → Blockchain Sepolia
6. Transacción confirmada → Hash: 0x1234...
7. Backend registra en MongoDB → Investment document
8. Dashboard actualizado → Muestra nueva inversión
```

**Verificable en**: https://sepolia.etherscan.io/tx/[hash]

---

## Modelo de Datos

### Entidades Principales

#### User (Usuario)
```javascript
{
  firstName, lastName, email,
  walletAddress,           // Único
  role,                    // 'farmer' | 'investor' | 'admin'
  tokenBalance,            // Caché de balance MORPHO
  farmerData: {...},       // Si es agricultor
  investorData: {...}      // Si es inversor
}
```

#### Farm (Finca)
```javascript
{
  owner,                   // Referencia a User
  name, description,
  location: {...},
  landSize, cropType,
  tokenId,                 // ID del NFT en blockchain
  investmentGoal,
  currentInvestment,
  status,                  // 'draft' | 'active' | 'funded'
  impactMetrics: {...}
}
```

#### Investment (Inversión)
```javascript
{
  investor,                // Referencia a User
  farm,                    // Referencia a Farm
  amount,                  // USD
  amountInTokens,          // MORPHO
  transactionHash,         // Hash blockchain (único)
  status,                  // 'confirmed' | 'pending'
  expectedReturn,
  investmentDate
}
```

#### Product (Producto)
```javascript
{
  seller,                  // Referencia a User
  name, description,
  category,                // 'coffee' | 'cacao' | etc.
  price,                   // USD
  priceInTokens,           // MORPHO
  stock,
  status                   // 'active' | 'out-of-stock'
}
```

#### Transaction (Transacción)
```javascript
{
  from, to,                // Usuarios
  type,                    // 'investment' | 'product-purchase'
  amount,
  transactionHash,         // Hash blockchain (si aplica)
  status,                  // 'confirmed' | 'failed'
  createdAt
}
```

---

## API - Endpoints Principales

### Autenticación

```
POST   /api/auth/register-wallet    # Registro con wallet
POST   /api/auth/login               # Login tradicional
GET    /api/auth/me                  # Perfil actual
```

### Fincas

```
GET    /api/farms                    # Listar fincas
POST   /api/farms                    # Crear finca (+ NFT)
GET    /api/farms/:id                # Detalle de finca
PUT    /api/farms/:id                # Actualizar finca
```

### Inversiones

```
GET    /api/investments/my/investments    # Mis inversiones
POST   /api/investments/buy-tokens        # Invertir en finca
```

### Productos

```
GET    /api/products/marketplace     # Productos públicos
POST   /api/products                 # Crear producto
PUT    /api/products/:id             # Actualizar producto
```

### Blockchain

```
GET    /api/blockchain/token/balance/:address    # Balance MORPHO
GET    /api/blockchain/eth/balance/:address      # Balance ETH
POST   /api/blockchain/token/faucet              # Tokens gratis (testnet)
```

### Dashboard

```
GET    /api/dashboard/investor       # Dashboard inversor
GET    /api/dashboard/farmer         # Dashboard agricultor
```

**Autenticación**: La mayoría de endpoints requieren header `Authorization: Bearer <token>`

---

## Pruebas de la PoC

### Cómo Probar el Sistema

#### 1. Autenticación

1. Abrir `http://localhost:3000`
2. Hacer clic en "Conectar Wallet"
3. Seleccionar "Google" o wallet de Ethereum
4. Completar onboarding (nombre, email, rol)
5. Verificar que aparece dashboard correspondiente

#### 2. Crear Finca (Agricultor)

1. Ir a `/panel-agricultor`
2. Clic en "Crear Finca"
3. Completar formulario básico
4. Enviar → Se crea NFT en blockchain
5. Verificar tokenId en el detalle de la finca
6. Buscar transacción en Sepolia Etherscan

#### 3. Invertir en Finca (Inversor)

1. Solicitar tokens MORPHO: `/api/blockchain/token/faucet`
2. Ir a `/inversion`
3. Seleccionar finca
4. Ingresar cantidad de tokens
5. Confirmar transacción en wallet
6. Verificar inversión en `/investor-dashboard`

#### 4. Crear Producto (Agricultor)

1. Ir a `/inventario`
2. Crear nuevo producto
3. Definir precio, stock, categoría
4. Publicar en marketplace
5. Verificar en `/mercado`

#### 5. Verificar Blockchain

**Consultar NFT de Finca**:
```
https://sepolia.etherscan.io/address/0xde4822ea001c21f8dbd5d37c290808d877e9166f
```

**Consultar Token MORPHO**:
```
https://sepolia.etherscan.io/address/0xa0943426e598d223852023e7879d92c704791e62
```

**Ver Transacción Específica**:
```
https://sepolia.etherscan.io/tx/[transaction_hash]
```

### Limitaciones Conocidas

1. **Red Sepolia**: Es testnet, puede tener retrasos o downtime
2. **Gas Fees**: Se necesita ETH de Sepolia para transacciones (faucets disponibles)
3. **Marketplace**: Compras simuladas, no ejecutan contrato real
4. **Dividendos**: No hay distribución automática
5. **Verificación de Impacto**: Datos ingresados manualmente, sin validación externa

---

## Conclusiones

### Logros de la PoC

1. **Viabilidad Técnica Demostrada**
   - Se puede autenticar usuarios con wallets Web3
   - Se pueden crear NFTs de fincas en blockchain
   - Las inversiones se registran de forma transparente en Sepolia
   - Los dashboards muestran datos combinados de blockchain y BD

2. **Integración Blockchain Funcional**
   - Contratos inteligentes desplegados y operativos
   - Transacciones reales verificables en Etherscan
   - Sincronización bidireccional blockchain ↔ MongoDB

3. **Experiencia de Usuario Simplificada**
   - Thirdweb oculta la complejidad de Web3
   - Autenticación con Google funcional
   - Interfaz amigable para no-técnicos

4. **Arquitectura Escalable**
   - Separación clara frontend/backend/blockchain
   - API REST bien estructurada
   - Base de datos flexible (MongoDB)

### Aprendizajes

1. **Blockchain es Lenta**: Transacciones en Sepolia tardan 15-30 segundos
   - Solución: UI optimista + actualizaciones asíncronas

2. **Gas Fees son un Factor**: Incluso en testnet
   - Solución: Optimizar contratos, usar Layer 2 en producción

3. **Híbrido es Mejor**: Blockchain solo para lo crítico
   - Transparencia: Blockchain
   - Velocidad: Base de datos tradicional

4. **UX es Crítica**: Los usuarios no deben "sentir" la blockchain
   - Thirdweb ayuda mucho
   - Wallets sociales (Google) son clave para adopción


---

## Recomendaciones

### Corto Plazo (Siguiente Sprint)

1. **Activar Marketplace Blockchain**
   - Implementar compras reales usando `MorphoMarketplace.purchaseProduct()`
   - Probar flujo completo de listado → compra → transferencia

2. **Mejorar Onboarding**
   - Agregar wizard paso a paso
   - Explicar conceptos básicos de wallets
   - Tour guiado en primera visita

3. **Faucet Automático**
   - Al registrarse, dar 100 MORPHO gratis
   - Facilita pruebas inmediatas

4. **Validación de Usuarios**
   - Implementar verificación de email
   - KYC básico para inversores (futuro regulatorio)

### Mediano Plazo (Antes de Lanzamiento)

1. **Migrar a Mainnet**
   - Auditar contratos inteligentes
   - Calcular costos de gas
   - Evaluar Layer 2 (Polygon, Arbitrum)

2. **Distribución de Dividendos**
   - Smart contract para distribución automática
   - Basado en % de participación
   - Trigger al registrar cosecha

3. **Verificación de Impacto**
   - Integrar oráculos (Chainlink)
   - Certificaciones de terceros
   - Sensores IoT para datos ambientales

4. **Mobile App**
   - React Native
   - Foco en agricultores (captura de datos en campo)

### Largo Plazo (Roadmap Producto)

1. **DAO (Gobernanza Descentralizada)**
   - Token de gobernanza
   - Votaciones on-chain
   - Treasury comunitario

2. **DeFi Integrado**
   - Lending usando fincas como colateral
   - Staking de MORPHO para rewards
   - Pools de liquidez en DEXs

3. **Escalabilidad**
   - Considerar Layer 2 o sidechain propia
   - Reducir costos de gas
   - Mejorar velocidad de transacciones

4. **Expansión Geográfica**
   - Multi-idioma
   - Multi-moneda
   - Regulaciones locales

### Aspectos No Técnicos Críticos

1. **Legal**
   - Consultar abogado especializado en blockchain
   - Verificar si tokens son valores (securities)
   - Términos de servicio claros
   - Política de privacidad (GDPR si aplica)

2. **Negocio**
   - Validar modelo de comisiones
   - Piloto con agricultores reales
   - Partnerships con certificadoras
   - Marketing para inversores

3. **Seguridad**
   - Auditoría de contratos antes de mainnet
   - Penetration testing de API
   - Bug bounty program
   - Seguro para smart contracts

---

## Siguientes Pasos Inmediatos

### Para Desarrolladores

1. Revisar issues abiertos en repositorio
2. Implementar tests automatizados (Jest, Cypress)
3. Mejorar documentación de código
4. Optimizar queries de MongoDB

### Para Product

1. Recopilar feedback de usuarios beta
2. Definir métricas de éxito (KPIs)
3. Priorizar backlog
4. Planificar roadmap de features

### Para Negocio

1. Preparar pitch deck
2. Buscar inversión seed
3. Formar equipo core
4. Establecer partnerships estratégicos

---

## Anexo: Comandos Útiles

### Backend
```bash
npm run dev              # Desarrollo
npm start                # Producción
npm run test             # Tests (pendiente)
```

### Frontend
```bash
npm run dev              # Desarrollo (puerto 3000)
npm run build            # Build de producción
npm run start            # Servir build
npm run lint             # Linter
```

### MongoDB
```bash
mongosh                  # Conectar a MongoDB local
use morphochain          # Seleccionar BD
db.users.find()          # Ver usuarios
db.farms.find()          # Ver fincas
```

### Blockchain (Ethers.js)
```javascript
// En consola de Node.js
const { ethers } = require('ethers');
const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/...');

// Ver balance
const balance = await provider.getBalance('0x...');
console.log(ethers.utils.formatEther(balance));
```

---

## Contacto y Soporte

**Repositorio**: https://github.com/Morpho-Hub/MorphoChain
**Documentación Adicional**: `/docs`


---

**Versión**: 1.0 (PoC)
**Última Actualización**: Noviembre 2024
**Estado**: Prueba de Concepto Funcional
