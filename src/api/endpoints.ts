export const ENDPOINTS = {
  AUTH_LOGIN: '/api/auth/login',

  DASHBOARD_CANDIDATES: '/api/dashboard/candidates',
  DASHBOARD_CANDIDATE_DETAIL: (id: string) =>
    `/api/dashboard/candidates/${encodeURIComponent(id)}`,
  DASHBOARD_SCORE_OVERVIEW: (id: string) =>
    `/api/dashboard/candidates/${encodeURIComponent(id)}/score-overview`,
  DASHBOARD_CV_REVIEW: (id: string) => `/api/dashboard/candidates/${encodeURIComponent(id)}/cv-review`,
  DASHBOARD_ESSAY_REVIEW: (id: string) => `/api/dashboard/candidates/${encodeURIComponent(id)}/essay-review`,
  DASHBOARD_CHATBOT: (id: string) => `/api/dashboard/candidates/${encodeURIComponent(id)}/chatbot-analysis`,
  DASHBOARD_STATUS: (id: string) => `/api/dashboard/candidates/${encodeURIComponent(id)}/status`,
  DASHBOARD_EXTRA_ACTIVITIES: (id: string) =>
    `/api/dashboard/candidates/${encodeURIComponent(id)}/extra`,
  DASHBOARD_CODING_REVIEW: (id: string) =>
    `/api/dashboard/candidates/${encodeURIComponent(id)}/coding-review`,

  /** Applicant flow — no JWT; use with `getSpringApiBase()` (already includes `/api`). */
  FORMS_DRAFT: '/forms/draft',
  FORMS_SUBMIT: (id: string | number) => `/forms/${encodeURIComponent(String(id))}/submit`,

  SUBMIT_CHATBOT: '/applications/chatbot',
  GET_CHATBOT_QUESTIONS: '/chatbot/questions',
} as const;
