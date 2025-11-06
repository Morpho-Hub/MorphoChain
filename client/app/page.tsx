"use client"
import { useRouter } from 'next/navigation';
import { Chip } from "@/src/atoms";
import Button from "@/src/atoms/button";
import { TileOutlined } from "@/src/atoms/TileOutlined";
import { useAuth } from '@/contexts/AuthContext';
import { ChartLine, Coins, Droplet, Globe, Leaf, Shield, Sprout, BarChart3, Users, TrendingUp } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  
  return (
    <main className="w-full flex flex-col">

      <section className="md:px-50 py-24 gradient-hero">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Texto */}
          <div>
            <Chip icon={Leaf} size='lg' label="Plataforma de Finanzas Regenerativas" className="mb-4" />

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Tokenizando el Futuro Regenerativo de Costa Rica
            </h1>

            <p className="text-lg text-text-secondary mb-8 max-w-xl">
              Conectamos agricultores con inversores conscientes mediante la tokenización agrícola. 
              Construye riqueza mientras restauras el planeta, una cosecha a la vez.
            </p>

            <div className="flex gap-4">
              <Button title="Comenzar a invertir" variant="blue" className="px-8 py-4 text-lg" onClick={() => {router.push('/login-register')}}/>
              <Button title="Conocer más" variant="white_bordered" className="px-8 py-4 text-lg"/>
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
                  <p className="text-gray-600 mt-1 text-sm">Retorno Anual Promedio</p>
                  <p className="text-4xl font-bold text-[#26ade4]">12.5%</p>
                </TileOutlined>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="flex flex-wrap gap-12 mt-16">
          <div>
            <p className="text-4xl font-bold text-[#26ade4]">250+</p>
            <p className="text-gray-600 text-sm mt-1">Agricultores</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-[#26ade4]">$2.4M</p>
            <p className="text-gray-600 text-sm mt-1">Financiado</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-[#26ade4]">1.2K</p>
            <p className="text-gray-600 text-sm mt-1">Hectáreas</p>
          </div>
        </div>
      </section>

      {/* PARA AGRICULTORES */}
      <section className="max-w-6xl mx-auto px-8 md:px-0 py-24 text-center">
        <h2 className="text-4xl font-semibold mb-4">Para Agricultores</h2>
        <p className="text-text-secondary mb-12 max-w-2xl mx-auto">
          Accede a capital, rastrea la sostenibilidad y construye relaciones transparentes con inversores conscientes
        </p>

        {/* Tus Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <TileOutlined
            leading={ <Coins className="w-10 h-10 mx-auto"/>
            }
          >
            <h3 className="text-xl font-semibold mb-3 text-[#243c0b]">
              Tokeniza tus Activos
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Convierte tus activos agrícolas en tokens digitales y accede a financiamiento de inversores globales sin las barreras de los préstamos tradicionales.
            </p>
          </TileOutlined>

          <TileOutlined
            leading={ <ChartLine className="w-10 h-10 mx-auto" />
            }
          >
            <h3 className="text-xl font-semibold mb-3 text-[#243c0b]">
              Rastrea Métricas de Impacto
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Monitorea automáticamente la salud del suelo (S), secuestro de carbono (C) e índices de vegetación (V) para comprobar tus prácticas regenerativas.
            </p>
          </TileOutlined>

          <TileOutlined
            leading={ <Shield className="w-10 h-10 mx-auto" />}
          >
            <h3 className="text-xl font-semibold mb-3 text-[#243c0b]">
              Confianza y Transparencia
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Las credenciales verificadas por blockchain muestran tus prácticas sostenibles y construyen credibilidad con compradores e inversores premium.
            </p>
          </TileOutlined>
        </div>

        <Button title="Explorar Panel de Agricultor →" variant="blue" onClick={() => {}} className="px-8 py-4 text-lg"/>
      </section>


      {/* PARA INVERSORES */}

    <section className="w-full py-24">
      {/* Título */}
      <div className="text-center max-w-3xl mx-auto mb-16 px-8">
        <h2 className="text-4xl font-semibold mb-4">Para Inversores</h2>
        <p className="text-gray-600">
          Invierte en agricultura regenerativa verificada con total transparencia e impacto medible
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
              <h3 className="text-xl font-semibold">Diversifica con Activos Reales</h3>
              <p className="text-gray-600">
                Accede a propiedad fraccionada de operaciones agrícolas desde $100.
                Construye un portafolio que crece mientras haces el bien.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex gap-4 items-start">
          <div className="w-20 h-10 rounded-xl gradient-earth flex items-center justify-center shadow-morpho">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
            <div>
              <h3 className="text-xl font-semibold">Métricas de Impacto Verificadas</h3>
              <p className="text-gray-600">
                Rastrea datos reales de restauración de suelos, captura de carbono y biodiversidad,
                todo validado en blockchain.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex gap-4 items-start">
            <div className="w-20 h-10 rounded-xl gradient-earth flex items-center justify-center shadow-morpho">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Conexión Directa con Agricultores</h3>
              <p className="text-gray-600">
                Sabe exactamente a dónde va tu dinero. Habla con agricultores,
                visita proyectos y observa el impacto de tu inversión.
              </p>
            </div>
          </div>

          {/* Botón */}
          <Button title="Ver Oportunidades de Inversión" variant="blue" className="px-8 py-4 text-lg" onClick={() => isLoggedIn ? router.push('/investor-dashboard') : router.push('/login-register')} />
        </div>
      </div>
    </section>


   <section className="text-center py-16 max-w-6xl mx-auto">

      {/* Título y descripción */}
      <h2 className="text-4xl font-bold mb-4">Impacto de Sostenibilidad</h2>
      <p className="text-gray-600 mb-12">
        Cada token representa prácticas regenerativas verificadas e impacto
        ambiental medible
      </p>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <TileOutlined
          leading={<Sprout className="w-10 h-10 mx-auto" />}
        >
          <p className="text-3xl font-semibold">85%</p>
          <p className="text-gray-600 mt-2">Mejora en Salud del Suelo</p>
        </TileOutlined>

        <TileOutlined
          leading={<Globe className="w-10 h-10 mx-auto" />}
        >
          <p className="text-3xl font-semibold">12K</p>
          <p className="text-gray-600 mt-2">Toneladas CO₂ Secuestradas</p>
        </TileOutlined>

        <TileOutlined
          leading={<Leaf className="w-10 h-10 mx-auto" />}
        >
          <p className="text-3xl font-semibold">+42%</p>
          <p className="text-gray-600 mt-2">Aumento en Biodiversidad</p>
        </TileOutlined>

        <TileOutlined
          leading={<Droplet className="w-10 h-10 mx-auto" />}
        >
          <p className="text-3xl font-semibold">68%</p>
          <p className="text-gray-600 mt-2">Conservación de Agua</p>
        </TileOutlined>
      </div>

    </section>

      {/* CTA FINAL */}
      <section className="w-full py-24 bg-black text-white text-center">
        <h2 className="text-3xl font-semibold mb-4">
          ¿Listo para Unirte a la Revolución de Finanzas Regenerativas?
        </h2>

        <p className="text-white/70 mb-8 max-w-xl mx-auto">
          Ya seas un agricultor buscando capital o un inversor en busca de impacto, MorphoChain te conecta con el futuro agrícola sostenible de Costa Rica.
        </p>

        <div className="flex justify-center gap-4">
          <Button title="Comienza Hoy" variant="blue" onClick={() => {router.push('/login-register')}} />
          <Button title="Explorar Mercado" variant="white_bordered" onClick={() => isLoggedIn ? router.push('/mercado') : router.push('/login-register')} />
        </div>
      </section>

    </main>
  );
}
