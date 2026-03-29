import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ApplicationFormData, ChatbotAnswer, Program } from '../types';
import type { InterviewApiState } from '../types/interview';
import { STUDENT_LEVELS } from '../constants';

export type FormSubmitStatus = 'idle' | 'pending' | 'success' | 'failed';

const defaultForm: ApplicationFormData = {
  fullName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  studentLevel: STUDENT_LEVELS[0].value,
  program: null,
  city: '',
  school: '',
  gpa: '',
  cvFile: null,
  essayFile: null,
  videoFile: null,
};

interface ApplicationState {
  selectedProgram: Program | null;
  setSelectedProgram: (program: Program) => void;
  formData: ApplicationFormData;
  /** Draft row id from `POST /api/forms/draft` (numeric). */
  formDraftId: number | null;
  setFormDraftId: (id: number | null) => void;
  /** True after `POST /api/forms/{id}/submit` succeeds (required to open interview). */
  applicationFinalized: boolean;
  setApplicationFinalized: (v: boolean) => void;
  /** Final application id string (for legacy chatbot submit + success screen). */
  applicationId: string | null;
  /** Optional: interview started while user was still on the long form. */
  prefetchedInterviewSession: InterviewApiState | null;
  setPrefetchedInterviewSession: (s: InterviewApiState | null) => void;
  /** @deprecated Kept for persisted state migration; prefer local submit UI on the form page. */
  formSubmitStatus: FormSubmitStatus;
  formSubmitError: string | null;
  referenceNumber: string;
  chatbotAnswers: ChatbotAnswer[];
  setFormField: <K extends keyof ApplicationFormData>(key: K, value: ApplicationFormData[K]) => void;
  setFormData: (partial: Partial<ApplicationFormData>) => void;
  setApplicationId: (id: string | null) => void;
  setFormSubmitStatus: (status: FormSubmitStatus, error?: string | null) => void;
  setReferenceNumber: (ref: string) => void;
  addChatbotAnswer: (a: ChatbotAnswer) => void;
  resetChatbot: () => void;
  resetAll: () => void;
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set) => ({
      selectedProgram: null,
      setSelectedProgram: (program) => set({ selectedProgram: program }),
      formData: defaultForm,
      formDraftId: null,
      setFormDraftId: (formDraftId) => set({ formDraftId }),
      applicationFinalized: false,
      setApplicationFinalized: (applicationFinalized) => set({ applicationFinalized }),
      applicationId: null,
      prefetchedInterviewSession: null,
      setPrefetchedInterviewSession: (prefetchedInterviewSession) => set({ prefetchedInterviewSession }),
      formSubmitStatus: 'idle',
      formSubmitError: null,
      referenceNumber: '',
      chatbotAnswers: [],
      setFormField: (key, value) =>
        set((s) => ({ formData: { ...s.formData, [key]: value } })),
      setFormData: (partial) =>
        set((s) => ({ formData: { ...s.formData, ...partial } })),
      setApplicationId: (applicationId) => set({ applicationId }),
      setFormSubmitStatus: (formSubmitStatus, formSubmitError = null) =>
        set({ formSubmitStatus, formSubmitError: formSubmitError ?? null }),
      setReferenceNumber: (referenceNumber) => set({ referenceNumber }),
      addChatbotAnswer: (a) =>
        set((s) => ({ chatbotAnswers: [...s.chatbotAnswers, a] })),
      resetChatbot: () => set({ chatbotAnswers: [] }),
      resetAll: () =>
        set({
          selectedProgram: null,
          formData: defaultForm,
          formDraftId: null,
          applicationFinalized: false,
          applicationId: null,
          prefetchedInterviewSession: null,
          formSubmitStatus: 'idle',
          formSubmitError: null,
          referenceNumber: '',
          chatbotAnswers: [],
        }),
    }),
    {
      name: 'invision-application',
      merge: (persistedState, currentState) => {
        const p = persistedState as Partial<ApplicationState> | undefined;
        if (!p?.formData) return { ...currentState, ...p } as ApplicationState;
        const raw = p.formData as Partial<ApplicationFormData> & { fieldOfStudy?: unknown };
        const { fieldOfStudy: _legacy, ...rest } = raw;
        return {
          ...currentState,
          ...p,
          formDraftId: p.formDraftId ?? null,
          applicationFinalized: p.applicationFinalized ?? false,
          prefetchedInterviewSession: null,
          formSubmitStatus: (p as Partial<ApplicationState>).formSubmitStatus ?? 'idle',
          formSubmitError: (p as Partial<ApplicationState>).formSubmitError ?? null,
          formData: {
            ...currentState.formData,
            ...rest,
            studentLevel: rest.studentLevel ?? STUDENT_LEVELS[0].value,
            cvFile: null,
            essayFile: null,
            videoFile: null,
          },
        };
      },
      partialize: (s) => ({
        selectedProgram: s.selectedProgram,
        formDraftId: s.formDraftId,
        applicationFinalized: s.applicationFinalized,
        formData: {
          ...s.formData,
          cvFile: null,
          essayFile: null,
          videoFile: null,
        },
        applicationId: s.applicationId,
        referenceNumber: s.referenceNumber,
        chatbotAnswers: s.chatbotAnswers,
      }),
    },
  ),
);
