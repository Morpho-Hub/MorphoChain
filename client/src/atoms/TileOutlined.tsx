import { ElementType, ReactNode } from "react";

type TileOutlinedProps = {
  as?: ElementType;
  leading?: ReactNode;     // slot para ícono u otro
  children?: ReactNode;    // slot libre (título, párrafo, lo que sea)
  className?: string;
};

export function TileOutlined({
  as: Tag = "article",
  leading,
  children,
  className = "",
}: TileOutlinedProps) {
  const base =
    "p-8 rounded-2xl border-2 border-[#d1e751]/30 hover:border-[#d1e751] transition-all shadow-morpho hover:shadow-morpho-lg";
  return (
    <Tag className={`${base} ${className}`}>
      {leading ? <div className="mb-6">{leading}</div> : null}
      {children}
    </Tag>
  );
}
