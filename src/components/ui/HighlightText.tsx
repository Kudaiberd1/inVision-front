import type { AIHighlight } from '../../types';
import { isPositiveHighlightSentiment } from '../../utils/aiHighlight';

interface HighlightTextProps {
  fullText: string;
  highlights: AIHighlight[];
}

interface Segment {
  text: string;
  highlight?: AIHighlight;
}

interface Range {
  start: number;
  end: number;
  h: AIHighlight;
}

function normalizeDocumentText(s: string): string {
  return s.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function normalizeQuotes(s: string): string {
  return s
    .replace(/\u2018/g, "'")
    .replace(/\u2019/g, "'")
    .replace(/\u201C/g, '"')
    .replace(/\u201D/g, '"');
}

function normalizeDashes(s: string): string {
  return s.replace(/\u2013/g, '-').replace(/\u2014/g, '-');
}

function buildNeedleVariants(raw: string): string[] {
  const t = raw.trim();
  const set = new Set<string>();
  const add = (v: string) => {
    if (!v) return;
    set.add(v);
    set.add(normalizeQuotes(v));
    set.add(normalizeDashes(v));
    set.add(normalizeDashes(normalizeQuotes(v)));
  };
  add(raw);
  if (t && t !== raw) add(t);
  return [...set].filter(Boolean);
}

/** When exact match fails: match words in order with flexible whitespace (PDF vs model spacing). */
function flexWhitespaceRanges(doc: string, needle: string): { start: number; end: number }[] {
  const t = needle.trim();
  if (t.length < 5) return [];
  const words = t.split(/\s+/).filter(Boolean);
  const esc = (w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let pattern: string;
  try {
    if (words.length < 2) {
      if (words.length !== 1 || words[0].length < 6) return [];
      pattern = `\\b${esc(words[0])}\\b`;
    } else {
      pattern = esc(words[0]);
      for (let i = 1; i < words.length; i++) {
        pattern += '\\s+' + esc(words[i]);
      }
    }
  } catch {
    return [];
  }
  const re = new RegExp(pattern, 'gu');
  const out: { start: number; end: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(doc)) !== null) {
    out.push({ start: m.index, end: m.index + m[0].length });
    if (m[0].length === 0) re.lastIndex++;
  }
  return out;
}

function collectRanges(fullText: string, highlights: AIHighlight[]): Range[] {
  const doc = normalizeDocumentText(fullText);
  const raw: Range[] = [];
  const seen = new Set<string>();

  const addRange = (start: number, end: number, h: AIHighlight) => {
    if (end <= start) return;
    const key = `${start}:${end}`;
    if (seen.has(key)) return;
    seen.add(key);
    raw.push({ start, end, h });
  };

  for (const h of highlights) {
    let matched = false;
    for (const needle of buildNeedleVariants(h.text)) {
      if (!needle) continue;
      let from = 0;
      while (from < doc.length) {
        const idx = doc.indexOf(needle, from);
        if (idx < 0) break;
        addRange(idx, idx + needle.length, h);
        matched = true;
        from = idx + 1;
      }
      if (matched) break;
    }

    if (!matched) {
      const flex = flexWhitespaceRanges(doc, h.text);
      for (const r of flex) {
        addRange(r.start, r.end, h);
      }
    }
  }

  raw.sort((a, b) => a.start - b.start || a.end - b.end);

  const merged: Range[] = [];
  for (const r of raw) {
    const prev = merged[merged.length - 1];
    if (!prev || r.start >= prev.end) {
      merged.push({ ...r });
    } else {
      prev.end = Math.max(prev.end, r.end);
    }
  }

  return merged;
}

function buildSegments(doc: string, highlights: AIHighlight[]): Segment[] {
  if (!highlights.length) return [{ text: doc }];

  const ranges = collectRanges(doc, highlights);
  if (!ranges.length) return [{ text: doc }];

  const segments: Segment[] = [];
  let cursor = 0;
  for (const r of ranges) {
    if (r.start > cursor) segments.push({ text: doc.slice(cursor, r.start) });
    segments.push({
      text: doc.slice(r.start, r.end),
      highlight: r.h,
    });
    cursor = r.end;
  }
  if (cursor < doc.length) segments.push({ text: doc.slice(cursor) });
  return segments;
}

function highlightHasMatch(doc: string, h: AIHighlight): boolean {
  for (const needle of buildNeedleVariants(h.text)) {
    if (needle && doc.indexOf(needle) >= 0) return true;
  }
  return flexWhitespaceRanges(doc, h.text).length > 0;
}

function countHighlightsWithMatch(doc: string, highlights: AIHighlight[]): number {
  return highlights.reduce((n, h) => n + (highlightHasMatch(doc, h) ? 1 : 0), 0);
}

export function HighlightText({ fullText, highlights }: HighlightTextProps) {
  const doc = normalizeDocumentText(fullText);
  const segs = buildSegments(doc, highlights);
  const matched = highlights.length ? countHighlightsWithMatch(doc, highlights) : 0;
  const unmatched = highlights.length - matched;

  return (
    <div className="flex w-full min-w-0 flex-col rounded-xl border border-[#E8E8E6] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="shrink-0 border-b border-neutral-100 px-4 pb-4 pt-5 sm:px-6 sm:pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
          Full text — highlighted in context
        </p>
        {highlights.length > 0 && (
          <p className="mt-2 text-xs text-neutral-500">
            Matched {matched} of {highlights.length} snippet{highlights.length === 1 ? '' : 's'} in this text.
            {unmatched > 0
              ? ' Others may differ slightly from the extract (spacing or quotes) — check the list on the right.'
              : null}
          </p>
        )}
      </div>
      <div className="px-4 pb-6 pt-4 sm:px-6">
        <div className="whitespace-pre-wrap break-words font-mono text-[13px] leading-[1.7] text-neutral-900">
          {segs.map((s, i) => {
            if (!s.highlight) {
              return <span key={i}>{s.text}</span>;
            }
            const positive = isPositiveHighlightSentiment(s.highlight.sentiment);
            const cls = positive
              ? 'bg-[#E4F2A8] text-neutral-900 [box-decoration-break:clone]'
              : 'bg-[#FFF3A8] text-neutral-900 [box-decoration-break:clone]';
            return (
              <mark
                key={i}
                className={`cursor-help rounded-[2px] px-0.5 font-normal ${cls}`}
                title={s.highlight.reason}
              >
                {s.text}
              </mark>
            );
          })}
        </div>
      </div>
    </div>
  );
}
