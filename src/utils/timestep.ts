export type Timestep = "s" | "m" | "h" | "d" | "w" | "M" | "y" | `${number}y`;

const durations = [
  { duration: 1000, label: "s" },
  { duration: 1000 * 60, label: "m" },
  { duration: 1000 * 60 * 60, label: "h" },
  { duration: 1000 * 60 * 60 * 24, label: "d" },
  { duration: 1000 * 60 * 60 * 24 * 7, label: "w" },
  { duration: 1000 * 60 * 60 * 24 * 30, label: "M" },
  { duration: 1000 * 60 * 60 * 24 * 365, label: "y" },
] as const;

export const getMaximumTimestepForDuration = (
  duration: number,
  steps: number,
): [number, Timestep] => {
  const timestep = duration / steps;

  for (const duration of durations) {
    if (timestep <= duration.duration)
      return [duration.duration, duration.label];
  }

  // If not, return every 10, 100, 1000, etc. years

  let factor = 10;

  while (timestep > factor * 1000 * 60 * 60 * 24 * 365) {
    factor *= 10;
  }

  return [
    factor * 1000 * 60 * 60 * 24 * 365,
    `${factor.toString().substring(1)}y` as `${number}y`,
  ];
};
