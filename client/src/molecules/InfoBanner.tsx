import React, { FC } from "react";
import Card from "@/src/atoms/Card";
import Text from "@/src/atoms/Text";

interface InfoBannerProps {
  text: string;
  className?: string;
}

const InfoBanner: FC<InfoBannerProps> = ({ text, className = "" }) => {
  return (
    <div className={`p-4 rounded-xl bg-[#d1e751]/10 border border-[#d1e751]/30 ${className}`}>
      <Text variant="caption" className="text-center">
        {text}
      </Text>
    </div>
  );
};

export default InfoBanner;
