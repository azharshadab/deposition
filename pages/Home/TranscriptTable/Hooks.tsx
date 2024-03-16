import { useHttp } from '@hooks/useHttp';
import { SortField, SortOrder } from '@interfaces/TranscriptQueryParams';
import { Transcript } from '@interfaces/transcript';
import { transcriptService } from '@services/http/transcripts';
import { useCallback, useEffect, useState } from 'react';

export const useSort = () => {
  const [sortField, setSortField] = useState<SortField>();
  const [sortOrder, setSortOrder] = useState<SortOrder>();

  const toggleSortOrder = () => {
    setSortOrder(prevSortOrder => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
  };

  const toggleSortFieldAndOrder = (field?: SortField) => {
    if (!field) {
      setSortField(undefined);
      setSortOrder(undefined);
      return;
    }
    if (!sortField) setSortOrder('desc');
    if (sortField === field) {
      toggleSortOrder();
      return;
    }
    setSortField(field);
  };

  return {
    sortField,
    sortOrder,
    toggleSortFieldAndOrder,
  };
};

export const useCheckedTranscripts = () => {
  const [checkedTranscripts, setCheckedTranscripts] = useState<Transcript[]>(
    [],
  );

  const handleCheck = useCallback(
    (transcript: Transcript, isChecked: boolean) => {
      setCheckedTranscripts(prevState =>
        isChecked
          ? [...prevState, transcript]
          : prevState.filter(t => t.id !== transcript.id),
      );
    },
    [],
  );

  const areTranscriptsSelected = useCallback(
    (transcripts: Transcript[]) => {
      return transcripts.every(transcript =>
        checkedTranscripts.some(
          checkedTranscript => checkedTranscript.id === transcript.id,
        ),
      );
    },
    [checkedTranscripts],
  );

  const toggleAllTranscripts = useCallback(
    (transcripts: Transcript[]) => {
      setCheckedTranscripts(prevState => {
        const allCurrentSelected = areTranscriptsSelected(transcripts);

        if (allCurrentSelected) {
          return prevState.filter(t => !transcripts.some(ct => ct.id === t.id));
        }

        const newCheckedTranscripts = transcripts.filter(
          t => !areTranscriptsSelected([t]),
        );
        return [...prevState, ...newCheckedTranscripts];
      });
    },
    [checkedTranscripts, areTranscriptsSelected],
  );

  return {
    checkedTranscripts,
    handleCheck,
    toggleAllTranscripts,
    areTranscriptsSelected,
    resetCheckedTranscripts: () => setCheckedTranscripts([]),
  };
};

export const useDeleteTranscripts = () => {
  const [_, isLoading, deleteTranscripts, error] = useHttp(
    (tList: number[]) => transcriptService.deleteManyTranscripts(tList),
    { callImmediately: false },
  );

  useEffect(() => {
    console.error(error);
    alert(
      `There was a problem deleting your transcripts. Please try again: ${error}`,
    );
  }, [error]);

  return {
    isDeleting: isLoading,
    deleteTranscripts:
      deleteTranscripts as any as typeof transcriptService.deleteManyTranscripts,
    deletingError: error,
  };
};
