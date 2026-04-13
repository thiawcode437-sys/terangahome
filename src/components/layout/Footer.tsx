import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">TH</span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">
                Teranga<span className="text-primary">Home</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-[280px]">
              La plateforme immobilière de confiance au Sénégal. Achat, vente, location et marketplace.
            </p>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold tracking-tight mb-4">Immobilier</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/annonces?category=LOCATION" className="hover:text-white transition-colors">Locations</Link></li>
              <li><Link href="/annonces?category=VENTE" className="hover:text-white transition-colors">Ventes</Link></li>
              <li><Link href="/annonces?category=TERRAIN" className="hover:text-white transition-colors">Terrains</Link></li>
              <li><Link href="/localiser" className="hover:text-white transition-colors">Carte des agents</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold tracking-tight mb-4">Plateforme</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link href="/annonces/publier" className="hover:text-white transition-colors">Publier une annonce</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Créer un compte</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold tracking-tight mb-4">Contact</h3>
            <ul className="space-y-2.5 text-sm">
              <li>Dakar, Sénégal</li>
              <li>contact@terangahome.sn</li>
              <li>+221 77 845 23 91</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800/60 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} TerangaHome. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span>Conçu au Sénégal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
