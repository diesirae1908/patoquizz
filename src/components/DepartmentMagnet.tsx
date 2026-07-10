"use client";

import type { DepartmentMagnet as DepartmentMagnetType } from "@/lib/types";

interface DepartmentMagnetProps {
  magnet: DepartmentMagnetType;
  size?: "sm" | "md" | "lg";
}

export function DepartmentMagnet({ magnet, size = "md" }: DepartmentMagnetProps) {
  const sizeClasses = {
    sm: "h-14 w-14 text-[10px]",
    md: "h-20 w-20 text-xs",
    lg: "h-28 w-28 text-sm",
  };

  if (!magnet.owned) {
    return (
      <div
        className={`${sizeClasses[size]} flex flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/5 text-white/25`}
        title={`${magnet.name} — non collecté`}
      >
        <span className="font-bold">{magnet.code}</span>
        <span className="mt-0.5 truncate px-1 text-center leading-tight opacity-50">
          {magnet.name}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} flex flex-col items-center justify-center rounded-lg border-2 border-white/30 shadow-lg transition hover:scale-105`}
      style={{
        backgroundColor: magnet.color,
        boxShadow: `0 4px 12px ${magnet.color}40`,
      }}
      title={`${magnet.name} (${magnet.region})`}
    >
      <span className="font-black text-white drop-shadow">{magnet.code}</span>
      <span className="mt-0.5 truncate px-1 text-center font-semibold leading-tight text-white/90">
        {magnet.name}
      </span>
    </div>
  );
}
