"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  UserCircle,
  EnvelopeSimple,
  Phone,
  Lock,
  ArrowRight,
  WarningCircle,
  Buildings,
} from "@phosphor-icons/react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      role: formData.get("role"),
    };

    const confirmPassword = formData.get("confirmPassword");
    if (data.password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Une erreur est survenue lors de l'inscription");
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-[100dvh] flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-zinc-950 relative items-end p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-emerald-900/20" />
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">TH</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              Teranga<span className="text-primary">Home</span>
            </span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tighter text-white leading-tight mb-3">
            Rejoignez la communauté immobilière
          </h2>
          <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
            Que vous soyez acheteur, vendeur ou agent, TerangaHome vous connecte aux bonnes personnes.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center px-4 sm:px-8 py-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Créer un compte
            </h1>
            <p className="text-sm text-zinc-500 mt-1.5">
              Inscription gratuite en moins d&apos;une minute
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
                <WarningCircle size={18} className="mt-0.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Nom complet</label>
                <div className="relative">
                  <UserCircle size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input type="text" name="name" required className="input pl-10" placeholder="Amadou Ndiaye" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Téléphone</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input type="tel" name="phone" className="input pl-10" placeholder="+221 77 845 23 91" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email</label>
              <div className="relative">
                <EnvelopeSimple size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input type="email" name="email" required className="input pl-10" placeholder="votre@email.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Profil</label>
              <div className="relative">
                <Buildings size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <select name="role" className="input pl-10 appearance-none">
                  <option value="CLIENT">Acheteur / Locataire</option>
                  <option value="VENDEUR">Vendeur / Propriétaire</option>
                  <option value="AGENT">Agent immobilier</option>
                  <option value="LIVREUR">Livreur</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Mot de passe</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input type="password" name="password" required minLength={6} className="input pl-10" placeholder="Min. 6 caractères" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Confirmer</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input type="password" name="confirmPassword" required className="input pl-10" placeholder="Retaper le mot de passe" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Création du compte...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Créer mon compte
                  <ArrowRight size={16} weight="bold" />
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Déjà inscrit ?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline underline-offset-2">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
