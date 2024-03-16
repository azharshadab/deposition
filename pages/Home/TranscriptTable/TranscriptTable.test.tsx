import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { transcriptService } from '@services/http/transcripts';
import { Wrapper } from 'wrapper';
import { TranscriptTable } from './TranscriptTable';
import { Transcript } from '@interfaces/transcript';
import { TranscriptsProvider } from '@hooks/useTranscripts';

const mockTranscripts = [
  {
    id: 1,
    transcript_name: 'SisteAngela.d20200309-u133240.txt',
    size: '0.3 Mb',
    mod_on: '2023-05-29 15:10:20',
    ClusteringStatus: 'Failed',
    ContradictionStatus: 'Completed',
    no_of_que: '1011',
    anomalies_stat: 'Failed',
    job_ids: {
      contradiction: 63,
      explorer: 65,
      summary: '284c79b3-da2e-473a-9950-7af280c9a1e2',
    },
    start_date: '',
    end_date: '',
    DepositionDate: 'None',
    MiddleName: null,
    FirstName: 'John',
    LastName: 'Doe',
  },
  {
    id: 2,
    transcript_name:
      'Ignacio v. Consigli Construction Co. - 11-21-19 - Nicole Ignacio - FINAL.d20191204-u204912.txt',
    size: '0.3 Mb',
    mod_on: '2023-05-29 15:10:20',
    ClusteringStatus: 'Failed',
    ContradictionStatus: 'Completed',
    no_of_que: '1011',
    anomalies_stat: 'Failed',
    job_ids: {
      contradiction: 63,
      explorer: 65,
      summary: '284c79b3-da2e-473a-9950-7af280c9a1e2',
    },
    start_date: '',
    end_date: '',
    DepositionDate: 'None',
    MiddleName: null,
    FirstName: 'Jain',
    LastName: 'Robinson',
  },
];

const renderTranscriptTable = async (
  transcripts: Transcript[],
  count: number,
) => {
  (transcriptService.getUserTranscripts as jest.Mock).mockResolvedValue({
    data: transcripts,
    count,
  });
  render(
    <Wrapper>
      <TranscriptsProvider>
        <TranscriptTable />
      </TranscriptsProvider>
    </Wrapper>,
  );
  await waitFor(() =>
    expect(transcriptService.getUserTranscripts).toHaveBeenCalled(),
  );
};

jest.mock('@services/http/transcripts', () => ({
  transcriptService: {
    getUserTranscripts: jest.fn(),
    deleteManyTranscripts: jest.fn(),
  },
}));

