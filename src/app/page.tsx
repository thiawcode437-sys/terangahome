import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AnnonceCard from "@/components/annonces/AnnonceCard";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const recentAnnonces = await prisma.annonce.findMany({
    where: { status: "ACTIVE" },
    include: { user: { select: { name: true, avatar: true } } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const stats = await prisma.annonce.groupBy({
    by: ["category"],
    where: { status: "ACTIVE" },
    _count: true,
  });

  const statMap = Object.fromEntries(
    stats.map((s: { category: string; _count: number }) => [s.category, s._count])
  );

  return (
    <div className="bg-background">
      <HeroSection />
      <CategoryGrid statMap={statMap} />

      {/* Recent listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-medium tracking-widest text-primary uppercase mb-2">
              Dernières publications
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900">
              Annonces récentes
            </h2>
          </div>
          <Link
            href="/annonces"
            className="btn-secondary text-sm hidden sm:inline-flex"
          >
            Tout voir
          </Link>
        </div>

        {recentAnnonces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recentAnnonces.slice(0, 2).map((annonce) => (
              <AnnonceCard key={annonce.id} annonce={annonce} featured />
            ))}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recentAnnonces.slice(2).map((annonce) => (
                <AnnonceCard key={annonce.id} annonce={annonce} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200/60">
            <div className="w-12 h-12 bg-zinc-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-zinc-500 text-sm mb-1">Aucune annonce publiée</p>
            <p className="text-zinc-400 text-xs mb-6">Soyez le premier à publier sur TerangaHome</p>
            <Link href="/annonces/publier" className="btn-primary">
              Publier maintenant
            </Link>
          </div>
        )}

        <div className="mt-6 sm:hidden text-center">
          <Link href="/annonces" className="btn-secondary text-sm w-full">
            Voir toutes les annonces
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="relative overflow-hidden bg-zinc-950 rounded-[2rem] px-8 py-14 md:px-16 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-emerald-900/30" />
          <div className="relative z-10 max-w-xl">
            <p className="text-xs font-medium tracking-widest text-emerald-400 uppercase mb-3">
              Vendez plus vite
            </p>
            <h2 className="text-2xl md:text-4xl font-semibold tracking-tighter text-white leading-tight mb-4">
              Votre bien mérite la meilleure visibilité
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-md">
              Publiez votre annonce et atteignez des milliers d&apos;acheteurs qualifiés à travers tout le Sénégal. Gratuit, rapide et sécurisé.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/annonces/publier" className="btn-primary bg-white text-zinc-950 hover:bg-zinc-100">
                Publier une annonce
              </Link>
              <Link href="/localiser" className="btn-secondary border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                Trouver un agent
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
