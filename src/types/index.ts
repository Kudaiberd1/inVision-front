// --- Shared ---
export type DecisionStatus = 'pending' | 'accepted' | 'rejected';
export type FieldOfStudy = 'Technology' | 'Business' | 'Social Impact' | 'Design' | 'Science';
export type StudentLevel = 'school' | 'college-university';
export type Criteria = 'leadership' | 'proactiveness' | 'energy';

// --- Scoring ---
export interface CriteriaScore {
  leadership: number;
  proactiveness: number;
  energy: number;
}

export interface AIHighlight {
  text: string;
  reason: string;
  sentiment: 'positive' | 'warning';
}

// --- Reviews ---
export interface CVReview {
  summary: string;
  highlights: AIHighlight[];
  criteriaScores: CriteriaScore;
  overallScore: number;
}

export interface EssayReview {
  summary: string;
  highlights: AIHighlight[];
  aiGeneratedFlag: boolean;
  aiGeneratedConfidence: number;
  criteriaScores: CriteriaScore;
  overallScore: number;
}

export interface ChatMessage {
  question: string;
  answer: string;
  criteria: Criteria;
  questionIndex: number;
}

export interface ChatbotAnalysis {
  conversations: ChatMessage[];
  criteriaScores: CriteriaScore;
  overallScore: number;
  summary: string;
  /** Admin UI: one short paragraph per criterion */
  criteriaSummaries: Record<Criteria, string>;
}

export type ExtraPlatform = 'codeforces' | 'leetcode' | 'linkedin' | 'github';

export interface CodeforcesStats {
  platform: 'codeforces';
  rating: number;
  maxRating: number;
  rank: string;
  problemsSolved: number;
  contests: number;
  activedays: number;
  chartImageUrl?: string;
}

export interface LeetcodeStats {
  platform: 'leetcode';
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  ranking: number;
  chartImageUrl?: string;
}

export interface LinkedinStats {
  platform: 'linkedin';
  headline: string;
  connections: number;
  skills: string[];
  certifications: string[];
  summary: string;
  chartImageUrl?: string;
}

export interface GithubStats {
  platform: 'github';
  publicRepos: number;
  followers: number;
  totalStars: number;
  totalCommits: number;
  topLanguages: string[];
  chartImageUrl?: string;
}

export interface ExtraActivity {
  id: string;
  platform: ExtraPlatform;
  handle: string;
  profileUrl: string;
  available: boolean;
  aiScore: number;
  aiExplanation: string;
  stats: CodeforcesStats | LeetcodeStats | LinkedinStats | GithubStats;
}

export interface Program {
  id: string;
  category: string;
  name: string;
  description?: string;
}

// --- Candidate (admin view) ---
export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  fieldOfStudy: FieldOfStudy;
  program: Program;
  submissionDate: string;
  aiScore: number;
  criteriaScores: CriteriaScore;
  status: DecisionStatus;
  /**
   * CV body from the API: often a LaTeX fragment (e.g. `\begin{verbatim}...\end{verbatim}` with PDF
   * extract inside). The review UI unwraps verbatim for display; do not treat as HTML.
   */
  cvFullText: string;
  /** HTTPS URL of the CV PDF in S3 (viewer / download). Prefer this when the API sends it. */
  cvPdfUrl?: string | null;
  /** Legacy or alternate CV file URL; used if `cvPdfUrl` is absent */
  cvUrl?: string | null;
  /**
   * Essay body from the API: same convention as `cvFullText` (LaTeX / verbatim-wrapped extract).
   */
  essayFullText: string;
  /** HTTPS URL of the essay PDF in S3 (viewer / download). Prefer this when the API sends it. */
  essayPdfUrl?: string | null;
  /** Legacy or alternate essay file URL; used if `essayPdfUrl` is absent */
  essayUrl?: string | null;
  cvReview: CVReview;
  essayReview: EssayReview;
  chatbotAnalysis: ChatbotAnalysis;
  extraActivities?: ExtraActivity[];
}

// --- Application form (applicant submits) ---
export interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  studentLevel: StudentLevel;
  program: Program | null;
  city: string;
  school: string;
  untScore: string;
  ielts: string;
  toefl: string;
  codeforces: string;
  leetcode: string;
  github: string;
  linkedin: string;
  cvFile: File | null;
  essayFile: File | null;
  videoFile: File | null;
}

// --- Chatbot (applicant interview) ---
export interface ChatbotQuestion {
  id: string;
  criteria: Criteria;
  questionIndex: number;
  text: string;
}

export interface ChatbotAnswer {
  questionId: string;
  criteria: Criteria;
  answer: string;
}

// --- Auth ---
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  token: string;
}
