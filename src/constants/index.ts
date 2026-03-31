import type { ExtraPlatform, FieldOfStudy, Program, StudentLevel } from '../types';

export const CRITERIA = ['leadership', 'proactiveness', 'energy'] as const;

export const CRITERIA_LABELS: Record<string, string> = {
  leadership: 'Leadership',
  proactiveness: 'Proactiveness',
  energy: 'Energy',
};

export const CRITERIA_DESCRIPTIONS: Record<string, string> = {
  leadership: 'Ability to guide, influence and inspire others',
  proactiveness: 'Taking initiative before being asked',
  energy: 'Drive, passion and sustained motivation',
};

export const SCORE_THRESHOLDS = { HIGH: 80, MID: 60 } as const;

export const FIELDS_OF_STUDY: FieldOfStudy[] = [
  'Technology',
  'Business',
  'Social Impact',
  'Design',
  'Science',
];

export const STUDENT_LEVELS: { value: StudentLevel; label: string }[] = [
  { value: 'school', label: 'School student' },
  { value: 'college-university', label: 'College/University student' },
];

export const PROGRAMS: Program[] = [
  {
    id: 'sociology',
    category: 'Society',
    name: 'Sociology: Leadership and Innovation',
  },
  {
    id: 'digital-media',
    category: 'Art + Media',
    name: 'Digital Media and Marketing',
  },
  {
    id: 'it-product',
    category: 'Tech',
    name: 'Innovative IT Product Design and Development',
  },
  {
    id: 'policy',
    category: 'Policy Reform',
    name: 'Public Policy and Development',
  },
  {
    id: 'engineering',
    category: 'Engineering',
    name: 'Creative Engineering',
  },
];

export const CHATBOT_QUESTIONS_PER_CRITERIA = 3;
/** Set `VITE_USE_MOCK_DATA=true` for mock candidates (no JWT dashboard). */
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const DEMO_EMAIL = 'admin@invisionu.kz';
export const DEMO_PASSWORD = 'demo1234';

export const ROUTES = {
  HOME: '/',
  SELECT_PROGRAM: '/select-program',
  APPLY: '/apply',
  INTERVIEW: '/interview',
  SUCCESS: '/success',
  ADMIN_LOGIN: '/admin/login',
  ADMIN: '/admin',
  ADMIN_CANDIDATE: (id: string) => `/admin/candidates/${id}`,
} as const;

