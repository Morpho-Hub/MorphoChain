import React, { FC } from "react";

interface TextProps {
  children: React.ReactNode;
  variant?: "body" | "caption" | "small";
  className?: string;
}

const Text: FC<TextProps> = ({ children, variant = "body", className = "" }) => {
  const variants = {
    body: "text-base text-[#000000]/70",
    caption: "text-sm text-[#000000]/70",
    small: "text-xs text-[#000000]/70",
  };
  
  return (
    <p className={`${variants[variant]} ${className}`}>
      {children}
    </p>
  );
};

export default Text;
