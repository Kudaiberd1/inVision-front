/** Raw shapes from Spring (snake_case); camelCase variants optional. */

export interface InterviewQuestionPayload {
  question_text?: string;
  questionText?: string;
}

export interface InterviewConversationTurn {
  role?: string;
  question?: string;
  answer?: string;
  content?: string;
}

export interface InterviewBlock {
  conversation?: InterviewConversationTurn[];
}

export interface InterviewScoresPayload {
  leadership?: number;
  proactiveness?: number;
  energy?: number;
  core_score?: number;
  coreScore?: number;
  motivation?: number;
  growth_potential?: number;
  growthPotential?: number;
  experience_signals?: number;
  experienceSignals?: number;
  final_score?: number;
  finalScore?: number;
  [key: string]: unknown;
}

/** Normalized view used by React state after parsing any response. */
export interface InterviewApiState {
  sessionId: string;
  questionText: string | null;
  interviewCompleted: boolean;
  questionsAsked: number;
  maxQuestions: number;
  jurySessionSummary: string | null;
  scoring: InterviewScoresPayload | null;
  conversation: InterviewConversationTurn[];
  feedbackForJury: unknown;
}

export interface InterviewStartRequest {
  candidate_id: string;
  candidate_stage: string;
}
