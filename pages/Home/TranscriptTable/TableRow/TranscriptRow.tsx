import Checkbox from '@common/CheckBox';
import { StyledRow } from '@styles/table';
import { Transcript } from '@interfaces/transcript';
import { HtmlHTMLAttributes, useCallback } from 'react';
import { EditTranscriptForm } from '../EditTranscriptForm/EditTranscriptForm';
import { StyledTableButtons } from '@styles/buttons';
import { Link } from 'react-router-dom';
import Image from '@common/Image';
import { useDialogContext } from '@common/Dialog';
import JobButton from '@common/JobButton';

interface TableRowProps extends HtmlHTMLAttributes<any> {
  transcript: Transcript;
  onCheck?: (transcript: Transcript, isChecked: boolean) => void;
  checked: boolean;
  refresh?: () => void;
}

export function TableRow({
  transcript,
  onCheck,
  checked,
  refresh,
  ...rest
}: TableRowProps) {
  const handleCheck = useCallback(() => {
    onCheck?.(transcript, !checked);
  }, [transcript, onCheck, checked]);
  const { openDialog, closeDialog, sendMessage } = useDialogContext();

  const openEditForm = () => {
    openDialog(
      <EditTranscriptForm
        onSubmit={() => {
          closeDialog();
          refresh?.();
        }}
        transcript={transcript}
        setMessage={sendMessage}
      />,
    );
  };

  return (
    <StyledRow
      className={checked ? 'checked' : ''}
      data-testid={`transcript-row-${transcript.id}`}
      {...rest}
    >
      <td>
        <Checkbox
          onChange={handleCheck}
          checked={checked}
          data-testid={`checkbox-transcript-${transcript.id}`}
        />
        <span data-testid={`transcript-row-witness-name`}>
          {transcript.LastName ? `${transcript.LastName}, ` : ''}
          {transcript.FirstName} {transcript.MiddleName}
        </span>
      </td>
      <td data-testid={`transcript-row-date`}>{transcript.DepositionDate}</td>
      <td>
        <StyledTableButtons>
          <JobButton
            data-testid={`transcript-row-explorer-link-${transcript.id}`}
            jobType="Explorer"
            jobId={transcript.job_ids.explorer}
            pathType="t"
            altText="explorer"
            normalImageUrl="/explorer_table_btn.svg"
            errorImageUrl="/explorer - error.svg"
          />
          <Link
            data-testid={`transcript-row-statistics-link-${transcript.id}`}
            to={`/statistics/t/${transcript.id}`}
          >
            <Image src="/statistics_table_btn.svg" alt="statistics" />
            <span>Statistics</span>
          </Link>
          <JobButton
            data-testid={`transcript-row-summary-link-${transcript.id}`}
            jobType="Summary"
            jobId={transcript.job_ids.summary}
            altText="Summary"
            normalImageUrl="/summary_table_btn.svg"
            errorImageUrl="/statistics - error.svg"
          />
          <JobButton
            data-testid={`transcript-row-contradictions-link-${transcript.id}`}
            jobType="Contradictions"
            jobId={transcript.job_ids.contradiction}
            pathType="t"
            altText="contradictions"
            normalImageUrl="/contradictions_table_btn.svg"
            errorImageUrl="/contradictions - error.svg"
          />
          <button
            data-testid={`transcript-row-edit-btn-${transcript.id}`}
            onClick={openEditForm}
          >
            <Image src="/edit_table_btn.svg" alt="exlporer" />
            <span>Edit</span>
          </button>
        </StyledTableButtons>
      </td>
    </StyledRow>
  );
}
