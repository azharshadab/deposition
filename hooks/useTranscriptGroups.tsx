import { ReactNode, createContext, useContext } from 'react';
import { Group } from '@interfaces/group';
import { transcriptGroupService } from '@services/http/transcriptGroups';
import { useHttp } from './useHttp';

export const useTranscriptGroups = () => {
  const [groups, isLoading, refreshGroups, error] = useHttp<Group[]>(
    () => transcriptGroupService.getTranscriptGroups(),
    { callImmediately: true, initialData: [] },
  );

  return { groups, isLoading, refreshGroups, error };
};

interface TranscriptsProviderProps {
  children: ReactNode;
}

interface TranscriptGroupsContextType {
  groups: Group[];
  isLoading: boolean;
  refreshGroups: () => void;
  error: any;
}

const TranscriptGroupsContext = createContext<TranscriptGroupsContextType>({
  groups: [],
  isLoading: false,
  refreshGroups() {},
  error: undefined,
});

export const TranscriptGroupsProvider = ({
  children,
}: TranscriptsProviderProps) => {
  const groups = useTranscriptGroups();
  return (
    <TranscriptGroupsContext.Provider value={groups}>
      {children}
    </TranscriptGroupsContext.Provider>
  );
};
export const useTranscriptGroupsContext = () =>
  useContext(TranscriptGroupsContext);
