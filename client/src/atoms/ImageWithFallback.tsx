import React, { FC } from "react";
import Image from "next/image";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageWithFallback: FC<ImageWithFallbackProps> = ({ src, alt, className = "" }) => {
  return (
    <div className={`relative w-full ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "https://via.placeholder.com/1080x500?text=Image+Not+Available";
        }}
      />
    </div>
  );
};

export default ImageWithFallback;
