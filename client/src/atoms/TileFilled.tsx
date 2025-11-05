import { ElementType, ReactNode } from "react";

type TileFilledProps = {
  as?: ElementType;
  tone?: "green" | "earth"; // solo estilo, no datos
  align?: "start" | "center";
  leading?: ReactNode;      // slot para ícono u otro
  children?: ReactNode;     // slot libre (valor, label, etc.)
  className?: string;
};

export function TileFilled({
  as: Tag = "section",
  tone = "green",
  align = "center",
  leading,
  children,
  className = "",
}: TileFilledProps) {
  const toneClass = tone === "earth" ? "bg-gradient-earth" : "bg-gradient-green";
  const alignClass = align === "center" ? "text-center" : "text-left";
  const base = "p-8 rounded-2xl border-0 shadow-morpho";

  return (
    <Tag className={`${toneClass} ${alignClass} ${base} ${className}`}>
      {leading ? (
        <div className={align === "center" ? "mx-auto mb-3" : "mb-3"}>{leading}</div>
      ) : null}
      {children}
    </Tag>
  );
}
