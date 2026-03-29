import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROGRAMS, ROUTES, COPY } from '../../constants';
import { useApplicationStore } from '../../store/useApplicationStore';
import type { Program } from '../../types';
import { Button } from '../../components/ui/Button';
import { createFormDraft, FormDraftError } from '../../api/services/application';

export function ProgramSelectionPage() {
  const navigate = useNavigate();
  const setSelectedProgram = useApplicationStore((s) => s.setSelectedProgram);
  const setFormDraftId = useApplicationStore((s) => s.setFormDraftId);
  const setApplicationFinalized = useApplicationStore((s) => s.setApplicationFinalized);
  const setApplicationId = useApplicationStore((s) => s.setApplicationId);
  const setReferenceNumber = useApplicationStore((s) => s.setReferenceNumber);
  const setFormSubmitStatus = useApplicationStore((s) => s.setFormSubmitStatus);
  const setPrefetchedInterviewSession = useApplicationStore((s) => s.setPrefetchedInterviewSession);
  const [selected, setSelected] = useState<Program | null>(null);
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);

  async function handleContinue() {
    if (!selected || draftLoading) return;
    setDraftError(null);
    setDraftLoading(true);
    try {
      const { id } = await createFormDraft(selected.name);
      setSelectedProgram(selected);
      setFormDraftId(id);
      setApplicationFinalized(false);
      setApplicationId(null);
      setReferenceNumber('');
      setFormSubmitStatus('idle', null);
      setPrefetchedInterviewSession(null);
      navigate(`${ROUTES.APPLY}?formId=${encodeURIComponent(String(id))}`);
    } catch (e) {
      const msg =
        e instanceof FormDraftError
          ? e.message
          : e instanceof Error
            ? e.message
            : COPY.application.errors.draftFailed;
      setDraftError(msg);
    } finally {
      setDraftLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col items-center bg-gradient-to-b from-[#C8E63C] to-[#F7F7F5] px-4 py-12">
      <div className="mb-6 w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate(ROUTES.HOME)}
          className="flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-neutral-900"
        >
          ← {COPY.programSelection.back}
        </button>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-[#E5E5E4] bg-white p-8">
        <h1 className="mb-8 text-center text-3xl font-extrabold leading-tight tracking-tight text-neutral-900">
          {COPY.programSelection.title}
        </h1>

        <div className="flex flex-col gap-5">
          {PROGRAMS.map((program) => (
            <div key={program.id}>
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-neutral-500">
                {program.category}
              </p>
              <div className="mb-3 border-t border-[#E5E5E4]" />
              <button
                type="button"
                onClick={() => setSelected(program)}
                className={`w-fit rounded-full border px-5 py-2 text-left text-sm font-medium transition-all duration-200 ${
                  selected?.id === program.id
                    ? 'border-[#C8E63C] bg-[#C8E63C] text-black'
                    : 'border-neutral-300 bg-transparent text-neutral-900 hover:border-[#C8E63C] hover:text-[#6B7A12]'
                }`}
              >
                {program.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {draftError && (
        <p
          className="mt-4 w-full max-w-md rounded-lg border border-[#F87171]/40 bg-[#FEF2F2] px-3 py-2 text-center text-sm text-[#B91C1C]"
          role="alert"
        >
          {draftError}
        </p>
      )}

      <div className="mt-6 w-full max-w-md">
        <Button
          type="button"
          variant="publicPrimary"
          disabled={!selected || draftLoading}
          className="w-full py-4 text-base disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 disabled:hover:bg-neutral-200"
          onClick={() => void handleContinue()}
        >
          {draftLoading ? COPY.programSelection.creatingDraft : COPY.programSelection.createApplication}
        </Button>
      </div>
    </div>
  );
}
