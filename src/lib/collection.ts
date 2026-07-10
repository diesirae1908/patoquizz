import { DEPARTMENTS } from "./geography/departments";

const REGION_COLORS: Record<string, string> = {
  "Auvergne-Rhône-Alpes": "#3B82F6",
  "Bourgogne-Franche-Comté": "#8B5CF6",
  Bretagne: "#06B6D4",
  "Centre-Val de Loire": "#10B981",
  Corse: "#F59E0B",
  "Grand Est": "#6366F1",
  Guadeloupe: "#14B8A6",
  Guyane: "#22C55E",
  "Hauts-de-France": "#EF4444",
  "Île-de-France": "#A855F7",
  "La Réunion": "#F97316",
  Martinique: "#EC4899",
  Mayotte: "#84CC16",
  Normandie: "#0EA5E9",
  "Nouvelle-Aquitaine": "#D946EF",
  Occitanie: "#EAB308",
  "Pays de la Loire": "#64748B",
  "Provence-Alpes-Côte d'Azur": "#F43F5E",
};

export interface CollectedDepartment {
  dept_code: string;
  dept_name: string;
  region: string;
  quiz_date: string;
  collected_at: string;
}

export function getRegionColor(region: string): string {
  return REGION_COLORS[region] ?? "#6B7280";
}

export function getAllDepartments() {
  return DEPARTMENTS.map((dept) => ({
    code: dept.code,
    name: dept.name,
    region: dept.region,
    color: getRegionColor(dept.region),
  }));
}

export function pickRandomUncollectedDepartment(
  ownedCodes: string[]
): { code: string; name: string; region: string } | null {
  const owned = new Set(ownedCodes);
  const available = DEPARTMENTS.filter((dept) => !owned.has(dept.code));
  if (available.length === 0) return null;
  const pick = available[Math.floor(Math.random() * available.length)];
  return { code: pick.code, name: pick.name, region: pick.region };
}

export function getDepartmentByCode(code: string) {
  return DEPARTMENTS.find((dept) => dept.code === code) ?? null;
}
