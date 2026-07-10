"use client";

import { useEffect, useState } from "react";
import type { LeaderboardEntry } from "@/lib/types";

export default function ClassementPage() {
  const [period, setPeriod] = useState<"today" | "all">("today");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      setLoading(true);
      const response = await fetch(`/api/leaderboard?period=${period}`);
      const data = await response.json();
      setEntries(data.entries ?? []);
      setLoading(false);
    }

    loadLeaderboard();
  }, [period]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Classement</h1>
        <p className="mt-2 text-white/60">
          Comparez vos performances avec les autres joueurs
        </p>
      </div>

      <div className="flex justify-center gap-2">
        <button
          onClick={() => setPeriod("today")}
          className={`rounded-lg px-4 py-2 text-sm ${
            period === "today"
              ? "bg-white text-black"
              : "border border-white/20 text-white/70"
          }`}
        >
          Aujourd&apos;hui
        </button>
        <button
          onClick={() => setPeriod("all")}
          className={`rounded-lg px-4 py-2 text-sm ${
            period === "all"
              ? "bg-white text-black"
              : "border border-white/20 text-white/70"
          }`}
        >
          Général
        </button>
      </div>

      {loading ? (
        <p className="text-center text-white/60">Chargement...</p>
      ) : entries.length === 0 ? (
        <p className="text-center text-white/60">
          Aucun résultat pour le moment. Soyez le premier !
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Joueur</th>
                <th className="px-4 py-3">Points</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Temps</th>
                <th className="px-4 py-3">Série</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={`${entry.username}-${entry.rank}`} className="border-t border-white/5">
                  <td className="px-4 py-3">{entry.rank}</td>
                  <td className="px-4 py-3 font-medium">
                    {entry.username}
                    {entry.country ? (
                      <span className="ml-2 text-white/40">{entry.country}</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{entry.points}</td>
                  <td className="px-4 py-3">{entry.score}</td>
                  <td className="px-4 py-3 text-white/50">
                    {entry.total_time_ms
                      ? `${Math.round(entry.total_time_ms / 1000)}s`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">{entry.streak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