describe('TranscriptTable', () => {
  beforeEach(async () => {
    await renderTranscriptTable(mockTranscripts, 20);
  });

  it('renders a row for each transcript', async () => {
    mockTranscripts.forEach(async transcript => {
      expect(
        await screen.findByTestId(`transcript-row-${transcript.id}`),
      ).toBeInTheDocument();
    });
  });

  describe('Searching and Sorting', () => {
    const updateWitnessInput = (name: string) => {
      const witnessNameInput = screen.getByPlaceholderText(
        'Search for Deponent Name',
      );
      fireEvent.change(witnessNameInput, {
        target: { value: name },
      });
    };

    it(`
      Scenario: I search for transcripts that have a specific witness name
      Given I navigate to the Home Page
      When I enter a name into the input 
      Then a call will be made with that name  
    `, async () => {
      updateWitnessInput('John');

      await waitFor(() =>
        expect(transcriptService.getUserTranscripts).toHaveBeenCalledWith(
          expect.objectContaining({
            witnessName: 'John',
          }),
        ),
      );
    });
    it(`
      Scenario: I search for transcripts that have a specific witness name while on the 2nd page
      Given I navigate to the Home Page
      And click the next page button
      When I enter a name into the input
      Then a call will be made with that name
      And the page will be set to 1
    `, async () => {
      fireEvent.click(await screen.findByTestId('pagination-next'));
      updateWitnessInput('John');

      await waitFor(() =>
        expect(transcriptService.getUserTranscripts).toHaveBeenCalledWith(
          expect.objectContaining({
            witnessName: 'John',
            page: 1,
          }),
        ),
      );
    });

    it(`
      Scenario: I sort the transcripts based on Witness name 
      Given I navigate to the Home Page
      When I click the witness name button
      Then a call will be made for transcripts sorted by witness name alphabetically
      And the witness name button will have an up arrow
    `, async () => {
      const witnessNameButton = await screen.findByText(/Witness Name/);

      fireEvent.click(witnessNameButton);
      await waitFor(() =>
        expect(transcriptService.getUserTranscripts).toHaveBeenCalledWith(
          expect.objectContaining({
            sortField: 'witness_name',
            sortOrder: 'desc',
          }),
        ),
      );
    });

    it(`
      Scenario: I sort the transcripts based on Deposition Date
      Given I navigate to the Home Page
      When I click the Deposition Date button
      Then a call will be made for transcripts sorted by Deposition Date chronologically
    `, async () => {
      const depostionDateButton = await screen.findByText(/Deposition Date/);

      fireEvent.click(depostionDateButton);
      await waitFor(() =>
        expect(transcriptService.getUserTranscripts).toHaveBeenCalledWith(
          expect.objectContaining({
            sortField: 'deposition_date',
            sortOrder: 'desc',
          }),
        ),
      );
    });
    it(`
      Scenario: I sort the transcripts based on Deposition Date in reverse order
      Given I sort the transcripts based on Deposition Date
      When I click the Deposition Date button
      Then a call will be made for transcripts sorted by Deposition Date reverse chronologically 
    `, async () => {
      let depostionDateButton = await screen.findByText(/Deposition Date/);

      fireEvent.click(depostionDateButton);
      depostionDateButton = await screen.findByText(/Deposition Date/);
      fireEvent.click(depostionDateButton);
      await waitFor(() =>
        expect(transcriptService.getUserTranscripts).toHaveBeenCalledWith(
          expect.objectContaining({
            sortField: 'deposition_date',
            sortOrder: 'asc',
          }),
        ),
      );
    });

    it(`
      Scenario: I sort the transcripts based on Witness name (again)
      Given I navigate to the Home Page
      When I click the witness name button
      Then a call will be made for transcripts sorted by witness name reverse alphabetically
    `, async () => {
      let witnessNameButton = await screen.findByText(/Witness Name/);

      fireEvent.click(witnessNameButton);
      witnessNameButton = await screen.findByText(/Witness Name/);
      fireEvent.click(witnessNameButton);

      await waitFor(() =>
        expect(transcriptService.getUserTranscripts).toHaveBeenCalledWith(
          expect.objectContaining({
            sortField: 'witness_name',
            sortOrder: 'asc',
          }),
        ),
      );
    });
  });
  async function checkButtonIsDisabled(
    buttonId: string,
    shouldBeDisabled: boolean,
  ): Promise<void> {
    const button = await screen.findByTestId(buttonId);
    if (shouldBeDisabled) {
      expect(button).toBeDisabled();
    } else {
      expect(button).not.toBeDisabled();
    }
  }
  async function selectTranscript(transcriptId: number): Promise<void> {
    const checkboxId = `checkbox-transcript-${transcriptId}`;
    const checkbox = await screen.findByTestId(checkboxId);
    fireEvent.click(checkbox);
  }

  describe('Creating a Group', () => {
    it('should disable the "Create Group" button when no transcripts are selected', async () => {
      await checkButtonIsDisabled('create-group-button', true);
    });

    it('should enable the "Create Group" button when a transcript is selected', async () => {
      await selectTranscript(1);
      await checkButtonIsDisabled('create-group-button', false);
    });
  });

  describe('Deleting Transcripts', () => {
    it('should disable the "Delete Transcript" button when no transcripts are selected', async () => {
      await checkButtonIsDisabled('delete-transcript-button', true);
    });

    it('should enable the "Delete Transcript" button when a transcript is selected', async () => {
      await selectTranscript(1);
      await checkButtonIsDisabled('delete-transcript-button', false);
    });

    it('calls deleteManyTranscripts with all checked transcripts when the Delete Transcripts button is clicked and user confirms the deletion', async () => {
      await selectTranscript(1);
      await selectTranscript(2);

      const deleteTranscriptButton = await screen.findByTestId(
        'delete-transcript-button',
      );

      jest.spyOn(window, 'confirm').mockReturnValue(true);

      fireEvent.click(deleteTranscriptButton);

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalled();
        expect(transcriptService.deleteManyTranscripts).toHaveBeenCalledTimes(
          1,
        );
        expect(transcriptService.deleteManyTranscripts).toHaveBeenCalledWith([
          mockTranscripts[0].id,
          mockTranscripts[1].id,
        ]);
      });
    });
    it('does not deleteManyTranscripts with all checked transcripts when the Delete Transcripts button is clicked and user cancels the deletion', async () => {
      await selectTranscript(1);
      await selectTranscript(2);

      const deleteTranscriptButton = await screen.findByTestId(
        'delete-transcript-button',
      );

      jest.spyOn(window, 'confirm').mockReturnValue(false);

      fireEvent.click(deleteTranscriptButton);

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalled();
        expect(
          transcriptService.deleteManyTranscripts,
        ).not.toHaveBeenCalledTimes(1);
        expect(
          transcriptService.deleteManyTranscripts,
        ).not.toHaveBeenCalledWith([mockTranscripts[0], mockTranscripts[1]]);
      });
    });

    it('should give an alert message if the operation is successful', async () => {
      await selectTranscript(1);

      const deleteTranscriptButton = await screen.findByTestId(
        'delete-transcript-button',
      );

      (
        transcriptService.deleteManyTranscripts as jest.Mock
      ).mockResolvedValueOnce(true);
      jest.spyOn(window, 'confirm').mockReturnValue(true);
      fireEvent.click(deleteTranscriptButton);

      const msg = await screen.findByText(
        'Transcripts have successfully been deleted',
      );
      expect(msg).toBeInTheDocument();
    });

    it('should give an alert message if the operation is unsuccessful', async () => {
      await selectTranscript(1);

      const deleteTranscriptButton = await screen.findByTestId(
        'delete-transcript-button',
      );
      const mockError = new Error('An unexpected error occurred');

      jest.spyOn(window, 'confirm').mockReturnValue(true);
      (
        transcriptService.deleteManyTranscripts as jest.Mock
      ).mockRejectedValueOnce(mockError);
      fireEvent.click(deleteTranscriptButton);

      const msg = await screen.findByText(
        `There was a problem deleting your transcripts. Please try again.`,
      );
      expect(msg).toBeInTheDocument();
    });
    it('re-calls getUserTranscripts after deletion operation', async () => {
      await selectTranscript(1);

      const deleteTranscriptButton = await screen.findByTestId(
        'delete-transcript-button',
      );
      jest.spyOn(window, 'confirm').mockReturnValue(true);

      (
        transcriptService.deleteManyTranscripts as jest.Mock
      ).mockResolvedValueOnce(true);

      const initialGetUserTranscriptsCallCount = (
        transcriptService.getUserTranscripts as jest.Mock
      ).mock.calls.length;

      fireEvent.click(deleteTranscriptButton);

      const msg = await screen.findByText(
        'Transcripts have successfully been deleted',
      );
      expect(msg).toBeInTheDocument();
      const finalGetUserTranscriptsCallCount = (
        transcriptService.getUserTranscripts as jest.Mock
      ).mock.calls.length;

      expect(finalGetUserTranscriptsCallCount).toBe(
        initialGetUserTranscriptsCallCount + 1,
      );
    });
  });
});

