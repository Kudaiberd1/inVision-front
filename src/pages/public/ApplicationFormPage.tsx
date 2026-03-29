import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { StudentLevel } from '../../types';
import { COPY, ROUTES, STUDENT_LEVELS, FILE_RULES } from '../../constants';
import { useApplicationStore } from '../../store/useApplicationStore';
import { useApplication } from '../../hooks/useApplication';
import { startInterviewSession } from '../../api/services/interviewApi';
import { Input } from '../../components/ui/Input';
import { FileUpload } from '../../components/ui/FileUpload';
import { Button } from '../../components/ui/Button';

const TOTAL_STEPS = 2;

function parseFormIdParam(raw: string | null): number | null {
  if (!raw) return null;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function ApplicationFormPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const formIdParam = parseFormIdParam(searchParams.get('formId'));

  const selectedProgram = useApplicationStore((s) => s.selectedProgram);
  const formDraftId = useApplicationStore((s) => s.formDraftId);
  const setFormDraftId = useApplicationStore((s) => s.setFormDraftId);
  const setFormData = useApplicationStore((s) => s.setFormData);
  const formData = useApplicationStore((s) => s.formData);
  const setFormField = useApplicationStore((s) => s.setFormField);
  const resetChatbot = useApplicationStore((s) => s.resetChatbot);
  const setPrefetchedInterviewSession = useApplicationStore((s) => s.setPrefetchedInterviewSession);

  const { startBackgroundSubmit } = useApplication();

  const submitOnceRef = useRef(false);

  const [hydrated, setHydrated] = useState(() => useApplicationStore.persist.hasHydrated());
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);

  const f = COPY.application.fields;
  const err = COPY.application.errors;

  useEffect(() => {
    const unsub = useApplicationStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (formIdParam != null && formDraftId !== formIdParam) {
      setFormDraftId(formIdParam);
    }
  }, [hydrated, formIdParam, formDraftId, setFormDraftId]);

  useEffect(() => {
    if (!hydrated || !formDraftId) return;
    if (formIdParam !== formDraftId) {
      setSearchParams({ formId: String(formDraftId) }, { replace: true });
    }
  }, [hydrated, formDraftId, formIdParam, setSearchParams]);

  useEffect(() => {
    if (!hydrated) return;
    if (!selectedProgram) {
      navigate(ROUTES.SELECT_PROGRAM, { replace: true });
    }
  }, [hydrated, selectedProgram, navigate]);

  useEffect(() => {
    if (!hydrated || !selectedProgram) return;
    const id = formDraftId ?? formIdParam;
    if (id == null) {
      navigate(ROUTES.SELECT_PROGRAM, { replace: true });
    }
  }, [hydrated, selectedProgram, formDraftId, formIdParam, navigate]);

  useEffect(() => {
    if (!hydrated) return;
    const id = formDraftId ?? formIdParam;
    if (id == null) return;

    let cancelled = false;
    void (async () => {
      const stage = useApplicationStore.getState().formData.studentLevel;
      try {
        const state = await startInterviewSession({
          candidate_id: String(id),
          candidate_stage: stage,
        });
        if (cancelled || !state.sessionId) return;
        setPrefetchedInterviewSession(state);
      } catch {
        /* Prefetch is optional */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, formDraftId, formIdParam, setPrefetchedInterviewSession]);

  useEffect(() => {
    if (!hydrated || !selectedProgram) return;
    setFormData({ program: selectedProgram });
  }, [hydrated, selectedProgram, setFormData]);

  function validateStep1(): boolean {
    const e: Record<string, string> = {};
    if (!formData.fullName.trim()) e.fullName = err.required;
    if (!formData.email.trim()) e.email = err.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = err.email;
    if (!formData.dateOfBirth) e.dateOfBirth = err.required;
    if (!formData.city.trim()) e.city = err.required;
    if (!formData.school.trim()) e.school = err.required;
    if (!formData.gpa.trim()) e.gpa = err.required;
    else {
      const gpaVal = parseFloat(formData.gpa.replace(',', '.'));
      if (Number.isNaN(gpaVal) || gpaVal < 0 || gpaVal > 5) e.gpa = err.gpaRange;
    }
    if (!formData.cvFile) e.cv = err.required;
    if (!formData.essayFile) e.essay = err.required;
    if (!formData.videoFile) e.video = err.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2(): boolean {
    if (!confirmed) {
      setErrors({ confirm: err.confirm });
      return false;
    }
    setErrors({});
    return true;
  }

  function handleSubmit() {
    if (!validateStep2()) return;
    if (submitOnceRef.current) return;
    const id = formDraftId ?? formIdParam;
    if (id == null) {
      navigate(ROUTES.SELECT_PROGRAM, { replace: true });
      return;
    }
    submitOnceRef.current = true;
    resetChatbot();
    startBackgroundSubmit(id, formData);
    navigate(ROUTES.INTERVIEW);
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gradient-to-b from-[#C8E63C] to-[#F7F7F5] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-sm font-medium text-neutral-600">
          {COPY.application.progressLabel(step, TOTAL_STEPS)} —{' '}
          {step === 1 ? COPY.application.step1Title : COPY.application.step2Title}
        </p>
        {selectedProgram && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-medium text-neutral-900">{COPY.application.programLabel}</span>
            <span className="max-w-[min(100%,28rem)] rounded-full border-2 border-neutral-900/20 bg-white px-3 py-1.5 text-center text-sm font-semibold leading-snug text-neutral-900 shadow-md">
              {selectedProgram.name}
            </span>
            <button
              type="button"
              onClick={() => navigate(ROUTES.SELECT_PROGRAM)}
              className="ml-1 text-xs font-medium text-neutral-800 underline transition-colors hover:text-neutral-950"
            >
              {COPY.application.programChange}
            </button>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-4">
          {[1, 2].map((s) => {
            const active = step === s;
            const done = step > s;
            return (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    active
                      ? 'border-2 border-neutral-900 bg-white text-neutral-900 shadow-md'
                      : done
                        ? 'border-2 border-[#3d4510] bg-[#3d4510] text-white shadow-sm'
                        : 'border-2 border-neutral-900/25 bg-white text-neutral-500'
                  }`}
                >
                  {s}
                </div>
                {s < TOTAL_STEPS && (
                  <div
                    className="h-1 w-8 rounded-full bg-neutral-900/45 sm:w-16"
                    aria-hidden
                  />
                )}
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <div className="mt-10 space-y-8">
            <div>
              <h2 className="mb-4 border-b border-neutral-900/25 pb-2 text-xs font-medium uppercase tracking-widest text-neutral-700">
                {COPY.application.step1Title}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <Input
                  label={f.fullName}
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormField('fullName', e.target.value)}
                  error={errors.fullName}
                />
                <Input
                  label={f.email}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormField('email', e.target.value)}
                  error={errors.email}
                />
                <Input
                  label={f.phone}
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormField('phone', e.target.value)}
                  error={errors.phone}
                />
                <Input
                  label={f.dateOfBirth}
                  name="dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormField('dateOfBirth', e.target.value)}
                  error={errors.dateOfBirth}
                />
                <Input
                  label={f.city}
                  name="city"
                  value={formData.city}
                  onChange={(e) => setFormField('city', e.target.value)}
                  error={errors.city}
                />
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-neutral-600">{f.studentLevel}</span>
                  <select
                    className="w-full cursor-pointer rounded-lg border border-[#E5E5E4] bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors duration-200 focus:border-[#C8E63C] focus:ring-0"
                    value={formData.studentLevel}
                    onChange={(e) => setFormField('studentLevel', e.target.value as StudentLevel)}
                  >
                    {STUDENT_LEVELS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
                <Input
                  label={f.school}
                  name="school"
                  value={formData.school}
                  onChange={(e) => setFormField('school', e.target.value)}
                  error={errors.school}
                />
                <Input
                  label={f.gpa}
                  name="gpa"
                  value={formData.gpa}
                  onChange={(e) => setFormField('gpa', e.target.value)}
                  hint={COPY.application.gpaHint}
                  error={errors.gpa}
                />
              </div>
            </div>
            <FileUpload
              label={f.cv}
              accept={FILE_RULES.cv.accept}
              maxSizeMB={FILE_RULES.cv.maxMb}
              allowedMime={[FILE_RULES.cv.mime]}
              value={formData.cvFile}
              onChange={(file) => setFormField('cvFile', file)}
            />
            {errors.cv && <p className="text-xs text-[#F87171]">{errors.cv}</p>}
            <FileUpload
              label={COPY.application.essayLabel}
              accept={FILE_RULES.essay.accept}
              maxSizeMB={FILE_RULES.essay.maxMb}
              allowedMime={[FILE_RULES.essay.mime]}
              value={formData.essayFile}
              onChange={(file) => setFormField('essayFile', file)}
            />
            {errors.essay && <p className="text-xs text-[#F87171]">{errors.essay}</p>}
            <FileUpload
              label={f.video}
              accept={FILE_RULES.video.accept}
              maxSizeMB={FILE_RULES.video.maxMb}
              allowedMime={[FILE_RULES.video.mime]}
              value={formData.videoFile}
              onChange={(file) => setFormField('videoFile', file)}
            />
            {errors.video && <p className="text-xs text-[#F87171]">{errors.video}</p>}
            <Button
              variant="publicPrimary"
              className="w-full sm:w-auto"
              onClick={() => validateStep1() && setStep(2)}
            >
              {COPY.application.next}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="mt-10 space-y-6">
            <h2 className="mb-4 border-b border-neutral-900/25 pb-2 text-xs font-medium uppercase tracking-widest text-neutral-700">
              {COPY.application.step2Title}
            </h2>
            <div className="rounded-xl border border-[#E5E5E4] bg-white p-6 text-sm text-neutral-700">
              <dl className="grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase text-neutral-500">{f.fullName}</dt>
                  <dd className="font-medium text-neutral-900">{formData.fullName}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-neutral-500">{f.email}</dt>
                  <dd className="font-medium text-neutral-900">{formData.email}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-neutral-500">{f.phone}</dt>
                  <dd>{formData.phone}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-neutral-500">{f.dateOfBirth}</dt>
                  <dd>{formData.dateOfBirth}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-neutral-500">{f.city}</dt>
                  <dd>{formData.city}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-neutral-500">{f.studentLevel}</dt>
                  <dd>
                    {STUDENT_LEVELS.find((o) => o.value === formData.studentLevel)?.label ??
                      formData.studentLevel}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-neutral-500">{f.school}</dt>
                  <dd>{formData.school}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-neutral-500">{f.gpa}</dt>
                  <dd>{formData.gpa}</dd>
                </div>
                {formData.program && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs uppercase text-neutral-500">{COPY.application.programSummary}</dt>
                    <dd className="font-medium text-neutral-900">{formData.program.name}</dd>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase text-neutral-500">{f.cv}</dt>
                  <dd>{formData.cvFile?.name ?? '—'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase text-neutral-500">{COPY.application.essayLabel}</dt>
                  <dd>{formData.essayFile?.name ?? '—'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase text-neutral-500">{f.video}</dt>
                  <dd>{formData.videoFile?.name ?? '—'}</dd>
                </div>
              </dl>
            </div>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => {
                  setConfirmed(e.target.checked);
                  setErrors({});
                }}
                className="mt-1 rounded border-[#E5E5E4] text-[#C8E63C] focus:ring-[#C8E63C]"
              />
              <span>{COPY.application.confirmAccuracy}</span>
            </label>
            {errors.confirm && <p className="text-xs text-[#F87171]">{errors.confirm}</p>}
            <div className="flex flex-wrap gap-3">
              <Button variant="publicOutline" onClick={() => setStep(1)}>
                {COPY.application.back}
              </Button>
              <Button variant="publicPrimary" onClick={() => handleSubmit()}>
                {COPY.application.submit}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
