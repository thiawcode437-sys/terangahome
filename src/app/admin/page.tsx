"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { formatPrice, getStatusLabel, timeAgo } from "@/lib/utils";

interface AdminAnnonce {
  id: string;
  title: string;
  price: number;
  category: string;
  city: string;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  _count: { annonces: number };
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"annonces" | "users">("annonces");
  const [annonces, setAnnonces] = useState<AdminAnnonce[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const role = (session?.user as Record<string, unknown>)?.role;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && role !== "ADMIN") router.push("/");
  }, [status, role, router]);

  useEffect(() => {
    if (role !== "ADMIN") return;
    setLoading(true);

    if (tab === "annonces") {
      const params = statusFilter ? `?status=${statusFilter}` : "";
      fetch(`/api/admin/annonces${params}`)
        .then((r) => r.json())
        .then((data) => { setAnnonces(data); setLoading(false); });
    } else {
      fetch("/api/admin/users")
        .then((r) => r.json())
        .then((data) => { setUsers(data); setLoading(false); });
    }
  }, [tab, statusFilter, role]);

  async function updateAnnonceStatus(id: string, newStatus: string) {
    await fetch("/api/admin/annonces", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    setAnnonces((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
  }

  async function updateUserRole(id: string, newRole: string) {
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: newRole }),
    });
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
  }

  if (status === "loading" || role !== "ADMIN") {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration</h1>
      <p className="text-gray-600 mb-6">Gérez les utilisateurs et les annonces</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-2xl font-bold text-primary">{users.length || "..."}</p>
          <p className="text-sm text-gray-600">Utilisateurs</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-2xl font-bold text-blue-600">{annonces.length || "..."}</p>
          <p className="text-sm text-gray-600">Annonces</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-2xl font-bold text-amber-600">
            {annonces.filter((a) => a.status === "PENDING").length}
          </p>
          <p className="text-sm text-gray-600">En attente</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-2xl font-bold text-green-600">
            {annonces.filter((a) => a.status === "ACTIVE").length}
          </p>
          <p className="text-sm text-gray-600">Actives</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setTab("annonces")}
          className={`pb-3 px-1 font-medium ${
            tab === "annonces" ? "text-primary border-b-2 border-primary" : "text-gray-500"
          }`}
        >
          Annonces
        </button>
        <button
          onClick={() => setTab("users")}
          className={`pb-3 px-1 font-medium ${
            tab === "users" ? "text-primary border-b-2 border-primary" : "text-gray-500"
          }`}
        >
          Utilisateurs
        </button>
      </div>

      {/* Content */}
      {tab === "annonces" && (
        <>
          <div className="flex gap-2 mb-4">
            {["", "PENDING", "ACTIVE", "REJECTED"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  statusFilter === s
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {s ? getStatusLabel(s) : "Toutes"}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : (
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">Annonce</th>
                      <th className="text-left px-4 py-3 font-medium">Vendeur</th>
                      <th className="text-left px-4 py-3 font-medium">Prix</th>
                      <th className="text-left px-4 py-3 font-medium">Statut</th>
                      <th className="text-left px-4 py-3 font-medium">Date</th>
                      <th className="text-left px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {annonces.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium truncate max-w-[200px]">{a.title}</p>
                          <p className="text-xs text-gray-500">{a.city}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{a.user.name}</td>
                        <td className="px-4 py-3">{formatPrice(a.price)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            a.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                            a.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                            a.status === "REJECTED" ? "bg-red-100 text-red-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {getStatusLabel(a.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{timeAgo(a.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {a.status !== "ACTIVE" && (
                              <button
                                onClick={() => updateAnnonceStatus(a.id, "ACTIVE")}
                                className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                              >
                                Approuver
                              </button>
                            )}
                            {a.status !== "REJECTED" && (
                              <button
                                onClick={() => updateAnnonceStatus(a.id, "REJECTED")}
                                className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                              >
                                Rejeter
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {tab === "users" && (
        loading ? (
          <div className="text-center py-8 text-gray-500">Chargement...</div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Nom</th>
                    <th className="text-left px-4 py-3 font-medium">Email</th>
                    <th className="text-left px-4 py-3 font-medium">Téléphone</th>
                    <th className="text-left px-4 py-3 font-medium">Rôle</th>
                    <th className="text-left px-4 py-3 font-medium">Annonces</th>
                    <th className="text-left px-4 py-3 font-medium">Inscription</th>
                    <th className="text-left px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3 text-gray-600">{u.phone || "-"}</td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          onChange={(e) => updateUserRole(u.id, e.target.value)}
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="CLIENT">Client</option>
                          <option value="VENDEUR">Vendeur</option>
                          <option value="AGENT">Agent</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u._count.annonces}</td>
                      <td className="px-4 py-3 text-gray-500">{timeAgo(u.createdAt)}</td>
                      <td className="px-4 py-3">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
}
