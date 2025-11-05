import React, { FC } from "react";
import { Leaf } from "lucide-react";
import ImageWithFallback from "@/src/atoms/ImageWithFallback";
import Heading from "@/src/atoms/Heading";
import Text from "@/src/atoms/Text";
import StatsGrid from "@/src/molecules/StatsGrid";

interface BrandingSectionProps {
  title: string;
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
  title,
  subtitle,
  imageUrl,
  imageAlt,
  stats,
  className = "",
}) => {
  return (
    <div className={`hidden lg:block space-y-8 ${className}`}>
      {/* Logo and Title */}
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-green flex items-center justify-center">
          <Leaf className="w-8 h-8 text-[#000000]" />
        </div>
        <div>
          <Heading level={1} className="text-3xl">
            {title}
          </Heading>
          <Text variant="body" className="text-[#000000]/70">
            {subtitle}
          </Text>
        </div>
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
