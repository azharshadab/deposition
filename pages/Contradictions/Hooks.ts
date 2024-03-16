import { useHttp } from '@hooks/useHttp';
import { Pagination } from '@interfaces/pagination';
import {
  ContradictionOptions,
  ContradictionsResponse,
  SortOrder,
  transcriptContradictionsService,
} from '@services/http/transcriptContradiction';

export const useDropdownOptions = () => {
  const [dropdownOptions, isLoading, refresh, error] =
    useHttp<ContradictionOptions>(
      () => transcriptContradictionsService.getDropdownOptions(),
      {
        initialData: {
          transcripts: [],
          groups: [],
        },
        callImmediately: true,
      },
    );

  return {
    dropdownOptions,
    dropdownLoading: isLoading,
    refresh,
    dropdownError: error,
  };
};

export const useDeleteContradiction = () => {
  const [res, deletionLoading, remove, deletionError, reset] = useHttp(
    (id: number) => transcriptContradictionsService.deleteAnomaly(id),
    { callImmediately: false },
  );

  return {
    deletionLoading,
    removeContradiction:
      remove as any as typeof transcriptContradictionsService.deleteAnomaly,
    deletionError,
    resetError: reset,
  };
};

const initialContradictions = { data: [], total_count: 0 };

export const useContradictions = () => {
  const [res, contradictionsLoading, refresh, contradictionsError] = useHttp(
    async (
      ids: string[],
      pagination: Pagination,
      order: SortOrder,
    ): Promise<ContradictionsResponse> => {
      if (ids.length === 0) return initialContradictions;
      return transcriptContradictionsService.getAnomalies(
        ids,
        pagination,
        order,
      );
    },
    { callImmediately: false, initialData: initialContradictions },
  );

  return {
    contradictions: res.data,
    total: res.total_count,
    contradictionsLoading,
    refreshContradictions:
      refresh as any as typeof transcriptContradictionsService.getAnomalies,
    contradictionsError,
  };
};
