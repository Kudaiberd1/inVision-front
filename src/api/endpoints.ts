export const ENDPOINTS = {
  AUTH_LOGIN: '/api/auth/login',

  DASHBOARD_CANDIDATES: '/api/dashboard/candidates',
  DASHBOARD_CV_REVIEW: (id: string) => `/api/dashboard/candidates/${encodeURIComponent(id)}/cv-review`,
  DASHBOARD_ESSAY_REVIEW: (id: string) => `/api/dashboard/candidates/${encodeURIComponent(id)}/essay-review`,
  DASHBOARD_CHATBOT: (id: string) => `/api/dashboard/candidates/${encodeURIComponent(id)}/chatbot-analysis`,
  DASHBOARD_STATUS: (id: string) => `/api/dashboard/candidates/${encodeURIComponent(id)}/status`,

  /** Applicant flow — no JWT; use with `getSpringApiBase()` (already includes `/api`). */
  FORMS_DRAFT: '/forms/draft',
  FORMS_SUBMIT: (id: string | number) => `/forms/${encodeURIComponent(String(id))}/submit`,

  SUBMIT_CHATBOT: '/applications/chatbot',
  GET_CHATBOT_QUESTIONS: '/chatbot/questions',
} as const;
