import React, { FC } from "react";

interface LabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

const Label: FC<LabelProps> = ({ htmlFor, children, className = "" }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-[#000000] mb-1 ${className}`}
    >
      {children}
    </label>
  );
};

export default Label;
