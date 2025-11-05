import React, { FC } from "react";
import { Sprout, TrendingUp } from "lucide-react";

interface RoleSelectorProps {
  selectedRole: "farmer" | "investor";
  onRoleChange: (role: "farmer" | "investor") => void;
  farmerLabel: string;
  investorLabel: string;
  className?: string;
}

const RoleSelector: FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleChange,
  farmerLabel,
  investorLabel,
  className = "",
}) => {
  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {/* Farmer Option */}
      <button
        type="button"
        onClick={() => onRoleChange("farmer")}
        className={`p-4 rounded-xl border-2 transition-all ${
          selectedRole === "farmer"
            ? "border-[#d1e751] bg-[#d1e751]/10"
            : "border-border hover:border-[#d1e751]/50"
        }`}
      >
        <div className="w-10 h-10 rounded-lg bg-gradient-green flex items-center justify-center mx-auto mb-2">
          <Sprout className="w-6 h-6 text-[#000000]" />
        </div>
        <div className="text-sm text-[#000000]">{farmerLabel}</div>
      </button>

      {/* Investor Option */}
      <button
        type="button"
        onClick={() => onRoleChange("investor")}
        className={`p-4 rounded-xl border-2 transition-all ${
          selectedRole === "investor"
            ? "border-[#d1e751] bg-[#d1e751]/10"
            : "border-border hover:border-[#d1e751]/50"
        }`}
      >
        <div className="w-10 h-10 rounded-lg bg-gradient-earth flex items-center justify-center mx-auto mb-2">
          <TrendingUp className="w-6 h-6 text-[#000000]" />
        </div>
        <div className="text-sm text-[#000000]">{investorLabel}</div>
      </button>
    </div>
  );
};

export default RoleSelector;
