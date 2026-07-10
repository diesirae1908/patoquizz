"use client";

import { useEffect, useState } from "react";
import { formatCountdown, getNextQuizCountdown } from "@/lib/dates";

export function Countdown() {
  const [countdown, setCountdown] = useState(getNextQuizCountdown());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getNextQuizCountdown());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-sm text-white/60">
      Prochain quiz dans {formatCountdown(countdown)}
    </p>
  );
}
