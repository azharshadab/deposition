import { useMemo } from 'react';
import {
  GetQuestionsParams,
  transcriptSearchService,
} from '@services/http/transcriptSearch';
import { useHttp } from '@hooks/useHttp';
import { AnalysisOptions } from '@interfaces/AnalysisOptions';

export const useDropdownOptions = () => {
  const [{ transcripts, groups }, isLoading, refresh, error] =
    useHttp<AnalysisOptions>(
      () => transcriptSearchService.getDropdownOptions(),
      { initialData: { groups: [], transcripts: [] } },
    );

  const transcriptOptions = useMemo(
    () =>
      transcripts.map(t => ({
        label: t.DeponentName,
        value: t.id.toString(),
      })),
    [transcripts],
  );

  const groupOptions = useMemo(
    () =>
      groups.map(g => ({
        value: g.id + ':' + g.job_ids.join(','),
        label: g.name,
      })),
    [groups],
  );

  return {
    transcriptOptions,
    groupOptions,
    dropdownLoading: isLoading,
    dropdownError: error,
  };
};

export const useTopicsHttp = () => {
  const [topics, isLoading, refresh, error] = useHttp(
    async (...args: [id: number[], topics: string[]]) => {
      if (args[0].length === 0) return [];
      return transcriptSearchService.getTopics(...args);
    },
    {
      callImmediately: false,
      initialData: [],
    },
  );
  return {
    topics,
    topicsLoading: isLoading,
    refreshTopics: refresh as any as typeof transcriptSearchService.getTopics,
    topicalError: error,
  };
};

export const useQuestionsHttp = () => {
  const [questions, isLoading, refresh, error] = useHttp(
    async (args: GetQuestionsParams) => {
      if (args.job_ids.length === 0) return { data: [], total: 0 };
      return transcriptSearchService.getQuestions(args);
    },
    {
      callImmediately: false,
      initialData: { data: [], total: 0 },
    },
  );
  return {
    questions: questions.data,
    totalQuestions: questions.total,
    questionsLoading: isLoading,
    refreshQuestions:
      refresh as any as typeof transcriptSearchService.getQuestions,
    questionsError: error,
  };
};
