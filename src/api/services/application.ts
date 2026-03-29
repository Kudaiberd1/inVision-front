import type { ApplicationFormData, ChatbotAnswer, ChatbotQuestion } from '../../types';
import { CHATBOT_QUESTIONS } from '../../data/mockData';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { getSpringApiBase } from '../springBase';
import { buildSpringApplicationFormData, mapSpringFieldErrors } from '../../utils/springForm';

const USE_MOCK_APPLICATION = import.meta.env.VITE_USE_MOCK_APPLICATION === 'true';

/** Applicant endpoints use `fetch` without `Authorization` (no JWT). */

async function readJsonBody(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { message: text };
  }
}

function firstString(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  if (Array.isArray(v) && typeof v[0] === 'string') return v[0];
  return undefined;
}

function extractFieldErrors(data: Record<string, unknown>): Record<string, string> | undefined {
  const raw = data.fieldErrors ?? data.errors;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const msg = firstString(v) ?? (typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v));
    if (msg) out[k] = msg;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function extractTopLevelMessage(data: Record<string, unknown>, fallback: string): string {
  const m = data.message ?? data.error ?? data.detail;
  if (typeof m === 'string' && m.trim()) return m;
  return fallback;
}

function parseNumericId(body: Record<string, unknown>): number {
  const raw = body.id ?? body.applicationId;
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string' && /^\d+$/.test(raw)) return parseInt(raw, 10);
  throw new Error('Invalid response: missing numeric id.');
}

export class FormDraftError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'FormDraftError';
    this.status = status;
  }
}

export class ApplicationSubmitError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = 'ApplicationSubmitError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Step 1: create draft row. Backend should return **201** and `{ id: number }` quickly.
 * Body: `{ fieldOfStudy }` — we send the selected **program name** (adjust if your API expects program id).
 */
export async function createFormDraft(fieldOfStudy: string): Promise<{ id: number }> {
  if (USE_MOCK_APPLICATION) {
    await new Promise((r) => setTimeout(r, 200));
    return { id: 100_000 + Math.floor(Math.random() * 900_000) };
  }

  const url = `${getSpringApiBase()}${ENDPOINTS.FORMS_DRAFT}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ fieldOfStudy: fieldOfStudy.trim() }),
    });
  } catch {
    throw new FormDraftError('Network error — could not reach the server.', 0);
  }

  const body = await readJsonBody(res);

  if (res.status === 201) {
    try {
      return { id: parseNumericId(body) };
    } catch {
      throw new FormDraftError('Invalid response: missing numeric id.', res.status);
    }
  }

  const msg = extractTopLevelMessage(body, `Could not start application (${res.status}).`);
  throw new FormDraftError(msg, res.status);
}

/**
 * Step 2: full multipart submit (slow: uploads + AI). Expect **200** and `{ id }`.
 * **404** — invalid/expired draft id. **409** — already submitted.
 */
export async function submitApplicationForm(
  formId: number,
  data: ApplicationFormData,
): Promise<{ id: number }> {
  if (USE_MOCK_APPLICATION) {
    await new Promise((r) => setTimeout(r, 800));
    return { id: formId };
  }

  const form = buildSpringApplicationFormData(data);
  const url = `${getSpringApiBase()}${ENDPOINTS.FORMS_SUBMIT(formId)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      body: form,
    });
  } catch {
    throw new ApplicationSubmitError('Network error — could not reach the server.', 0);
  }

  const body = await readJsonBody(res);

  if (res.status === 200) {
    try {
      return { id: parseNumericId(body) };
    } catch {
      throw new ApplicationSubmitError('Invalid response: missing numeric id.', res.status);
    }
  }

  const serverFields = extractFieldErrors(body);
  const mapped = serverFields ? mapSpringFieldErrors(serverFields) : undefined;

  if (res.status === 400) {
    const msg = extractTopLevelMessage(body, 'Please check the form and try again.');
    throw new ApplicationSubmitError(msg, res.status, mapped);
  }

  if (res.status === 404) {
    const msg = extractTopLevelMessage(
      body,
      'This application draft was not found or has expired. Please start again from program selection.',
    );
    throw new ApplicationSubmitError(msg, 404, mapped);
  }

  if (res.status === 409) {
    const msg = extractTopLevelMessage(body, 'This application has already been submitted.');
    throw new ApplicationSubmitError(msg, 409, mapped);
  }

  if (res.status === 502) {
    const msg = extractTopLevelMessage(
      body,
      'Processing failed (service unavailable). Please try again later.',
    );
    throw new ApplicationSubmitError(msg, res.status, mapped);
  }

  const msg = extractTopLevelMessage(body, `Submit failed (${res.status}).`);
  throw new ApplicationSubmitError(msg, res.status, mapped);
}

export const submitChatbot = async (
  applicationId: string,
  answers: ChatbotAnswer[],
): Promise<void> => {
  if (USE_MOCK_APPLICATION) {
    await new Promise((r) => setTimeout(r, 300));
    void applicationId;
    void answers;
    return;
  }
  await apiClient.post(ENDPOINTS.SUBMIT_CHATBOT, { applicationId, answers });
};

export const getChatbotQuestions = async (): Promise<ChatbotQuestion[]> => {
  if (USE_MOCK_APPLICATION) return structuredClone(CHATBOT_QUESTIONS);
  const { data } = await apiClient.get<ChatbotQuestion[]>(ENDPOINTS.GET_CHATBOT_QUESTIONS);
  return data;
};
