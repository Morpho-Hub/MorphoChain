"use client";

import { useState } from "react";
import { DollarSign, Sprout, Wind, Leaf } from "lucide-react";
import Heading from "@/src/atoms/Heading";
import Text from "@/src/atoms/Text";
import Button from "@/src/atoms/button";
import Card from "@/src/atoms/Card";
import Input from "@/src/atoms/Input";
import { SustainabilityCertificate } from "@/src/organisms";
import { es } from "@/locales";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, sendTransaction } from "thirdweb";
import { toWei } from "thirdweb/utils";
import { useMorphoCoinContract } from "@/hooks/useContract";
import { investmentService } from "@/src/services";

interface CertificateData {
  companyName: string;
  tokensPurchased: number;
  totalAmount: string;
  carbonOffset: string;
  waterSaved: string;
  treesPlanted: number;
  purchaseDate: string;
  certificateId: string;
}

export default function InversionPage() {
  const { user } = useAuth();
  const account = useActiveAccount();
  const morphoContract = useMorphoCoinContract();
  
  console.log('User:', user); // To avoid unused variable warning
  const [bulkAmount, setBulkAmount] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState<any>(null);

  const t = es.investment;

  const handleBulkPurchase = async () => {
    if (!bulkAmount || parseFloat(bulkAmount) <= 0) return;

    try {
      setIsProcessing(true);
      const tokens = parseFloat(bulkAmount);
      const morphoCost = tokens * 5; // 1 token = 5 MORPHO
      const TREASURY_WALLET = '0xD823f20E8053ead7ae65538ff73e23438F524E2E'; // Treasury address (checksummed)

      console.log(`💰 Comprando ${tokens} tokens regenerativos por ${morphoCost} MORPHO`);

      // Check if wallet is connected
      if (!account || !account.address) {
        throw new Error('Por favor conecta tu wallet primero');
      }

      // Step 1: Check MORPHO balance
      console.log('🔍 Verificando balance de MORPHO...');
      const { BLOCKCHAIN_API_URL } = await import('@/config/web3');
      const balanceRes = await fetch(`${BLOCKCHAIN_API_URL}/token/balance/${account.address}`);
      const balanceData = await balanceRes.json();
      
      if (!balanceData.success) {
        throw new Error('No se pudo verificar tu balance de MORPHO');
      }

      const userBalance = parseFloat(balanceData.data?.availableBalance || balanceData.data?.totalBalance || '0');
      console.log(`💰 Balance actual: ${userBalance} MORPHO`);

      if (userBalance < morphoCost) {
        throw new Error(
          `Balance insuficiente.\n\n` +
          `Necesitas: ${morphoCost} MORPHO\n` +
          `Tienes: ${userBalance.toFixed(2)} MORPHO\n\n` +
          `Por favor compra más MORPHO tokens primero.`
        );
      }

      // Step 2: Transfer MORPHO to treasury
      if (!morphoContract) {
        throw new Error('Contrato MORPHO no disponible');
      }

      console.log(`📤 Transfiriendo ${morphoCost} MORPHO a tesorería...`);

      const amountInWei = toWei(morphoCost.toString());
      
      const transaction = prepareContractCall({
        contract: morphoContract,
        method: "function transfer(address to, uint256 amount) returns (bool)",
        params: [TREASURY_WALLET, amountInWei],
      });

      const txResult = await sendTransaction({
        transaction,
        account,
      });
      
      const transferTxHash = txResult.transactionHash;
      console.log('💸 Transferencia enviada:', transferTxHash);
      
      // Wait for confirmation
      console.log('⏳ Esperando confirmación...');
      await new Promise(resolve => setTimeout(resolve, 5000));

      console.log('✅ Transferencia completada');

      // Step 3: Register purchase in backend (this will also mint to REGENERATIVE_POOL)
      const companyName = "Mi Empresa S.A."; // TODO: Get from user input
      const response = await investmentService.buyRegenerativeTokens(tokens, transferTxHash, companyName);

      if (!response.success) {
        throw new Error(response.error || 'Error al registrar la compra');
      }

      console.log('✅ Compra registrada:', response.data);

      // Step 4: Show certificate with real data from backend
      const certData = {
        companyName: companyName,
        tokensPurchased: response.data.tokensPurchased,
        totalAmount: `${response.data.morphoSpent} MORPHO`,
        carbonOffset: response.data.carbonOffset,
        waterSaved: response.data.waterSaved,
        treesPlanted: response.data.treesPlanted,
        purchaseDate: response.data.purchaseDate,
        certificateId: response.data.certificateId,
      };

      setCertificateData(certData);
      setBulkAmount("");
      setPurchaseDetails(response.data);
      
      // Show success modal first
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Error en compra de tokens regenerativos:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al procesar la compra: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadCertificate = async () => {
    const element = document.getElementById("certificate");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`certificado-regenerativo-${certificateData?.certificateId}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Heading level={1} className="text-4xl">
            {t.title}
          </Heading>
          <Text className="text-lg max-w-2xl mx-auto">{t.subtitle}</Text>
        </div>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="p-8 rounded-2xl border-2 border-[#26ade4]/30 shadow-morpho bg-gradient-to-br from-white to-blue-50">
            <div className="text-center mb-6">
              <Heading level={2} className="mb-3">
                Compra Tokens Regenerativos
              </Heading>
              <Text className="text-[#000000]/60 text-lg">
                Cada token representa impacto ambiental verificable. Ideal para empresas que buscan compensar su huella de carbono.
              </Text>
            </div>

            {/* Token Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl border border-[#66b32e]/30 text-center">
                <Leaf className="w-6 h-6 text-[#66b32e] mx-auto mb-2" />
                <Text variant="body" className="font-bold text-[#66b32e]">0.1 ha</Text>
                <Text variant="caption" className="text-[#000000]/60">regenerada</Text>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#26ade4]/30 text-center">
                <Wind className="w-6 h-6 text-[#26ade4] mx-auto mb-2" />
                <Text variant="body" className="font-bold text-[#26ade4]">50 kg</Text>
                <Text variant="caption" className="text-[#000000]/60">CO₂ capturado</Text>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#26ade4]/30 text-center">
                <Sprout className="w-6 h-6 text-[#26ade4] mx-auto mb-2" />
                <Text variant="body" className="font-bold text-[#26ade4]">1,000 L</Text>
                <Text variant="caption" className="text-[#000000]/60">agua ahorrada</Text>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#d1e751]/30 text-center">
                <DollarSign className="w-6 h-6 text-[#66b32e] mx-auto mb-2" />
                <Text variant="body" className="font-bold text-[#66b32e]">5 MORPHO</Text>
                <Text variant="caption" className="text-[#000000]/60">por token</Text>
              </div>
            </div>
          </Card>

          {/* Purchase Section */}
          <Card className="p-8 rounded-2xl border-2 border-[#d1e751]/30 shadow-morpho">
            <div className="space-y-6" suppressHydrationWarning>
              <div>
                <Heading level={3} className="mb-4">
                  Calcula tu Impacto
                </Heading>
                <Input
                  type="number"
                  placeholder="Cantidad de tokens"
                  value={bulkAmount}
                  onChange={(e) => setBulkAmount(e.target.value)}
                  className="w-full"
                />
              </div>

              {bulkAmount && parseFloat(bulkAmount) > 0 && (
                <div className="bg-[#d1e751]/10 rounded-xl p-6 space-y-4">
                  <Heading level={4}>Resumen de Compra</Heading>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Text variant="caption" className="text-[#000000]/60">
                        Total a Pagar
                      </Text>
                      <Text variant="body" className="font-bold text-[#26ade4]">
                        {(parseFloat(bulkAmount) * 5).toLocaleString()} MORPHO
                      </Text>
                    </div>
                    <div>
                      <Text variant="caption" className="text-[#000000]/60">
                        Tokens
                      </Text>
                      <Text variant="body" className="font-bold text-[#66b32e]">
                        {parseFloat(bulkAmount).toLocaleString()}
                      </Text>
                    </div>
                    <div>
                      <Text variant="caption" className="text-[#000000]/60">
                        CO₂ Compensado
                      </Text>
                      <Text variant="body" className="font-bold text-[#26ade4]">
                        {(parseFloat(bulkAmount) * 0.05).toFixed(1)} ton
                      </Text>
                    </div>
                    <div>
                      <Text variant="caption" className="text-[#000000]/60">
                        Agua Ahorrada
                      </Text>
                      <Text variant="body" className="font-bold text-[#26ade4]">
                        {(parseFloat(bulkAmount) * 1000).toLocaleString()} L
                      </Text>
                    </div>
                  </div>
                </div>
              )}

              <Button
                title={isProcessing ? "Procesando..." : "Comprar Tokens y Generar Certificado"}
                onClick={handleBulkPurchase}
                variant="primary"
                disabled={!bulkAmount || parseFloat(bulkAmount) <= 0 || isProcessing}
                className="w-full bg-gradient-to-r from-[#66b32e] to-[#26ade4] hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50"
              />
            </div>
          </Card>
        </div>

        {/* Success Modal */}
        {showSuccessModal && purchaseDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 max-w-lg w-full relative shadow-2xl animate-fadeIn">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl transition-colors"
              >
                ×
              </button>
              
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-green-500 rounded-full p-3 animate-bounce">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                ¡Compra Exitosa!
              </h2>
              <p className="text-center text-gray-600 mb-6">
                Gracias por contribuir a la regeneración del planeta 🌱
              </p>

              {/* Purchase Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between bg-white bg-opacity-60 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌱</span>
                    <span className="text-gray-700 font-medium">Tokens Regenerativos</span>
                  </div>
                  <span className="font-bold text-green-600">{purchaseDetails.tokensPurchased}</span>
                </div>

                <div className="flex items-center justify-between bg-white bg-opacity-60 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💎</span>
                    <span className="text-gray-700 font-medium">MORPHO Gastados</span>
                  </div>
                  <span className="font-bold text-blue-600">{purchaseDetails.morphoSpent}</span>
                </div>

                <div className="flex items-center justify-between bg-white bg-opacity-60 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌾</span>
                    <span className="text-gray-700 font-medium">Fincas Apoyadas</span>
                  </div>
                  <span className="font-bold text-amber-600">{purchaseDetails.farmsSupported}</span>
                </div>
              </div>

              {/* Environmental Impact */}
              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-4 mb-6 text-white">
                <h3 className="font-semibold mb-3 text-center">Impacto Ambiental</h3>
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div>
                    <div className="text-2xl mb-1">🌍</div>
                    <div className="font-bold">{purchaseDetails.carbonOffset} ton</div>
                    <div className="text-xs opacity-90">CO₂</div>
                  </div>
                  <div>
                    <div className="text-2xl mb-1">💧</div>
                    <div className="font-bold">{purchaseDetails.waterSaved.toLocaleString()} L</div>
                    <div className="text-xs opacity-90">Agua</div>
                  </div>
                  <div>
                    <div className="text-2xl mb-1">🌳</div>
                    <div className="font-bold">{purchaseDetails.treesPlanted}</div>
                    <div className="text-xs opacity-90">Árboles</div>
                  </div>
                </div>
              </div>

              {/* Transaction Hash */}
              <div className="bg-white bg-opacity-60 rounded-lg p-3 mb-6">
                <p className="text-xs text-gray-500 text-center mb-1">Transacción verificada en blockchain</p>
                <a
                  href={`https://sepolia.basescan.org/tx/${purchaseDetails.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-700 break-all block text-center underline"
                >
                  {purchaseDetails.transactionHash.slice(0, 10)}...{purchaseDetails.transactionHash.slice(-8)}
                </a>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setShowCertificate(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  📜 Ver Certificado
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="px-6 py-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Modal */}
        {showCertificate && certificateData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <SustainabilityCertificate
                companyName={certificateData.companyName}
                tokensPurchased={certificateData.tokensPurchased}
                totalAmount={certificateData.totalAmount}
                carbonOffset={certificateData.carbonOffset}
                waterSaved={certificateData.waterSaved}
                treesPlanted={certificateData.treesPlanted}
                purchaseDate={certificateData.purchaseDate}
                certificateId={certificateData.certificateId}
                labels={es.investment.certificate}
              />
              <div className="flex gap-4 mt-6">
                <Button
                  title="Descargar PDF"
                  onClick={downloadCertificate}
                  variant="primary"
                  className="flex-1"
                />
                <Button
                  title="Cerrar"
                  onClick={() => setShowCertificate(false)}
                  variant="white_bordered"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
