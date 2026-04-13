import Link from "next/link";
import Image from "next/image";
import { formatPrice, getCategoryLabel, timeAgo, parseJsonArray } from "@/lib/utils";

interface AnnonceCardProps {
  annonce: {
    id: string;
    title: string;
    price: number;
    category: string;
    city: string;
    images: string;
    rooms?: number | null;
    surface?: number | null;
    createdAt: Date;
    user: {
      name: string;
      avatar: string | null;
    };
  };
  featured?: boolean;
}

const categoryStyles: Record<string, string> = {
  LOCATION: "bg-blue-50 text-blue-700 border-blue-100",
  VENTE: "bg-emerald-50 text-emerald-700 border-emerald-100",
  TERRAIN: "bg-amber-50 text-amber-700 border-amber-100",
  PRODUIT: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function AnnonceCard({ annonce, featured }: AnnonceCardProps) {
  const images = parseJsonArray(annonce.images);
  const firstImage = images[0];

  return (
    <Link
      href={`/annonces/${annonce.id}`}
      className={`group block bg-white border border-zinc-200/60 overflow-hidden transition-all hover:border-zinc-300 hover:shadow-sm active:scale-[0.99] ${
        featured ? "rounded-2xl" : "rounded-xl"
      }`}
    >
      <div className={`relative bg-zinc-100 ${featured ? "h-56" : "h-44"}`}>
        {firstImage ? (
          <Image
            src={firstImage}
            alt={annonce.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes={featured
              ? "(max-width: 768px) 100vw, 50vw"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            }
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" />
            </svg>
          </div>
        )}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-semibold tracking-wide uppercase border ${categoryStyles[annonce.category] || "bg-zinc-50 text-zinc-600 border-zinc-200"}`}>
          {getCategoryLabel(annonce.category)}
        </span>
      </div>

      <div className={`${featured ? "p-5" : "p-4"}`}>
        <h3 className={`font-semibold text-zinc-900 tracking-tight truncate ${featured ? "text-base" : "text-sm"}`}>
          {annonce.title}
        </h3>
        <p className={`font-semibold text-primary font-mono mt-1.5 ${featured ? "text-lg" : "text-base"}`}>
          {formatPrice(annonce.price)}
        </p>

        <div className="flex items-center gap-3 mt-2.5 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {annonce.city}
          </span>
          {annonce.rooms && <span>{annonce.rooms} pièces</span>}
          {annonce.surface && <span className="font-mono">{annonce.surface} m²</span>}
        </div>

        <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-zinc-100">
          <span className="text-[11px] text-zinc-400">{timeAgo(annonce.createdAt)}</span>
          <span className="text-[11px] text-zinc-500 font-medium">{annonce.user.name}</span>
        </div>
      </div>
    </Link>
  );
}
