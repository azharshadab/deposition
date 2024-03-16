import ContradictionCard from './ContradictionCard';
import Dropdown from '@common/Dropdown';
import HomeLink from '@common/HomeLink';
import styled from 'styled-components';
import { StyledH1, StyledH3 } from '@styles/header';
import { colors } from '@styles/colors';
import {
  useContradictions,
  useDeleteContradiction,
  useDropdownOptions,
} from './Hooks';
import { useEffect, useState } from 'react';
import { Spinner } from '@styles/spinner';
import DropdownMultiple from '@common/DropdownMultiple';
import useTitle from '@hooks/useTitle';
import { useParams } from 'react-router-dom';
import usePagination from '@common/Pagination/Hooks';
import Pagination from '@common/Pagination/Pagination';
import { SortOrder } from '@services/http/transcriptContradiction';
import { useDialogContext } from '@common/Dialog';
import useTranscriptsWithGroupsDropdown from '@hooks/useTranscriptsWithGroupsDropdown';

const StyledContradictionsPage = styled.div`
  .sub-header {
    padding-bottom: 15px;
    border-bottom: solid 1px ${colors.grey[12]};
    margin-bottom: 30px;
  }
  .dropdown-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 20px;
  }
  .sub-container {
    z-index: 5;
    transform: translateY(12px);
    display: flex;
    width: 70%;
    align-items: baseline;
    justify-content: flex-end;
  }
`;

export default function ContradictionsPage() {
  useTitle('Deposition Insight TM - Contradictions');

  const { dropdownLoading, dropdownError, dropdownOptions } =
    useDropdownOptions();

  const { id: paramId, type: paramType } = useParams<{
    id: string;
    type: 't' | 'g';
  }>();
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!initialized && dropdownOptions.transcripts.length === 1) {
      const [onlyTranscript] = dropdownOptions.transcripts;
      setSelectedTranscripts([onlyTranscript.value.toString()]);
      setInitialized(true);
    }
    if (!initialized && dropdownOptions.transcripts.length > 0 && paramId) {
      const matchingOptions = (
        paramType === 't' ? dropdownOptions.transcripts : dropdownOptions.groups
      ).filter(option =>
        paramId.split(',').includes(option.value.split(':')[0]),
      );

      if (matchingOptions) {
        const defaultValue = matchingOptions.map(o => o.value.toString());
        paramType === 't'
          ? setSelectedTranscripts(defaultValue)
          : setSelectedGroups(defaultValue);
        setInitialized(true);
      }
    }
  }, [dropdownOptions, paramId, initialized]);

  const {
    contradictions,
    contradictionsLoading,
    refreshContradictions,
    total,
    contradictionsError,
  } = useContradictions();

  const { removeContradiction, deletionLoading, deletionError } =
    useDeleteContradiction();

  const handleRefresh = () => {
    refreshContradictions(
      selectedTranscripts,
      {
        page,
        count: rowCount,
      },
      sortOrder,
    );
  };

  const handleDeletion = async (id: number) => {
    try {
      await removeContradiction(id);
      handleRefresh();
    } catch (e) {
      console.log(e);
    }
  };

  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const { selectedTranscripts, setSelectedTranscripts } =
    useTranscriptsWithGroupsDropdown(selectedGroups, 'contradictions');

  useEffect(() => {
    if (!selectedGroups.length) {
      window.history.replaceState(null, '', '/contradictions');
      return;
    }
    window.history.replaceState(
      null,
      '',
      `/contradictions/g/${selectedGroups.map(g => g.split(':')[0]).join(',')}`,
    );
  }, [selectedGroups]);

  const { page, rowCount, setPage, setRowCount } =
    usePagination(contradictions);

  const [sortOrder, setSortOrder] = useState<SortOrder>('score');

  useEffect(() => {
    handleRefresh();
  }, [selectedTranscripts, page, rowCount, sortOrder]);

  useEffect(() => setPage(1), [selectedTranscripts, selectedGroups]);

  const { closeDialog, sendMessage } = useDialogContext();

  useEffect(() => {
    !!deletionError
      ? sendMessage(
          `
            It seems there was an error deleting your anomaly. Our Team has been
            informed.
          `,
        )
      : closeDialog();
  }, [deletionError]);

  return (
    <StyledContradictionsPage>
      <HomeLink />
      <StyledH1>Contradictions</StyledH1>
      <p className="sub-header small-txt">
        Detect potential contradictions through comparisons of similar questions
        and dissimilar answers.
      </p>
      <div className="dropdown-container">
        <Dropdown
          id="transcript-contradictions-sort-input"
          label="Sort By"
          placeholder=""
          options={[
            { label: 'Contradiction Score', value: 'score' },
            { label: 'Chronological', value: 'chronological' },
          ]}
          secondary={true}
          selectedOption={sortOrder}
          setSelectedOption={setSortOrder as (value: string) => void}
        />
        <div className="sub-container">
          {dropdownLoading ? (
            <Spinner
              id="transcript-contradictions-dropdown-spinner"
              data-testid="dropdown-spinner"
            />
          ) : dropdownError ? (
            <span id="transcript-contradictions-options-error-msg">
              There seems to have been an error getting your options. Our staff
              has been notified.
            </span>
          ) : (
            <>
              <DropdownMultiple
                id="transcript-contradictions-dropdown-input"
                selectedOption={selectedTranscripts}
                setSelectedOption={setSelectedTranscripts}
                placeholder="Transcripts"
                options={dropdownOptions.transcripts}
              />
              <DropdownMultiple
                id="transcript-group-contradictions-dropdown-input"
                selectedOption={selectedGroups}
                setSelectedOption={setSelectedGroups}
                placeholder="Groups"
                options={dropdownOptions.groups}
              />
            </>
          )}
        </div>
      </div>

      {contradictions.length > 0 && (
        <Pagination
          rowCount={rowCount}
          currentPage={page}
          setRowCount={setRowCount}
          handlePageChange={setPage}
          totalPages={Math.ceil(total / rowCount)}
        />
      )}

      {contradictionsLoading || deletionLoading ? (
        <Spinner
          id="transcript-contradictions-data-spinner"
          data-testid="contradiction-spinner"
        />
      ) : contradictionsError ? (
        <span id="transcript-contradictions-error-msg">
          There seems to have been an error getting your contradictions. Our
          staff has been notified.
        </span>
      ) : dropdownOptions.transcripts.length === 0 &&
        dropdownOptions.groups.length === 0 &&
        !dropdownLoading ? (
        <StyledH3 id="transcript-contradictions-upload-msg">
          To view contradictions, please upload transcripts from the Home page.
        </StyledH3>
      ) : selectedGroups.length === 0 &&
        selectedTranscripts.length === 0 &&
        !dropdownLoading ? (
        <StyledH3 id="transcript-contradictions-select-msg">
          Please select a transcript from the menu above
        </StyledH3>
      ) : contradictions.length === 0 ? (
        <StyledH3 id="transcript-contradictions-empty-msg">
          There does not seem to be contradictions associated with those
          transcripts
        </StyledH3>
      ) : (
        contradictions.map(c => (
          <ContradictionCard
            handleDelete={() => handleDeletion(c.id)}
            contradiction={c}
            key={c.id}
          />
        ))
      )}
    </StyledContradictionsPage>
  );
}
