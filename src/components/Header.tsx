"use client";

import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-white/10 px-4 py-4">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Patoquizz"
              width={36}
              height={36}
              className="rounded-full"
            />
            <span className="text-xl font-bold tracking-[0.2em] text-white">
              PATOQUIZZ
            </span>
          </Link>
        </div>
        <nav className="flex items-center gap-4 text-sm text-white/80">
          <Link href="/classement" className="hover:text-white">
            Classement
          </Link>
          <Link href="/profil" className="hover:text-white">
            Profil
          </Link>
        </nav>
      </div>
    </header>
  );
}
