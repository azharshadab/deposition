import { FormEvent, useState } from 'react';
import { useForm } from '@hooks/useForm';
import { SecondaryStyledTextInput } from '@styles/inputs';
import { transcriptService } from '@services/http/transcripts';
import { Transcript } from '@interfaces/transcript';
import { StyledForm } from '@styles/form';
import { StyledPrimaryButton } from '@styles/buttons';
import { Spinner } from '@styles/spinner';
import styled from 'styled-components';

type FormData = {
  firstName: string;
  middleName: string;
  lastName: string;
  depositionDate: Date;
};

interface EditTranscriptFormProps {
  transcript: Transcript;
  onSubmit: () => void;
  setMessage: (msg: string) => void;
}

const StyledFileNameInput = styled.input`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:focus {
    text-overflow: clip; /* revert to default */
    overflow: auto; /* Allows scrolling */
  }
`;

export const EditTranscriptForm = ({
  transcript,
  onSubmit,
  setMessage,
}: EditTranscriptFormProps) => {
  const { formState, handleChange } = useForm<FormData>({
    firstName: transcript.FirstName || '',
    middleName: transcript.MiddleName || '',
    lastName: transcript.LastName,
    depositionDate:
      transcript.DepositionDate && transcript.DepositionDate !== 'None'
        ? new Date(transcript.DepositionDate)
        : new Date(),
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formState.firstName.trim()) {
      setMessage('First name is required!');
      return;
    }

    if (!formState.lastName.trim()) {
      setMessage('Last name is required!');
      return;
    }

    if (isNaN(formState.depositionDate.getTime())) {
      setMessage('Deposition date is required!');
      return;
    }
    setIsUpdating(true);
    try {
      await transcriptService.updateTranscript({
        FirstName: formState.firstName.trim(),
        LastName: formState.lastName.trim(),
        MiddleName: formState.middleName.trim(),
        depositiondate: formState.depositionDate,
        TranscriptId: transcript.id,
      });
      onSubmit();
      setMessage(`Transcripts Updated Successfully`);
    } catch (e) {
      console.error(e);
      setMessage(
        `There was an error updating your transcript. Please try again later.`,
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (isUpdating) return <Spinner />;

  return (
    <StyledForm
      method="dialog"
      onSubmit={handleSubmit}
      data-testid="update-transcript-form"
    >
      <SecondaryStyledTextInput htmlFor="transcript-edit-transcript-name-input">
        File Name:
        <StyledFileNameInput
          id="transcript-edit-transcript-name-input"
          type="text"
          name="transcript-name-input"
          readOnly
          value={transcript.transcript_name}
        />
      </SecondaryStyledTextInput>
      <SecondaryStyledTextInput htmlFor="transcript-edit-first-name-input">
        First Name:
        <input
          id="transcript-edit-first-name-input"
          type="text"
          name="firstName"
          value={formState.firstName}
          onChange={handleChange}
        />
      </SecondaryStyledTextInput>
      <SecondaryStyledTextInput htmlFor="transcript-edit-middle-name-input">
        Middle Name:
        <input
          id="transcript-edit-middle-name-input"
          type="text"
          name="middleName"
          value={formState.middleName}
          onChange={handleChange}
        />
      </SecondaryStyledTextInput>
      <SecondaryStyledTextInput htmlFor="transcript-edit-last-name-input">
        Last Name:
        <input
          id="transcript-edit-last-name-input"
          type="text"
          name="lastName"
          value={formState.lastName}
          onChange={handleChange}
        />
      </SecondaryStyledTextInput>
      <SecondaryStyledTextInput htmlFor="transcript-edit-date-input">
        Deposition Date:
        <input
          id="transcript-edit-date-input"
          type="date"
          name="depositionDate"
          value={
            formState.depositionDate &&
            !isNaN(formState.depositionDate?.getTime?.())
              ? new Date(formState.depositionDate)
                  .toISOString()
                  .substring(0, 10)
              : ''
          }
          onChange={handleChange}
        />
      </SecondaryStyledTextInput>
      <StyledPrimaryButton id="transcript-edit-submit-btn" type="submit">
        Submit
      </StyledPrimaryButton>
    </StyledForm>
  );
};
