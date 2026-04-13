"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PublierAnnoncePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  if (status === "loading") return <div className="text-center py-12">Chargement...</div>;
  if (!session) {
    router.push("/login");
    return null;
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (data.urls) {
      setImages((prev) => [...prev, ...data.urls]);
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: formData.get("price"),
      category: formData.get("category"),
      city: formData.get("city"),
      address: formData.get("address"),
      rooms: formData.get("rooms"),
      surface: formData.get("surface"),
      images,
    };

    const res = await fetch("/api/annonces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const annonce = await res.json();
      router.push(`/annonces/${annonce.id}`);
    } else {
      const body = await res.json();
      setError(body.error || "Erreur lors de la publication");
      setLoading(false);
    }
  }

  const cities = [
    "Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Kaolack",
    "Mbour", "Rufisque", "Touba", "Diourbel", "Tambacounda",
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Publier une annonce</h1>
      <p className="text-gray-600 mb-8">Remplissez les détails de votre bien ou produit</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        {/* Basic info */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Informations de base</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
            <select name="category" required className="input">
              <option value="">Sélectionner une catégorie</option>
              <option value="LOCATION">Location</option>
              <option value="VENTE">Vente immobilière</option>
              <option value="TERRAIN">Terrain</option>
              <option value="PRODUIT">Produit (Marketplace)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
            <input
              type="text"
              name="title"
              required
              className="input"
              placeholder="Ex: Bel appartement 3 pièces à Dakar Plateau"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              required
              rows={5}
              className="input resize-none"
              placeholder="Décrivez votre bien en détail..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) *</label>
              <input type="number" name="price" required min="0" className="input" placeholder="Ex: 150000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
              <select name="city" required className="input">
                <option value="">Sélectionner</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input type="text" name="address" className="input" placeholder="Quartier, rue..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de pièces</label>
              <input type="number" name="rooms" min="1" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Surface (m²)</label>
              <input type="number" name="surface" min="1" className="input" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Photos</h2>
          <p className="text-sm text-gray-500">Ajoutez jusqu&apos;à 10 photos de votre bien</p>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image src={img} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                >
                  X
                </button>
              </div>
            ))}
            {images.length < 10 && (
              <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs text-gray-500 mt-1">
                  {uploading ? "Upload..." : "Ajouter"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3 text-lg disabled:opacity-50"
        >
          {loading ? "Publication..." : "Publier l'annonce"}
        </button>
      </form>
    </div>
  );
}
