import { useState, useEffect, useMemo } from 'react';
import {
  LawyerOption,
  LawyerStatistic,
  transcriptStatisticsService,
} from '@services/http/transcriptStatistics';
import { useTranscriptGroupsContext } from '@hooks/useTranscriptGroups';
import { DropdownOption } from '@interfaces/option';
import { useHttp } from '@hooks/useHttp';
import { StatTranscriptOption } from '@interfaces/statistics';

interface StatDropdown extends DropdownOption {
  lawyers: LawyerOption[];
}
export interface StatisticsOptions {
  groupOptions: StatDropdown[];
  transcriptOptions: StatDropdown[];
}

function getOptionsWithUniqueLabels(options: LawyerOption[]) {
  const nameCount: { [key: string]: number } = {};
  const uniqueOptions: DropdownOption[] = [];

  options.forEach(option => {
    const { name } = option;
    nameCount[name] = (nameCount[name] || 0) + 1;
  });

  const nameSuffix: { [key: string]: number } = {};

  options.forEach(option => {
    const { name, id } = option;
    let label = name;

    if (nameCount[name] > 1) {
      nameSuffix[name] = (nameSuffix[name] || 0) + 1;
      label = `${name} (${nameSuffix[name]})`;
    }

    uniqueOptions.push({
      label,
      value: id,
    });
  });

  return uniqueOptions;
}

function getUniqueLawyerNames(
  lawyerStats: LawyerStatistic[] = [],
): LawyerStatistic[] {
  const nameCount: { [key: string]: number } = {};
  const uniqueLawyerStats: LawyerStatistic[] = [];

  lawyerStats.forEach(stat => {
    const name = stat.lawyer_name;
    nameCount[name] = (nameCount[name] || 0) + 1;
  });

  const nameSuffix: { [key: string]: number } = {};

  lawyerStats.forEach(stat => {
    let uniqueName = stat.lawyer_name;

    if (nameCount[uniqueName] > 1) {
      nameSuffix[uniqueName] = (nameSuffix[uniqueName] || 0) + 1;
      uniqueName = `${stat.lawyer_name} (${nameSuffix[uniqueName]})`;
    }

    uniqueLawyerStats.push({
      ...stat,
      lawyer_name: uniqueName,
    });
  });

  return uniqueLawyerStats;
}

export const useStatisticsDropdown = () => {
  const [statisticsOptions, isLoading, refreshDropdownOptions, error] = useHttp(
    () => transcriptStatisticsService.getDropdownOptions(),
    {
      callImmediately: true,
      initialData: {
        groups: [],
        transcripts: [],
      },
    },
  );

  const dropdownOptions = useMemo(
    () => ({
      transcriptOptions: statisticsOptions.transcripts?.map(t => ({
        label: t.name,
        value: t.id.toString(),
        lawyers: t.lawyers,
      })),
      groupOptions: statisticsOptions.groups.map(g => ({
        label: g.name,
        value: g.id + ':' + g.job_ids.join(','),
        lawyers: g.questioners,
      })),
    }),
    [statisticsOptions],
  );

  return {
    dropdownOptions,
    dropdownLoading: isLoading,
    refreshDropdown:
      refreshDropdownOptions as any as typeof transcriptStatisticsService.getDropdownOptions,
    dropdownError: error,
  };
};

export const useGroupsDropdown = () => {
  const { groups, isLoading, error } = useTranscriptGroupsContext();

  const groupOptions = useMemo(
    () =>
      groups.map(g => ({
        label: g.groupName,
        value: g.groupId,
      })),
    [groups],
  );
  return { groupOptions, groupsLoading: isLoading, groupsError: error };
};

export const useSelectedLawyers = (
  transcriptOptions: StatisticsOptions,
  selectedTranscripts: string[],
  selectedGroups: string[],
) => {
  const [selectedLawyers, setSelectedLawyers] = useState<string[]>([]);
  const [lawyerOptions, setLawyerOptions] = useState<DropdownOption[]>([]);

  const accumulateLawyers = (
    options: StatDropdown[],
    selectedIds: string[],
  ): LawyerOption[] =>
    options.reduce((acc, option) => {
      const id = option.value.toString();
      if (selectedIds.includes(id)) {
        return [...acc, ...option.lawyers];
      }
      return acc;
    }, [] as LawyerOption[]);

  useEffect(() => {
    const selectedLawyers1 = accumulateLawyers(
      transcriptOptions.transcriptOptions,
      selectedTranscripts,
    );
    const selectedLawyers2 = accumulateLawyers(
      transcriptOptions.groupOptions,
      selectedGroups,
    );

    const newSelectedLawyers = [...selectedLawyers1, ...selectedLawyers2];
    const newLawyerOptions = getOptionsWithUniqueLabels(newSelectedLawyers);
    setLawyerOptions(newLawyerOptions);
    setSelectedLawyers(newSelectedLawyers.map(option => option.id.toString()));
  }, [selectedTranscripts, selectedGroups]);

  return { selectedLawyers, setSelectedLawyers, lawyerOptions };
};

export const useStats = (lawyers: string[]) => {
  const [currentStats, statsLoading, refreshStats, statsError] = useHttp(
    async (lawyers: number[]): Promise<LawyerStatistic[]> => {
      if (lawyers.length === 0) return [];
      return transcriptStatisticsService.getStatistics(lawyers);
    },
    {
      callImmediately: false,
    },
  );
  useEffect(() => {
    const parsedLawyers = lawyers.map(id => parseInt(id));
    (refreshStats as any as typeof transcriptStatisticsService.getStatistics)(
      parsedLawyers,
    );
  }, [lawyers]);

  return {
    currentStats: getUniqueLawyerNames(currentStats),
    statsLoading,
    statsError,
  };
};
