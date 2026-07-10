"use client";

import { useEffect, useState } from "react";
import { DepartmentCollection } from "@/components/DepartmentCollection";
import type { UserStats } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

const GUEST_KEY = "patoquizz_guest_id";

export default function ProfilPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function getGuestId() {
    if (typeof window === "undefined") return null;
    const existing = localStorage.getItem(GUEST_KEY);
    if (existing) return existing;
    const created = uuidv4();
    localStorage.setItem(GUEST_KEY, created);
    return created;
  }

  useEffect(() => {
    async function loadStats() {
      const guestId = getGuestId();
      const response = await fetch(
        `/api/profile/stats?guestId=${guestId ?? ""}`
      );
      const data = await response.json();
      setStats(data);
      setLoading(false);
    }

    loadStats();
  }, []);

  async function handleAuthSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);

    const guestId = getGuestId();
    const endpoint = authMode === "signup" ? "/api/auth/signup" : "/api/auth/login";
    const body =
      authMode === "signup"
        ? { email, password, username, country, guestId }
        : { email, password };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Erreur d'authentification.");
      return;
    }

    setMessage("Compte connecté avec succès !");
    setAuthMode(null);
    window.location.reload();
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  }

  if (loading) {
    return <p className="text-center text-white/60">Chargement...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Profil</h1>
        <p className="mt-2 text-white/60">Vos statistiques et votre compte</p>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="Parties jouées" value={stats.games_played} />
          <StatCard label="Score moyen" value={`${stats.average_score}/6`} />
          <StatCard label="Points totaux" value={stats.total_points} />
          <StatCard label="Magnets collectés" value={`${stats.collection_count}/101`} />
          <StatCard label="Série actuelle" value={stats.current_streak} />
          <StatCard label="Meilleure série" value={stats.best_streak} />
        </div>
      )}

      {stats && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-lg font-semibold">Distribution des scores</h2>
          <div className="space-y-2">
            {[6, 5, 4, 3, 2, 1, 0].map((score) => {
              const count = stats.distribution[score] ?? 0;
              const max = Math.max(...Object.values(stats.distribution), 1);
              const width = `${(count / max) * 100}%`;

              return (
                <div key={score} className="flex items-center gap-3 text-sm">
                  <span className="w-8 text-white/60">{score}/6</span>
                  <div className="h-4 flex-1 rounded bg-white/10">
                    <div
                      className="h-4 rounded bg-emerald-500"
                      style={{ width }}
                    />
                  </div>
                  <span className="w-8 text-right text-white/60">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <DepartmentCollection />

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-lg font-semibold">Compte</h2>
        {stats?.username ? (
          <div className="space-y-3">
            <p>
              Connecté en tant que{" "}
              <span className="font-semibold">{stats.username}</span>
            </p>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
            >
              Se déconnecter
            </button>
          </div>
        ) : authMode ? (
          <form onSubmit={handleAuthSubmit} className="space-y-3">
            {authMode === "signup" && (
              <>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Pseudo"
                  required
                  className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2"
                />
                <input
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  placeholder="Pays (optionnel)"
                  className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2"
                />
              </>
            )}
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              required
              className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2"
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mot de passe"
              required
              className="w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black"
              >
                {authMode === "signup" ? "Créer un compte" : "Se connecter"}
              </button>
              <button
                type="button"
                onClick={() => setAuthMode(null)}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm"
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setAuthMode("signup")}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black"
            >
              Créer un compte
            </button>
            <button
              onClick={() => setAuthMode("login")}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm"
            >
              Se connecter
            </button>
          </div>
        )}
        {message && <p className="mt-3 text-sm text-emerald-400">{message}</p>}
        <p className="mt-4 text-sm text-white/50">
          Vous pouvez jouer sans compte. Créez un profil pour sauvegarder vos
          résultats et apparaître au classement.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
