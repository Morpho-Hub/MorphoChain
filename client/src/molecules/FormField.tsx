import React, { FC } from "react";
import Label from "@/src/atoms/Label";
import Input from "@/src/atoms/Input";

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField: FC<FormFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  required = false,
  className = "",
  value,
  onChange,
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className="rounded-xl border-[#000000]/20 focus:border-[#d1e751]"
        required={required}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default FormField;
