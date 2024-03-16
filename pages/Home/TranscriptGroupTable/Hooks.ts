import { Group } from '@interfaces/group';
import { useState, useCallback } from 'react';

export const useCheckedGroups = () => {
  const [checkedGroups, setCheckedGroups] = useState<Group[]>([]);

  const handleCheck = useCallback((group: Group, isChecked: boolean) => {
    setCheckedGroups(prevState => {
      const isExisting = prevState.some(g => g.groupId === group.groupId);
      if (isChecked && !isExisting) return [...prevState, group];
      if (!isChecked && isExisting)
        return prevState.filter(g => g.groupId !== group.groupId);
      return prevState;
    });
  }, []);

  const areGroupsSelected = useCallback(
    (groups: Group[]) => {
      return groups.every(group =>
        checkedGroups.some(
          checkedGroup => checkedGroup.groupId === group.groupId,
        ),
      );
    },
    [checkedGroups],
  );

  const toggleAllGroups = useCallback(
    (groups: Group[]) => {
      setCheckedGroups(prevState => {
        const allCurrentSelected = areGroupsSelected(groups);

        if (allCurrentSelected) {
          return prevState.filter(
            g => !groups.some(group => group.groupId === g.groupId),
          );
        }

        const newCheckedGroups = groups.filter(
          group => !areGroupsSelected([group]),
        );
        return [...prevState, ...newCheckedGroups];
      });
    },
    [checkedGroups, areGroupsSelected],
  );

  return {
    checkedGroups,
    handleCheck,
    areGroupsSelected,
    toggleAllGroups,
    resetCheckedGroups: () => setCheckedGroups([]),
  };
};

type SortField = 'name' | 'date';
type SortOrder = 'asc' | 'desc';

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
