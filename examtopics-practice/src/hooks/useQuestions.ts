import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { examApi } from '../services/examApi';
import { Question } from '../types';

type Scope = { examId: string | undefined; token: string | null | undefined };
type Result = { scope: Scope; questions: Question[]; loading: boolean; error: string | null };

export const useQuestions = (examId: string | undefined, token?: string | null) => {
  const scope = useMemo(() => ({ examId, token }), [examId, token]);
  const [result, setResult] = useState<Result>();
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => request.current?.abort(), [scope]);

  const loadQuestions = useCallback(async () => {
    request.current?.abort();
    if (!scope.examId) return;

    const controller = new AbortController();
    request.current = controller;
    setResult({ scope, questions: [], loading: true, error: null });

    try {
      const questions = await examApi.getAllQuestions(scope.examId, scope.token, controller.signal);
      if (!controller.signal.aborted) {
        setResult({ scope, questions, loading: false, error: null });
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setResult({ scope, questions: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }
  }, [scope]);

  const setQuestions = (questions: Question[]) =>
    setResult(current => current?.scope === scope ? { ...current, questions } : current);

  const current = result?.scope === scope ? result : undefined;
  return {
    questions: current?.questions ?? [],
    loading: current?.loading ?? Boolean(examId),
    error: current?.error ?? null,
    loadQuestions,
    setQuestions,
  };
};
