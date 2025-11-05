import React, { FC } from "react";
import Button from "@/src/atoms/button";
import GoogleIcon from "@/src/atoms/GoogleIcon";

interface GoogleButtonProps {
  onClick: () => void;
  text: string;
  className?: string;
}

const GoogleButton: FC<GoogleButtonProps> = ({ onClick, text, className = "" }) => {
  return (
    <Button
      onClick={onClick}
      variant="google"
      icon={<GoogleIcon />}
      iconPosition="left"
      title={text}
      className={`w-full border-[#000000]/20 hover:border-[#d1e751] rounded-xl py-6 ${className}`}
    />
  );
};

export default GoogleButton;
