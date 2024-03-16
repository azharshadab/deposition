
import { useDialogContext } from '@common/Dialog';
import SearchBar from '@common/SearchBar';
import Table from '@common/Table';
import { StyledPrimaryButton, StyledSecondaryButton } from '@styles/buttons';
import { TableRow } from './TableRow/TranscriptRow';
import Pagination from '@common/Pagination/Pagination';
import { useCheckedTranscripts, useSort } from './Hooks';
import { UploadTranscriptForm } from './UploadFilesForm/UploadTranscriptsForm';
import { useTranscriptsContext } from '@hooks/useTranscripts';
import { CreateGroupForm } from './CreateGroupForm/CreateGroupForm';
import { useTranscriptGroupsContext } from '@hooks/useTranscriptGroups';
import { transcriptService } from '@services/http/transcripts';
import { Spinner } from '@styles/spinner';
import { useEffect, useRef, useState } from 'react';
import Image from '@common/Image';
import { StyledH3 } from '@styles/header';
import usePagination from '@common/Pagination/Hooks';
import { EditTranscriptForm } from './EditTranscriptForm/EditTranscriptForm';
import SortButton from '@common/SortButton';
import Checkbox from '@common/CheckBox';
import { StyledTableHead } from '@styles/table';

const PAGE_LENGTH = 10;
const TRANSCRIPT_EDIT_SHOWN_KEY = 'transcriptEditShown';

