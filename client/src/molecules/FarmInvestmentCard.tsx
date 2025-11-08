import React, { FC } from "react";
import Card from "@/src/atoms/Card";
import Heading from "@/src/atoms/Heading";
import Text from "@/src/atoms/Text";
import Button from "@/src/atoms/button";
import ImageWithFallback from "@/src/atoms/ImageWithFallback";
import Badge from "@/src/atoms/Badge";

interface FarmInvestmentCardProps {
  farmName: string;
  location: string;
  imageUrl: string;
  expectedRoi: string;
  minInvestment: string;
  availableTokens: number;
  carbonOffset: string;
  category: string;
  onInvest: () => void;
  investButtonText: string;
  roiLabel: string;
  minInvestmentLabel: string;
  availableLabel: string;
  carbonLabel: string;
}

const FarmInvestmentCard: FC<FarmInvestmentCardProps> = ({
  farmName,
  location,
  imageUrl,
  expectedRoi,
  minInvestment,
  availableTokens,
  carbonOffset,
  category,
  onInvest,
  investButtonText,
  roiLabel,
  minInvestmentLabel,
  availableLabel,
  carbonLabel,
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-morpho-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 w-full">
        <ImageWithFallback
          src={imageUrl}
          alt={farmName}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge variant="success">{category}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <Heading level={3} className="mb-1">
            {farmName}
          </Heading>
          <Text variant="caption" className="text-[#000000]/60">
            📍 {location}
          </Text>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text variant="caption" className="text-[#000000]/60">
              {roiLabel}
            </Text>
            <Text variant="body" className="font-semibold text-[#26ade4]">
              {expectedRoi}
            </Text>
          </div>
          <div>
            <Text variant="caption" className="text-[#000000]/60">
              {minInvestmentLabel}
            </Text>
            <Text variant="body" className="font-semibold">
              {minInvestment}
            </Text>
          </div>
          <div>
            <Text variant="caption" className="text-[#000000]/60">
              {availableLabel}
            </Text>
            <Text variant="body" className="font-semibold">
              {availableTokens} tokens
            </Text>
          </div>
          <div>
            <Text variant="caption" className="text-[#000000]/60">
              {carbonLabel}
            </Text>
            <Text variant="body" className="font-semibold text-[#66b32e]">
              {carbonOffset}
            </Text>
          </div>
        </div>

        {/* Invest Button */}
        <Button
          title={investButtonText}
          onClick={onInvest}
          variant="blue"
          className="w-full bg-[#26ade4] hover:bg-[#26ade4]/90 text-white rounded-xl py-3"
        />
      </div>
    </Card>
  );
};

export default FarmInvestmentCard;
