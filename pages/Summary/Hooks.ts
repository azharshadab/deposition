import { useMemo } from 'react';
import {
  SummaryOption,
  transcriptSummaryService,
} from '@services/http/transcriptSummary';
import { useHttp } from '@hooks/useHttp';

export const useSummaryDropdown = () => {
  const [data, isLoading, refresh, error] = useHttp<SummaryOption[]>(
    () => transcriptSummaryService.getDropdownOptions(),
    { callImmediately: true, initialData: [] },
  );

  const options = useMemo(
    () =>
      data.map(o => ({
        value: o.job_id,
        label: o.transcript,
      })),
    [data],
  );

  return {
    options,
    optionsAreLoading: isLoading,
    optionsError: error,
    refresh,
  };
};

export const useSummaryHttp = () => {
  const [data, isLoading, refresh, error] = useHttp(
    (id: string) => transcriptSummaryService.getSummary(id),
    {
      callImmediately: false,
    },
  );

  return {
    summary: data,
    summaryIsLoading: isLoading,
    getSummary: refresh as any as typeof transcriptSummaryService.getSummary,
    summaryError: error,
  };
};
export const useSpecificSummaryHttp = () => {
  const [data, isLoading, refresh, error] = useHttp(
    (id: string, query: string, abortSigal: AbortSignal) =>
      transcriptSummaryService.getSpecificSummary(id, query, abortSigal),
    {
      callImmediately: false,
    },
  );

  return {
    specificSummary: data,
    specificSummaryIsLoading: isLoading,
    getSpecificSummary:
      refresh as any as typeof transcriptSummaryService.getSpecificSummary,
    specificSummaryError: error,
  };
};
