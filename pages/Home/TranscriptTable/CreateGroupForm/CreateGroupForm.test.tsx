import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateGroupForm } from './CreateGroupForm';
import { transcriptGroupService } from '@services/http/transcriptGroups';
import { Transcript } from '@interfaces/transcript';
import { Wrapper } from 'wrapper';

jest.mock('@services/http/transcriptGroups', () => ({
  transcriptGroupService: {
    createTranscriptGroup: jest.fn(),
  },
}));

const transcripts = [
  { id: 1, transcript_name: 'test 1' },
  { id: 2, transcript_name: 'test 2' },
] as Partial<Transcript>[];

describe('CreateGroupForm', () => {
  const handleSubmit = jest.fn();

  beforeEach(() => {
    render(
      <Wrapper>
        <CreateGroupForm
          checkedTranscripts={transcripts as Transcript[]}
          onSubmit={handleSubmit}
        />
      </Wrapper>,
    );
  });

  it('calls createTranscriptGroup with selected transcripts when Submit button is clicked', async () => {
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'New Group' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));

    expect(transcriptGroupService.createTranscriptGroup).toHaveBeenCalledWith(
      transcripts.map(t => t.id),
      'New Group',
    );
  });

  it('disables submit button if name is empty', async () => {
    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toBeDisabled();

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'New Group' },
    });

    expect(button).not.toBeDisabled();

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '' },
    });

    expect(button).toBeDisabled();
  });

  it('displays a spinner while creating a group', async () => {
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'New Group' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
  });

  it('submits a duplicate group message when a group with the same name exists', async () => {
    (
      transcriptGroupService.createTranscriptGroup as jest.Mock
    ).mockResolvedValue({ error: 'duplicate' });

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Duplicate Group' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => new Promise(resolve => setTimeout(resolve, 0)));

    expect(handleSubmit).toHaveBeenCalledWith(
      'The group name you have selected already exists. Please choose another.',
    );
  });
});