export function TranscriptTable() {
  const { transcripts, isLoading, refreshTranscripts, error } = useTranscriptsContext();
  const { openDialog, closeDialog, sendMessage } = useDialogContext();

  const [displayedTranscripts, setDisplayedTranscripts] = useState(() => {
    const storedData = localStorage.getItem(TRANSCRIPT_EDIT_SHOWN_KEY);
    return storedData ? new Set(JSON.parse(storedData)) : new Set();
  });

  useEffect(() => {
    transcripts.data.forEach(t => {
      const FullName = t.FirstName + ' ' + t.LastName;
      if (((FullName === 'THE WITNESS' && t.MiddleName === '') || FullName.trim() === 'N/A') && 
          !displayedTranscripts.has(t.id)) {
        openDialog(
          <EditTranscriptForm
            transcript={t}
            onSubmit={() => {
              closeDialog();
              refreshTranscripts(); 
            }}
            setMessage={sendMessage}
          />,
        );
        setDisplayedTranscripts(prev => {
          const newSet = new Set(prev).add(t.id);
          localStorage.setItem(TRANSCRIPT_EDIT_SHOWN_KEY, JSON.stringify([...newSet]));
          return newSet;
        });
      }
    });
  }, [transcripts]);

  const { refreshGroups } = useTranscriptGroupsContext();

  const { page, setPage, rowCount, setRowCount } = usePagination(transcripts.data);

  const [witnessName, setWitnessName] = useState('');
  const prevWitnessNameRef = useRef<String>('');

  const { sortField, sortOrder, toggleSortFieldAndOrder } = useSort();

  const refreshTranscriptsWithPagination = () => {
    refreshTranscripts({
      page,
      count: rowCount,
      sortField,
      sortOrder,
      witnessName: witnessName.trim().length >= 3 ? witnessName : undefined,
    });
  };

  const {
    checkedTranscripts,
    handleCheck,
    resetCheckedTranscripts,
    toggleAllTranscripts,
    areTranscriptsSelected,
  } = useCheckedTranscripts();

  const [isDeleting, setIsDeleting] = useState(false);

  const deleteCheckedTranscripts = async () => {
    try {
      const transcriptNames = checkedTranscripts
        .map(t => t.transcript_name)
        .join(', ');
      const confirmed = window.confirm(
        `Delete the Transcript(s) of ${transcriptNames}? Click to Confirm.`,
      );
      if (!confirmed) return;
      setIsDeleting(true);
      await transcriptService.deleteManyTranscripts(
        checkedTranscripts.map(t => t.id),
      );
      setIsDeleting(false);
      if (checkedTranscripts.length === transcripts.data.length) {
        setPage(1);
      }
      resetCheckedTranscripts();
      sendMessage(`Transcripts have successfully been deleted`);
      refreshTranscriptsWithPagination();
    } catch (error) {
      console.error(error);
      sendMessage(
        `There was a problem deleting your transcripts. Please try again.`,
      );
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    refreshTranscriptsWithPagination();
  }, [rowCount, page]);

  useEffect(() => {
    const isAbove3 = witnessName.trim().length >= 3;
    const wasPreviouslyAbove3 = prevWitnessNameRef.current.trim().length >= 3;
    if (isAbove3 || (witnessName.trim().length <= 3 && wasPreviouslyAbove3)) {
      setPage(1);
      refreshTranscriptsWithPagination();
    }
    prevWitnessNameRef.current = witnessName;
  }, [witnessName]);

  useEffect(() => {
    setPage(1);
    refreshTranscriptsWithPagination();
  }, [sortField, sortOrder]);

  if (isDeleting) return <Spinner data-testid="spinner" />;

  const openCreateGroupForm = () => {
    openDialog(
      <CreateGroupForm
        onSubmit={(msg: string) => {
          resetCheckedTranscripts();
          sendMessage(msg);
          refreshGroups();
        }}
        checkedTranscripts={checkedTranscripts}
      />,
    );
  };

  const openUploadTranscriptForm = () => {
    openDialog(
      <UploadTranscriptForm
        onSubmit={() => {
          setPage(1);
          toggleSortFieldAndOrder();
          refreshTranscriptsWithPagination();
        }}
      />,
    );
  };

  return (
    <>
      <div className="input-container">
        <SearchBar
          id="transcript-witness-search"
          onSearch={setWitnessName}
          placeholder="Search for Deponent Name"
          label=""
        />
        <div className="btn-container">
          <StyledPrimaryButton
            id="transcript-delete-btn"
            disabled={checkedTranscripts.length === 0}
            onClick={deleteCheckedTranscripts}
            data-testid="delete-transcript-button"
          >
            Delete Transcripts
          </StyledPrimaryButton>
          <StyledPrimaryButton
            id="transcript-group-create-btn"
            disabled={checkedTranscripts.length === 0}
            onClick={openCreateGroupForm}
            data-testid="create-group-button"
          >
            Create Group
          </StyledPrimaryButton>
          <StyledSecondaryButton
            id="transcript-upload-btn"
            onClick={openUploadTranscriptForm}
          >
            Upload
            <Image
              style={{ width: '16px', height: '16px' }}
              src="/upload.svg"
            />
          </StyledSecondaryButton>
        </div>
      </div>
      {transcripts.count > PAGE_LENGTH && (
        <Pagination
          id="transcript-pagination"
          currentPage={page}
          totalPages={Math.ceil(transcripts.count / rowCount)}
          handlePageChange={setPage}
          rowCount={rowCount}
          setRowCount={setRowCount}
        />
      )}
      {isLoading ? (
        <Spinner id="transcript-table-spinner" />
      ) : (
        <>
          <Table
            style={{
              borderLeft: 'none',
              borderRight: 'none',
            }}
            headers={[
              <StyledTableHead>
                <Checkbox
                  checked={areTranscriptsSelected(transcripts.data)}
                  onChange={() => toggleAllTranscripts(transcripts.data)}
                />
                <SortButton
                  id="transcript-name-sort-btn"
                  onClick={() => toggleSortFieldAndOrder('witness_name')}
                  sortOrder={
                    sortField === 'witness_name' ? sortOrder : undefined
                  }
                >
                  Witness Name
                </SortButton>
              </StyledTableHead>,
              <th>
                <SortButton
                  id="transcript-date-sort-btn"
                  onClick={() => toggleSortFieldAndOrder('deposition_date')}
                  sortOrder={
                    sortField === 'deposition_date' ? sortOrder : undefined
                  }
                >
                  Deposition Date
                </SortButton>
              </th>,
              <th>Actions</th>,
            ]}
            rows={transcripts.data.map(transcript => (
              <TableRow
                checked={!!checkedTranscripts.find(t => t.id === transcript.id)}
                key={transcript.id}
                transcript={transcript}
                onCheck={handleCheck}
                refresh={refreshTranscriptsWithPagination}
                style={{
                  border: 'none',
                }}
              />
            ))}
          />
          {transcripts.data.length === 0 && (
            <StyledH3
              id="transcript-generic-message"
              style={{ textAlign: 'center' }}
            >
              {error ? (
                `There was an error getting your transcript. Please try again later.`
              ) : witnessName.length > 0 ? (
                'There is no matching text for your search'
              ) : (
                <>
                  Click the <i>Upload</i> Transcript button to upload
                  transcripts.
                </>
              )}
            </StyledH3>
          )}
        </>
      )}
    </>
  );
}
