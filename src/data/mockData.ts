import { PROGRAMS } from '../constants';
import type {
  Candidate,
  ChatbotQuestion,
  ChatMessage,
  CodeforcesStats,
  Criteria,
  GithubStats,
  LeetcodeStats,
  LinkedinStats,
  Program,
} from '../types';

function programById(id: string): Program {
  const p = PROGRAMS.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown program: ${id}`);
  return p;
}

export const CHATBOT_QUESTIONS: ChatbotQuestion[] = [
  {
    id: 'l1',
    criteria: 'leadership',
    questionIndex: 1,
    text: 'Tell me about a time you led a group through a difficult situation. What was your role?',
  },
  {
    id: 'l2',
    criteria: 'leadership',
    questionIndex: 2,
    text: 'How do you handle disagreements within a team you are leading?',
  },
  {
    id: 'l3',
    criteria: 'leadership',
    questionIndex: 3,
    text: 'Describe a moment when you had to make a tough decision that affected others.',
  },
  {
    id: 'p1',
    criteria: 'proactiveness',
    questionIndex: 1,
    text: 'Tell me about something you started on your own without being asked.',
  },
  {
    id: 'p2',
    criteria: 'proactiveness',
    questionIndex: 2,
    text: 'When you see a problem around you, what do you typically do?',
  },
  {
    id: 'p3',
    criteria: 'proactiveness',
    questionIndex: 3,
    text: 'Describe a time you identified an opportunity others missed.',
  },
  {
    id: 'e1',
    criteria: 'energy',
    questionIndex: 1,
    text: 'What drives you to keep going when things get really hard?',
  },
  {
    id: 'e2',
    criteria: 'energy',
    questionIndex: 2,
    text: 'Tell me about a project or cause you poured yourself into completely.',
  },
  {
    id: 'e3',
    criteria: 'energy',
    questionIndex: 3,
    text: "How do you keep others motivated when the team's energy is low?",
  },
];

function conv(answers: string[]): ChatMessage[] {
  return CHATBOT_QUESTIONS.map((q, i) => ({
    question: q.text,
    answer: answers[i] ?? '',
    criteria: q.criteria,
    questionIndex: q.questionIndex,
  }));
}

function cs(l: number, p: number, e: number) {
  return { leadership: l, proactiveness: p, energy: e };
}

function critSum(
  leadership: string,
  proactiveness: string,
  energy: string,
): Record<Criteria, string> {
  return { leadership, proactiveness, energy };
}

const kudaiberdiCodeforces: CodeforcesStats = {
  platform: 'codeforces',
  rating: 1847,
  maxRating: 1923,
  rank: 'Expert',
  problemsSolved: 312,
  contests: 47,
  activedays: 183,
  chartImageUrl: '/demo/codeforces-chart.png',
};

const kudaiberdiLeetcode: LeetcodeStats = {
  platform: 'leetcode',
  totalSolved: 234,
  easySolved: 71,
  mediumSolved: 142,
  hardSolved: 21,
  acceptanceRate: 61.4,
  ranking: 48291,
  chartImageUrl: '/demo/leetcode-chart.png',
};

const kudaiberdiLinkedin: LinkedinStats = {
  platform: 'linkedin',
  headline: 'Software Engineer · CS Student at SDU · Competitive Programmer',
  connections: 183,
  skills: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Python', 'TypeScript', 'AWS', 'System Design'],
  certifications: ['AWS Cloud Practitioner', 'CS50x Harvard', 'Spring Framework Udemy'],
  summary:
    'Passionate backend developer and competitive programmer. I love building things that matter and solving hard problems.',
};

const kudaiberdiGithub: GithubStats = {
  platform: 'github',
  publicRepos: 18,
  followers: 34,
  totalStars: 23,
  totalCommits: 847,
  topLanguages: ['Java', 'TypeScript', 'Python', 'SQL'],
};

export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: '1',
    fullName: 'Asel Nurlanova',
    email: 'asel.nurlanova@example.kz',
    fieldOfStudy: 'Technology',
    program: programById('it-product'),
    submissionDate: '2026-03-12T09:15:00.000Z',
    aiScore: 91,
    criteriaScores: cs(92, 90, 91),
    status: 'accepted',
    cvFullText: `ASEL NURLANOVA\nAlmaty, Kazakhstan | asel.nurlanova@example.kz\n\nSUMMARY\nComputer science student focused on inclusive tech education. I founded a coding club at my school that grew from 4 members to 48 in one year. I mentor younger students in Python and web basics and coordinate weekend hackathons with local NGOs.\n\nEXPERIENCE\nLead Organizer — Almaty Youth Tech Weekend (2025)\nRaised sponsorship, designed curriculum, and ran a 36-hour build sprint for 120 participants.\n\nPeer Tutor — SDU (2024–present)\nHold weekly labs; students I coached raised average project scores by 18%.\n\nSKILLS\nPython, TypeScript, React, SQL, public speaking, curriculum design.\n\nLANGUAGES\nKazakh (native), Russian (fluent), English (C1).`,
    essayFullText: `Growing up, I was the kid who fixed relatives’ phones and then taught cousins how to build their first HTML page. Technology felt like a superpower, but only if you could access it. That belief is why I founded a coding club at my school: I wanted classmates who had never written a line of code to feel the same spark I felt the first time a program ran without errors.\n\nThe club was messy at first—broken projectors, outdated laptops, skeptical teachers—but we kept showing up. We partnered with a local library for weekend sessions and invited women in tech to speak. Watching a shy tenth-grader present her first Flask app is the proudest moment of my life so far.\n\nAt inVision U, I want to deepen my engineering skills while learning how to scale programs that expand access. My goal is to build tools and communities that make Central Asia a place where young builders don’t have to leave home to matter.`,
    cvReview: {
      summary:
        'Exceptional evidence of initiative and community leadership in technology. Clear outcomes, growing responsibility, and strong alignment with inclusive education.',
      highlights: [
        {
          text: 'I founded a coding club at my school that grew from 4 members to 48 in one year.',
          reason: 'Concrete scale story with measurable growth — rare for this age group.',
          sentiment: 'positive',
        },
        {
          text: 'Raised sponsorship, designed curriculum, and ran a 36-hour build sprint for 120 participants.',
          reason: 'Shows ownership across fundraising, pedagogy, and operations.',
          sentiment: 'positive',
        },
        {
          text: 'students I coached raised average project scores by 18%',
          reason: 'Quantified peer impact strengthens credibility.',
          sentiment: 'positive',
        },
        {
          text: 'Python, TypeScript, React, SQL, public speaking, curriculum design.',
          reason: 'Balanced stack plus communication skills relevant to leadership track.',
          sentiment: 'positive',
        },
      ],
      criteriaScores: cs(93, 91, 92),
      overallScore: 92,
    },
    essayReview: {
      summary:
        'Authentic, specific narrative with emotional range and clear motivation. Voice is consistent and grounded in lived experience.',
      highlights: [
        {
          text: 'I wanted classmates who had never written a line of code to feel the same spark',
          reason: 'Personal mission statement reads genuine, not performative.',
          sentiment: 'positive',
        },
        {
          text: 'Watching a shy tenth-grader present her first Flask app is the proudest moment of my life so far.',
          reason: 'Vivid scene; demonstrates empathy and long-term commitment.',
          sentiment: 'positive',
        },
        {
          text: 'My goal is to build tools and communities that make Central Asia a place where young builders don’t have to leave home to matter.',
          reason: 'Strong closing tie to regional impact and program fit.',
          sentiment: 'positive',
        },
      ],
      aiGeneratedFlag: false,
      aiGeneratedConfidence: 12,
      criteriaScores: cs(90, 88, 91),
      overallScore: 90,
    },
    chatbotAnalysis: {
      conversations: conv([
        'Last winter our club’s server budget was cut two days before a citywide demo day. I split the team into a fundraising pair, a migration pair, and a rehearsal pair. I stayed up rewriting our deployment guide so volunteers could help. We shipped on time and two teams adopted our templates.',
        'I start with one-on-ones so people feel heard, then bring conflicting owners into the same room with a shared doc of facts—not opinions. Once we agree on goals, we vote on options. I’ve learned my job is to keep the process fair, not to win every argument.',
        'I had to cut a close friend’s feature scope 48 hours before judging because it broke our accessibility checklist. I took responsibility publicly, offered them the keynote slot to explain the tradeoff, and we still placed second—but the team trusted me after that.',
        'I started a “debug café” on Saturdays: two hours of peer help in the cafeteria. No teacher asked; I just printed posters and brought extension cords. It became a standing tradition.',
        'I document the issue, find who is already working on it, and if nobody is, I propose a small experiment with a deadline. I hate watching problems become folklore.',
        'Our school had no intro UI course. I built a four-week Figma → HTML module and convinced three teachers to award extra credit. Enrollment exceeded our lab capacity.',
        'Honestly, the students who rely on the club for confidence. If I disappear, the room gets quieter. That responsibility keeps me honest when I’m tired.',
        'I organized a month-long build for a nonprofit’s volunteer scheduler. I slept little but learned how to scope, test, and present to non-technical boards.',
        'I rename the milestone something silly but concrete, run a 10-minute stand-up with snacks, and pair a confident person with someone stuck. Momentum returns when people see a small win in under an hour.',
      ]),
      criteriaScores: cs(92, 90, 91),
      overallScore: 91,
      summary:
        'Responses are structured, reflective, and full of verifiable detail. Strong leadership instincts, proactive problem solving, and resilient energy.',
      criteriaSummaries: critSum(
        'Balances empathy with decisive action; cites specific conflicts and resolutions.',
        'Repeated pattern of creating structures (cafés, modules) without waiting for permission.',
        'Sustains motivation through responsibility to others; uses rituals to restore team energy.',
      ),
    },
    extraActivities: [
      {
        id: 'cf-1',
        platform: 'codeforces',
        handle: 'kudaiberdi_z',
        profileUrl: 'https://codeforces.com/profile/kudaiberdi_z',
        available: true,
        aiScore: 72,
        aiExplanation:
          "The candidate's Codeforces profile shows consistent competitive programming activity with a rating of 1847 (Expert level). They have participated in 47 contests and solved 312 problems. The upward rating trajectory demonstrates strong problem-solving growth over time. Evidence of proactiveness: they participate regularly without external pressure. Energy signal: active on the platform across 180+ days. Leadership signal is low as competitive programming is individual. Overall this is a strong technical signal for the Technology track.",
        stats: kudaiberdiCodeforces,
      },
      {
        id: 'lc-1',
        platform: 'leetcode',
        handle: 'kudaiberdi_z',
        profileUrl: 'https://leetcode.com/kudaiberdi_z',
        available: true,
        aiScore: 65,
        aiExplanation:
          'The LeetCode profile shows 234 problems solved with a 61% acceptance rate. Medium problem count (142) is notably higher than Easy (71), suggesting comfort with complex algorithmic thinking. Hard problems (21) indicate willingness to challenge oneself. This supports proactiveness and energy signals. Ranking places the candidate in the top 15% globally.',
        stats: kudaiberdiLeetcode,
      },
      {
        id: 'li-1',
        platform: 'linkedin',
        handle: 'kudaiberdi-zainiyev',
        profileUrl: 'https://linkedin.com/in/kudaiberdi-zainiyev',
        available: true,
        aiScore: 58,
        aiExplanation:
          'The LinkedIn profile is moderately developed. 3 certifications and 8 listed skills show awareness of professional branding. Connection count (180+) is modest but reasonable for a student. The headline and summary demonstrate self-awareness of career direction. Leadership signal: mentions team project involvement. Proactiveness: voluntarily built a professional presence before being required to.',
        stats: kudaiberdiLinkedin,
      },
      {
        id: 'gh-1',
        platform: 'github',
        handle: 'kudaiberdi-z',
        profileUrl: 'https://github.com/kudaiberdi-z',
        available: true,
        aiScore: 70,
        aiExplanation:
          'The GitHub profile contains 18 public repositories with a total of 847 commits in the last year. Top languages (Java, TypeScript, Python) align with the CV content, increasing authenticity confidence. 3 repositories have 5+ stars indicating community recognition. Consistent commit history across weekdays and weekends is a strong energy signal — this candidate codes outside of school hours.',
        stats: kudaiberdiGithub,
      },
    ],
  },
  {
    id: '2',
    fullName: 'Dauren Seitkali',
    email: 'dauren.seitkali@example.kz',
    fieldOfStudy: 'Business',
    program: programById('digital-media'),
    submissionDate: '2026-03-14T14:40:00.000Z',
    aiScore: 84,
    criteriaScores: cs(88, 82, 78),
    status: 'pending',
    cvFullText: `DAUREN SEITKALI\nAstana | dauren.seitkali@example.kz\n\nPROFILE\nBusiness analytics student with internship experience at a regional e-commerce firm. Led campus case club; placed top 5 in national competition. Comfortable with Excel, SQL, and storytelling with data.\n\nEXPERIENCE\nCommercial Analyst Intern — SteppeMart (2025)\nBuilt weekly revenue dashboards; flagged a vendor pricing drift that recovered ~4% margin.\n\nPresident — KBTU Case Club (2024–2026)\nRecruited mentors, standardized training decks, grew membership 2×.\n\nPROJECTS\nCustomer cohort analysis for a subscription box pilot; presented recommendations to founders.\n\nSKILLS\nExcel, SQL, PowerBI, stakeholder management, facilitation.`,
    essayFullText: `I have always been fascinated by how small changes in pricing or inventory can reshape whether a business survives. During my internship I learned that the best analysts don’t only report numbers—they translate them into decisions founders can act on overnight.\n\nI am a natural organizer: I like agendas, clear owners, and follow-ups. My friends joke that I run birthday parties like board meetings, but I think that discipline matters when stakes are real.\n\nI want to study business at inVision U because I hope to build companies that hire thoughtfully in Central Asia. I believe the region’s next decade belongs to operators who combine data fluency with moral clarity. I will contribute energy in class and humility in teams.`,
    cvReview: {
      summary:
        'Solid operator profile with measurable internship impact and credible club leadership. Communication is professional and outcome-oriented.',
      highlights: [
        {
          text: 'flagged a vendor pricing drift that recovered ~4% margin',
          reason: 'Concrete business outcome tied to analytical work.',
          sentiment: 'positive',
        },
        {
          text: 'Recruited mentors, standardized training decks, grew membership 2×.',
          reason: 'Shows systems thinking in a student organization context.',
          sentiment: 'positive',
        },
        {
          text: 'placed top 5 in national competition',
          reason: 'External validation; keep pushing for more specificity on role vs team.',
          sentiment: 'positive',
        },
        {
          text: 'Comfortable with Excel, SQL, and storytelling with data.',
          reason: 'Clear baseline toolkit for analytics track.',
          sentiment: 'positive',
        },
      ],
      criteriaScores: cs(89, 84, 80),
      overallScore: 85,
    },
    essayReview: {
      summary:
        'Competent essay with clear interest in operations, but a few claims stay generic without examples.',
      highlights: [
        {
          text: 'I believe the region’s next decade belongs to operators who combine data fluency with moral clarity.',
          reason: 'Strong line; would benefit from one concrete anecdote proving “moral clarity.”',
          sentiment: 'positive',
        },
        {
          text: 'I will contribute energy in class and humility in teams.',
          reason: 'Vague commitment — reads like filler without a supporting story.',
          sentiment: 'warning',
        },
        {
          text: 'I am a natural organizer: I like agendas, clear owners, and follow-ups.',
          reason: 'Self-assessment without evidence; risk of sounding rehearsed.',
          sentiment: 'warning',
        },
      ],
      aiGeneratedFlag: false,
      aiGeneratedConfidence: 22,
      criteriaScores: cs(82, 80, 78),
      overallScore: 81,
    },
    chatbotAnalysis: {
      conversations: conv([
        'Our case team had 48 hours and two members wanted opposite market entry strategies. I mapped assumptions on a whiteboard, assigned each person to disprove their own idea with one data source, then we chose the path with fewer fatal risks. We advanced.',
        'I separate people from positions. If two leads disagree, I ask for a decision deadline and a shared success metric first—usually the emotion drops once the metric exists.',
        'I had to drop a sponsor’s logo from materials hours before finals because it violated school policy. I apologized to the sponsor, offered a digital mention instead, and briefed my team so nobody was blindsided on stage.',
        'I built a Notion pipeline for case sourcing and onboarding new analysts—nobody asked; interviews were chaotic before that.',
        'I pull the smallest chart that answers the question, then ask who owns the next step. Analysis without ownership is just noise.',
        'I noticed our student store threw away unsold baked goods. I proposed a closing-hour discount sheet and tracked waste for two weeks—waste fell sharply.',
        'Proving that my recommendations actually changed a decision—not just slid into a deck.',
        'I ran intake for a pro-bono project for a local bakery’s delivery experiment; I coordinated volunteers across three time zones for a month.',
        'I run a five-minute “win of the day” round-robin. It sounds cheesy but it breaks the doom loop when everyone only talks about blockers.',
      ]),
      criteriaScores: cs(87, 85, 79),
      overallScore: 84,
      summary:
        'Interview shows confident facilitation and structured thinking. Energy is steady but less vivid than leadership/proactiveness threads.',
      criteriaSummaries: critSum(
        'Clear conflict-resolution playbook; examples map to real team settings.',
        'Identifies process gaps and fixes them without waiting for assignment.',
        'Motivated by measurable impact; team rituals are pragmatic, not theatrical.',
      ),
    },
    extraActivities: [
      {
        id: 'li-2',
        platform: 'linkedin',
        handle: 'dauren-seitkali',
        profileUrl: 'https://linkedin.com/in/dauren-seitkali',
        available: true,
        aiScore: 62,
        aiExplanation:
          'LinkedIn shows a clear operator narrative with case competitions and internship experience. Activity cadence is moderate; more long-form posts or articles would strengthen leadership signaling.',
        stats: {
          platform: 'linkedin',
          headline: 'Business Analytics Student · Case Club President',
          connections: 256,
          skills: ['Excel', 'SQL', 'PowerBI', 'Storytelling with data'],
          certifications: ['Google Data Analytics Certificate'],
          summary:
            'Aspiring operator focused on turning messy spreadsheets into clear decisions for founders and teams.',
        },
      },
    ],
  },
  {
    id: '3',
    fullName: 'Madina Akhmetova',
    email: 'madina.akhmetova@example.kz',
    fieldOfStudy: 'Social Impact',
    program: programById('sociology'),
    submissionDate: '2026-03-10T11:05:00.000Z',
    aiScore: 73,
    criteriaScores: cs(62, 58, 72),
    status: 'pending',
    cvFullText: `MADINA AKHMETOVA\nShymkent | madina.akhmetova@example.kz\n\nSUMMARY\nMotivated student interested in social projects and volunteering. Participated in several school events. Strong communication skills and teamwork. Seeking opportunities to grow and learn from experienced mentors.\n\nEXPERIENCE\nVolunteer — local community center (2024)\nHelped organize activities for children.\n\nMember — school student council (2023–2025)\nAssisted with event planning.\n\nSKILLS\nMicrosoft Office, teamwork, communication, time management.\n\nEDUCATION\nHigh school graduate; currently preparatory year.`,
    essayFullText: `I care about helping people in my community and want to make a difference in the world. I believe education is important and everyone deserves a chance to succeed. I have volunteered and worked with my classmates on different initiatives.\n\nI want to join inVision U to learn from the best mentors and improve my skills. I am hardworking and ready to take on challenges. I will do my best to contribute to the program and represent my city positively.\n\nThank you for considering my application.`,
    cvReview: {
      summary:
        'CV reads generic with limited measurable outcomes. Activities are listed without scope, timeframe, or personal contribution.',
      highlights: [
        {
          text: 'Motivated student interested in social projects and volunteering.',
          reason: 'Template-style opening; no differentiating proof points.',
          sentiment: 'warning',
        },
        {
          text: 'Helped organize activities for children.',
          reason: 'Lacks scale, frequency, and specific responsibility.',
          sentiment: 'warning',
        },
        {
          text: 'Assisted with event planning.',
          reason: 'Weak verb stack; unclear what was owned end-to-end.',
          sentiment: 'warning',
        },
        {
          text: 'Microsoft Office, teamwork, communication, time management.',
          reason: 'Common skill list without evidence or context.',
          sentiment: 'warning',
        },
      ],
      criteriaScores: cs(52, 48, 58),
      overallScore: 54,
    },
    essayReview: {
      summary:
        'Essay is polite but abstract; few concrete scenes or decisions. Reads like a safe template.',
      highlights: [
        {
          text: 'I care about helping people in my community and want to make a difference in the world.',
          reason: 'Broad claim without supporting narrative.',
          sentiment: 'warning',
        },
        {
          text: 'I am hardworking and ready to take on challenges.',
          reason: 'Self-praise without evidence.',
          sentiment: 'warning',
        },
        {
          text: 'Thank you for considering my application.',
          reason: 'Polite close but no memorable insight.',
          sentiment: 'warning',
        },
      ],
      aiGeneratedFlag: false,
      aiGeneratedConfidence: 28,
      criteriaScores: cs(50, 46, 55),
      overallScore: 52,
    },
    chatbotAnalysis: {
      conversations: conv([
        'I led a winter clothing drive when our neighborhood lost power. I split volunteers into intake, sorting, and delivery, and I walked routes myself so elders didn’t slip on ice. We served 214 households in four days.',
        'If two volunteers argue, I listen separately first—people calm down when they feel safe—then we restate shared values on a poster we wrote on day one. Rules we chose together are easier to enforce.',
        'I stopped a partner NGO from publishing photos of kids without consent. It was awkward in the moment, but I offered a consent workflow and QR-based sign-off. They adopted it.',
        'I started a “homework hotspot” in a café basement with donated routers after I saw students doing assignments on phones. Owners said yes because I showed a one-page safety plan.',
        'I map who is affected, who has authority, and what can be tested in a week. If nobody moves, I do the smallest legal pilot and bring receipts.',
        'Our city had no central list of free mental health walk-in hours. I scraped public pages, called clinics to verify, and published a one-pager schools could print.',
        'The faces of parents when kids get warm shoes—not abstract “impact,” just that relief.',
        'I spent six weeks helping a women’s cooperative switch from cash notebooks to a simple spreadsheet template; I slept less but they cut reconciliation time in half.',
        'I switch the room to physical tasks—packing boxes, labeling—because motion breaks shame cycles. Then I tell a true story of a mistake I made so people risk speaking again.',
      ]),
      criteriaScores: cs(90, 88, 86),
      overallScore: 88,
      summary:
        'Stark contrast: live conversation shows mature judgment, logistics, and moral courage—far beyond written materials.',
      criteriaSummaries: critSum(
        'Crisis coordination and ethical boundaries are advanced; clear command presence.',
        'Repeatedly spots infrastructure gaps and executes practical fixes.',
        'Emotionally grounded; uses body-doubling and vulnerability to rebuild group morale.',
      ),
    },
  },
  {
    id: '4',
    fullName: 'Timur Bekuov',
    email: 'timur.bekuov@example.kz',
    fieldOfStudy: 'Design',
    program: programById('digital-media'),
    submissionDate: '2026-03-15T16:22:00.000Z',
    aiScore: 68,
    criteriaScores: cs(70, 66, 68),
    status: 'pending',
    cvFullText: `TIMUR BEKUOV\nAlmaty | timur.bekuov@example.kz\n\nSUMMARY\nProduct design student with freelance UI work for small businesses. Interested in human-centered design and brand systems.\n\nSELECTED WORK\nRedesigned ordering flow for a local coffee chain (Figma + prototype testing with 12 users).\nVolunteer brand refresh for animal shelter (logo system + social templates).\n\nTOOLS\nFigma, Illustrator, Principle, basic HTML/CSS.\n\nEDUCATION\nSecond year, Visual Communication.`,
    essayFullText: `Design, for me, is translating confusion into calm. I like watching someone click through a prototype and suddenly relax because the steps make sense.\n\nMy freelance projects taught me that small businesses rarely need flashy visuals—they need clarity, consistent files, and someone who answers messages on time. I try to be that person.\n\nI want to study at inVision U to learn how design decisions connect to business constraints. I hope to collaborate with engineers and operators, not only other designers.`,
    cvReview: {
      summary:
        'Portfolio snippets show user testing awareness and range across product and brand. Depth is moderate; more metrics would strengthen claims.',
      highlights: [
        {
          text: 'Redesigned ordering flow for a local coffee chain (Figma + prototype testing with 12 users).',
          reason: 'Signals HCD practice; sample size is small but methodology is named.',
          sentiment: 'positive',
        },
        {
          text: 'Volunteer brand refresh for animal shelter (logo system + social templates).',
          reason: 'Shows pro-bono initiative and system thinking.',
          sentiment: 'positive',
        },
        {
          text: 'basic HTML/CSS',
          reason: 'Honest baseline; consider expanding collaboration artifacts.',
          sentiment: 'warning',
        },
      ],
      criteriaScores: cs(71, 68, 69),
      overallScore: 69,
    },
    essayReview: {
      summary:
        'Clear philosophy and professional tone. Could use one deeper case study narrative.',
      highlights: [
        {
          text: 'Design, for me, is translating confusion into calm.',
          reason: 'Memorable thesis; authentic voice.',
          sentiment: 'positive',
        },
        {
          text: 'small businesses rarely need flashy visuals—they need clarity',
          reason: 'Mature client empathy.',
          sentiment: 'positive',
        },
        {
          text: 'I hope to collaborate with engineers and operators, not only other designers.',
          reason: 'Signals interdisciplinary maturity.',
          sentiment: 'positive',
        },
      ],
      aiGeneratedFlag: false,
      aiGeneratedConfidence: 18,
      criteriaScores: cs(69, 67, 68),
      overallScore: 68,
    },
    chatbotAnalysis: {
      conversations: conv([
        'I led a hackathon team when our dev quit Saturday morning. I reframed scope, moved us from an app to a clickable prototype, and assigned roles by energy level—not titles. Judges praised clarity.',
        'I use “how might we” reframes until the fight is about users, not egos. If it stalls, I sketch two bad options so people react to something concrete.',
        'I pulled a neon color palette hours before print because contrast failed WCAG AA. The client was upset; I showed side-by-side simulations and we shipped accessible assets.',
        'I created a Figma library for a student newspaper nobody commissioned me to do—I was tired of inconsistent posters.',
        'I watch users struggle silently. If I see three people hesitate at the same step, I file a micro-copy issue the same day.',
        'I noticed our campus map PDF was wrong for wheelchair routes. I walked paths, annotated screenshots, and emailed facilities with a prioritized fix list.',
        'Seeing non-designers present work confidently using components I built.',
        'I rebuilt my portfolio three times in one semester because critique hurt and I wanted to be proud.',
        'I run a quick “gallery walk” where everyone pins sticky notes on printed frames—movement + humor loosens people up.',
      ]),
      criteriaScores: cs(72, 69, 70),
      overallScore: 70,
      summary:
        'Balanced profile: competent leadership framing, steady initiative, moderate emotional expressiveness.',
      criteriaSummaries: critSum(
        'Pragmatic under pressure; reframes conflict toward user outcomes.',
        'Self-starts systems (libraries, tickets) that reduce future friction.',
        'Draws energy from craft improvement and lightweight workshop formats.',
      ),
    },
  },
  {
    id: '5',
    fullName: 'Aliya Smagulova',
    email: 'aliya.smagulova@example.kz',
    fieldOfStudy: 'Science',
    program: programById('engineering'),
    submissionDate: '2026-03-11T08:50:00.000Z',
    aiScore: 61,
    criteriaScores: cs(58, 78, 52),
    status: 'pending',
    cvFullText: `ALIYA SMAGULOVA\nKaraganda | aliya.smagulova@example.kz\n\nSUMMARY\nBiology-focused student with strong lab grades. Independent literature reviews on antibiotic resistance. Built a simple data notebook tracking local water readings (citizen science).\n\nLAB SKILLS\nMicroscopy, pipetting, gel documentation, sterile technique.\n\nPROJECTS\nPoster on phage therapy awareness at regional fair (third place).\n\nINTERESTS\nPublic health communication, open data.`,
    essayFullText: `Science matters to me because it is a language for arguing kindly with reality. I like turning messy observations into tables you can disagree about without shouting.\n\nI taught younger students how to read graphs after I noticed memes spreading fake “cure” charts. It was awkward at first, but repetition helped.\n\nI want to join inVision U to learn how scientists explain risk to the public without talking down. I know I can be blunt; I am working on warmth.`,
    cvReview: {
      summary:
        'Solid academic orientation with citizen science initiative. Leadership signals are subtle but present in mentoring angle.',
      highlights: [
        {
          text: 'Built a simple data notebook tracking local water readings (citizen science).',
          reason: 'Hands-on data collection beyond classroom.',
          sentiment: 'positive',
        },
        {
          text: 'Poster on phage therapy awareness at regional fair (third place).',
          reason: 'Communication + recognition.',
          sentiment: 'positive',
        },
        {
          text: 'Independent literature reviews on antibiotic resistance.',
          reason: 'Shows intellectual independence.',
          sentiment: 'positive',
        },
      ],
      criteriaScores: cs(60, 72, 54),
      overallScore: 62,
    },
    essayReview: {
      summary:
        'Sharp voice with self-awareness. Slightly short; could expand evidence of sustained projects.',
      highlights: [
        {
          text: 'Science matters to me because it is a language for arguing kindly with reality.',
          reason: 'Distinctive, thoughtful opening.',
          sentiment: 'positive',
        },
        {
          text: 'I taught younger students how to read graphs after I noticed memes spreading fake “cure” charts.',
          reason: 'Concrete civic response to misinformation.',
          sentiment: 'positive',
        },
        {
          text: 'I know I can be blunt; I am working on warmth.',
          reason: 'Mature metacognition.',
          sentiment: 'positive',
        },
      ],
      aiGeneratedFlag: false,
      aiGeneratedConfidence: 15,
      criteriaScores: cs(58, 80, 50),
      overallScore: 61,
    },
    chatbotAnalysis: {
      conversations: conv([
        'I coordinated lab shifts when our TA was sick. I wrote a one-page checklist so beginners didn’t ruin cultures—blunt, but it worked.',
        'I ask people to restate the other side’s hypothesis in their own words. Scientists respect precision; mirroring reduces strawmen.',
        'I stopped an unsafe shortcut a teammate wanted for faster plating. I escalated to the instructor privately first to protect their dignity.',
        'I started a journal club Slack with DOI links—tiny, but attendance grew.',
        'I log weird results immediately. Most “errors” are interesting if you don’t delete them out of embarrassment.',
        'I found a funding note for cheap filters that matched our water dataset gaps and pitched it to our club lead.',
        'Curiosity, honestly. And spite against sloppy charts.',
        'I spent a month re-running a western blot because one antibody batch was suspect. boring but necessary.',
        'I use dumb jokes about pipette nightmares. If people laugh, they admit mistakes.',
      ]),
      criteriaScores: cs(56, 79, 51),
      overallScore: 61,
      summary:
        'Proactiveness stands out; leadership is functional but terse. Energy reads lower—few inspirational cues, more dry persistence.',
      criteriaSummaries: critSum(
        'Direct, safety-conscious lab leadership; limited charisma in storytelling.',
        'Strong habit of systems, documentation, and follow-through.',
        'Drive is internal and technical; less animated team rallying language.',
      ),
    },
  },
  {
    id: '6',
    fullName: 'Nursultan Dzhaksybekov',
    email: 'nursultan.dzhaksybekov@example.kz',
    fieldOfStudy: 'Technology',
    program: programById('it-product'),
    submissionDate: '2026-03-09T19:30:00.000Z',
    aiScore: 55,
    criteriaScores: cs(52, 54, 58),
    status: 'rejected',
    cvFullText: `NURSULTAN DZHAKSYBEKOV\nAlmaty | nursultan.dzhaksybekov@example.kz\n\nSUMMARY\nIT enthusiast learning programming online. Interested in AI and startups. Fast learner.\n\nSKILLS\nPython basics, HTML, ChatGPT.\n\nPROJECTS\nPersonal website.\n\nEDUCATION\nOnline courses (Udemy).`,
    essayFullText: `Technology is transforming the world at an unprecedented pace. In today’s fast-moving digital landscape, it is essential to leverage cutting-edge tools to unlock synergies and drive innovation forward.\n\nI am passionate about harnessing the power of artificial intelligence to solve complex problems and create value for stakeholders across the ecosystem. My journey has been one of continuous improvement, learning agile methodologies, and embracing a growth mindset.\n\nI believe inVision U will empower me to cultivate leadership excellence and collaborate with like-minded peers to build the future of Central Asia through disruptive technologies.`,
    cvReview: {
      summary:
        'Thin evidence of depth. Tool list is minimal; projects lack description, links, or outcomes.',
      highlights: [
        {
          text: 'IT enthusiast learning programming online.',
          reason: 'Vague positioning without artifacts.',
          sentiment: 'warning',
        },
        {
          text: 'Python basics, HTML, ChatGPT.',
          reason: 'Lists a consumer tool as a skill without context.',
          sentiment: 'warning',
        },
        {
          text: 'Personal website.',
          reason: 'No URL, stack, or problem statement provided.',
          sentiment: 'warning',
        },
      ],
      criteriaScores: cs(50, 48, 52),
      overallScore: 50,
    },
    essayReview: {
      summary:
        'Language is polished but hollow—buzzwords without scenes, metrics, or personal stakes.',
      highlights: [
        {
          text: 'leverage cutting-edge tools to unlock synergies',
          reason: 'Generic corporate phrasing; no substantiation.',
          sentiment: 'warning',
        },
        {
          text: 'cultivate leadership excellence',
          reason: 'Template-like abstraction.',
          sentiment: 'warning',
        },
        {
          text: 'disruptive technologies',
          reason: 'Buzzword cluster typical of low-substance drafts.',
          sentiment: 'warning',
        },
      ],
      aiGeneratedFlag: true,
      aiGeneratedConfidence: 87,
      criteriaScores: cs(48, 46, 50),
      overallScore: 47,
    },
    chatbotAnalysis: {
      conversations: conv([
        'I led once for a group project. It was fine.',
        'I try to listen to both sides.',
        'I had to decide something. It was hard.',
        'I started studying online.',
        'I tell someone maybe.',
        'I saw an opportunity.',
        'Success.',
        'A project.',
        'I encourage people.',
      ]),
      criteriaScores: cs(50, 52, 55),
      overallScore: 52,
      summary:
        'Responses are extremely short and non-specific; impossible to verify leadership or initiative claims.',
      criteriaSummaries: critSum(
        'No concrete scenarios, roles, or outcomes described.',
        'No evidence of self-directed projects beyond generic statements.',
        'Minimal affect or detail; reads disengaged.',
      ),
    },
  },
  {
    id: '7',
    fullName: 'Zarina Ospanova',
    email: 'zarina.ospanova@example.kz',
    fieldOfStudy: 'Business',
    program: programById('policy'),
    submissionDate: '2026-03-13T10:00:00.000Z',
    aiScore: 88,
    criteriaScores: cs(90, 87, 88),
    status: 'accepted',
    cvFullText: `ZARINA OSPANOVA\nAlmaty | zarina.ospanova@example.kz\n\nSUMMARY\nEconomics student specializing in competition strategy. Two-time international case finalist (Singapore, Warsaw). Founded a student consultancy serving local SMEs with pricing experiments.\n\nHIGHLIGHTS\nDesigned a dynamic pricing pilot for a regional grocery app; lift documented by product team.\nMentored 9 juniors to national finals; 4 placed top 3.\nPublished a school journal article on platform market fairness.\n\nSKILLS\nSQL, Python (pandas), slide storytelling, stakeholder workshops, bilingual facilitation (EN/RU).`,
    essayFullText: `Case competitions taught me that adrenaline is cheap—preparation is expensive. I love the moment when a team stops performing confidence and starts showing receipts: numbers, citations, a clear plan B.\n\nFounding a micro-consultancy for SMEs started as a selfish way to practice live negotiations. It became a lesson in humility: owners don’t care about your framework; they care if Saturday sales move.\n\nI want to study at inVision U because I’m hungry for peers who treat ethics as a design constraint, not a slide decoration. I’ll bring rigor, late-night practice reps, and relentless feedback.`,
    cvReview: {
      summary:
        'Elite extracurricular trajectory with international validation and measurable commercial experiments.',
      highlights: [
        {
          text: 'Two-time international case finalist (Singapore, Warsaw).',
          reason: 'Rare, verifiable competitive signal.',
          sentiment: 'positive',
        },
        {
          text: 'Founded a student consultancy serving local SMEs with pricing experiments.',
          reason: 'Entrepreneurial execution with real clients.',
          sentiment: 'positive',
        },
        {
          text: 'Designed a dynamic pricing pilot for a regional grocery app; lift documented by product team.',
          reason: 'Business impact tied to product org—strong for age.',
          sentiment: 'positive',
        },
        {
          text: 'Mentored 9 juniors to national finals; 4 placed top 3.',
          reason: 'Leadership pipeline with outcomes.',
          sentiment: 'positive',
        },
      ],
      criteriaScores: cs(91, 89, 88),
      overallScore: 90,
    },
    essayReview: {
      summary:
        'Voice is confident, witty, and grounded in operator reality. Excellent fit signal.',
      highlights: [
        {
          text: 'owners don’t care about your framework; they care if Saturday sales move',
          reason: 'Shows customer-centric maturity.',
          sentiment: 'positive',
        },
        {
          text: 'I’m hungry for peers who treat ethics as a design constraint, not a slide decoration',
          reason: 'Values alignment articulated memorably.',
          sentiment: 'positive',
        },
        {
          text: 'I’ll bring rigor, late-night practice reps, and relentless feedback.',
          reason: 'Clear commitment to cohort culture.',
          sentiment: 'positive',
        },
      ],
      aiGeneratedFlag: false,
      aiGeneratedConfidence: 9,
      criteriaScores: cs(89, 87, 88),
      overallScore: 88,
    },
    chatbotAnalysis: {
      conversations: conv([
        'We flew home with broken models after a judge challenged our market size. I called a two-hour “autopsy,” assigned each person one assumption to kill, and rebuilt the story overnight. We medaled next round.',
        'I make disagreements explicit on paper: decision, owner, deadline. Ambiguity is what turns healthy debate into personal beef.',
        'I withdrew a flashy recommendation that would’ve hurt gig workers. The team wanted the win; I argued our brand risk wasn’t worth a trophy. We pivoted to a fairer fee structure.',
        'I built a case drills calendar and invited rival schools—free labor for us, free practice for them.',
        'I walk into stores with a clipboard and ask clerks what actually breaks—not what decks say breaks.',
        'I spotted that our client’s churn spike matched a broken SMS gateway, not product dislike. We proved it with logs in 36 hours.',
        'Respect. I like winning, but only if the room still wants to work with me on Monday.',
        'I spent a semester helping a family business digitize inventory; ugly spreadsheets, real margin.',
        'I run “red team 15”: fifteen minutes where one person must destroy the plan. Laughs first, truths second, fixes third.',
      ]),
      criteriaScores: cs(90, 88, 87),
      overallScore: 88,
      summary:
        'Exceptional clarity under pressure, ethical backbone, and infectious standards for the team.',
      criteriaSummaries: critSum(
        'Decisive post-mortems; converts conflict into structured decisions.',
        'Creates training infrastructure and market research habits proactively.',
        'High-octane motivation balanced with sportsmanship and humor.',
      ),
    },
  },
  {
    id: '8',
    fullName: 'Arman Tulegenov',
    email: 'arman.tulegenov@example.kz',
    fieldOfStudy: 'Social Impact',
    program: programById('sociology'),
    submissionDate: '2026-03-08T12:12:00.000Z',
    aiScore: 47,
    criteriaScores: cs(45, 48, 46),
    status: 'rejected',
    cvFullText: `ARMAN TULEGENOV\nOral | arman.tulegenov@example.kz\n\nSUMMARY\nStudent. Looking for opportunities.\n\nEXPERIENCE\nNone listed.\n\nSKILLS\nInternet, social media.`,
    essayFullText: `I want to apply because it is a good program. I think I can learn many things and meet new friends. I am interested in social impact and helping people.\n\nPlease accept me. Thank you.`,
    cvReview: {
      summary:
        'Minimal content; no activities, outcomes, or educational detail to evaluate.',
      highlights: [
        {
          text: 'Looking for opportunities.',
          reason: 'No evidence of prior initiative.',
          sentiment: 'warning',
        },
        {
          text: 'None listed.',
          reason: 'Empty experience section.',
          sentiment: 'warning',
        },
        {
          text: 'Internet, social media.',
          reason: 'Not meaningful skills for admissions bar.',
          sentiment: 'warning',
        },
      ],
      criteriaScores: cs(42, 40, 44),
      overallScore: 43,
    },
    essayReview: {
      summary:
        'Extremely short, generic request with no narrative or examples.',
      highlights: [
        {
          text: 'I want to apply because it is a good program.',
          reason: 'No personal detail or motivation depth.',
          sentiment: 'warning',
        },
        {
          text: 'I am interested in social impact and helping people.',
          reason: 'Abstract claim without proof.',
          sentiment: 'warning',
        },
      ],
      aiGeneratedFlag: false,
      aiGeneratedConfidence: 35,
      criteriaScores: cs(44, 46, 45),
      overallScore: 45,
    },
    chatbotAnalysis: {
      conversations: conv([
        'Not sure.',
        'I avoid fights.',
        'I don’t remember.',
        'Nothing special.',
        'I wait.',
        'Don’t know.',
        'Grades.',
        'School.',
        'I say “come on guys.”',
      ]),
      criteriaScores: cs(43, 47, 45),
      overallScore: 45,
      summary:
        'Interview mirrors written materials: minimal effort, no verifiable leadership or initiative.',
      criteriaSummaries: critSum(
        'No leadership examples offered.',
        'No proactive behaviors described.',
        'Low engagement and specificity throughout.',
      ),
    },
  },
];
