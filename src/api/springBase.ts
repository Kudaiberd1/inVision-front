/**
 * Spring Boot server root, e.g. http://localhost:8080 — no trailing slash.
 * Prefer VITE_API_BASE_URL; fall back to older env names for compatibility.
 * Empty string = same-origin (Vite dev proxy to /api).
 */
export function getApiRoot(): string {
  const u =
    import.meta.env.VITE_API_BASE_URL ??
    import.meta.env.VITE_SPRING_API_BASE ??
    import.meta.env.VITE_INTERVIEW_API_BASE;
  if (typeof u === 'string' && u.trim()) return u.replace(/\/$/, '');
  return '';
}

/** Base for applicant fetch() calls: absolute /api on server or relative /api behind proxy. */
export function getSpringApiBase(): string {
  const root = getApiRoot();
  return root ? `${root}/api` : '/api';
}
