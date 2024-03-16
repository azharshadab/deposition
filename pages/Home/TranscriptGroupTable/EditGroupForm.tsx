import { FormEvent, useCallback, useMemo, useState } from 'react';
import { transcriptGroupService } from '@services/http/transcriptGroups';
import { Group } from '@interfaces/group';
import { StyledForm } from '@styles/form';
import { SecondaryStyledTextInput } from '@styles/inputs';
import { StyledPrimaryButton, StyledSecondaryButton } from '@styles/buttons';
import { useForm } from '@hooks/useForm';
import { Spinner } from '@styles/spinner';
import styled from 'styled-components';
import { colors } from '@styles/colors';
import { useDialogContext } from '@common/Dialog';
import { transcriptService } from '@services/http/transcripts';

interface EditGroupFormProps {
  group: Group;
  onSubmit: () => void;
}
type FormData = {
  groupName: string;
};
const StyledList = styled.ul`
  display: flex;
  align-items: center;
  flex-direction: column;
  max-height: 250px;
  overflow-y: auto;
  li {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 10px;
    border: ${colors.grey[150]} solid 1px;
    border-bottom: none;
    width: 100%;
    &:last-of-type {
      border: ${colors.grey[150]} solid 1px;
    }
    button {
      font-size: 14px;
      margin: 5px 10px;
    }
    span {
      font-size: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export const EditGroupForm = ({ group, onSubmit }: EditGroupFormProps) => {
  const [loading, setLoading] = useState(false);

  const { sendMessage } = useDialogContext();
  const { formState, handleChange } = useForm<FormData>({
    groupName: group.groupName,
  });
  const [markedForDeletion, setMarkedForDeletion] = useState<number[]>([]);

  const deletingAllTranscript = useMemo(
    () => markedForDeletion.length === group.transcripts.length,
    [markedForDeletion, group],
  );
  const handleGroupNameExistsError = (message: string) => {
    if (
      message === 'A group with the same name already exists for this user.'
    ) {
      sendMessage(
        'The group name you have selected already exists. Please choose another.',
      );
      return true;
    }
    return false;
  };

  const deleteAllTranscripts = async () => {
    await transcriptGroupService.deleteManyTranscriptGroups([group.groupId]);
  };

  const updateGroupAndDeleteTranscripts = async () => {
    if (formState.groupName !== group.groupName) {
      const message = await transcriptGroupService.updateGroup(
        group.groupId,
        formState.groupName,
      );
      if (handleGroupNameExistsError(message)) {
        return 'duplicate error';
      }
    }
    if (markedForDeletion.length > 0) {
      await transcriptService.deleteManyTranscripts(markedForDeletion);
    }
  };

  const handleSubmit = async () => {
    if (!formState.groupName.trim()) {
      sendMessage('Group name is required!');
      return;
    }
    setLoading(true);
    try {
      if (deletingAllTranscript) {
        await deleteAllTranscripts();
      } else {
        const res = await updateGroupAndDeleteTranscripts();
        if (res === 'duplicate error') return;
      }
      onSubmit();
      sendMessage('The group update was successful.');
    } catch (e) {
      sendMessage('Failed to update group.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setMarkedForDeletion(prev => [...prev, id]);
  };

  const handleUndo = (id: number) => {
    setMarkedForDeletion(prev =>
      prev.filter(transcriptId => transcriptId !== id),
    );
  };

  if (loading) return <Spinner data-testid="spinner" />;

  return (
    <StyledForm>
      <SecondaryStyledTextInput>
        Group Name:
        <input
          id="transcript-group-name-input"
          type="text"
          name="groupName"
          value={formState.groupName}
          onChange={handleChange}
        />
      </SecondaryStyledTextInput>
      <StyledList>
        {group.transcripts.map(transcript => (
          <li key={transcript.id}>
            <span
              data-testid="group-transcript-witness-name"
              style={{
                textDecoration: markedForDeletion.includes(transcript.id)
                  ? 'line-through'
                  : '',
              }}
            >
              {transcript.witnessName}
            </span>
            {markedForDeletion.includes(transcript.id) ? (
              <StyledPrimaryButton
                data-testid="group-transcript-undo-delete-btn"
                onClick={() => handleUndo(transcript.id)}
              >
                Undo
              </StyledPrimaryButton>
            ) : (
              <StyledSecondaryButton
                data-testid="group-transcript-delete-btn"
                onClick={() => handleDelete(transcript.id)}
              >
                Remove
              </StyledSecondaryButton>
            )}
          </li>
        ))}
      </StyledList>
      {deletingAllTranscript && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Warning: Deleting all transcripts will result in the deletion of the
          group itself.
        </div>
      )}
      <StyledPrimaryButton
        id="transcript-group-submit-btn"
        type="submit"
        disabled={!formState.groupName.trim()}
        onClick={handleSubmit}
      >
        Update
      </StyledPrimaryButton>
    </StyledForm>
  );
};
