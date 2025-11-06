import React, { FC } from "react";
import { Search } from "lucide-react";
import Input from "@/src/atoms/Input";

interface SearchBarProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const SearchBar: FC<SearchBarProps> = ({ placeholder, value, onChange, className = "" }) => {
  return (
    <div className={`flex-1 relative ${className}`}>
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/50" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="pl-12 rounded-xl border-black/20 focus:border-[#d1e751]"
      />
    </div>
  );
};

export default SearchBar;
