import type {
  InterviewApiState,
  InterviewConversationTurn,
  InterviewStartRequest,
} from '../../types/interview';
import { getSpringApiBase } from '../springBase';

const SESSION_STORAGE_KEY = 'invision_interview_session_id';

/** @deprecated use getSpringApiBase — kept for interview paths */
export function getInterviewApiBase(): string {
  return getSpringApiBase();
}

async function readBody(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { message: text };
  }
}

function extractErrorMessage(data: Record<string, unknown>, fallback: string): string {
  const msg = data.message ?? data.error ?? data.detail;
  if (typeof msg === 'string' && msg.trim()) return msg;
  if (Array.isArray(data.errors)) return String(data.errors[0]);
  return fallback;
}

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

/** Normalize start/reply JSON into a single shape (snake_case + camelCase). */
export function normalizeInterviewPayload(raw: Record<string, unknown>): InterviewApiState {
  const sessionId = String(raw.session_id ?? raw.sessionId ?? '');
  const q = asRecord(raw.question);
  const questionText = q
    ? String(q.question_text ?? q.questionText ?? '') || null
    : null;

  const interviewCompleted = Boolean(raw.interview_completed ?? raw.interviewCompleted);
  const questionsAsked = Number(raw.questions_asked ?? raw.questionsAsked ?? 0);
  const maxQuestions = Number(raw.max_questions ?? raw.maxQuestions ?? 0);

  const jurySessionSummary =
    typeof raw.jury_session_summary === 'string'
      ? raw.jury_session_summary
      : typeof raw.jurySessionSummary === 'string'
        ? raw.jurySessionSummary
        : null;

  const scoringRaw = raw.scoring;
  const scoring =
    scoringRaw && typeof scoringRaw === 'object' && !Array.isArray(scoringRaw)
      ? (scoringRaw as InterviewApiState['scoring'])
      : null;

  const interviewBlock = asRecord(raw.interview);
  let conversation: InterviewConversationTurn[] = [];
  if (interviewBlock?.conversation && Array.isArray(interviewBlock.conversation)) {
    conversation = interviewBlock.conversation as InterviewConversationTurn[];
  }

  const feedbackForJury = raw.feedback_for_jury ?? raw.feedbackForJury ?? null;

  return {
    sessionId,
    questionText: questionText && questionText.length > 0 ? questionText : null,
    interviewCompleted,
    questionsAsked: Number.isFinite(questionsAsked) ? questionsAsked : 0,
    maxQuestions: Number.isFinite(maxQuestions) ? maxQuestions : 0,
    jurySessionSummary,
    scoring,
    conversation,
    feedbackForJury,
  };
}

export class InterviewApiError extends Error {
  status: number;
  body: Record<string, unknown>;

  constructor(message: string, status: number, body: Record<string, unknown>) {
    super(message);
    this.name = 'InterviewApiError';
    this.status = status;
    this.body = body;
  }
}

export async function startInterviewSession(
  body: InterviewStartRequest,
): Promise<InterviewApiState> {
  const url = `${getInterviewApiBase()}/interview/start`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new InterviewApiError('Network error — could not reach interview service.', 0, {});
  }

  const data = await readBody(res);
  if (!res.ok) {
    const msg =
      res.status === 502
        ? extractErrorMessage(data, 'Interview service unavailable (502).')
        : extractErrorMessage(data, `Interview start failed (${res.status}).`);
    throw new InterviewApiError(msg, res.status, data);
  }

  const normalized = normalizeInterviewPayload(data);
  if (normalized.sessionId) {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, normalized.sessionId);
    } catch {
      /* ignore */
    }
  }
  return normalized;
}

export async function sendInterviewReply(
  sessionId: string,
  answer: string,
): Promise<InterviewApiState> {
  const url = `${getInterviewApiBase()}/interview/${encodeURIComponent(sessionId)}/reply`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer }),
    });
  } catch {
    throw new InterviewApiError('Network error — could not reach interview service.', 0, {});
  }

  const data = await readBody(res);
  if (!res.ok) {
    const msg =
      res.status === 502
        ? extractErrorMessage(data, 'Interview service unavailable (502).')
        : extractErrorMessage(data, `Could not send answer (${res.status}).`);
    throw new InterviewApiError(msg, res.status, data);
  }

  return normalizeInterviewPayload(data);
}

export function clearStoredInterviewSession(): void {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function getStoredInterviewSessionId(): string | null {
  try {
    return sessionStorage.getItem(SESSION_STORAGE_KEY);
  } catch {
    return null;
  }
}
