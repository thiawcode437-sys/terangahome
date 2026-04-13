"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { formatPrice, getCategoryLabel, getCategoryColor, formatDate, parseJsonArray } from "@/lib/utils";

interface AnnonceDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  city: string;
  address: string | null;
  images: string;
  rooms: number | null;
  surface: number | null;
  views: number;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    role: string;
    city: string | null;
  };
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: { name: string; avatar: string | null };
  }>;
  _count: { favorites: number };
}

export default function AnnonceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [annonce, setAnnonce] = useState<AnnonceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`/api/annonces/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) router.push("/annonces");
        else setAnnonce(data);
        setLoading(false);
      });
  }, [params.id, router]);

  async function handleFavorite() {
    if (!session) return router.push("/login");
    await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ annonceId: annonce!.id }),
    });
  }

  async function handleSendMessage() {
    if (!session) return router.push("/login");
    if (!message.trim()) return;
    setSending(true);

    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: message,
        receiverId: annonce!.user.id,
        annonceId: annonce!.id,
      }),
    });

    setMessage("");
    setSending(false);
    alert("Message envoyé !");
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-500">Chargement...</div>;
  }

  if (!annonce) return null;

  const images = parseJsonArray(annonce.images);
  const avgRating = annonce.reviews.length
    ? (annonce.reviews.reduce((sum, r) => sum + r.rating, 0) / annonce.reviews.length).toFixed(1)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        {" / "}
        <Link href="/annonces" className="hover:text-primary">Annonces</Link>
        {" / "}
        <span className="text-gray-900">{annonce.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div className="bg-white rounded-xl overflow-hidden border">
            <div className="relative h-64 sm:h-96 bg-gray-100">
              {images[selectedImage] ? (
                <Image
                  src={images[selectedImage]}
                  alt={annonce.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                  Pas d&apos;image
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                      selectedImage === i ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium mb-2 ${getCategoryColor(annonce.category)}`}>
                  {getCategoryLabel(annonce.category)}
                </span>
                <h1 className="text-2xl font-bold text-gray-900">{annonce.title}</h1>
              </div>
              <button onClick={handleFavorite} className="p-2 text-gray-400 hover:text-red-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <p className="text-3xl font-bold text-primary mb-4">{formatPrice(annonce.price)}</p>

            <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {annonce.city}{annonce.address && `, ${annonce.address}`}
              </span>
              {annonce.rooms && <span>{annonce.rooms} pièces</span>}
              {annonce.surface && <span>{annonce.surface} m²</span>}
              <span>{annonce.views} vues</span>
              <span>{annonce._count.favorites} favoris</span>
            </div>

            <div className="border-t pt-4">
              <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{annonce.description}</p>
            </div>

            <p className="text-sm text-gray-400 mt-4">Publiée le {formatDate(annonce.createdAt)}</p>
          </div>

          {/* Reviews */}
          {annonce.reviews.length > 0 && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-semibold text-gray-900 mb-4">
                Avis ({annonce.reviews.length}) {avgRating && `- ${avgRating}/5`}
              </h2>
              <div className="space-y-4">
                {annonce.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{review.user.name}</span>
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i}>{i < review.rating ? "\u2605" : "\u2606"}</span>
                        ))}
                      </div>
                    </div>
                    {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact card */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Contacter le vendeur</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                {annonce.user.name[0]}
              </div>
              <div>
                <p className="font-medium">{annonce.user.name}</p>
                <p className="text-sm text-gray-500">{annonce.user.role === "AGENT" ? "Agent immobilier" : "Propriétaire"}</p>
              </div>
            </div>

            {annonce.user.phone && (
              <a
                href={`tel:${annonce.user.phone}`}
                className="w-full btn-primary block text-center mb-3"
              >
                Appeler {annonce.user.phone}
              </a>
            )}

            <div className="space-y-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Bonjour, je suis intéressé(e) par votre annonce..."
                className="input min-h-[100px] resize-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={sending || !message.trim()}
                className="w-full btn-primary disabled:opacity-50"
              >
                {sending ? "Envoi..." : "Envoyer un message"}
              </button>
            </div>
          </div>

          {/* Buy + Delivery button (for PRODUIT category) */}
          {annonce.category === "PRODUIT" && annonce.user.id !== session?.user?.id && (
            <div className="bg-white rounded-xl border p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Acheter avec livraison</h2>
              <p className="text-sm text-gray-500 mb-4">
                Un livreur proche du vendeur sera automatiquement assigné pour récupérer et livrer le produit.
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Votre adresse de livraison"
                  id="deliveryAddress"
                  className="input"
                />
                <textarea
                  placeholder="Instructions pour le livreur (optionnel)"
                  id="deliveryNotes"
                  className="input min-h-[60px] resize-none"
                />
                <button
                  onClick={async () => {
                    if (!session) return router.push("/login");
                    const addr = (document.getElementById("deliveryAddress") as HTMLInputElement)?.value;
                    const notes = (document.getElementById("deliveryNotes") as HTMLTextAreaElement)?.value;

                    const res = await fetch("/api/livraisons", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        annonceId: annonce.id,
                        deliveryAddress: addr,
                        notes,
                      }),
                    });

                    if (res.ok) {
                      alert("Commande confirmée ! Un livreur a été assigné et va contacter le vendeur.");
                      router.push("/livraisons");
                    } else {
                      const data = await res.json();
                      alert(data.error || "Erreur lors de la commande");
                    }
                  }}
                  className="w-full btn-primary py-3"
                >
                  Commander avec livraison
                </button>
              </div>
            </div>
          )}

          {/* Safety tips */}
          <div className="bg-amber-50 rounded-xl p-4 text-sm">
            <h3 className="font-semibold text-amber-800 mb-2">Conseils de sécurité</h3>
            <ul className="text-amber-700 space-y-1">
              <li>- Visitez le bien avant tout paiement</li>
              <li>- Ne payez jamais avant de voir le bien</li>
              <li>- Vérifiez les documents officiels</li>
              <li>- Méfiez-vous des prix trop bas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
