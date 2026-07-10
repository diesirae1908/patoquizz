"use client";

import { useEffect, useState } from "react";
import type { DepartmentMagnet as DepartmentMagnetType } from "@/lib/types";
import { DepartmentMagnet } from "./DepartmentMagnet";
import { v4 as uuidv4 } from "uuid";

const GUEST_KEY = "patoquizz_guest_id";

export function DepartmentCollection() {
  const [magnets, setMagnets] = useState<DepartmentMagnetType[]>([]);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  function getGuestId() {
    if (typeof window === "undefined") return null;
    const existing = localStorage.getItem(GUEST_KEY);
    if (existing) return existing;
    const created = uuidv4();
    localStorage.setItem(GUEST_KEY, created);
    return created;
  }

  useEffect(() => {
    async function load() {
      const guestId = getGuestId();
      const response = await fetch(
        `/api/profile/collection?guestId=${guestId ?? ""}`
      );
      const data = await response.json();
      setMagnets(data.magnets ?? []);
      setCount(data.count ?? 0);
      setTotal(data.total ?? 0);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <p className="text-center text-white/60">Chargement de la collection...</p>;
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Ma collection</h2>
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
          {count}/{total}
        </span>
      </div>
      <p className="mb-4 text-sm text-white/50">
        Gagnez un département à chaque quiz avec 5 bonnes réponses ou plus.
        Collectionnez-les tous comme les magnets Père Dodu !
      </p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
        {magnets.map((magnet) => (
          <DepartmentMagnet key={magnet.code} magnet={magnet} size="sm" />
        ))}
      </div>
    </div>
  );
}
