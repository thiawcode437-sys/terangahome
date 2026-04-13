"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Package,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ArrowRight,
  CurrencyCircleDollar,
} from "@phosphor-icons/react";
import { formatPrice, timeAgo } from "@/lib/utils";

interface Livraison {
  id: string;
  status: string;
  deliveryPrice: number;
  distance: number | null;
  pickupAddress: string | null;
  deliveryAddress: string | null;
  notes: string | null;
  estimatedTime: number | null;
  acceptedAt: string | null;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  annonce: {
    id: string;
    title: string;
    price: number;
    images: string;
    city: string;
  };
  buyer: {
    id: string;
    name: string;
    phone: string | null;
    city: string | null;
  };
  livreur: {
    id: string;
    name: string;
    phone: string | null;
    vehicleType: string | null;
  } | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Package }> = {
  PENDING: { label: "En attente", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  ACCEPTED: { label: "Acceptée", color: "bg-blue-50 text-blue-700 border-blue-200", icon: CheckCircle },
  PICKED_UP: { label: "Récupéré", color: "bg-indigo-50 text-indigo-700 border-indigo-200", icon: Package },
  IN_TRANSIT: { label: "En route", color: "bg-primary/10 text-primary border-primary/20", icon: Truck },
  DELIVERED: { label: "Livré", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
  CANCELLED: { label: "Annulée", color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
};

export default function LivraisonsPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [livraisons, setLivraisons] = useState<Livraison[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const role = (session?.user as Record<string, unknown>)?.role as string;
  const isLivreur = role === "LIVREUR";

  const fetchLivraisons = useCallback(async () => {
    setLoading(true);
    const params = statusFilter ? `?status=${statusFilter}` : "";
    const res = await fetch(`/api/livraisons${params}`);
    const data = await res.json();
    setLivraisons(data);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/login");
  }, [authStatus, router]);

  useEffect(() => {
    if (session) fetchLivraisons();
  }, [session, fetchLivraisons]);

  async function updateStatus(livraisonId: string, newStatus: string) {
    await fetch(`/api/livraisons/${livraisonId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchLivraisons();
  }

  if (authStatus === "loading") {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center text-zinc-500">Chargement...</div>;
  }
  if (!session) return null;

  const pending = livraisons.filter((l) => l.status === "PENDING" || l.status === "ACCEPTED");
  const active = livraisons.filter((l) => l.status === "PICKED_UP" || l.status === "IN_TRANSIT");
  const completed = livraisons.filter((l) => l.status === "DELIVERED" || l.status === "CANCELLED");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <p className="text-xs font-medium tracking-widest text-primary uppercase mb-1">
            {isLivreur ? "Mes livraisons" : "Mes commandes"}
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900">
            {isLivreur ? "Tableau de bord livreur" : "Suivi des livraisons"}
          </h1>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-zinc-200/60 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock size={18} className="text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-semibold tracking-tight text-zinc-900 font-mono">{pending.length}</p>
          <p className="text-xs text-zinc-500 mt-0.5">En attente</p>
        </div>
        <div className="bg-white border border-zinc-200/60 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Truck size={18} className="text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-semibold tracking-tight text-zinc-900 font-mono">{active.length}</p>
          <p className="text-xs text-zinc-500 mt-0.5">En cours</p>
        </div>
        <div className="bg-white border border-zinc-200/60 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle size={18} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-semibold tracking-tight text-zinc-900 font-mono">{completed.length}</p>
          <p className="text-xs text-zinc-500 mt-0.5">Terminées</p>
        </div>
        <div className="bg-white border border-zinc-200/60 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <CurrencyCircleDollar size={18} className="text-primary" />
            </div>
          </div>
          <p className="text-2xl font-semibold tracking-tight text-zinc-900 font-mono">
            {formatPrice(livraisons.filter((l) => l.status === "DELIVERED").reduce((sum, l) => sum + l.deliveryPrice, 0))}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">{isLivreur ? "Gains" : "Frais livraison"}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { value: "", label: "Toutes" },
          { value: "PENDING", label: "En attente" },
          { value: "ACCEPTED", label: "Acceptées" },
          { value: "PICKED_UP", label: "Récupérées" },
          { value: "IN_TRANSIT", label: "En route" },
          { value: "DELIVERED", label: "Livrées" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              statusFilter === f.value
                ? "bg-zinc-900 text-white"
                : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Livraisons list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
      ) : livraisons.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200/60">
          <div className="w-12 h-12 bg-zinc-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <Package size={24} className="text-zinc-400" />
          </div>
          <p className="text-zinc-500 text-sm mb-1">
            {isLivreur ? "Aucune livraison assignée" : "Aucune commande"}
          </p>
          <p className="text-zinc-400 text-xs">
            {isLivreur
              ? "Les nouvelles livraisons apparaîtront ici automatiquement"
              : "Achetez un produit pour voir vos commandes ici"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {livraisons.map((liv) => {
            const config = statusConfig[liv.status] || statusConfig.PENDING;
            const StatusIcon = config.icon;
            return (
              <div
                key={liv.id}
                className="bg-white border border-zinc-200/60 rounded-2xl p-5 hover:border-zinc-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${config.color}`}>
                        <StatusIcon size={14} />
                        {config.label}
                      </span>
                      {liv.distance && (
                        <span className="text-xs text-zinc-400 font-mono">{liv.distance} km</span>
                      )}
                      {liv.estimatedTime && liv.status !== "DELIVERED" && (
                        <span className="text-xs text-zinc-400">~{liv.estimatedTime} min</span>
                      )}
                    </div>

                    <h3 className="font-semibold text-zinc-900 tracking-tight mb-1">
                      {liv.annonce.title}
                    </h3>
                    <p className="text-sm text-primary font-semibold font-mono mb-3">
                      {formatPrice(liv.annonce.price)}
                      <span className="text-zinc-400 font-normal ml-2">
                        + {formatPrice(liv.deliveryPrice)} livraison
                      </span>
                    </p>

                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-500">
                      {liv.pickupAddress && (
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-zinc-400" />
                          Récup. : {liv.pickupAddress}
                        </span>
                      )}
                      {liv.deliveryAddress && (
                        <span className="flex items-center gap-1.5">
                          <ArrowRight size={14} className="text-zinc-400" />
                          Livr. : {liv.deliveryAddress}
                        </span>
                      )}
                    </div>

                    {/* Contact info */}
                    <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-zinc-100">
                      {isLivreur ? (
                        <>
                          <span className="text-xs text-zinc-500">
                            Acheteur : <strong>{liv.buyer.name}</strong>
                            {liv.buyer.phone && (
                              <a href={`tel:${liv.buyer.phone}`} className="text-primary ml-1.5 inline-flex items-center gap-0.5">
                                <Phone size={12} /> {liv.buyer.phone}
                              </a>
                            )}
                          </span>
                        </>
                      ) : (
                        liv.livreur && (
                          <span className="text-xs text-zinc-500">
                            Livreur : <strong>{liv.livreur.name}</strong>
                            {liv.livreur.vehicleType && (
                              <span className="text-zinc-400 ml-1">({liv.livreur.vehicleType})</span>
                            )}
                            {liv.livreur.phone && (
                              <a href={`tel:${liv.livreur.phone}`} className="text-primary ml-1.5 inline-flex items-center gap-0.5">
                                <Phone size={12} /> {liv.livreur.phone}
                              </a>
                            )}
                          </span>
                        )
                      )}
                      <span className="text-xs text-zinc-400">{timeAgo(liv.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions for livreur */}
                  {isLivreur && (
                    <div className="flex flex-col gap-2 sm:min-w-[140px]">
                      {liv.status === "PENDING" && (
                        <button
                          onClick={() => updateStatus(liv.id, "ACCEPTED")}
                          className="btn-primary text-xs py-2"
                        >
                          Accepter
                        </button>
                      )}
                      {liv.status === "ACCEPTED" && (
                        <button
                          onClick={() => updateStatus(liv.id, "PICKED_UP")}
                          className="btn-primary text-xs py-2"
                        >
                          Colis récupéré
                        </button>
                      )}
                      {liv.status === "PICKED_UP" && (
                        <button
                          onClick={() => updateStatus(liv.id, "IN_TRANSIT")}
                          className="btn-primary text-xs py-2"
                        >
                          En route
                        </button>
                      )}
                      {liv.status === "IN_TRANSIT" && (
                        <button
                          onClick={() => updateStatus(liv.id, "DELIVERED")}
                          className="btn-primary bg-emerald-600 hover:bg-emerald-700 text-xs py-2"
                        >
                          Livré
                        </button>
                      )}
                      {(liv.status === "PENDING" || liv.status === "ACCEPTED") && (
                        <button
                          onClick={() => updateStatus(liv.id, "CANCELLED")}
                          className="btn-secondary text-xs py-2 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
