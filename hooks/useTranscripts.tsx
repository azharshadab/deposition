import { transcriptService } from '@services/http/transcripts';
import { ReactNode, useContext, createContext } from 'react';
import { Transcript } from '@interfaces/transcript';
import { useHttp } from './useHttp';
import { Pagination } from '@interfaces/pagination';

const initialTranscriptData = { data: [], count: 0 };

export const useTranscripts = (): TranscriptsContextType => {
  const [transcripts, isLoading, refreshTranscripts, error] = useHttp<{
    data: Transcript[];
    count: number;
  }>(
    (pagination?: Pagination) =>
      transcriptService.getUserTranscripts(pagination),
    {
      callImmediately: false,
      initialData: initialTranscriptData,
    },
  );

  return {
    transcripts,
    isLoading,
    refreshTranscripts:
      refreshTranscripts as any as typeof transcriptService.getUserTranscripts,
    error,
  };
};

interface TranscriptsContextType {
  transcripts: { data: Transcript[]; count: number };
  isLoading: boolean;
  refreshTranscripts: typeof transcriptService.getUserTranscripts;
  error: any;
}

const TranscriptsContext = createContext<TranscriptsContextType>({
  transcripts: initialTranscriptData,
  isLoading: false,
  async refreshTranscripts(pagination: Pagination) {
    console.count('dummy data');
    return initialTranscriptData;
  },
  error: undefined,
});

interface TranscriptsProviderProps {
  children: ReactNode;
}

export const TranscriptsProvider = ({ children }: TranscriptsProviderProps) => {
  const transcripts = useTranscripts();
  return (
    <TranscriptsContext.Provider value={transcripts}>
      {children}
    </TranscriptsContext.Provider>
  );
};

export const useTranscriptsContext = () => {
  const context = useContext(TranscriptsContext);
  if (context === undefined) {
    throw new Error(
      'useTranscriptsContext must be used within a TranscriptsProvider',
    );
  }
  return context;
};
