'use client';

import React from 'react';
import { MapPin, TrendingUp } from 'lucide-react';
import { Badge, Progress, ImageWithFallback } from '@/src/atoms';

interface AssetCardProps {
  name: string;
  farmer: string;
  location: string;
  image: string;
  price: string;
  tokenPrice: string;
  totalTokens: number;
  available: number;
  roi: string;
  soilHealth: number;
  carbonScore: number;
  vegetationIndex: number;
  status: string;
  onClick: () => void;
  labels: {
    farmer: string;
    available: string;
    roi: string;
    soilHealth: string;
    carbon: string;
    vegetation: string;
    details: string;
  };
}

const AssetCard: React.FC<AssetCardProps> = ({
  name,
  farmer,
  location,
  image,
  price,
  tokenPrice,
  totalTokens,
  available,
  roi,
  soilHealth,
  carbonScore,
  vegetationIndex,
  status,
  onClick,
  labels,
}) => {
  const availablePercentage = (available / totalTokens) * 100;

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-morpho transition-all cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 w-full">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge 
            variant={status === 'Activo' ? 'success' : 'default'}
          >
            {status}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <h3 className="text-xl font-semibold text-black mb-2 line-clamp-1">
          {name}
        </h3>
        
        {/* Farmer */}
        <p className="text-sm text-gray-600 mb-1">
          {labels.farmer}: <span className="font-medium text-black">{farmer}</span>
        </p>
        
        {/* Location */}
        <div className="flex items-center gap-1 text-gray-600 mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>

        {/* Price & ROI */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-black">{price}</div>
            <div className="text-xs text-gray-500">{tokenPrice}</div>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-lg font-semibold">{roi}</span>
          </div>
        </div>

        {/* Availability */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">{labels.available}</span>
            <span className="font-medium text-black">
              {available}/{totalTokens}
            </span>
          </div>
          <Progress value={availablePercentage} className="h-2" />
        </div>

        {/* Environmental Indicators */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{soilHealth}%</div>
            <div className="text-xs text-gray-600">{labels.soilHealth}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{carbonScore}%</div>
            <div className="text-xs text-gray-600">{labels.carbon}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-600">{vegetationIndex}%</div>
            <div className="text-xs text-gray-600">{labels.vegetation}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
