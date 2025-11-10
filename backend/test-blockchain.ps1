# Script de prueba para los endpoints de blockchain

Write-Host "🧪 Probando endpoints de blockchain..." -ForegroundColor Cyan
Write-Host ""

# 1. Health Check
Write-Host "1️⃣ Health Check:" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/blockchain/health" -Method GET
    Write-Host "✅ Status: $($response.data.status)" -ForegroundColor Green
    Write-Host "   Chain ID: $($response.data.chainId)"
    Write-Host "   Block Number: $($response.data.blockNumber)"
    Write-Host "   Wallet: $($response.data.walletAddress)"
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 2. Token Info
Write-Host "2️⃣ Token Info:" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/blockchain/token/info" -Method GET
    Write-Host "✅ Name: $($response.data.name)" -ForegroundColor Green
    Write-Host "   Symbol: $($response.data.symbol)"
    Write-Host "   Decimals: $($response.data.decimals)"
    Write-Host "   Total Supply: $($response.data.totalSupply)"
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 3. Plantation Stats
Write-Host "3️⃣ Plantation Stats:" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/blockchain/plantation/stats" -Method GET
    Write-Host "✅ Total Plantations: $($response.data.total)" -ForegroundColor Green
    Write-Host "   Active: $($response.data.active)"
    Write-Host "   Total Minted: $($response.data.totalMinted)"
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# 4. Marketplace Stats
Write-Host "4️⃣ Marketplace Stats:" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/blockchain/marketplace/stats" -Method GET
    Write-Host "✅ Total Listings: $($response.data.totalListings)" -ForegroundColor Green
    Write-Host "   Active Listings: $($response.data.activeListings)"
    Write-Host "   Platform Fee: $($response.data.platformFee)%"
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Pruebas completadas!" -ForegroundColor Green
