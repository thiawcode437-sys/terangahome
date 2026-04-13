"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Buildings,
  CurrencyCircleDollar,
  MapTrifold,
  ShoppingBag,
} from "@phosphor-icons/react";

interface CategoryGridProps {
  statMap: Record<string, number>;
}

const categories = [
  {
    name: "Location",
    key: "LOCATION",
    icon: Buildings,
    desc: "Appartements et maisons à louer",
    color: "from-blue-500/10 to-blue-600/5",
    iconColor: "text-blue-600",
    href: "/annonces?category=LOCATION",
  },
  {
    name: "Vente",
    key: "VENTE",
    icon: CurrencyCircleDollar,
    desc: "Biens immobiliers à vendre",
    color: "from-emerald-500/10 to-emerald-600/5",
    iconColor: "text-emerald-600",
    href: "/annonces?category=VENTE",
  },
  {
    name: "Terrains",
    key: "TERRAIN",
    icon: MapTrifold,
    desc: "Parcelles et terrains viabilisés",
    color: "from-amber-500/10 to-amber-600/5",
    iconColor: "text-amber-600",
    href: "/annonces?category=TERRAIN",
  },
  {
    name: "Marketplace",
    key: "PRODUIT",
    icon: ShoppingBag,
    desc: "Produits et articles divers",
    color: "from-rose-500/10 to-rose-600/5",
    iconColor: "text-rose-600",
    href: "/marketplace",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

export function CategoryGrid({ statMap }: CategoryGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <p className="text-xs font-medium tracking-widest text-primary uppercase mb-2">
          Catégories
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900">
          Explorez par type de bien
        </h2>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <motion.div key={cat.key} variants={item}>
              <Link
                href={cat.href}
                className="group block bg-white border border-zinc-200/60 rounded-2xl p-6 hover:border-zinc-300 transition-all hover:shadow-sm active:scale-[0.98]"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <Icon size={22} weight="duotone" className={cat.iconColor} />
                </div>
                <h3 className="font-semibold text-zinc-900 tracking-tight mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed mb-3">
                  {cat.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400">
                    {statMap[cat.key] || 0} annonces
                  </span>
                  <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Explorer
                    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6h7m0 0L6.5 3m3 3l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
