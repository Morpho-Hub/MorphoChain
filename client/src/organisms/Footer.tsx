import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-earth text-[#000000] border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contacto */}
        <div className="grid grid-cols-1 place-items-start">
          <div>
            <h4 className="mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 opacity-80">
                <MapPin className="w-4 h-4" />
                <span>San José, Costa Rica</span>
              </li>
              <li className="flex items-center gap-2 opacity-80">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:hello@morphochain.cr"
                  className="no-underline hover:no-underline"
                >
                  hello@morphochain.cr
                </a>
              </li>
              <li className="flex items-center gap-2 opacity-80">
                <Phone className="w-4 h-4" />
                <a
                  href="tel:+50622223333"
                  className="no-underline hover:no-underline"
                >
                  +506 2222 3333
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea inferior con copyright (sin enlaces) */}
        <div className="mt-12 pt-8 border-t border-[#000000]/20 flex justify-center">
          <p className="text-sm opacity-80">
            © {new Date().getFullYear()} MorphoChain. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
