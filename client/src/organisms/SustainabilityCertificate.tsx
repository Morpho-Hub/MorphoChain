import React, { FC } from "react";
import Heading from "@/src/atoms/Heading";
import Text from "@/src/atoms/Text";
import Badge from "@/src/atoms/Badge";

interface SustainabilityCertificateProps {
  companyName: string;
  tokensPurchased: number;
  totalAmount: string;
  carbonOffset: string;
  waterSaved: string;
  treesPlanted: number;
  purchaseDate: string;
  certificateId: string;
  labels: {
    title: string;
    subtitle: string;
    certifies: string;
    purchased: string;
    amount: string;
    environmentalImpact: string;
    carbonOffset: string;
    waterConserved: string;
    treesPlanted: string;
    issuedOn: string;
    certificateNumber: string;
    signature: string;
    signatureName: string;
  };
}

const SustainabilityCertificate: FC<SustainabilityCertificateProps> = ({
  companyName,
  tokensPurchased,
  totalAmount,
  carbonOffset,
  waterSaved,
  treesPlanted,
  purchaseDate,
  certificateId,
  labels,
}) => {
  return (
    <div
      id="sustainability-certificate"
      className="bg-white p-12 rounded-2xl border-4 border-[#d1e751] shadow-morpho-lg max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-[#d1e751] pb-6">
        <div className="flex justify-center mb-4">
          <Badge variant="success" className="text-lg px-6 py-2">
            MorphoChain
          </Badge>
        </div>
        <Heading level={1} className="text-[#66b32e] mb-2">
          {labels.title}
        </Heading>
        <Text variant="body" className="text-[#000000]/70 italic">
          {labels.subtitle}
        </Text>
      </div>

      {/* Certificate Body */}
      <div className="space-y-8">
        {/* Certification Statement */}
        <div className="text-center">
          <Text variant="body" className="text-lg">
            {labels.certifies}
          </Text>
          <Heading level={2} className="text-[#26ade4] my-4">
            {companyName}
          </Heading>
        </div>

        {/* Purchase Details */}
        <div className="bg-[#d1e751]/10 rounded-xl p-6 space-y-3">
          <div className="flex justify-between">
            <Text variant="body" className="font-medium">
              {labels.purchased}:
            </Text>
            <Text variant="body" className="font-bold text-[#26ade4]">
              {tokensPurchased.toLocaleString()} tokens
            </Text>
          </div>
          <div className="flex justify-between">
            <Text variant="body" className="font-medium">
              {labels.amount}:
            </Text>
            <Text variant="body" className="font-bold">
              {totalAmount}
            </Text>
          </div>
        </div>

        {/* Environmental Impact */}
        <div>
          <Heading level={3} className="text-[#66b32e] mb-4 text-center">
            {labels.environmentalImpact}
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-b from-[#66b32e]/10 to-transparent rounded-xl">
              <Text variant="caption" className="text-[#000000]/60 mb-2">
                {labels.carbonOffset}
              </Text>
              <Text variant="body" className="text-2xl font-bold text-[#66b32e]">
                {carbonOffset}
              </Text>
            </div>
            <div className="text-center p-4 bg-gradient-to-b from-[#26ade4]/10 to-transparent rounded-xl">
              <Text variant="caption" className="text-[#000000]/60 mb-2">
                {labels.waterConserved}
              </Text>
              <Text variant="body" className="text-2xl font-bold text-[#26ade4]">
                {waterSaved}
              </Text>
            </div>
            <div className="text-center p-4 bg-gradient-to-b from-[#d1e751]/10 to-transparent rounded-xl">
              <Text variant="caption" className="text-[#000000]/60 mb-2">
                {labels.treesPlanted}
              </Text>
              <Text variant="body" className="text-2xl font-bold text-[#66b32e]">
                {treesPlanted.toLocaleString()}
              </Text>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-[#d1e751] pt-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <Text variant="caption" className="text-[#000000]/60">
                {labels.issuedOn}:
              </Text>
              <Text variant="body" className="font-medium">
                {purchaseDate}
              </Text>
            </div>
            <div className="text-right">
              <Text variant="caption" className="text-[#000000]/60">
                {labels.certificateNumber}:
              </Text>
              <Text variant="body" className="font-medium">
                {certificateId}
              </Text>
            </div>
          </div>

          {/* Signature */}
          <div className="text-center pt-8">
            <div className="inline-block border-t-2 border-[#000000]/20 pt-2">
              <Text variant="body" className="font-bold">
                {labels.signatureName}
              </Text>
              <Text variant="caption" className="text-[#000000]/60">
                {labels.signature}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityCertificate;
