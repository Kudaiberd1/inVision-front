/**
 * Dashboard `cvFullText` / `essayFullText` are often LaTeX fragments: plain text from the PDF
 * wrapped in `\begin{verbatim}...\end{verbatim}` (monospace, line breaks preserved).
 *
 * We do not run a full TeX engine in the browser. This strips the outer verbatim environment
 * when present so the inner string can be shown with `white-space: pre-wrap` and matched for AI
 * highlights. Treat the API value as opaque text; never inject it as unsanitized HTML.
 *
 * @see https://www.latex-project.org/help/documentation/ (verbatim)
 */
export function unwrapVerbatimLatexFragment(source: string): string {
  const s = source.trim();
  if (!s) return '';

  const beginRe = /^\s*\\begin\s*\{\s*verbatim\*?\s*\}\s*/i;
  const endRe = /\s*\\end\s*\{\s*verbatim\*?\s*\}\s*$/i;

  let out = s;
  if (beginRe.test(out)) out = out.replace(beginRe, '');
  if (endRe.test(out)) out = out.replace(endRe, '');
  return out;
}

/** True when there is non-whitespace content after unwrapping (for “has document text” UI). */
export function hasMeaningfulDocumentText(source: string): boolean {
  return unwrapVerbatimLatexFragment(source).trim().length > 0;
}
