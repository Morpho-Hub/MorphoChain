import { MapPin } from "lucide-react";

interface InvestmentItemProps {
  image: string;
  name: string;
  location: string;
  invested: string;
  progress: number;
  roi: string;
}

export function InvestmentItem({
  image,
  name,
  location,
  invested,
  progress,
  roi,
}: InvestmentItemProps) {
  return (
    <div className="flex gap-4 p-4 border border-gray-200 rounded-2xl bg-white shadow-sm">
      {/* Imagen */}
      <div className="w-24 h-24 rounded-xl overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Contenido */}
      <div className="flex flex-col justify-between w-full">
        {/* Título y ubicación */}
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <div className="flex items-center text-gray-500 text-sm gap-1">
            <MapPin className="w-4 h-4" />
            {location}
          </div>
        </div>

        {/* Progreso */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Invertido: {invested}</span>
            <span className="text-gray-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-lime-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* ROI */}
        <p className="text-sm text-lime-600 font-medium mt-2">
          Retorno estimado: {roi}
        </p>
      </div>
    </div>
  );
}
