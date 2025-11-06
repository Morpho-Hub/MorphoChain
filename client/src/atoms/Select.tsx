import React, { FC, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
  className?: string;
}

const Select: FC<SelectProps> = ({ options, className = "", ...props }) => {
  return (
    <div className="relative">
      <select
        className={`appearance-none px-4 py-2 pr-10 rounded-xl border-2 border-black/20 bg-white text-black focus:border-[#d1e751] focus:outline-none cursor-pointer w-full ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/50 pointer-events-none" />
    </div>
  );
};

export default Select;
