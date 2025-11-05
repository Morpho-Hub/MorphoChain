import React, { FC } from "react";
import ImageWithFallback from "@/src/atoms/ImageWithFallback";
import Text from "@/src/atoms/Text";
import StatsGrid from "@/src/molecules/StatsGrid";

interface BrandingSectionProps {
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  stats: Array<{
    value: string;
    label: string;
  }>;
  className?: string;
}

const BrandingSection: FC<BrandingSectionProps> = ({
  subtitle,
  imageUrl,
  imageAlt,
  stats,
  className = "",
}) => {
  return (
    <div className={`hidden lg:block space-y-8 ${className}`}>
      {/* Subtitle */}
      <div className="text-center">
        <Text variant="body" className="text-[#000000]/70 text-xl">
          {subtitle}
        </Text>
      </div>

      {/* Image */}
      <div className="rounded-3xl overflow-hidden shadow-morpho-lg">
        <ImageWithFallback
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-[500px] object-cover"
        />
      </div>

      {/* Stats */}
      <StatsGrid stats={stats} />
    </div>
  );
};

export default BrandingSection;
