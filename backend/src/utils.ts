export function getRandomDistinct(n: number, max: number): number[] {
  const set = new Set<number>();

  while (set.size < n) {
    const val = Math.floor(Math.random() * max);
    set.add(val);
  }

  return Array.from(set);
}
