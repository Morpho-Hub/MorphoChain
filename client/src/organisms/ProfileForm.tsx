import React, { FC } from "react";
import Heading from "@/src/atoms/Heading";
import Text from "@/src/atoms/Text";
import Button from "@/src/atoms/button";
import Label from "@/src/atoms/Label";
import FormField from "@/src/molecules/FormField";
import RoleSelector from "@/src/molecules/RoleSelector";

interface ProfileFormProps {
  title: string;
  subtitle: string;
  labels: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    accountType: string;
    farmer: string;
    investor: string;
  };
  placeholders: {
    fullName: string;
    email: string;
    password: string;
  };
  submitButtonText: string;
  backButtonText: string;
  selectedRole: "farmer" | "investor";
  onRoleChange: (role: "farmer" | "investor") => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  className?: string;
}

const ProfileForm: FC<ProfileFormProps> = ({
  title,
  subtitle,
  labels,
  placeholders,
  submitButtonText,
  backButtonText,
  selectedRole,
  onRoleChange,
  onSubmit,
  onBack,
  className = "",
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <Heading level={2} className="mb-2">
          {title}
        </Heading>
        <Text variant="body">{subtitle}</Text>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          id="fullname"
          label={labels.fullName}
          type="text"
          placeholder={placeholders.fullName}
          required
        />

        <FormField
          id="email"
          label={labels.email}
          type="email"
          placeholder={placeholders.email}
          required
        />

        <FormField
          id="password"
          label={labels.password}
          type="password"
          placeholder={placeholders.password}
          required
        />

        <FormField
          id="confirm-password"
          label={labels.confirmPassword}
          type="password"
          placeholder={placeholders.password}
          required
        />

        <div className="space-y-2">
          <Label>{labels.accountType}</Label>
          <RoleSelector
            selectedRole={selectedRole}
            onRoleChange={onRoleChange}
            farmerLabel={labels.farmer}
            investorLabel={labels.investor}
          />
        </div>

        <Button
          title={submitButtonText}
          onClick={onSubmit}
          variant="blue"
          className="w-full bg-[#26ade4] hover:bg-[#26ade4]/90 text-white rounded-xl py-6"
        />
      </form>

      <button
        onClick={onBack}
        className="w-full text-sm text-[#000000]/70 hover:text-[#000000]"
      >
        {backButtonText}
      </button>
    </div>
  );
};

export default ProfileForm;
