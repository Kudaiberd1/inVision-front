import type {
  Candidate,
  ChatbotAnalysis,
  ChatMessage,
  Criteria,
  CriteriaScore,
  CVReview,
  EssayReview,
  FieldOfStudy,
} from '../types';
import { FIELDS_OF_STUDY, PROGRAMS } from '../constants';

/** Row from GET /api/dashboard/candidates */
export interface DashboardCandidateListItem {
  id: number;
  fullName: string;
  email: string;
  fieldOfStudy: string;
  programId: string;
  submissionDate: string;
  aiScore: number;
  criteriaScores: CriteriaScore;
  status: Candidate['status'];
}

export interface DashboardCvReviewResponse {
  /** LaTeX fragment (typically `verbatim` around plain text); not a URL. */
  cvFullText: string | null;
  /** HTTPS URL of the CV PDF in S3 — viewer / download */
  cvPdfUrl?: string | null;
  /** @deprecated Prefer `cvPdfUrl` when provided */
  cvUrl?: string | null;
  cvReview: CVReview;
}

export interface DashboardEssayReviewResponse {
  /** LaTeX fragment (typically `verbatim` around plain text); not a URL. */
  essayFullText: string | null;
  /** HTTPS URL of the essay PDF in S3 — viewer / download */
  essayPdfUrl?: string | null;
  /** @deprecated Prefer `essayPdfUrl` when provided */
  essayUrl?: string | null;
  essayReview: EssayReview;
}

export interface DashboardChatbotTurn {
  dimension: string;
  questionId: number;
  questionType?: string;
  questionText: string;
  answerText: string;
}

export interface DashboardChatbotResponse {
  turns: DashboardChatbotTurn[];
  criteriaScores: CriteriaScore;
  overallScore: number;
  summary: string;
  criteriaSummaries: Record<string, string>;
}

function coerceFieldOfStudy(raw: string): FieldOfStudy {
  const t = raw.trim();
  if ((FIELDS_OF_STUDY as readonly string[]).includes(t)) return t as FieldOfStudy;
  return 'Technology';
}

function programFromDashboard(programId: string, fieldOfStudy: FieldOfStudy): Candidate['program'] {
  const byId = PROGRAMS.find((p) => p.id === programId);
  if (byId) return byId;
  return {
    id: programId || 'unknown',
    category: fieldOfStudy,
    name: fieldOfStudy,
  };
}

function emptyChatbot(): ChatbotAnalysis {
  return {
    conversations: [],
    criteriaScores: { leadership: 0, proactiveness: 0, energy: 0 },
    overallScore: 0,
    summary: '',
    criteriaSummaries: { leadership: '', proactiveness: '', energy: '' },
  };
}

function dimensionToCriteria(d: string): Criteria {
  const x = d.toLowerCase();
  if (x === 'leadership' || x === 'proactiveness' || x === 'energy') return x;
  return 'leadership';
}

export function mapDashboardChatbotToAnalysis(data: DashboardChatbotResponse): ChatbotAnalysis {
  const conversations: ChatMessage[] = data.turns.map((t) => ({
    question: t.questionText,
    answer: t.answerText,
    criteria: dimensionToCriteria(t.dimension),
    questionIndex: t.questionId,
  }));
  const criteriaSummaries: ChatbotAnalysis['criteriaSummaries'] = {
    leadership: data.criteriaSummaries.leadership ?? '',
    proactiveness: data.criteriaSummaries.proactiveness ?? '',
    energy: data.criteriaSummaries.energy ?? '',
  };
  return {
    conversations,
    criteriaScores: data.criteriaScores,
    overallScore: data.overallScore,
    summary: data.summary,
    criteriaSummaries,
  };
}

/** List row → minimal Candidate for table + detail merge. */
export function dashboardListItemToCandidate(row: DashboardCandidateListItem): Candidate {
  const fieldOfStudy = coerceFieldOfStudy(row.fieldOfStudy);
  const placeholderCv: CVReview = {
    summary: '',
    highlights: [],
    criteriaScores: row.criteriaScores,
    overallScore: row.aiScore,
  };
  const placeholderEssay: EssayReview = {
    summary: '',
    highlights: [],
    aiGeneratedFlag: false,
    aiGeneratedConfidence: 0,
    criteriaScores: row.criteriaScores,
    overallScore: row.aiScore,
  };
  return {
    id: String(row.id),
    fullName: row.fullName,
    email: row.email,
    fieldOfStudy,
    program: programFromDashboard(row.programId, fieldOfStudy),
    submissionDate: row.submissionDate,
    aiScore: row.aiScore,
    criteriaScores: row.criteriaScores,
    status: row.status,
    cvFullText: '',
    essayFullText: '',
    cvReview: placeholderCv,
    essayReview: placeholderEssay,
    chatbotAnalysis: emptyChatbot(),
  };
}

export function mergeCandidateDetail(
  base: Candidate,
  cv: DashboardCvReviewResponse,
  essay: DashboardEssayReviewResponse,
  chat: DashboardChatbotResponse | null,
): Candidate {
  return {
    ...base,
    cvFullText: cv.cvFullText ?? '',
    cvPdfUrl: cv.cvPdfUrl ?? undefined,
    cvUrl: cv.cvUrl ?? undefined,
    cvReview: cv.cvReview,
    essayFullText: essay.essayFullText ?? '',
    essayPdfUrl: essay.essayPdfUrl ?? undefined,
    essayUrl: essay.essayUrl ?? undefined,
    essayReview: essay.essayReview,
    chatbotAnalysis: chat ? mapDashboardChatbotToAnalysis(chat) : base.chatbotAnalysis,
  };
}