const mockTranscripts2 = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  transcript_name: `Transcript-${i + 1}`,
  size: '0.3 Mb',
  mod_on: '2023-05-29 15:10:20',
  ClusteringStatus: 'Failed',
  ContradictionStatus: 'Completed',
  no_of_que: '1011',
  anomalies_stat: 'Failed',
  job_ids: {
    contradiction: 63,
    explorer: 65,
    summary: '284c79b3-da2e-473a-9950-7af280c9a1e2',
  },
  start_date: '',
  end_date: '',
  DepositionDate: 'None',
  MiddleName: null,
  FirstName: `FirstName-${i + 1}`,
  LastName: `LastName`, // changed here to sort naturally
}));

describe('pagination', () => {
  it('does not render pagination component if there are less than 10 transcripts', async () => {
    const fewerTranscripts = mockTranscripts.slice(0, 5);
    await renderTranscriptTable(fewerTranscripts, 5);
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('renders pagination component if there are 10 or more transcripts', async () => {
    await renderTranscriptTable(mockTranscripts2, 15);
    expect(await screen.findByTestId('pagination')).toBeInTheDocument();
  });

  it('renders the next page of transcripts when the Next Page button is clicked', async () => {
    await renderTranscriptTable(mockTranscripts2, 15);
    await waitFor(() => screen.getByTestId('transcript-row-1'));

    await waitFor(() =>
      expect(transcriptService.getUserTranscripts).toHaveBeenLastCalledWith(
        expect.objectContaining({
          count: 10,
          page: 1,
        }),
      ),
    );

    const nextPageButton = await screen.findByTestId('pagination-next');
    fireEvent.click(nextPageButton);

    await waitFor(() =>
      expect(transcriptService.getUserTranscripts).toHaveBeenLastCalledWith(
        expect.objectContaining({
          count: 10,
          page: 2,
        }),
      ),
    );
  });

  it('renders the previous page of transcripts when the Previous Page button is clicked', async () => {
    await renderTranscriptTable(mockTranscripts2, 15);
    await waitFor(() => screen.getByTestId('transcript-row-1'));

    const nextPageButton = await screen.findByTestId('pagination-next');
    fireEvent.click(nextPageButton);

    const prevPageButton = await screen.findByTestId('pagination-prev');
    fireEvent.click(prevPageButton);

    await waitFor(() =>
      expect(transcriptService.getUserTranscripts).toHaveBeenLastCalledWith(
        expect.objectContaining({
          count: 10,
          page: 1,
        }),
      ),
    );
  });
});

it('should display an error message when the transcript service method throws an error', async () => {
  const errorMessage = 'Something went wrong';
  (transcriptService.getUserTranscripts as jest.Mock).mockRejectedValue(
    errorMessage,
  );

  render(
    <TranscriptsProvider>
      <TranscriptTable />
    </TranscriptsProvider>,
  );

  expect(
    await screen.findByText(
      `There was an error getting your transcript. Please try again later.`,
    ),
  ).toBeInTheDocument();
});
