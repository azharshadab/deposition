import Checkbox from '@common/CheckBox';
import { StyledRow } from '@styles/table';
import { useCallback } from 'react';
import { StyledTableButtons } from '@styles/buttons';
import { Link } from 'react-router-dom';
import Image from '@common/Image';
import { useDialogContext } from '@common/Dialog';
import { EditGroupForm } from './EditGroupForm';
import { Group } from '@interfaces/group';
import { useTranscriptGroupsContext } from '@hooks/useTranscriptGroups';
import JobButton from '@common/JobButton';

interface GroupTableRowProps {
  group: Group;
  onCheck?: (group: Group, isChecked: boolean) => void;
  isChecked: boolean;
}

export function GroupTableRow({
  group,
  onCheck,
  isChecked,
}: GroupTableRowProps) {
  const handleCheck = useCallback(() => {
    onCheck?.(group, !isChecked);
  }, [group, onCheck, isChecked]);

  const { refreshGroups } = useTranscriptGroupsContext();
  const { openDialog, closeDialog } = useDialogContext();

  const openEditGroupForm = () => {
    openDialog(
      <EditGroupForm
        group={group}
        onSubmit={() => {
          closeDialog();
          refreshGroups();
        }}
      />,
    );
  };

  return (
    <StyledRow
      className={isChecked ? 'checked' : ''}
      data-testid={`transcript-group-row-${group.groupId}`}
    >
      <td>
        <Checkbox
          onChange={handleCheck}
          checked={isChecked}
          data-testid={`checkbox-group`}
        />
        <span data-testid={`transcript-group-name`}>{group.groupName}</span>
      </td>
      <td>{group.createdOn.split(' ')[0]}</td>
      <td>
        <StyledTableButtons>
          <JobButton
            data-testid={`transcript-group-explorer-link`}
            jobType="Explorer"
            jobId={group.groupId}
            pathType="g"
            altText="explorer"
            normalImageUrl="/explorer_table_btn.svg"
            errorImageUrl="/explorer - error.svg"
          />
          <Link
            data-testid={`transcript-group-statistics-link`}
            to={`/statistics/g/${group.groupId}`}
          >
            <Image src="/statistics_table_btn.svg" alt="exlporer" />
            <span>Statistics</span>
          </Link>
          <JobButton
            data-testid={`transcript-group-contradictions-link`}
            jobType="Contradictions"
            jobId={group.groupId}
            pathType="g"
            altText="contradictions"
            normalImageUrl="/contradictions_table_btn.svg"
            errorImageUrl="/contradictions - error.svg"
          />
          <button
            data-testid={`transcript-group-edit-btn`}
            onClick={openEditGroupForm}
          >
            <Image src="/edit_table_btn.svg" alt="exlporer" />
            <span>Edit</span>
          </button>
        </StyledTableButtons>
      </td>
    </StyledRow>
  );
}
