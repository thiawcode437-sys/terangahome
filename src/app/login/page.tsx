"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EnvelopeSimple, Lock, ArrowRight, WarningCircle } from "@phosphor-icons/react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Identifiants incorrects. Vérifiez votre email et mot de passe.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-[100dvh] flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-950 relative items-end p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-emerald-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_30%_60%,rgba(5,150,105,0.12),transparent)]" />
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
            La confiance au coeur <br />de l&apos;immobilier sénégalais
          </h2>
          <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
            Rejoignez des milliers d&apos;utilisateurs qui achètent, vendent et louent en toute sécurité.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Connexion
            </h1>
            <p className="text-sm text-zinc-500 mt-1.5">
              Accédez à votre espace TerangaHome
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
                <WarningCircle size={18} className="mt-0.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <EnvelopeSimple size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  name="email"
                  required
                  className="input pl-10"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="password"
                  name="password"
                  required
                  className="input pl-10"
                  placeholder="Votre mot de passe"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Se connecter
                  <ArrowRight size={16} weight="bold" />
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline underline-offset-2">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
