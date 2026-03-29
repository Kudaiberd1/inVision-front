import { useCallback, useState } from 'react';
import type { ApplicationFormData, ChatbotAnswer } from '../types';
import {
  ApplicationSubmitError,
  getChatbotQuestions,
  submitApplicationForm,
  submitChatbot,
} from '../api/services/application';
import { COPY } from '../constants';
import { useApplicationStore } from '../store/useApplicationStore';

export function useApplication() {
  const applicationId = useApplicationStore((s) => s.applicationId);
  const formDraftId = useApplicationStore((s) => s.formDraftId);
  const setApplicationId = useApplicationStore((s) => s.setApplicationId);
  const setReferenceNumber = useApplicationStore((s) => s.setReferenceNumber);
  const setApplicationFinalized = useApplicationStore((s) => s.setApplicationFinalized);
  const setFormSubmitStatus = useApplicationStore((s) => s.setFormSubmitStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fire-and-forget multipart submit. Call right before navigating to the interview:
   * correlation id for the interview is `String(formDraftId)` until the server returns `{ id }`.
   */
  const startBackgroundSubmit = useCallback(
    (draftId: number, data: ApplicationFormData) => {
      setError(null);
      setApplicationId(String(draftId));
      setReferenceNumber('');
      setApplicationFinalized(false);
      setFormSubmitStatus('pending', null);
      void (async () => {
        try {
          const { id } = await submitApplicationForm(draftId, data);
          const idStr = String(id);
          setApplicationId(idStr);
          setReferenceNumber(idStr);
          setApplicationFinalized(true);
          setFormSubmitStatus('success', null);
        } catch (e) {
          const msg =
            e instanceof ApplicationSubmitError
              ? e.message
              : e instanceof Error
                ? e.message
                : COPY.application.errors.submitFailed;
          setFormSubmitStatus('failed', msg);
        }
      })();
    },
    [setApplicationId, setReferenceNumber, setApplicationFinalized, setFormSubmitStatus],
  );

  const sendChatbot = useCallback(
    async (answers: ChatbotAnswer[]) => {
      const id = applicationId ?? (formDraftId != null ? String(formDraftId) : null);
      if (!id) throw new Error('Missing application id');
      setLoading(true);
      setError(null);
      try {
        await submitChatbot(id, answers);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Submit failed';
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [applicationId, formDraftId],
  );

  const loadQuestions = useCallback(async () => {
    return getChatbotQuestions();
  }, []);

  return { startBackgroundSubmit, sendChatbot, loadQuestions, loading, error, setError };
}
