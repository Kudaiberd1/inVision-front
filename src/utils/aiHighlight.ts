/** Maps API variants (e.g. weak / negative) to UI buckets. */
export function isPositiveHighlightSentiment(sentiment: unknown): boolean {
  const x = String(sentiment ?? '')
    .toLowerCase()
    .trim();
  return x === 'positive' || x === 'strong' || x === 'strength';
}
