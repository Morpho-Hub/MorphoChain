import React, { FC } from "react";
import Heading from "@/src/atoms/Heading";
import Text from "@/src/atoms/Text";
import InfoBanner from "@/src/molecules/InfoBanner";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/config/web3";
import { inAppWallet } from "thirdweb/wallets";

interface GoogleSignInFormProps {
  title: string;
  subtitle: string;
  buttonText: string;
  infoBannerText: string;
  loginLinkText?: string;
  onToggleLogin?: () => void;
  className?: string;
}

const GoogleSignInForm: FC<GoogleSignInFormProps> = ({
  title,
  subtitle,
  buttonText,
  infoBannerText,
  loginLinkText,
  onToggleLogin,
  className = "",
}) => {
  const wallets = [
    inAppWallet({
      auth: {
        options: ["google", "email"],
      },
    }),
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <Heading level={2} className="mb-2">
          {title}
        </Heading>
        <Text variant="body">{subtitle}</Text>
      </div>

      <InfoBanner text={infoBannerText} />

      <div className="flex justify-center">
        <ConnectButton
          client={client}
          wallets={wallets}
          connectButton={{
            label: buttonText,
            className: "w-full !bg-white !text-gray-900 hover:!bg-gray-100 !border-2 !border-gray-200 !rounded-xl !py-3 !px-6 !font-semibold !transition-all !duration-300 !shadow-lg hover:!shadow-xl",
          }}
          connectModal={{
            size: "compact",
            title: "Conecta tu Wallet",
            welcomeScreen: {
              title: "Bienvenido a MorphoChain",
              subtitle: "Conecta con Google para crear tu wallet automáticamente",
            },
          }}
        />
      </div>

      {onToggleLogin && loginLinkText && (
        <button
          onClick={onToggleLogin}
          className="w-full text-sm text-[#000000]/70 hover:text-[#000000] mt-4"
        >
          {loginLinkText}
        </button>
      )}
    </div>
  );
};

export default GoogleSignInForm;
