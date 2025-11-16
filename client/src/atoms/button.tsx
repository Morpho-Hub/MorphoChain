import React, { FC, ReactNode } from "react";

interface ButtonProps {
  title?: string;
  onClick?: () => void;
  variant: "blue" | "white_bordered" | "google" | "edit" | "delete";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
  title,
  onClick,
  variant,
  icon,
  iconPosition = "left",
  className = "",
  disabled = false,
}) => {

  const base = "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all";

  const variants: Record<ButtonProps["variant"], string> = {
    blue: 
        "!bg-[#26ade4] hover:!bg-[#1e8bb8] !text-white !px-6 shadow-morpho",

    white_bordered:
      "bg-white text-black border border-black px-4 py-2 hover:bg-gray-100 active:scale-95",

    google:
      "bg-white text-black border border-black px-4 py-2 hover:bg-green-200/40 active:scale-95",

    edit:
      "bg-white border border-blue-300 text-blue-300 p-2 hover:bg-blue-300 hover:text-white active:scale-95",

    delete:
      "bg-white border border-red-500 text-red-500 p-2 hover:bg-red-500 hover:text-white active:scale-95",
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      suppressHydrationWarning
    >
      {icon && iconPosition === "left" && icon}
      {title && <span>{title}</span>}
      {icon && iconPosition === "right" && icon}
    </button>
  );
};

export default Button;


