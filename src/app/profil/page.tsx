"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AnnonceCard from "@/components/annonces/AnnonceCard";

interface UserAnnonce {
  id: string;
  title: string;
  price: number;
  category: string;
  city: string;
  images: string;
  rooms: number | null;
  surface: number | null;
  status: string;
  createdAt: Date;
  user: { name: string; avatar: string | null };
}

export default function ProfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"annonces" | "favoris">("annonces");
  const [annonces, setAnnonces] = useState<UserAnnonce[]>([]);
  const [favoris, setFavoris] = useState<{ annonce: UserAnnonce }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;

    if (tab === "annonces") {
      fetch("/api/annonces?mine=1")
        .then((r) => r.json())
        .then((data) => {
          setAnnonces(data.annonces || []);
          setLoading(false);
        });
    } else {
      fetch("/api/favorites")
        .then((r) => r.json())
        .then((data) => {
          setFavoris(data);
          setLoading(false);
        });
    }
  }, [session, tab]);

  if (status === "loading") return <div className="text-center py-12">Chargement...</div>;
  if (!session) return null;

  const role = (session.user as Record<string, unknown>).role as string;
  const roleLabel: Record<string, string> = {
    CLIENT: "Client",
    VENDEUR: "Vendeur",
    AGENT: "Agent immobilier",
    ADMIN: "Administrateur",
    LIVREUR: "Livreur",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {session.user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{session.user?.name}</h1>
            <p className="text-gray-600">{session.user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-sm rounded-md font-medium">
              {roleLabel[role] || role}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => { setTab("annonces"); setLoading(true); }}
          className={`pb-3 px-1 font-medium ${
            tab === "annonces"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
          }`}
        >
          Mes annonces
        </button>
        <button
          onClick={() => { setTab("favoris"); setLoading(true); }}
          className={`pb-3 px-1 font-medium ${
            tab === "favoris"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
          }`}
        >
          Mes favoris
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Chargement...</div>
      ) : tab === "annonces" ? (
        annonces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {annonces.map((a) => (
              <AnnonceCard key={a.id} annonce={a} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Vous n&apos;avez pas encore publié d&apos;annonce</p>
          </div>
        )
      ) : favoris.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoris.map((f) => (
            <AnnonceCard key={f.annonce.id} annonce={f.annonce} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>Aucun favori pour le moment</p>
        </div>
      )}
    </div>
  );
}
