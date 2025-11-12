'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ImageWithFallback } from '@/src/atoms';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  label = 'Imágenes del Producto',
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      alert(`Solo puedes subir un máximo de ${maxImages} imágenes`);
      return;
    }

    setUploading(true);

    try {
      // Convert files to base64 for preview (in production, upload to cloud storage)
      const newImageUrls = await Promise.all(
        files.map(file => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      onImagesChange([...images, ...newImageUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error al subir las imágenes. Por favor intenta nuevamente.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-black">
        {label}
        <span className="text-gray-500 ml-2 font-normal">
          (Máximo {maxImages} imágenes)
        </span>
      </label>

      {/* Upload Button */}
      {images.length < maxImages && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full border-2 border-dashed border-[#d1e751] rounded-lg p-6 hover:bg-[#d1e751]/5 transition-colors disabled:opacity-50"
          >
            <div className="flex flex-col items-center gap-2">
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#26ade4]"></div>
                  <p className="text-sm text-gray-600">Subiendo imágenes...</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-[#66b32e]" />
                  <p className="text-sm font-medium text-black">
                    Click para subir imágenes
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WEBP hasta 5MB
                  </p>
                </>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#d1e751] transition-colors"
            >
              <ImageWithFallback
                src={url}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Image Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-[#26ade4] text-white text-xs px-2 py-1 rounded-md font-medium">
                  Principal
                </div>
              )}

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Reorder Buttons */}
              <div className="absolute bottom-2 left-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(index, index - 1)}
                    className="flex-1 bg-white/90 backdrop-blur-sm text-black text-xs px-2 py-1 rounded hover:bg-white transition-colors"
                  >
                    ← Mover
                  </button>
                )}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleReorder(index, index + 1)}
                    className="flex-1 bg-white/90 backdrop-blur-sm text-black text-xs px-2 py-1 rounded hover:bg-white transition-colors"
                  >
                    Mover →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !uploading && (
        <div className="border-2 border-gray-200 rounded-lg p-8 text-center">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600">
            No hay imágenes aún. Sube las primeras imágenes de tu producto.
          </p>
        </div>
      )}
    </div>
  );
};
