import { useEffect, useRef, useState } from 'react';

const useTranscriptsWithGroupsDropdown = (
  initialSelectedGroups: string[],
  page: string,
) => {
  const prevSelectedGroups = useRef<string[]>([]);
  const [selectedTranscripts, setSelectedTranscripts] = useState<string[]>([]);

  const extractUniqueJobIds = (groups: string[]) => {
    const jobIdsSeperatedByComma = groups.map(ids => ids.split(':')[1]);
    const jobIds = jobIdsSeperatedByComma.map(str => str.split(',')).flat();
    return [...new Set(jobIds)];
  };

  useEffect(() => {
    if (!initialSelectedGroups) return;
    const uniqueCurrentJobIds = extractUniqueJobIds(initialSelectedGroups);
    const uniquePreviousJobIds = extractUniqueJobIds(
      prevSelectedGroups.current,
    );

    const deselectedJobIds = uniquePreviousJobIds.filter(
      id => !uniqueCurrentJobIds.includes(id),
    );

    updateSelectedTranscripts(uniqueCurrentJobIds, deselectedJobIds);

    prevSelectedGroups.current = initialSelectedGroups;
  }, [initialSelectedGroups]);

  const updateSelectedTranscripts = (
    uniqueCurrentJobIds: string[],
    deselectedJobIds: string[],
  ) => {
    setSelectedTranscripts(prevIds => {
      const updatedTranscripts = [...uniqueCurrentJobIds, ...prevIds].filter(
        id => !deselectedJobIds.includes(id),
      );
      return [...new Set(updatedTranscripts)];
    });
  };

  return {
    selectedTranscripts,
    setSelectedTranscripts: (transcripts: string[]) => {
      setSelectedTranscripts(transcripts);
      if (!transcripts.length) {
        window.history.replaceState(null, '', `/${page}`);
        return;
      }
      window.history.replaceState(
        null,
        '',
        `/${page}/t/${transcripts.join(',')}`,
      );
    },
  };
};

export default useTranscriptsWithGroupsDropdown;
