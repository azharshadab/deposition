import { useCallback, useState } from 'react';
import { Transcript } from '@interfaces/transcript';
import { transcriptGroupService } from '@services/http/transcriptGroups';
import { GroupForm } from '@common/GroupForm';
import { useDialogContext } from '@common/Dialog';

interface CreateGroupFormProps {
  checkedTranscripts: Transcript[];
  onSubmit: (msg: string) => void;
}

export const CreateGroupForm = ({
  checkedTranscripts,
  onSubmit,
}: CreateGroupFormProps) => {
  const [loading, setLoading] = useState(false);

  const { closeDialog } = useDialogContext();
  const submitHandler = useCallback(
    async (data: { groupName: string }) => {
      setLoading(true);
      try {
        const result = await transcriptGroupService.createTranscriptGroup(
          checkedTranscripts.map(t => t.id),
          data.groupName.trim(),
        );
        if (result?.error === 'duplicate') {
          onSubmit(
            `The group name you have selected already exists. Please choose another.`,
          );
          return;
        }
        closeDialog();
        onSubmit(`The group ${data.groupName} was created successfully.`);
      } catch (e) {
        onSubmit('Failed to create group.');
      } finally {
        setLoading(false);
      }
    },
    [checkedTranscripts, onSubmit],
  );

  return (
    <GroupForm
      data-testid="create-transcript-group-form"
      submitHandler={submitHandler}
      loading={loading}
      buttonText="Submit"
    />
  );
};
