const PARIS_TIMEZONE = "Europe/Paris";

export function getParisDateString(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PARIS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getNextQuizCountdown(): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date();
  const parisNow = new Date(
    now.toLocaleString("en-US", { timeZone: PARIS_TIMEZONE })
  );

  const nextMidnight = new Date(parisNow);
  nextMidnight.setHours(24, 0, 0, 0);

  const diffMs = nextMidnight.getTime() - parisNow.getTime();
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function formatCountdown(countdown: {
  hours: number;
  minutes: number;
  seconds: number;
}): string {
  const pad = (value: number) => value.toString().padStart(2, "0");
  return `${pad(countdown.hours)}:${pad(countdown.minutes)}:${pad(countdown.seconds)}`;
}
