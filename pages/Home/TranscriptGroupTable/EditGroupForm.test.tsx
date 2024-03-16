import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EditGroupForm } from './EditGroupForm';
import { transcriptGroupService } from '@services/http/transcriptGroups';
import { Group } from '@interfaces/group';
import { transcriptService } from '@services/http/transcripts';

jest.mock('@services/http/transcriptGroups');
jest.mock('@services/http/transcripts');

const mockMessage = jest.fn();
jest.mock('@common/Dialog', () => ({
  useDialogContext: () => ({ sendMessage: mockMessage, closeDialog: () => {} }),
}));

describe('EditGroupForm', () => {
  const mockGroup: Group = {
    groupId: 1,
    groupName: 'Test Group',
    createdOn: '',
    transcripts: [
      { witnessName: 'any', id: 1 },
      { witnessName: 'anything', id: 2 },
    ],
  };
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    render(<EditGroupForm group={mockGroup} onSubmit={mockOnSubmit} />);
  });

  it('renders with initial group name', () => {
    expect(screen.getByDisplayValue(mockGroup.groupName)).toBeInTheDocument();
  });

  it('calls updateGroup on form submission', async () => {
    const newGroupName = 'Updated Group Name';
    (transcriptGroupService.updateGroup as jest.Mock).mockResolvedValueOnce(
      'Success',
    );
    fireEvent.change(screen.getByDisplayValue(mockGroup.groupName), {
      target: { value: newGroupName },
    });
    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(transcriptGroupService.updateGroup).toHaveBeenCalledWith(
        mockGroup.groupId,
        newGroupName,
      );
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockMessage).toHaveBeenCalledWith(
        'The group update was successful.',
      );
    });
  });

  it('displays error message on update failure', async () => {
    (transcriptGroupService.updateGroup as jest.Mock).mockRejectedValueOnce(
      new Error('Update failed'),
    );
    fireEvent.change(screen.getByDisplayValue(mockGroup.groupName), {
      target: { value: 'New Name' },
    });
    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(mockMessage).toHaveBeenCalledWith('Failed to update group.');
    });
  });

  it('displays duplicate group name message on duplicate group name', async () => {
    const newGroupName = 'Duplicate Group Name';
    const duplicateMessage =
      'A group with the same name already exists for this user.';
    (transcriptGroupService.updateGroup as jest.Mock).mockResolvedValueOnce(
      duplicateMessage,
    );

    fireEvent.change(screen.getByDisplayValue(mockGroup.groupName), {
      target: { value: newGroupName },
    });
    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(transcriptGroupService.updateGroup).toHaveBeenCalledWith(
        mockGroup.groupId,
        newGroupName,
      );
      expect(mockMessage).toHaveBeenLastCalledWith(
        'The group name you have selected already exists. Please choose another.',
      );
    });
  });
  it('renders transcripts correctly and allows marking them for deletion', async () => {
    const [witnessName] = screen.getAllByTestId(
      'group-transcript-witness-name',
    );
    expect(witnessName).toHaveTextContent(mockGroup.transcripts[0].witnessName);

    const [deleteButton] = screen.getAllByTestId('group-transcript-delete-btn');
    expect(deleteButton).toHaveTextContent('Remove');

    fireEvent.click(deleteButton);

    const [undoButton] = await screen.findAllByTestId(
      'group-transcript-undo-delete-btn',
    );
    expect(undoButton).toHaveTextContent('Undo');

    fireEvent.click(undoButton);

    const [deleteButtonAfterUndo] = await screen.findAllByTestId(
      'group-transcript-delete-btn',
    );
    expect(deleteButtonAfterUndo).toHaveTextContent('Remove');
  });
  it('calls deleteManyTranscriptGroups when all transcripts are marked for deletion', async () => {
    const deleteButtons = await screen.findAllByTestId(
      'group-transcript-delete-btn',
    );
    deleteButtons.forEach(btn => {
      fireEvent.click(btn);
    });

    fireEvent.click(await screen.findByText('Update'));

    await waitFor(() => {
      expect(
        transcriptGroupService.deleteManyTranscriptGroups,
      ).toHaveBeenCalledWith([mockGroup.groupId]);
    });
  });

  it('calls deleteManyTranscripts when some transcripts are marked for deletion', async () => {
    const deleteButton = screen.getAllByTestId(
      'group-transcript-delete-btn',
    )[0];
    fireEvent.click(deleteButton);

    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(transcriptService.deleteManyTranscripts).toHaveBeenCalledWith([
        mockGroup.transcripts[0].id,
      ]);
    });
  });
});
