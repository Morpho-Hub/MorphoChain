import React, { FC, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input: FC<InputProps> = ({ className = "", ...props }) => {
  const baseStyles = "w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-all";
  
  return (
    <input
      className={`${baseStyles} ${className}`}
      suppressHydrationWarning
      {...props}
    />
  );
};

export default Input;
