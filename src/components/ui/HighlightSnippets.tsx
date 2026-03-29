import type { AIHighlight } from '../../types';
import { isPositiveHighlightSentiment } from '../../utils/aiHighlight';

/** When full document text is unavailable, show each highlight’s quoted `text` with sentiment styling. */
export function HighlightSnippets({
  highlights,
  showHeading = true,
}: {
  highlights: AIHighlight[];
  showHeading?: boolean;
}) {
  if (!highlights.length) return null;
  return (
    <div className="space-y-4">
      {showHeading && (
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          AI-highlighted excerpts
        </p>
      )}
      {highlights.map((h, i) => {
        const positive = isPositiveHighlightSentiment(h.sentiment);
        return (
          <div
            key={`${i}-${h.text.slice(0, 24)}`}
            className={`rounded-lg border-l-4 py-3 pl-4 pr-3 ${
              positive
                ? 'border-emerald-500 bg-emerald-50/90'
                : 'border-amber-500 bg-amber-50/90'
            }`}
          >
            <p className="whitespace-pre-wrap text-sm font-medium text-neutral-900">{h.text}</p>
            <p className="mt-2 text-xs leading-relaxed text-neutral-600">{h.reason}</p>
          </div>
        );
      })}
    </div>
  );
}
