import React, { FC } from "react";
import Heading from "@/src/atoms/Heading";
import Text from "@/src/atoms/Text";
import GoogleButton from "@/src/molecules/GoogleButton";
import InfoBanner from "@/src/molecules/InfoBanner";

interface GoogleSignInFormProps {
  title: string;
  subtitle: string;
  buttonText: string;
  infoBannerText: string;
  onGoogleAuth: () => void;
  className?: string;
}

const GoogleSignInForm: FC<GoogleSignInFormProps> = ({
  title,
  subtitle,
  buttonText,
  infoBannerText,
  onGoogleAuth,
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

      <InfoBanner text={infoBannerText} />

      <GoogleButton onClick={onGoogleAuth} text={buttonText} />
    </div>
  );
};

export default GoogleSignInForm;
