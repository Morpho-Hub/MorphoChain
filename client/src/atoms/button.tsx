import React, { FC, ReactNode } from "react";

interface ButtonProps {
  title?: string;
  onClick?: () => void;
  variant: "blue" | "white_bordered" | "google" | "edit" | "delete";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
}

const Button: FC<ButtonProps> = ({
  title,
  onClick,
  variant,
  icon,
  iconPosition = "left",
  className = "",
}) => {

  const base = "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all";

  const variants: Record<ButtonProps["variant"], string> = {
    blue: 
        "bg-blue-500 text-black px-4 py-2 hover:bg-blue-600 active:scale-95",

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
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {icon && iconPosition === "left" && icon}
      {title && <span>{title}</span>}
      {icon && iconPosition === "right" && icon}
    </button>
  );
};

export default Button;


