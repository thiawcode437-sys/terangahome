"use client";

import { useState, useEffect, useCallback } from "react";
import AnnonceCard from "@/components/annonces/AnnonceCard";

interface Annonce {
  id: string;
  title: string;
  price: number;
  category: string;
  city: string;
  images: string;
  rooms: number | null;
  surface: number | null;
  createdAt: Date;
  user: { name: string; avatar: string | null };
}

export default function AnnoncesPage() {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    q: "",
  });

  const fetchAnnonces = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (filters.category) params.set("category", filters.category);
    if (filters.city) params.set("city", filters.city);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.q) params.set("q", filters.q);

    // Exclude marketplace products
    if (!filters.category) {
      // Show only real estate by default
    }

    const res = await fetch(`/api/annonces?${params}`);
    const data = await res.json();
    setAnnonces(data.annonces);
    setTotalPages(data.pages);
    setLoading(false);
  }, [page, filters]);

  useEffect(() => {
    // Read URL params on mount
    const urlParams = new URLSearchParams(window.location.search);
    const newFilters = { ...filters };
    let changed = false;
    for (const [key, val] of urlParams.entries()) {
      if (key in newFilters) {
        (newFilters as Record<string, string>)[key] = val;
        changed = true;
      }
    }
    if (changed) setFilters(newFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchAnnonces();
  }, [fetchAnnonces]);

  const cities = [
    "Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Kaolack",
    "Mbour", "Rufisque", "Touba", "Diourbel", "Tambacounda",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Annonces immobilières
      </h1>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Rechercher..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            className="input"
          />
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="input"
          >
            <option value="">Toutes catégories</option>
            <option value="LOCATION">Location</option>
            <option value="VENTE">Vente</option>
            <option value="TERRAIN">Terrain</option>
          </select>
          <select
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="input"
          >
            <option value="">Toutes les villes</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Prix min"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="input"
          />
          <input
            type="number"
            placeholder="Prix max"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="input"
          />
        </div>
        <button
          onClick={() => { setPage(1); fetchAnnonces(); }}
          className="btn-primary mt-3"
        >
          Filtrer
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Chargement...</div>
      ) : annonces.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {annonces.map((a) => (
              <AnnonceCard key={a.id} annonce={a} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    page === i + 1
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Aucune annonce trouvée</p>
          <p className="text-sm mt-2">Essayez de modifier vos filtres</p>
        </div>
      )}
    </div>
  );
}