export const COPY = {
  nav: {
    apply: 'Apply',
  },
  brand: {
    name: 'inVision U',
    tagline: '100% grant-funded. Built for future leaders of Central Asia.',
    footerLine: 'inVision U is an initiative inspired by inDrive’s mission to build opportunity across the region.',
  },
  landing: {
    heroTitle: 'Shape the future of Central Asia',
    heroBody:
      'inVision U is a fully grant-funded program for ambitious students who want to lead with purpose. We combine rigorous academics, mentorship from global operators, and a tight community of peers who push each other forward. Admission is holistic: we read every application, review your story, and learn how you think through a short conversation.',
    statGrant: '100% Grant Coverage',
    statProgram: 'Future Leaders Program',
    ctaApply: 'Apply Now',
    featureLeadershipTitle: 'Leadership Development',
    featureLeadershipBody:
      'Practice leading teams, giving feedback, and making decisions under ambiguity with coaches who have scaled real organizations.',
    featureEntrepreneurshipTitle: 'Entrepreneurship',
    featureEntrepreneurshipBody:
      'Turn ideas into pilots: customer discovery, storytelling, and building with limited resources — the way founders actually work.',
    featureImpactTitle: 'Community Impact',
    featureImpactBody:
      'Design projects that matter locally. We prioritize applicants who already invest time in their cities, schools, or causes.',
    programsTitle: 'Five tracks, one standard of excellence',
    programsBody:
      'Pick the program that fits your direction — from policy and engineering to digital media and IT product. Every track shares the same bar: curiosity, integrity, and the drive to build something bigger than yourself.',
    howItWorksTitle: 'How the platform works',
    howItWorksLead:
      'Your application lives in one guided flow: documents, written work, and a short guided interview. Nothing is a trick question — we want to understand how you think, communicate, and show up for others.',
    howStep1Title: 'Choose a program',
    howStep1Body:
      'Select the track that matches your interests. You can read what each path emphasizes before you start the form.',
    howStep2Title: 'Submit your application',
    howStep2Body:
      'Share accurate personal details, upload your CV and essay as PDFs, and add any required materials. The form saves your progress so you can complete it thoughtfully.',
    howStep3Title: 'Complete the conversation',
    howStep3Body:
      'You will answer a short set of questions in a chat-style interview on leadership, proactiveness, and energy. There are no right “keywords” — we care about your examples and how you reflect on them.',
    howStep4Title: 'Admission review',
    howStep4Body:
      'Our team reads your full packet: documents, writing, and conversation. Automated analysis helps reviewers see patterns and evidence faster; final decisions are always made by people who understand the program.',
    assessmentTitle: 'What we look at',
    assessmentLead:
      'We take a holistic view. Strong applications show consistency between what you write, what you have done, and how you explain your choices under time pressure.',
    assessmentCvTitle: 'CV & experience',
    assessmentCvBody:
      'We look for real projects, responsibility, and growth — not only titles. Clear, specific bullets help us understand your impact.',
    assessmentEssayTitle: 'Personal essay',
    assessmentEssayBody:
      'We read for authenticity, clarity of purpose, and how you connect your story to the communities you want to serve.',
    assessmentChatTitle: 'Guided interview',
    assessmentChatBody:
      'The chat explores how you lead, take initiative, and sustain motivation. It complements your written materials so we are not judging you on a single document.',
    adviceTitle: 'Advice, tools, and fairness',
    adviceLead:
      'We use technology to organize evidence and surface themes — not to replace human judgment. Here is how to think about it.',
    adviceHumanTitle: 'People decide',
    adviceHumanBody:
      'Admission officers review your materials in context. No score alone accepts or rejects a candidate; we read for fit, potential, and alignment with inVision U values.',
    adviceToolsTitle: 'Tools that support reviewers',
    adviceToolsBody:
      'Assistive summaries and structured signals help the team work consistently and catch details in long applications. They are aids for focus, not a black-box verdict.',
    adviceYouTitle: 'What you can expect',
    adviceYouBody:
      'Be honest and specific. The best applications sound like you — with concrete examples, reflection, and respect for the reader’s time. If something in the process is unclear, follow the instructions on the form and use a stable internet connection for the interview step.',
    ctaBandTitle: 'Ready to tell your story?',
    ctaBandBody:
      'The next cohort is built from applicants who are serious about learning and contributing. Start your application when you have ~45–60 minutes and your documents ready.',
  },
  application: {
    step1Title: 'Personal Info & Documents',
    step2Title: 'Review & Submit',
    progressLabel: (step: number, total: number) => `Step ${step} of ${total}`,
    fields: {
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      dateOfBirth: 'Date of Birth',
      city: 'City',
      school: 'School / University',
      untScore: 'UNT score (optional)',
      ielts: 'IELTS overall score (optional)',
      toefl: 'TOEFL score (optional)',
      studentLevel: 'Student type',
      codeforces: 'Codeforces profile (nickname, optional)',
      leetcode: 'LeetCode profile (nickname, optional)',
      github: 'GitHub profile (nickname, optional)',
      linkedin: 'LinkedIn profile (link, optional)',
      cv: 'CV (PDF)',
      video: 'Introduction video (MP4)',
    },
    errors: {
      required: 'This field is required',
      email: 'Enter a valid email',
      confirm: 'You must confirm accuracy',
      filesStep: 'Please fix file errors before continuing',
      submitFailed: 'Could not submit application. Please try again.',
      draftFailed: 'Could not start your application. Check your connection and try again.',
    },
    essayLabel: 'Motivation essay (PDF)',
    confirmAccuracy:
      'I confirm all information is accurate and the motivation essay PDF is my own work.',
    next: 'Continue',
    back: 'Back',
    submit: 'Submit application',
    programLabel: 'Program:',
    programChange: 'Change',
    programSummary: 'Degree program',
  },
  programSelection: {
    title: 'Choose the undergraduate degree program',
    back: 'Back',
    createApplication: 'Create Application',
    creatingDraft: 'Starting…',
  },
  chatbot: {
    welcome: (name: string) =>
      `Hi ${name}! You'll have a short conversation with our admissions assistant. Take your time — there are no right or wrong answers. Ready?`,
    startCta: "Let's start",
    progress: (n: number, total: number) => `Question ${n} of ${total}`,
    progressAsked: (asked: number, max: number) =>
      max > 0 ? `Progress: ${asked} / ${max}` : `Questions so far: ${asked}`,
    complete:
      "Thank you! Your application is complete. We'll review everything and be in touch soon.",
    send: 'Send',
    placeholder: 'Type your answer…',
    summaryTitle: 'Interview complete',
    continueCta: 'Finish & submit',
    starting: 'Starting interview…',
    sending: 'Sending…',
    prefetchReadyHint:
      'Your interview session is ready — tap below when you want to begin.',
    submitBackgroundPendingTitle: 'Application is processing in the background',
    submitBackgroundPendingBody:
      'Uploads and analysis may take a minute or two. You can start the interview now — no need to wait.',
    submitBackgroundFailedTitle: 'Application upload did not finish',
    submitBackgroundFailedBody:
      'Your answers are still saved. Check your connection and return to the form to try submitting again if needed.',
    backToApplicationForm: 'Back to application form',
  },
  success: {
    title: 'Application Submitted!',
    body: 'Thank you for applying to inVision U. Our admissions team will review your application and contact you within 2–3 weeks.',
    refLabel: 'Application reference',
    home: 'Back to Homepage',
  },
  admin: {
    portalSubtitle: 'Admissions Portal',
    signIn: 'Sign In',
    demoHint: 'Demo access',
    candidates: 'Candidates',
    filterField: 'Field of study',
    programColumn: 'Program',
    filterStatus: 'Status',
    sortScore: 'AI Score',
    sortDate: 'Submission date',
    all: 'All',
    review: 'Review',
    back: 'Back',
    accept: 'Accept',
    reject: 'Reject',
    changeDecision: 'Change decision',
    decisionAccepted: 'Accepted',
    decisionRejected: 'Rejected',
    statusPending: 'Pending',
    toastAccepted: 'Candidate accepted.',
    toastRejected: 'Candidate rejected.',
    logout: 'Log out',
    previous: 'Previous',
    next: 'Next',
    sortLabel: 'Sort',
    sections: {
      cv: 'CV Review',
      essay: 'Essay Review',
      chatbot: 'Chatbot Analysis',
      extra: 'Extra',
    },
    openCvPdf: 'Open CV (PDF)',
    openEssayPdf: 'Open essay (PDF)',
    applicationPdfs: 'Application PDFs',
    originalPdfLabel: 'Original file (PDF)',
    aiGeneratedBanner: 'AI-Generated Content Detected',
    confidence: (n: number) => `Confidence: ${n}%`,
  },
} as const;

export const PLATFORM_LABELS: Record<ExtraPlatform, string> = {
  codeforces: 'Codeforces',
  leetcode: 'LeetCode',
  linkedin: 'LinkedIn',
  github: 'GitHub',
};

export const PLATFORM_COLORS: Record<ExtraPlatform, string> = {
  codeforces: '#1a1a2e',
  leetcode: '#FFA116',
  linkedin: '#0A66C2',
  github: '#333333',
};

export const FILE_RULES = {
  cv: { accept: '.pdf', mime: 'application/pdf', maxMb: 5 },
  essay: { accept: '.pdf', mime: 'application/pdf', maxMb: 5 },
  video: { accept: '.mp4', mime: 'video/mp4', maxMb: 50 },
} as const;
