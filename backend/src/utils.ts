export function getRandomDistinct(n: number, max: number): number[] {
  const set = new Set<number>();

  while (set.size < n) {
    const val = Math.floor(Math.random() * max);
    set.add(val);
  }

  return Array.from(set);
}

export function rankDict(dict: Record<string, number>) {
  const entries = Object.entries(dict);

  const result: Record<string, number> = {};

  for (const [key, value] of entries) {
    let rank = 1;

    for (const [, otherValue] of entries) {
      if (otherValue > value) {
        rank++;
      }
    }

    result[key] = rank;
  }

  return result;
}
