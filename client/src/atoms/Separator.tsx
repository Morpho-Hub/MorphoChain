import React, { FC } from "react";

interface SeparatorProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

const Separator: FC<SeparatorProps> = ({ className = "", orientation = "horizontal" }) => {
  return (
    <div
      className={`${
        orientation === "horizontal" ? "w-full h-px" : "h-full w-px"
      } bg-gray-200 ${className}`}
    />
  );
};

export default Separator;
