import { useState, useMemo, useEffect } from 'react';
import SearchBar from '@common/SearchBar';
import Table from '@common/Table';
import { StyledH2, StyledH3 } from '@styles/header';
import { useTranscriptGroupsContext } from '@hooks/useTranscriptGroups';
import { GroupTableRow } from './GroupTableRow';
import { useCheckedGroups, useSort } from './Hooks';
import { StyledPrimaryButton } from '@styles/buttons';
import { transcriptGroupService } from '@services/http/transcriptGroups';
import { Spinner } from '@styles/spinner';
import styled from 'styled-components';
import Pagination from '@common/Pagination/Pagination';
import usePagination from '@common/Pagination/Hooks';
import { useDialogContext } from '@common/Dialog';
import SortButton from '@common/SortButton';
import { Group } from '@interfaces/group';
import Checkbox from '@common/CheckBox';
import { StyledTableHead } from '@styles/table';

const StyledGroupTable = styled.div`
  margin-top: 80px;
`;

export function TranscriptGroupTable() {
  const { groups, isLoading, refreshGroups, error } =
    useTranscriptGroupsContext();
  const [searchTerm, setSearchTerm] = useState('');
  const {
    checkedGroups,
    handleCheck,
    resetCheckedGroups,
    areGroupsSelected,
    toggleAllGroups,
  } = useCheckedGroups();

  const { sortField, sortOrder, toggleSortFieldAndOrder } = useSort();

  const filteredGroups = useMemo(() => {
    let result = groups.filter(group =>
      group.groupName.toLowerCase().includes(searchTerm.trim().toLowerCase()),
    );

    if (sortField && sortOrder) {
      result.sort((a, b) => {
        const key: keyof Group =
          sortField === 'date' ? 'createdOn' : 'groupName';
        let valueA = a[key];
        let valueB = b[key];

        if (sortField === 'date') {
          return sortOrder === 'asc'
            ? Number(new Date(valueA)) - Number(new Date(valueB))
            : Number(new Date(valueB)) - Number(new Date(valueA));
        } else {
          return sortOrder === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
      });
    }

    return result;
  }, [groups, searchTerm, sortField, sortOrder]);

  const { page, setPage, rowCount, setRowCount, totalPages, shouldPaginate } =
    usePagination(filteredGroups, 10);

  useEffect(() => {
    toggleSortFieldAndOrder();
    setPage(1);
  }, [groups]);

  const [isDeleting, setIsDeleting] = useState(false);

  const { sendMessage } = useDialogContext();

  const handleDeleteTranscripts = async () => {
    try {
      setIsDeleting(true);
      await transcriptGroupService.deleteManyTranscriptGroups(
        checkedGroups.map(g => g.groupId),
      );
      sendMessage('Transcript Groups have successfully been deleted');
    } catch (e) {
      alert(`There was a problem deleting your groups. Please try again.`);
    } finally {
      resetCheckedGroups();
      refreshGroups();
      setIsDeleting(false);
    }
  };

  const paginatedGroups = useMemo(
    () => filteredGroups.slice((page - 1) * rowCount, page * rowCount),
    [filteredGroups, page, rowCount],
  );

  if (isDeleting) return <Spinner />;

  return (
    <StyledGroupTable>
      <div className="input-container">
        <StyledH2>Groups</StyledH2>
        <div className="input-container">
          <SearchBar
            id="transcript-group-name-search-input"
            placeholder="Search"
            onSearch={setSearchTerm}
          />
          <StyledPrimaryButton
            id="transcript-group-delete-btn"
            onClick={handleDeleteTranscripts}
            disabled={checkedGroups.length === 0}
            data-testid="delete-groups-button"
          >
            Delete Groups
          </StyledPrimaryButton>
        </div>
      </div>
      {isLoading ? (
        <Spinner id="transcript-group-table-spinner" />
      ) : (
        <>
          <Table
            headers={[
              <StyledTableHead>
                <Checkbox
                  checked={areGroupsSelected(paginatedGroups)}
                  onChange={() => toggleAllGroups(paginatedGroups)}
                />
                <SortButton
                  id="transcript-group-sort-name-btn"
                  onClick={() => toggleSortFieldAndOrder('name')}
                  sortOrder={sortField === 'name' ? sortOrder : undefined}
                >
                  Group Name
                </SortButton>
              </StyledTableHead>,
              <th>
                <SortButton
                  id="transcript-group-sort-date-btn"
                  onClick={() => toggleSortFieldAndOrder('date')}
                  sortOrder={sortField === 'date' ? sortOrder : undefined}
                >
                  Created On
                </SortButton>
              </th>,
              <th>Actions</th>,
            ]}
            rows={paginatedGroups.map(g => (
              <GroupTableRow
                isChecked={!!checkedGroups.find(cg => cg.groupId === g.groupId)}
                key={g.groupId}
                group={g}
                onCheck={handleCheck}
              />
            ))}
          />
          {shouldPaginate && (
            <Pagination
              id="transcript-group-pagination"
              currentPage={page}
              totalPages={totalPages}
              handlePageChange={setPage}
              rowCount={rowCount}
              setRowCount={setRowCount}
            />
          )}
          {filteredGroups.length === 0 && groups.length > 0 && searchTerm && (
            <StyledH3 id="transcript-group-no-match-msg">
              There is no matching text for your search
            </StyledH3>
          )}
          {error && (
            <StyledH3 id="transcript-group-error-msg">
              It seems there was an error getting your groups. Please try again
              later.
            </StyledH3>
          )}
        </>
      )}
    </StyledGroupTable>
  );
}
