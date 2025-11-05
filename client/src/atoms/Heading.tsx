import React, { FC } from "react";

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

const Heading: FC<HeadingProps> = ({ level = 2, children, className = "" }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const baseStyles = "text-[#000000] font-semibold";
  
  const sizes = {
    1: "text-3xl",
    2: "text-2xl",
    3: "text-xl",
    4: "text-lg",
    5: "text-base",
    6: "text-sm",
  };
  
  return (
    <Tag className={`${baseStyles} ${sizes[level]} ${className}`}>
      {children}
    </Tag>
  );
};

export default Heading;
