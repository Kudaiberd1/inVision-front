import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  FileText,
  MessageCircle,
  Scale,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { COPY, PROGRAMS, ROUTES } from '../../constants';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const HOW_STEPS = [
  {
    title: COPY.landing.howStep1Title,
    body: COPY.landing.howStep1Body,
    icon: BookOpen,
  },
  {
    title: COPY.landing.howStep2Title,
    body: COPY.landing.howStep2Body,
    icon: ClipboardList,
  },
  {
    title: COPY.landing.howStep3Title,
    body: COPY.landing.howStep3Body,
    icon: MessageCircle,
  },
  {
    title: COPY.landing.howStep4Title,
    body: COPY.landing.howStep4Body,
    icon: UserCheck,
  },
] as const;

const ASSESSMENT_BLOCKS = [
  {
    title: COPY.landing.assessmentCvTitle,
    body: COPY.landing.assessmentCvBody,
    icon: FileText,
  },
  {
    title: COPY.landing.assessmentEssayTitle,
    body: COPY.landing.assessmentEssayBody,
    icon: BookOpen,
  },
  {
    title: COPY.landing.assessmentChatTitle,
    body: COPY.landing.assessmentChatBody,
    icon: MessageCircle,
  },
] as const;

const ADVICE_BLOCKS = [
  {
    title: COPY.landing.adviceHumanTitle,
    body: COPY.landing.adviceHumanBody,
    icon: UserCheck,
  },
  {
    title: COPY.landing.adviceToolsTitle,
    body: COPY.landing.adviceToolsBody,
    icon: Sparkles,
  },
  {
    title: COPY.landing.adviceYouTitle,
    body: COPY.landing.adviceYouBody,
    icon: Scale,
  },
] as const;

export function LandingPage() {
  return (
    <div className="bg-[#F7F7F5]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#C8E63C]/12 via-white to-[#F7F7F5] px-4 pb-20 pt-20 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#6B7A12]">
            {COPY.brand.name}
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tighter text-neutral-900 sm:text-6xl lg:text-7xl">
            {COPY.landing.heroTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-neutral-700">
            {COPY.brand.tagline}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-left text-base font-normal leading-relaxed text-neutral-600 sm:text-center">
            {COPY.landing.heroBody}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <div className="rounded-xl border border-[#E5E5E4] bg-white px-6 py-5">
              <p className="score-number text-4xl font-bold text-black">{COPY.landing.statGrant}</p>
            </div>
            <div className="rounded-xl border border-[#E5E5E4] bg-white px-6 py-5">
              <p className="score-number text-4xl font-bold text-[#C8E63C]">{COPY.landing.statProgram}</p>
            </div>
          </div>
          <div className="mt-10">
            <Link to={ROUTES.SELECT_PROGRAM}>
              <Button variant="publicPrimary" className="gap-2 text-base">
                {COPY.landing.ctaApply}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-8">
            <h3 className="text-xl font-bold tracking-tight text-neutral-900">
              {COPY.landing.featureLeadershipTitle}
            </h3>
            <p className="mt-3 text-sm font-normal leading-relaxed text-neutral-600">
              {COPY.landing.featureLeadershipBody}
            </p>
          </Card>
          <Card className="p-8">
            <h3 className="text-xl font-bold tracking-tight text-neutral-900">
              {COPY.landing.featureEntrepreneurshipTitle}
            </h3>
            <p className="mt-3 text-sm font-normal leading-relaxed text-neutral-600">
              {COPY.landing.featureEntrepreneurshipBody}
            </p>
          </Card>
          <Card className="p-8">
            <h3 className="text-xl font-bold tracking-tight text-neutral-900">
              {COPY.landing.featureImpactTitle}
            </h3>
            <p className="mt-3 text-sm font-normal leading-relaxed text-neutral-600">
              {COPY.landing.featureImpactBody}
            </p>
          </Card>
        </div>
      </section>

      <section className="border-y border-[#E5E5E4] bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            {COPY.landing.programsTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-relaxed text-neutral-600">
            {COPY.landing.programsBody}
          </p>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROGRAMS.map((p) => (
              <li
                key={p.id}
                className="flex items-start gap-3 rounded-xl border border-[#E5E5E4] bg-[#F7F7F5]/80 px-4 py-3 text-left"
              >
                <span className="mt-0.5 shrink-0 rounded-md bg-[#C8E63C]/25 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-[#5A6610]">
                  {p.category}
                </span>
                <span className="text-sm font-medium leading-snug text-neutral-900">{p.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            {COPY.landing.howItWorksTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600">{COPY.landing.howItWorksLead}</p>
        </div>
        <ol className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {HOW_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.title}>
                <Card className="relative h-full p-6 pt-8">
                  <span
                    className="absolute left-6 top-0 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#C8E63C] text-sm font-bold text-black shadow-sm"
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <Icon className="mb-3 h-8 w-8 text-[#6B7A12]" aria-hidden />
                  <h3 className="text-lg font-bold text-neutral-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.body}</p>
                </Card>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="border-t border-[#E5E5E4] bg-[#FAFAFA] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
              {COPY.landing.assessmentTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">{COPY.landing.assessmentLead}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {ASSESSMENT_BLOCKS.map((block) => {
              const Icon = block.icon;
              return (
                <Card key={block.title} className="p-7">
                  <Icon className="h-7 w-7 text-[#6B7A12]" aria-hidden />
                  <h3 className="mt-4 text-lg font-bold text-neutral-900">{block.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{block.body}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            {COPY.landing.adviceTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600">{COPY.landing.adviceLead}</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ADVICE_BLOCKS.map((block) => {
            const Icon = block.icon;
            return (
              <div
                key={block.title}
                className="rounded-2xl border border-[#E5E5E4] bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8E63C]/20">
                  <Icon className="h-5 w-5 text-[#5A6610]" aria-hidden />
                </div>
                <h3 className="mt-4 text-lg font-bold text-neutral-900">{block.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{block.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#C8E63C]/20 via-white to-[#C8E63C]/15 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            {COPY.landing.ctaBandTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-700">{COPY.landing.ctaBandBody}</p>
          <div className="mt-8">
            <Link to={ROUTES.SELECT_PROGRAM}>
              <Button variant="publicPrimary" className="gap-2 text-base">
                {COPY.landing.ctaApply}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E5E5E4] bg-white px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center text-sm text-neutral-600 sm:flex-row sm:text-left">
          <p>{COPY.brand.footerLine}</p>
          <p className="font-medium text-neutral-900">
            inDrive · <span className="text-[#6B7A12]">{COPY.brand.name}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
