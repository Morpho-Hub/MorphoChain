# 🎉 FRONTEND WEB3 CONFIGURADO

## ✅ Completado

### 1. Dependencias Instaladas
- ✅ `thirdweb` - SDK principal de Thirdweb
- ✅ `@thirdweb-dev/react` - React hooks y componentes
- ✅ `@thirdweb-dev/chains` - Configuración de chains (Sepolia)

### 2. Configuración Base

#### `config/web3.ts`
```typescript
- Configuración de Sepolia testnet
- Contract addresses (lowercase para evitar checksum errors)
- API URLs para backend
```

#### `app/providers.tsx`
```typescript
- ThirdwebProvider con configuración de:
  * Sepolia como chain por defecto
  * Auto-connect habilitado
  * Metadata de la dApp
```

### 3. Contextos

#### `contexts/Web3Context.tsx`
```typescript
export function useWeb3() {
  return {
    address,           // Dirección de la wallet conectada
    isConnected,       // Estado de conexión
    isConnecting,      // Estado de conexión en proceso
    morphoBalance,     // Balance de tokens MORPHO
    ethBalance,        // Balance de ETH
    chainId,           // 11155111 (Sepolia)
    contractAddresses  // Direcciones de contratos
  }
}
```

### 4. Custom Hooks

#### `hooks/useContract.ts`
- `useContract()` - Hook genérico para cualquier contrato
- `useMorphoCoinContract()` - Instancia del contrato MorphoCoin
- `usePlantationManagerContract()` - Instancia del contrato PlantationManager
- `useMorphoMarketplaceContract()` - Instancia del contrato MorphoMarketplace

#### `hooks/useMorphoCoin.ts`
```typescript
export function useMorphoCoin() {
  return {
    contract,
    isLoading,
    error,
    // Métodos:
    getBalance(),
    getAvailableBalance(),
    getFrozenBalance(),
    transfer(),
    approve(),
    getTokenInfo()
  }
}
```

#### `hooks/usePlantation.ts`
```typescript
export function usePlantation() {
  return {
    contract,
    isLoading,
    error,
    // Métodos:
    registerPlantation(),
    getPlantation(),
    getPlantationsByWallet(),
    getTotalPlantations(),
    getPlantationStats()
  }
}
```

#### `hooks/useMarketplace.ts`
```typescript
export function useMarketplace() {
  return {
    contract,
    isLoading,
    error,
    // Métodos:
    createListing(),
    buyFromListing(),
    cancelListing(),
    getListing(),
    getActiveListings(),
    getSellerListings(),
    calculatePurchaseCost(),
    getMarketplaceStats()
  }
}
```

### 5. Componentes Web3

#### `src/atoms/ConnectWalletButton.tsx`
```typescript
<ConnectWalletButton />
// Botón para conectar wallet con modal de Thirdweb
```

#### `src/atoms/TokenBalance.tsx`
```typescript
<TokenBalance />
// Muestra el balance de tokens MORPHO con ícono
```

#### `src/atoms/WalletInfo.tsx`
```typescript
<WalletInfo />
// Muestra dirección de wallet, balance ETH, botones para copiar y ver en Etherscan
```

#### `src/atoms/TransactionStatus.tsx`
```typescript
<TransactionStatus 
  status="pending|success|error|idle"
  txHash="0x..."
  message="Mensaje descriptivo"
/>
// Muestra el estado de una transacción con íconos y link a Etherscan
```

### 6. Integración en Layout

#### `app/layout.tsx`
```typescript
<Providers>              // ThirdwebProvider
  <Web3Provider>         // Web3Context
    <AuthProvider>       // AuthContext
      <Navbar />
      {children}
      <Footer />
    </AuthProvider>
  </Web3Provider>
</Providers>
```

### 7. ABIs Copiados
- ✅ `contracts/abis/MorphoCoin.json`
- ✅ `contracts/abis/PlantationManager.json`
- ✅ `contracts/abis/MorphoMarketplace.json`

### 8. Variables de Entorno

#### `.env.local`
```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=     # Opcional para desarrollo
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🚀 Cómo Usar

### 1. Conectar Wallet
```tsx
import { ConnectWalletButton } from '@/src/atoms';

function MyComponent() {
  return <ConnectWalletButton />;
}
```

### 2. Acceder a Información de Wallet
```tsx
import { useWeb3 } from '@/contexts';

function MyComponent() {
  const { address, morphoBalance, isConnected } = useWeb3();
  
  if (!isConnected) return <p>Conecta tu wallet</p>;
  
  return (
    <div>
      <p>Address: {address}</p>
      <p>Balance: {morphoBalance} MORPHO</p>
    </div>
  );
}
```

### 3. Transferir Tokens
```tsx
import { useMorphoCoin } from '@/hooks';

