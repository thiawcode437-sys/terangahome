"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/map/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
      <p className="text-gray-500">Chargement de la carte...</p>
    </div>
  ),
});

interface MapUser {
  id: string;
  name: string;
  role: string;
  city: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
  isOnline: boolean;
  lastSeenAt: string | null;
  _count: { annonces: number };
}

const roleLabels: Record<string, string> = {
  AGENT: "Agent immobilier",
  VENDEUR: "Vendeur",
  CLIENT: "Client",
  ADMIN: "Administrateur",
};

const roleColors: Record<string, string> = {
  AGENT: "bg-green-500",
  VENDEUR: "bg-red-500",
  CLIENT: "bg-blue-500",
  ADMIN: "bg-purple-500",
};

export default function LocaliserPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<MapUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [sharingLocation, setSharingLocation] = useState(false);
  const [locationShared, setLocationShared] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (roleFilter) params.set("role", roleFilter);
    if (cityFilter) params.set("city", cityFilter);

    const res = await fetch(`/api/users/location?${params}`);
    let data: MapUser[] = await res.json();

    if (showOnlineOnly) {
      data = data.filter((u) => u.isOnline);
    }

    setUsers(data);
    setLoading(false);
  }, [roleFilter, cityFilter, showOnlineOnly]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function shareMyLocation() {
    if (!session) {
      alert("Connectez-vous pour partager votre position");
      return;
    }

    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setSharingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await fetch("/api/users/location", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        });

        setLocationShared(true);
        setSharingLocation(false);
        fetchUsers();
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Impossible d'obtenir votre position. Vérifiez les permissions.");
        setSharingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const cities = [
    "Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Kaolack",
    "Mbour", "Rufisque", "Touba", "Diourbel", "Tambacounda",
  ];

  const onlineCount = users.filter((u) => u.isOnline).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Localiser</h1>
          <p className="text-gray-600">
            Trouvez des agents, vendeurs et clients près de chez vous
          </p>
        </div>
        <button
          onClick={shareMyLocation}
          disabled={sharingLocation}
          className={`btn-primary flex items-center gap-2 ${
            locationShared ? "bg-green-600" : ""
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {sharingLocation
            ? "Localisation..."
            : locationShared
            ? "Position partagée ✓"
            : "Partager ma position"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar filters */}
        <div className="lg:col-span-1 space-y-4">
          {/* Stats */}
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Statistiques</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total personnes</span>
                <span className="font-medium">{users.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  En ligne
                </span>
                <span className="font-medium text-green-600">{onlineCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  Hors ligne
                </span>
                <span className="font-medium text-gray-500">
                  {users.length - onlineCount}
                </span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Filtres</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de personne
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input"
              >
                <option value="">Tous</option>
                <option value="AGENT">Agents immobiliers</option>
                <option value="VENDEUR">Vendeurs</option>
                <option value="CLIENT">Clients</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="input"
              >
                <option value="">Toutes les villes</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="w-4 h-4 text-primary rounded"
              />
              <span className="text-sm text-gray-700">En ligne uniquement</span>
            </label>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Légende</h3>
            <div className="space-y-2">
              {Object.entries(roleLabels).map(([role, label]) => (
                <div key={role} className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded-full ${roleColors[role] || "bg-gray-500"}`}
                  ></span>
                  <span className="text-sm text-gray-700">{label}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow"></span>
                  <span className="text-sm text-gray-700">En ligne</span>
                </div>
              </div>
            </div>
          </div>

          {/* User list */}
          <div className="bg-white rounded-xl border overflow-hidden">
            <h3 className="font-semibold text-gray-900 p-4 pb-2">
              Personnes ({users.length})
            </h3>
            <div className="max-h-64 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 px-4 py-3 border-t hover:bg-gray-50"
                >
                  <div className="relative">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm ${roleColors[user.role] || "bg-gray-500"}`}
                    >
                      {user.name[0]}
                    </div>
                    {user.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-gray-500">
                      {roleLabels[user.role]} • {user.city || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
              {users.length === 0 && !loading && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Aucun résultat
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border overflow-hidden" style={{ height: "calc(100vh - 200px)", minHeight: "500px" }}>
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Chargement de la carte...
              </div>
            ) : (
              <MapComponent users={users} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
