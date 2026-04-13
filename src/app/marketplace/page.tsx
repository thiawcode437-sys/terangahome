"use client";

import { useState, useEffect, useCallback } from "react";
import AnnonceCard from "@/components/annonces/AnnonceCard";
import Link from "next/link";

interface Product {
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

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      category: "PRODUIT",
      page: page.toString(),
    });
    if (search) params.set("q", search);

    const res = await fetch(`/api/annonces?${params}`);
    const data = await res.json();
    setProducts(data.annonces);
    setTotalPages(data.pages);
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600">Achetez et vendez des produits en toute confiance</p>
        </div>
        <Link href="/annonces/publier" className="btn-primary text-center">
          Vendre un produit
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input flex-1"
          />
          <button onClick={() => { setPage(1); fetchProducts(); }} className="btn-primary">
            Rechercher
          </button>
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Chargement...</div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <AnnonceCard key={p.id} annonce={p} />
            ))}
          </div>

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
          <p className="text-lg">Aucun produit sur la marketplace</p>
          <Link href="/annonces/publier" className="btn-primary inline-block mt-4">
            Soyez le premier à vendre
          </Link>
        </div>
      )}
    </div>
  );
}
