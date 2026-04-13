"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  House,
  Storefront,
  MapPin,
  ChatCircle,
  Plus,
  List,
  X,
  SignOut,
  User,
  GearSix,
  Package,
} from "@phosphor-icons/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const role = (session?.user as Record<string, unknown>)?.role as string;

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-zinc-200/60 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-xs tracking-tight">TH</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-zinc-900">
              Teranga<span className="text-primary">Home</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/annonces"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
            >
              <House size={18} weight="duotone" />
              Immobilier
            </Link>
            <Link
              href="/marketplace"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
            >
              <Storefront size={18} weight="duotone" />
              Marketplace
            </Link>
            <Link
              href="/localiser"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
            >
              <MapPin size={18} weight="duotone" />
              Localiser
            </Link>
            {session && (role === "LIVREUR" || role === "CLIENT" || role === "VENDEUR") && (
              <Link
                href="/livraisons"
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25V6.375c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v8.25m-12.75 0h12.75m0 0h1.5c.621 0 1.125-.504 1.125-1.125v-3.026a1.5 1.5 0 00-.439-1.06l-2.525-2.525a1.5 1.5 0 00-1.06-.44H15.75" />
                </svg>
                Livraisons
              </Link>
            )}

            <div className="w-px h-6 bg-zinc-200 mx-2" />

            {session ? (
              <>
                <Link href="/annonces/publier" className="btn-primary text-sm py-2 px-3.5">
                  <Plus size={16} weight="bold" />
                  Publier
                </Link>
                <Link
                  href="/messages"
                  className="relative p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-all"
                >
                  <ChatCircle size={20} weight="duotone" />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-8 h-8 bg-gradient-to-br from-primary to-emerald-600 rounded-lg flex items-center justify-center text-white font-medium text-xs transition-transform hover:scale-105 active:scale-95"
                  >
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg shadow-zinc-200/50 border border-zinc-200/60 py-1.5 overflow-hidden">
                      <div className="px-4 py-2.5 border-b border-zinc-100">
                        <p className="text-sm font-medium text-zinc-900 truncate">{session.user?.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{session.user?.email}</p>
                      </div>
                      <Link
                        href="/profil"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User size={16} />
                        Mon Profil
                      </Link>
                      {role === "ADMIN" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <GearSix size={16} />
                          Administration
                        </Link>
                      )}
                      <div className="border-t border-zinc-100 mt-1 pt-1">
                        <button
                          onClick={() => signOut()}
                          className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <SignOut size={16} />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="btn-secondary text-sm py-2"
                >
                  Connexion
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2">
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <List size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1 border-t border-zinc-100 mt-2">
            <Link href="/annonces" className="flex items-center gap-2.5 py-2.5 px-3 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg" onClick={() => setMenuOpen(false)}>
              <House size={18} weight="duotone" /> Immobilier
            </Link>
            <Link href="/marketplace" className="flex items-center gap-2.5 py-2.5 px-3 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg" onClick={() => setMenuOpen(false)}>
              <Storefront size={18} weight="duotone" /> Marketplace
            </Link>
            <Link href="/localiser" className="flex items-center gap-2.5 py-2.5 px-3 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg" onClick={() => setMenuOpen(false)}>
              <MapPin size={18} weight="duotone" /> Localiser
            </Link>
            {session ? (
              <>
                <Link href="/livraisons" className="flex items-center gap-2.5 py-2.5 px-3 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                  <Package size={18} weight="duotone" /> Livraisons
                </Link>
                <Link href="/annonces/publier" className="flex items-center gap-2.5 py-2.5 px-3 text-sm text-primary font-medium hover:bg-emerald-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                  <Plus size={18} weight="bold" /> Publier une annonce
                </Link>
                <Link href="/messages" className="flex items-center gap-2.5 py-2.5 px-3 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                  <ChatCircle size={18} weight="duotone" /> Messages
                </Link>
                <Link href="/profil" className="flex items-center gap-2.5 py-2.5 px-3 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                  <User size={18} weight="duotone" /> Mon Profil
                </Link>
                {role === "ADMIN" && (
                  <Link href="/admin" className="flex items-center gap-2.5 py-2.5 px-3 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                    <GearSix size={18} weight="duotone" /> Administration
                  </Link>
                )}
                <div className="border-t border-zinc-100 mt-2 pt-2">
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2.5 py-2.5 px-3 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full"
                  >
                    <SignOut size={18} /> Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-2 mt-2 pt-2 border-t border-zinc-100">
                <Link href="/login" className="btn-secondary text-sm flex-1" onClick={() => setMenuOpen(false)}>
                  Connexion
                </Link>
                <Link href="/register" className="btn-primary text-sm flex-1" onClick={() => setMenuOpen(false)}>
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
