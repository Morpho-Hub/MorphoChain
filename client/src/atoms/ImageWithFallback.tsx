import React, { FC } from "react";
import Image from "next/image";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageWithFallback: FC<ImageWithFallbackProps> = ({ src, alt, className = "" }) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    // Evitar loop infinito: solo cambiar si no es ya el fallback
    if (!target.src.startsWith('data:')) {
      // Data URI: imagen gris con texto "Imagen no disponible"
      target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1080' height='500'%3E%3Crect width='1080' height='500' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3EImagen no disponible%3C/text%3E%3C/svg%3E";
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        onError={handleError}
      />
    </div>
  );
};

export default ImageWithFallback;
