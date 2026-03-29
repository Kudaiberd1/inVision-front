import type { Candidate } from '../types';

/** Prefer S3 HTTPS URL from API; fall back to legacy `cvUrl` if present. */
export function candidateCvPdfHref(c: Candidate): string | undefined {
  const u = c.cvPdfUrl ?? c.cvUrl;
  if (typeof u !== 'string') return undefined;
  const t = u.trim();
  return t.length ? t : undefined;
}

/** Prefer S3 HTTPS URL from API; fall back to legacy `essayUrl` if present. */
export function candidateEssayPdfHref(c: Candidate): string | undefined {
  const u = c.essayPdfUrl ?? c.essayUrl;
  if (typeof u !== 'string') return undefined;
  const t = u.trim();
  return t.length ? t : undefined;
}
