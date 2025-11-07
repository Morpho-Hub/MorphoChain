"use client"
import { useRouter } from 'next/navigation';
import { Chip } from "@/src/atoms";
import Button from "@/src/atoms/button";
import { TileOutlined } from "@/src/atoms/TileOutlined";
import { useAuth } from '@/contexts/AuthContext';
import { ChartLine, Coins, Droplet, Globe, Leaf, Shield, Sprout, BarChart3, Users, TrendingUp } from "lucide-react";
import { es } from '@/locales';

export default function Home() {
  const t = es.landingPage;
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  
  const averageAnnualReturn = 12.5;
  const numberOfFarmers = 250;
  const totalInvested = 2400000;
  const numberOfHec = 1200; 

  const soilHealth = 85;
  const co2Sequestration = 12000;
  const biodiversity = 40;
  const waterConservation = 68;

  const formatNumber = (value: number | string): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;    
    if (isNaN(num)) {return '0';}
    const absoluteValue = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    if (absoluteValue >= 1000000000) {return sign + (absoluteValue / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';}
    if (absoluteValue >= 1000000) {return sign + (absoluteValue / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';}
    if (absoluteValue >= 1000) {return sign + (absoluteValue / 1000).toFixed(1).replace(/\.0$/, '') + 'K';}
    if (absoluteValue === 0) return '0';
    if (absoluteValue < 1) {return sign + absoluteValue.toFixed(2);}
    return sign + (absoluteValue % 1 === 0 ? absoluteValue.toString() : absoluteValue.toFixed(1));
  };

  return (
    <main className="w-full flex flex-col">

      <section className="md:px-50 py-24 gradient-hero">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Texto */}
          <div>
            <Chip icon={Leaf} size='lg' variant="success"  label="Plataforma de Finanzas Regenerativas" className="mb-4" />

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              {t.LANDING_TEXTS.title}
            </h1>

            <p className="text-lg text-text-secondary mb-8 max-w-xl">
              {t.LANDING_TEXTS.subTitles}
            </p>

            <div className="flex gap-4">
              <Button
              title={t.BUTTON_TEXTS.startInvesting}
              variant="blue"
              className="px-12 py-6 text-xl font-semibold rounded-lg"
              onClick={() => {
                router.push('/login-register');
              }}/>
            </div>
          </div>

          {/* Imagen */}
          <div className="flex justify-center md:justify-end">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* Background Image */}
              <img
                src="../plants.jpg"
                className="w-full h-[380px] object-cover"
              />

              {/* Tile positioned over the image */}
              <div className="absolute bottom-2 left-2">
                <TileOutlined
                  className="bg-white/90 backdrop-blur-md px-6 py-4"
                  leading={<TrendingUp className="w-10 h-10 mx-auto text-[#26ade4]" />}
                >
                  <p className="text-gray-600 mt-1 text-sm">{t.LANDING_TEXTS.imageClip}</p>
                  <p className="text-4xl font-boldtext-[#26ade4]">{averageAnnualReturn}%</p>
                </TileOutlined>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="flex flex-wrap gap-12 mt-16">
          <div>
            <p className="text-4xl font-bold text-[#26ade4]">{formatNumber(numberOfFarmers)}+</p>
            <p className="text-gray-600 text-sm mt-1">{t.LANDING_TEXTS.stadsClip01}</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-[#26ade4]">${formatNumber(totalInvested)}</p>
            <p className="text-gray-600 text-sm mt-1">{t.LANDING_TEXTS.stadsClip02}</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-[#26ade4]">{formatNumber(numberOfHec)}</p>
            <p className="text-gray-600 text-sm mt-1">{t.LANDING_TEXTS.stadsClip03}</p>
          </div>
        </div>
      </section>

      {/* PARA AGRICULTORES */}
      <section className="max-w-6xl mx-auto px-8 md:px-0 py-24 text-center">
        <h2 className="text-4xl font-semibold mb-4">{t.LANDING_TEXTS.sectionFarmerTitle}</h2>
        <p className="text-text-secondary mb-12 max-w-2xl mx-auto">
          {t.LANDING_TEXTS.farmerDescription}
        </p>

        {/* Tus Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <TileOutlined
            leading={ <Coins className="w-10 h-10 mx-auto"/>
            }
          >
            <h3 className="text-xl font-semibold mb-3 text-[#243c0b]">
              {t.FARMER_FEATURES.tokenize.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {t.FARMER_FEATURES.tokenize.description}
            </p>
          </TileOutlined>

          <TileOutlined
            leading={ <ChartLine className="w-10 h-10 mx-auto" />
            }
          >
            <h3 className="text-xl font-semibold mb-3 text-[#243c0b]">
              {t.FARMER_FEATURES.metrics.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {t.FARMER_FEATURES.metrics.description}
            </p>
          </TileOutlined>

          <TileOutlined
            leading={ <Shield className="w-10 h-10 mx-auto" />}
          >
            <h3 className="text-xl font-semibold mb-3 text-[#243c0b]">
              {t.FARMER_FEATURES.trust.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {t.FARMER_FEATURES.trust.description}
            </p>
          </TileOutlined>
        </div>

        <Button 
          title={t.BUTTON_TEXTS.exploreFarmerPanel} 
          variant="blue" 
          onClick={() => {
            isLoggedIn && user?.role === 'farmer'  
              ? router.push('/investor-dashboard') 
              : router.push('/login-register')
          }} 
          className="px-8 py-4 text-lg"
        />
      </section>

    {/* PARA INVERSORES */}

    <section className="w-full py-24">
      {/* Título */}
      <div className="text-center max-w-3xl mx-auto mb-16 px-8">
        <h2 className="text-4xl font-semibold mb-4">{t.LANDING_TEXTS.sectionInvestor}</h2>
        <p className="text-gray-600">
          {t.LANDING_TEXTS.investorDescription}
        </p>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-8 md:px-0 grid md:grid-cols-2 gap-12 items-center">

        {/* Imagen */}
        <img
          src="../tractor.jpg"
          className="rounded-3xl shadow-xl w-full object-cover"
        />

        {/* Texto + Ítems */}
        <div className="space-y-8">

          {/* Item 1 */}
          <div className="flex gap-4 items-start">
            <div className="w-20 h-10 rounded-xl gradient-earth flex items-center justify-center shadow-morpho">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{t.INVESTOR_FEATURES.diversify.title}</h3>
              <p className="text-gray-600">
                {t.INVESTOR_FEATURES.diversify.description}
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex gap-4 items-start">
          <div className="w-20 h-10 rounded-xl gradient-earth flex items-center justify-center shadow-morpho">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
            <div>
              <h3 className="text-xl font-semibold">{t.INVESTOR_FEATURES.metrics.title}</h3>
              <p className="text-gray-600">
                {t.INVESTOR_FEATURES.metrics.description}
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex gap-4 items-start">
            <div className="w-20 h-10 rounded-xl gradient-earth flex items-center justify-center shadow-morpho">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{t.INVESTOR_FEATURES.connection.title}</h3>
              <p className="text-gray-600">
                {t.INVESTOR_FEATURES.connection.description}
              </p>
            </div>
          </div>

          {/* Botón */}
          <Button 
            title={t.BUTTON_TEXTS.viewInvestmentOpportunities} 
            variant="blue" 
            className="px-8 py-4 text-lg" 
            onClick={() => isLoggedIn && user?.role === 'investor'  
              ? router.push('/investor-dashboard') 
              : router.push('/login-register')} 
          />
        </div>
      </div>
    </section>

   <section className="text-center py-16 max-w-6xl mx-auto">

      {/* Título y descripción */}
      <h2 className="text-4xl font-bold mb-4">{t.LANDING_TEXTS.sustainabilityTitle}</h2>
      <p className="text-gray-600 mb-12">
        {t.LANDING_TEXTS.sustainabilityDescription}
      </p>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <TileOutlined
          leading={<Sprout className="w-10 h-10 mx-auto" />}
        >
          <p className="text-3xl font-semibold">{soilHealth}%</p>
          <p className="text-gray-600 mt-2">{t.SUSTAINABILITY_STATS.soilHealthText}</p>
        </TileOutlined>

        <TileOutlined
          leading={<Globe className="w-10 h-10 mx-auto" />}
        >
          <p className="text-3xl font-semibold">{formatNumber(co2Sequestration)}</p>
          <p className="text-gray-600 mt-2">{t.SUSTAINABILITY_STATS.co2SequestrationText}</p>
        </TileOutlined>

        <TileOutlined
          leading={<Leaf className="w-10 h-10 mx-auto" />}
        >
          <p className="text-3xl font-semibold">+{biodiversity}%</p>
          <p className="text-gray-600 mt-2">{t.SUSTAINABILITY_STATS.biodiversityText}</p>
        </TileOutlined>

        <TileOutlined
          leading={<Droplet className="w-10 h-10 mx-auto" />}
        >
          <p className="text-3xl font-semibold">{waterConservation}%</p>
          <p className="text-gray-600 mt-2">{t.SUSTAINABILITY_STATS.waterConservationText}</p>
        </TileOutlined>
      </div>

    </section>

      {/* CTA FINAL */}
      <section className="w-full py-24 bg-black text-white text-center">
        <h2 className="text-3xl font-semibold mb-4">
          {t.LANDING_TEXTS.ctaTitle}
        </h2>

        <p className="text-white/70 mb-8 max-w-xl mx-auto">
          {t.LANDING_TEXTS.ctaDescription}
        </p>

        <div className="flex justify-center gap-4">
          <Button 
            title={t.BUTTON_TEXTS.startToday} 
            variant="blue" 
            onClick={() => {router.push('/login-register')}} 
          />
          <Button 
            title={t.BUTTON_TEXTS.exploreMarket} 
            variant="white_bordered" 
            onClick={() => isLoggedIn ? router.push('/mercado') : router.push('/login-register')} 
          />
        </div>
      </section>

    </main>
  );
}