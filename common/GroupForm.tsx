import { FormEvent, ReactNode } from 'react';
import { SecondaryStyledTextInput } from '@styles/inputs';
import { StyledForm } from '@styles/form';
import { StyledPrimaryButton } from '@styles/buttons';
import { useForm } from '@hooks/useForm';
import { Spinner } from '@styles/spinner';

type FormData = {
  groupName: string;
};

interface GroupFormProps {
  submitHandler: (data: FormData) => void;
  loading: boolean;
  initialData?: FormData;
  buttonText: ReactNode;
}

export const GroupForm = ({
  submitHandler,
  loading,
  initialData = { groupName: '' },
  buttonText,
}: GroupFormProps) => {
  const { formState, handleChange } = useForm<FormData>(initialData);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formState.groupName.trim()) {
      alert('Group name is required!');
      return;
    }
    submitHandler(formState);
  };

  if (loading) return <Spinner data-testid="spinner" />;

  return (
    <StyledForm method="dialog" onSubmit={handleSubmit}>
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
      <StyledPrimaryButton
        id="transcript-group-submit-btn"
        type="submit"
        disabled={!formState.groupName.trim()}
      >
        {buttonText}
      </StyledPrimaryButton>
    </StyledForm>
  );
};
