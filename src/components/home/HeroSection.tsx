"use client";

import { motion } from "framer-motion";
import { MagnifyingGlass, ArrowRight } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/annonces?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/annonces");
    }
  }

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_40%,rgba(5,150,105,0.15),transparent)]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-medium tracking-widest text-emerald-400 uppercase">
                Plateforme immobilière au Sénégal
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter text-white leading-none mb-6">
              Trouvez votre <br />
              <span className="text-emerald-400">prochain chez-vous</span>
            </h1>

            <p className="text-base text-zinc-400 leading-relaxed max-w-[480px] mb-10">
              Maisons, appartements, terrains et produits. Connectez-vous directement avec les propriétaires et agents immobiliers vérifiés.
            </p>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-1.5 flex gap-1.5 max-w-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
              <div className="flex-1 flex items-center gap-2.5 px-4">
                <MagnifyingGlass size={18} className="text-zinc-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Appartement Dakar, terrain Thiès..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none py-2.5"
                />
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 active:scale-[0.98]"
              >
                Rechercher
                <ArrowRight size={16} weight="bold" />
              </button>
            </form>

            {/* Quick stats */}
            <div className="flex items-center gap-8 mt-10">
              {[
                { value: "500+", label: "Biens publiés" },
                { value: "2K+", label: "Utilisateurs" },
                { value: "14", label: "Villes couvertes" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl font-semibold tracking-tight text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right decorative element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Floating cards preview */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2rem] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <div className="space-y-4">
                  {[
                    { title: "Villa 5 chambres", loc: "Almadies, Dakar", price: "250 000 000 F", tag: "Vente" },
                    { title: "Appartement meublé", loc: "Plateau, Dakar", price: "350 000 F/mois", tag: "Location" },
                    { title: "Terrain 500m²", loc: "Zone résidentielle, Thiès", price: "15 000 000 F", tag: "Terrain" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.4 + i * 0.15,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="bg-white/[0.07] border border-white/[0.08] rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{item.title}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{item.loc}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-emerald-400 font-mono">{item.price}</p>
                        <span className="inline-block text-[10px] font-medium text-zinc-400 bg-white/5 px-2 py-0.5 rounded mt-0.5">
                          {item.tag}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
