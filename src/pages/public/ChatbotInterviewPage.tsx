import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { COPY, ROUTES } from '../../constants';
import { useApplicationStore } from '../../store/useApplicationStore';
import { useApplication } from '../../hooks/useApplication';
import type { ChatbotAnswer } from '../../types';
import type { InterviewApiState } from '../../types/interview';
import {
  InterviewApiError,
  clearStoredInterviewSession,
  sendInterviewReply,
  startInterviewSession,
} from '../../api/services/interviewApi';
import { ChatBubble } from '../../components/chatbot/ChatBubble';
import { ChatInput } from '../../components/chatbot/ChatInput';
import { TypingIndicator } from '../../components/chatbot/TypingIndicator';
import { Button } from '../../components/ui/Button';

function BotAvatar() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E5E5E4] bg-white text-xs font-bold text-[#6B7A12] shadow-sm">
      U
    </div>
  );
}

export function ChatbotInterviewPage() {
  const navigate = useNavigate();
  const formDraftId = useApplicationStore((s) => s.formDraftId);
  const formSubmitStatus = useApplicationStore((s) => s.formSubmitStatus);
  const formSubmitError = useApplicationStore((s) => s.formSubmitError);
  const applicationId = useApplicationStore((s) => s.applicationId);
  const studentLevel = useApplicationStore((s) => s.formData.studentLevel);
  const fullName = useApplicationStore((s) => s.formData.fullName);
  const prefetchedInterviewSession = useApplicationStore((s) => s.prefetchedInterviewSession);
  const setPrefetchedInterviewSession = useApplicationStore((s) => s.setPrefetchedInterviewSession);
  const { sendChatbot } = useApplication();

  const scrollRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<'welcome' | 'active' | 'summary'>('welcome');
  const [sessionId, setSessionId] = useState('');
  const [transcript, setTranscript] = useState<{ question: string; answer: string }[]>([]);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [progress, setProgress] = useState({ asked: 0, max: 0 });
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [sending, setSending] = useState(false);

  const displayName = fullName.trim() || 'there';
  const firstName = displayName.split(/\s+/)[0] ?? displayName;
  const candidateId = (applicationId ?? (formDraftId != null ? String(formDraftId) : '')).trim();

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [transcript, pendingQuestion, sending, phase, error, starting]);

  const applyServerState = useCallback((state: InterviewApiState) => {
    setProgress({
      asked: state.questionsAsked,
      max: state.maxQuestions,
    });
    const done = state.interviewCompleted || state.questionText == null || state.questionText === '';
    if (done) {
      setPendingQuestion(null);
      setPhase('summary');
      return;
    }
    setPendingQuestion(state.questionText);
    setPhase('active');
  }, []);

  const handleStart = useCallback(async () => {
    setError(null);
    setStarting(true);
    try {
      const cached = prefetchedInterviewSession;
      if (cached?.sessionId) {
        setSessionId(cached.sessionId);
        applyServerState(cached);
        setPrefetchedInterviewSession(null);
        return;
      }

      if (!candidateId) {
        throw new InterviewApiError('Missing application id.', 400, {});
      }

      const state = await startInterviewSession({
        candidate_id: candidateId,
        candidate_stage: studentLevel,
      });
      if (!state.sessionId) {
        throw new InterviewApiError('Interview did not return a session id.', 500, {});
      }
      setSessionId(state.sessionId);
      applyServerState(state);
    } catch (e) {
      const msg = e instanceof InterviewApiError ? e.message : 'Could not start interview.';
      setError(msg);
    } finally {
      setStarting(false);
    }
  }, [
    applyServerState,
    candidateId,
    prefetchedInterviewSession,
    setPrefetchedInterviewSession,
    studentLevel,
  ]);

  const submitAnswer = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !sessionId || !pendingQuestion || sending) return;

      const questionSnapshot = pendingQuestion;
      setError(null);
      setSending(true);
      setTranscript((t) => [...t, { question: questionSnapshot, answer: trimmed }]);
      setPendingQuestion(null);

      try {
        const state = await sendInterviewReply(sessionId, trimmed);
        applyServerState(state);
      } catch (e) {
        const msg = e instanceof InterviewApiError ? e.message : 'Could not send your answer.';
        setError(msg);
        setTranscript((t) => t.slice(0, -1));
        setPendingQuestion(questionSnapshot);
      } finally {
        setSending(false);
      }
    },
    [applyServerState, pendingQuestion, sending, sessionId],
  );

  const handleSendFromInput = useCallback(() => {
    const t = input.trim();
    if (!t) return;
    setInput('');
    void submitAnswer(t);
  }, [input, submitAnswer]);

  const handleFinish = useCallback(async () => {
    const answers: ChatbotAnswer[] = transcript.map((row, i) => ({
      questionId: `interview-${i}`,
      criteria: 'leadership',
      answer: row.answer,
    }));
    clearStoredInterviewSession();
    try {
      await sendChatbot(answers);
    } catch {
      /* optional legacy endpoint — still continue to success */
    }
    navigate(ROUTES.SUCCESS);
  }, [navigate, sendChatbot, transcript]);

  /** Must have come from “Submit application” (background upload started). */
  if (formSubmitStatus === 'idle') {
    return <Navigate to={ROUTES.APPLY} replace />;
  }

  if (!candidateId) {
    return <Navigate to={ROUTES.APPLY} replace />;
  }

  const inputDisabled = sending || !pendingQuestion || starting;

  const headerSubtitle =
    phase === 'welcome'
      ? 'Admissions interview'
      : phase === 'summary'
        ? 'Complete'
        : progress.max > 0
          ? COPY.chatbot.progressAsked(progress.asked, progress.max)
          : COPY.chatbot.progress(transcript.length + (pendingQuestion ? 1 : 0), Math.max(progress.max, 1));

  const showChatInput = phase === 'active';

  return (
    <div className="flex h-[calc(100vh-73px)] flex-col bg-[#F7F7F5]">
      <header className="shrink-0 border-b border-[#E5E5E4] bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BotAvatar />
            <div>
              <p className="text-sm font-bold text-neutral-900">{COPY.brand.name}</p>
              <p className="score-number text-sm text-[#6B7A12]">{headerSubtitle}</p>
            </div>
          </div>
        </div>
      </header>

      {formSubmitStatus === 'pending' && (
        <div className="shrink-0 border-b border-[#C8E63C]/40 bg-[#F7FAE8] px-4 py-3 text-sm text-neutral-800 sm:px-6">
          <p className="font-semibold text-[#3d4510]">{COPY.chatbot.submitBackgroundPendingTitle}</p>
          <p className="mt-1 text-neutral-700">{COPY.chatbot.submitBackgroundPendingBody}</p>
        </div>
      )}

      {formSubmitStatus === 'failed' && (
        <div className="shrink-0 border-b border-[#F87171]/30 bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B] sm:px-6">
          <p className="font-semibold text-[#7F1D1D]">{COPY.chatbot.submitBackgroundFailedTitle}</p>
          <p className="mt-1 leading-relaxed">{COPY.chatbot.submitBackgroundFailedBody}</p>
          {formSubmitError && (
            <p className="mt-2 rounded-md bg-white/60 px-2 py-1.5 font-mono text-xs text-neutral-800">
              {formSubmitError}
            </p>
          )}
          <Link
            to={ROUTES.APPLY}
            className="mt-3 inline-flex font-semibold text-[#6B7A12] underline underline-offset-2 hover:text-neutral-900"
          >
            {COPY.chatbot.backToApplicationForm}
          </Link>
        </div>
      )}

      {error && (
        <div className="shrink-0 border-b border-[#F87171]/30 bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C] sm:px-6">
          <p>{error}</p>
          {phase === 'welcome' && (
            <button
              type="button"
              className="mt-2 font-semibold underline"
              onClick={() => void handleStart()}
            >
              Try again
            </button>
          )}
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col">
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 sm:px-6"
        >
          <div className="mx-auto flex max-w-2xl flex-col gap-4 pb-2">
            {phase === 'welcome' && (
              <div className="flex gap-3">
                <BotAvatar />
                <ChatBubble
                  sender="bot"
                  message={
                    <div className="space-y-4">
                      <p>{COPY.chatbot.welcome(firstName)}</p>
                      {prefetchedInterviewSession?.sessionId && (
                        <p className="text-sm text-neutral-600">{COPY.chatbot.prefetchReadyHint}</p>
                      )}
                      <Button
                        variant="publicPrimary"
                        disabled={starting}
                        onClick={() => void handleStart()}
                      >
                        {starting ? COPY.chatbot.starting : `${COPY.chatbot.startCta} →`}
                      </Button>
                    </div>
                  }
                />
              </div>
            )}

            {(phase === 'active' || phase === 'summary') &&
              transcript.map((row, i) => (
                <div key={`${i}-${row.question.slice(0, 24)}`} className="space-y-3">
                  <ChatBubble sender="bot" message={row.question} />
                  <ChatBubble sender="user" message={row.answer} />
                </div>
              ))}

            {phase === 'active' && sending && (
              <div className="flex gap-3">
                <BotAvatar />
                <div className="rounded-2xl rounded-tl-sm border border-[#E5E5E4] bg-white shadow-sm">
                  <TypingIndicator />
                </div>
              </div>
            )}

            {phase === 'active' && pendingQuestion && !sending && (
              <ChatBubble sender="bot" message={pendingQuestion} />
            )}

            {phase === 'summary' && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <BotAvatar />
                  <ChatBubble sender="bot" message={<p className="font-medium">{COPY.chatbot.summaryTitle}</p>} />
                </div>
                <Button variant="publicPrimary" className="w-full sm:w-auto" onClick={() => void handleFinish()}>
                  {COPY.chatbot.continueCta}
                </Button>
                <ChatBubble sender="bot" message={COPY.chatbot.complete} />
              </div>
            )}
          </div>
        </div>

        {showChatInput && (
          <div className="shrink-0">
            <ChatInput
              value={input}
              onChange={setInput}
              onSend={handleSendFromInput}
              disabled={inputDisabled}
            />
          </div>
        )}
      </div>
    </div>
  );
}