function TransferComponent() {
  const { transfer, isLoading } = useMorphoCoin();
  
  const handleTransfer = async () => {
    try {
      await transfer("0x...", "100"); // Enviar 100 MORPHO
      alert("¡Transferencia exitosa!");
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <button onClick={handleTransfer} disabled={isLoading}>
      {isLoading ? "Enviando..." : "Transferir"}
    </button>
  );
}
```

### 4. Registrar Plantación
```tsx
import { usePlantation } from '@/hooks';

function RegisterPlantationComponent() {
  const { registerPlantation, isLoading } = usePlantation();
  
  const handleRegister = async () => {
    try {
      const txHash = await registerPlantation(
        "Mi Finca",
        "Costa Rica",
        1000, // 1000 hectáreas
        "Café"
      );
      alert(`Plantación registrada! TX: ${txHash}`);
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <button onClick={handleRegister} disabled={isLoading}>
      {isLoading ? "Registrando..." : "Registrar Plantación"}
    </button>
  );
}
```

### 5. Crear Listing en Marketplace
```tsx
import { useMarketplace } from '@/hooks';

function CreateListingComponent() {
  const { createListing, isLoading } = useMarketplace();
  
  const handleCreate = async () => {
    try {
      const txHash = await createListing(
        "Café Premium",
        1000, // 1000 kg
        "0.01" // 0.01 MORPHO por kg
      );
      alert(`Listing creado! TX: ${txHash}`);
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <button onClick={handleCreate} disabled={isLoading}>
      {isLoading ? "Creando..." : "Crear Listing"}
    </button>
  );
}
```

---

## 📝 Próximos Pasos

### 1. Integración Backend 2.0 + 3.0
Conectar las operaciones off-chain (MongoDB) con las operaciones on-chain (blockchain):

#### Ejemplo: Crear Inversión
```typescript
// 1. Crear inversión en MongoDB (Backend 2.0)
const investment = await fetch('/api/investments', {
  method: 'POST',
  body: JSON.stringify({
    farmId,
    amount: 1000,
    userId
  })
});

// 2. Transferir tokens en blockchain (Backend 3.0 via frontend)
const { transfer } = useMorphoCoin();
await transfer(farmWalletAddress, "1000");

// 3. Actualizar inversión con transactionHash
await fetch(`/api/investments/${investment.id}`, {
  method: 'PATCH',
  body: JSON.stringify({
    transactionHash: txHash,
    status: 'completed'
  })
});
```

#### Ejemplo: Registrar Farm
```typescript
// 1. Crear farm en MongoDB
const farm = await fetch('/api/farms', {
  method: 'POST',
  body: JSON.stringify({
    name: "Mi Finca",
    location: "Costa Rica",
    landSize: 1000,
    cropType: "Café"
  })
});

// 2. Registrar plantation en blockchain
const { registerPlantation } = usePlantation();
const txHash = await registerPlantation(
  farm.name,
  farm.location,
  farm.landSize,
  farm.cropType
);

// 3. Actualizar farm con tokenId
await fetch(`/api/farms/${farm.id}`, {
  method: 'PATCH',
  body: JSON.stringify({
    tokenId: extractTokenIdFromTx(txHash),
    transactionHash: txHash,
    contractAddress: CONTRACT_ADDRESSES.PLANTATION_MANAGER
  })
});
```

### 2. Event Listeners
Escuchar eventos de blockchain para actualizar MongoDB:

```typescript
// En un servicio de backend o worker
const { contract } = getPlantationManagerContract();

contract.events.on("PlantationRegistered", async (event) => {
  const { tokenId, owner, name } = event.data;
  
  // Actualizar MongoDB
  await Farm.findOneAndUpdate(
    { owner: owner.toLowerCase() },
    { tokenId, status: 'registered' }
  );
});
```

### 3. UI/UX Mejoradas
- Loading states durante transacciones
- Confirmaciones de transacciones
- Manejo de errores amigable
- Notificaciones toast
- Progress bars

---

## 🎯 Estado Actual

✅ **Frontend Web3**: 100% completado
✅ **Backend 2.0**: 100% completado (60+ endpoints)
✅ **Backend 3.0**: 100% completado (17 endpoints blockchain)
⏳ **Integración 2.0 + 3.0**: Pendiente
⏳ **UI/UX Completa**: Pendiente

---

## 🔥 Testing

### Frontend está corriendo:
```
http://localhost:3000
```

### Backend está corriendo:
```
http://localhost:5000
```

### Contracts en Sepolia:
- MorphoCoin: `0x6e81691b381255bf0d2056c6a4017a53bb3a421c`
- PlantationManager: `0xef67f46539f4e5d6991cab46153a109c00c3ba00`
- MorphoMarketplace: `0x35ac5e4061090849bcc26d507a4188dbb4557d66`

---

¡Todo listo para empezar a usar Web3 en el frontend! 🚀
