import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TranscriptGroupTable } from './TranscriptGroupTable';
import { TranscriptGroupsProvider } from '@hooks/useTranscriptGroups';
import { Wrapper } from 'wrapper';
import { transcriptGroupService } from '@services/http/transcriptGroups';
import { Group } from '@interfaces/group';
import { PropsWithChildren } from 'react';

jest.mock('@services/http/transcriptGroups', () => ({
  transcriptGroupService: {
    deleteManyTranscriptGroups: jest.fn(),
    getTranscriptGroups: jest.fn(),
  },
}));

const mockMessage = jest.fn();
jest.mock('@common/Dialog', () => ({
  DialogProvider: ({ children }: PropsWithChildren) => <>{children}</>,
  useDialogContext: () => ({ sendMessage: mockMessage, closeDialog: () => {} }),
}));

const mockedTranscriptService = transcriptGroupService as jest.Mocked<
  typeof transcriptGroupService
>;

describe('TranscriptGroupTable', () => {
  const testGroups: Group[] = [
    {
      groupName: 'Group A',
      groupId: 1,
      createdOn: '2023-11-16 17:55:40.000',
      transcripts: [],
    },
    {
      groupName: 'Group B',
      groupId: 2,
      createdOn: '2023-11-17 17:31:00.000',
      transcripts: [],
    },
    {
      groupName: 'Group C',
      groupId: 3,
      createdOn: '2023-11-18 17:28:42.000',
      transcripts: [],
    },
  ];

  beforeEach(async () => {
    mockedTranscriptService.getTranscriptGroups
      .mockClear()
      .mockResolvedValue(testGroups);

    render(
      <Wrapper>
        <TranscriptGroupsProvider>
          <TranscriptGroupTable />
        </TranscriptGroupsProvider>
      </Wrapper>,
    );
    await waitFor(() =>
      expect(mockedTranscriptService.getTranscriptGroups).toHaveBeenCalled(),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders a GroupTableRow for each group returned from the transcriptService', async () => {
    testGroups.forEach(async group => {
      expect(await screen.findByText(group.groupName)).toBeInTheDocument();
    });
  });

  it('renders only the groups that match the search term', async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), {
      target: { value: testGroups[0].groupName },
    });

    await waitFor(() => {
      expect(screen.getByText(testGroups[0].groupName)).toBeInTheDocument();
      expect(
        screen.queryByText(testGroups[1].groupName),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(testGroups[2].groupName),
      ).not.toBeInTheDocument();
    });
  });

  it('sorts groups alphabetically by group name when the sort button is clicked', async () => {
    const groupNameBtn = await screen.findByText('Group Name');
    fireEvent.click(groupNameBtn);
    await waitFor(async () => {
      const rows = await screen.findAllByTestId('transcript-group-name');
      expect(rows[0]).toHaveTextContent(/Group A/);
      expect(rows[1]).toHaveTextContent(/Group B/);
      expect(rows[2]).toHaveTextContent(/Group C/);
    });
    fireEvent.click(groupNameBtn);
    await waitFor(async () => {
      const rows = await screen.findAllByTestId('transcript-group-name');
      expect(rows[0]).toHaveTextContent(/Group C/);
      expect(rows[1]).toHaveTextContent(/Group B/);
      expect(rows[2]).toHaveTextContent(/Group A/);
    });
  });

  it('sorts groups chronologically by created on date when the sort button is clicked', async () => {
    const createdOnBtn = await screen.findByText('Created On');

    fireEvent.click(createdOnBtn);
    await waitFor(() => {
      const rows = screen.getAllByTestId('transcript-group-name');
      expect(rows[0]).toHaveTextContent(/Group A/);
      expect(rows[1]).toHaveTextContent(/Group B/);
      expect(rows[2]).toHaveTextContent(/Group C/);
    });
    fireEvent.click(createdOnBtn);
    await waitFor(() => {
      const rows = screen.getAllByTestId('transcript-group-name');
      expect(rows[0]).toHaveTextContent(/Group C/); // Assuming Group C is the latest
      expect(rows[1]).toHaveTextContent(/Group B/);
      expect(rows[2]).toHaveTextContent(/Group A/);
    });
  });

  describe('Deleting Groups', () => {
    beforeEach(async () => {
      const checkboxes = await screen.findAllByTestId('checkbox-group');
      fireEvent.click(checkboxes[0]);
      fireEvent.click(checkboxes[1]);
    });

    const deleteGroups = () =>
      fireEvent.click(screen.getByTestId('delete-groups-button'));

    it('calls deleteManyTranscriptGroups when the delete button is clicked', async () => {
      deleteGroups();
      await waitFor(() => {
        expect(
          mockedTranscriptService.deleteManyTranscriptGroups,
        ).toHaveBeenCalledWith([testGroups[0].groupId, testGroups[1].groupId]);
      });
    });

    it('shows success alert when deletion is successful', async () => {
      mockedTranscriptService.deleteManyTranscriptGroups.mockResolvedValue([]);
      deleteGroups();

      await waitFor(() => {
        expect(mockMessage).toHaveBeenCalledWith(
          'Transcript Groups have successfully been deleted',
        );
      });
    });

    it('shows error alert when deletion fails', async () => {
      const error = 'Sample error message';
      mockedTranscriptService.deleteManyTranscriptGroups.mockRejectedValueOnce(
        new Error(error),
      );
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      deleteGroups();

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          `There was a problem deleting your groups. Please try again.`,
        );
      });
    });

    it('re-calls getTranscriptGroups after successful deletion', async () => {
      mockedTranscriptService.deleteManyTranscriptGroups.mockResolvedValue([]);
      deleteGroups();

      await waitFor(() => {
        expect(mockedTranscriptService.getTranscriptGroups).toHaveBeenCalled();
      });
    });
  });
});
