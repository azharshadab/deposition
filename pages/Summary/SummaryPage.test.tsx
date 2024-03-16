import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SummaryPage from './SummaryPage';
import {
  SummaryOption,
  transcriptSummaryService,
} from '@services/http/transcriptSummary';
import { Wrapper } from 'wrapper';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TranscriptSummary } from '@interfaces/summary';

jest.mock('@services/http/transcriptSummary');

const mockSummaryOptions: SummaryOption[] = [
  {
    job_id: 'job-123',
    transcript: 'Transcript from Court Case 123',
  },
  {
    job_id: 'job-456',
    transcript: 'Transcript from Court Case 456',
  },
  {
    job_id: 'job-789',
    transcript: 'Transcript from Court Case 789',
  },
  {
    job_id: 'job-012',
    transcript: 'Transcript from Court Case 012',
  },
];

const mockTranscriptSummary: TranscriptSummary = {
  ClusteringId: 0,
  JobId: 'job-123',
  AttorneyName: 'Joe Smith',
  FullSummary: 'This is a full summary of the transcript from Court Case 123.',
  MidSummary: 'This is a mid summary of the transcript from Court Case 123.',
  SmallSummary:
    'This is a small summary of the transcript from Court Case 123.',
  Date: 'January 5th, 2020',
};

describe('SummaryPage', () => {
  describe('no valid transcripts', () => {
    beforeEach(() => {
      (
        transcriptSummaryService.getDropdownOptions as jest.Mock
      ).mockResolvedValue([]);
      render(
        <Wrapper>
          <SummaryPage />
        </Wrapper>,
      );
    });

    it('renders the "Go to the home Page to upload transcripts" message when getDropdownOptions returns an empty array and also does not show any statistics', async () => {
      await waitFor(() => {
        expect(
          screen.getByText(
            'To summarize transcripts, please upload them from the Home page',
          ),
        ).toBeInTheDocument();
      });
    });
  });

  describe('with valid transcripts', () => {
    beforeEach(() => {
      (
        transcriptSummaryService.getDropdownOptions as jest.Mock
      ).mockResolvedValue(mockSummaryOptions);

      (transcriptSummaryService.getSummary as jest.Mock).mockResolvedValue({});
      render(
        <Wrapper>
          <SummaryPage />
        </Wrapper>,
      );
    });

    it('will have dropdown options based on what is returned from the getDropdownOptions method and also render "Please select a transcript from the menu above"', async () => {
      await waitFor(() => {
        expect(
          screen.getByText('Please select a transcript from the menu above'),
        ).toBeInTheDocument();
      });

      const dropdown = await screen.findByTestId('summary-transcript-dropdown');
      userEvent.click(dropdown);

      await waitFor(() => {
        const dropdownList = screen.getByRole('list');
        expect(dropdownList).toBeInTheDocument();
      });

      mockSummaryOptions.forEach(async option => {
        const optionElement = screen.getByText(option.transcript);
        expect(optionElement).toBeInTheDocument();
      });
    });

    const selectATrasncriptForSummary = async () => {
      (transcriptSummaryService.getSummary as jest.Mock).mockResolvedValue(
        mockTranscriptSummary,
      );
      await waitFor(() =>
        expect(transcriptSummaryService.getDropdownOptions).toHaveBeenCalled(),
      );

      const transcriptDropdown = await screen.findByTestId<HTMLDivElement>(
        'summary-transcript-dropdown',
      );
      userEvent.click(transcriptDropdown);

      // Wait for the dropdown list to appear
      const dropdownList = await screen.findByRole('list');
      expect(dropdownList).toBeInTheDocument();

      // Find and click the first list item
      const firstOption = screen.getByText(mockSummaryOptions[0].transcript);
      userEvent.click(firstOption);

      const id = mockSummaryOptions[0].job_id;
      await waitFor(() =>
        expect(transcriptSummaryService.getSummary).toHaveBeenCalledWith(id),
      );

      expect(
        await screen.findByText(mockTranscriptSummary.MidSummary),
      ).toBeInTheDocument();
      const dateElement = await screen.findByTestId('deposition-date');
      expect(dateElement).toBeInTheDocument();
      expect(dateElement).toHaveTextContent(mockTranscriptSummary.Date);
      expect(window.location.pathname.endsWith(id)).toBeTruthy();
    };

    it(`
      Scenario: Successfully selected a transcript or group for summarization
      Given I have successfully navigated to the summarization page with transcripts uploaded
      When I select a transcript or group
      Then the summary associated with the transcript or group I selected is rendered to the screen
      And the Date is rendered to the screen
      And the id of that transcript or group is set as a hashed parameter in the URL (so that they can bookmark the page and return to that summary)
    `, async () => {
      await selectATrasncriptForSummary();
    });

    it(`
      Scenario: Unsuccessfully selected a transcript or group for summarization
      Given I have successfully navigated to the summarization page with transcripts uploaded
      When I select a transcript or group
      Then I see the message “We've encountered an error. Our staff has been notified.“
    `, async () => {
      (transcriptSummaryService.getSummary as jest.Mock).mockRejectedValue(
        'some error',
      );
      await waitFor(() =>
        expect(transcriptSummaryService.getDropdownOptions).toHaveBeenCalled(),
      );

      const transcriptDropdown = await screen.findByTestId<HTMLDivElement>(
        'summary-transcript-dropdown',
      );
      userEvent.click(transcriptDropdown);

      const dropdownList = await screen.findByRole('list');
      expect(dropdownList).toBeInTheDocument();

      const firstOption = screen.getByText(mockSummaryOptions[0].transcript);
      userEvent.click(firstOption);

      const id = mockSummaryOptions[0].job_id;
      await waitFor(() =>
        expect(transcriptSummaryService.getSummary).toHaveBeenCalledWith(id),
      );

      expect(
        await screen.findByText(
          "We've encountered an error. Our staff has been notified.",
        ),
      ).toBeInTheDocument();
    });

    const selectSpecificSummary = async () => {
      const mockSpecificSummary = 'Your Summary';

      (
        transcriptSummaryService.getSpecificSummary as jest.Mock
      ).mockResolvedValue(mockSpecificSummary);

      const queryInput = screen.getByPlaceholderText('Search...');
      fireEvent.input(queryInput, {
        target: { value: 'A more specific summary' },
      });
      fireEvent.keyUp(queryInput, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        expect(
          transcriptSummaryService.getSpecificSummary,
        ).toHaveBeenCalledWith(
          mockSummaryOptions[0].job_id,
          'A more specific summary',
          expect.anything(),
        );
      });

      expect(await screen.findByText(mockSpecificSummary)).toBeInTheDocument();
    };

    it(`
      Scenario: Successfully requested a more specific summary 
      Given I successfully selected a transcript or group for summarization
      When I have typed a search query in the text box
      Then I see a more specific summary based on that query
    `, async () => {
      await selectATrasncriptForSummary();
      await selectSpecificSummary();
    });

    it(`
      Scenario: Reset Specific Summary Search
      Given I Successfully requested a more specific summary 
      When I have cleared the search query
      Then I will default to the medium summary
    `, async () => {
      await selectATrasncriptForSummary();
      await selectSpecificSummary();
      const queryInput = screen.getByPlaceholderText('Search...');
      fireEvent.input(queryInput, {
        target: { value: '' },
      });
      expect(
        screen.getByText(mockTranscriptSummary.MidSummary),
      ).toBeInTheDocument();
    });

    it(`
      Scenario: Unsuccessfully requested a more specific summary 
      Given I successfully selected a transcript or group for summarization
      When I have typed a search query in the text box
      Then I see the message “We've encountered an error. Our staff has been notified.“
    `, async () => {
      await selectATrasncriptForSummary();

      (
        transcriptSummaryService.getSpecificSummary as jest.Mock
      ).mockRejectedValue('some error');

      const queryInput = screen.getByPlaceholderText('Search...');
      fireEvent.input(queryInput, {
        target: { value: 'A more specific summary' },
      });

      fireEvent.keyUp(queryInput, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        expect(
          transcriptSummaryService.getSpecificSummary,
        ).toHaveBeenCalledWith(
          mockSummaryOptions[0].job_id,
          'A more specific summary',
          expect.anything(),
        );
      });

      expect(
        await screen.findByText(
          "We've encountered an error. Our staff has been notified.",
        ),
      ).toBeInTheDocument();
    });
  });

  it(`
    Scenario: Successfully navigate to the summarization page with the endpoint that give me the dropdown options throwing an error
    Given I have successfully logged in as a client
    When I navigate to the summarization page 
    Then I see the message “We've encountered an error. Our staff has been notified.“
  `, async () => {
    (
      transcriptSummaryService.getDropdownOptions as jest.Mock
    ).mockRejectedValue('some error');
    render(
      <Wrapper>
        <SummaryPage />
      </Wrapper>,
    );

    await waitFor(() =>
      expect(transcriptSummaryService.getDropdownOptions).toHaveBeenCalled(),
    );

    expect(
      await screen.findByText(
        "We've encountered an error. Our staff has been notified.",
      ),
    ).toBeInTheDocument();
  });

  describe('When there is a valid hashed job_id in the parameter', () => {
    beforeEach(() => {
      (
        transcriptSummaryService.getDropdownOptions as jest.Mock
      ).mockResolvedValue(mockSummaryOptions);
      (transcriptSummaryService.getSummary as jest.Mock).mockResolvedValue(
        mockTranscriptSummary,
      );
      render(
        <MemoryRouter
          initialEntries={[`/summary/${mockSummaryOptions[0].job_id}`]}
        >
          <Routes>
            <Route path="/summary/:id" element={<SummaryPage />} />
          </Routes>
        </MemoryRouter>,
      );
    });

    it('the page makes an http call to get that summary', async () => {
      await waitFor(() =>
        expect(transcriptSummaryService.getSummary).toHaveBeenCalled(),
      );
      expect(transcriptSummaryService.getSummary).toHaveBeenCalledWith(
        mockSummaryOptions[0].job_id,
      );
    });
  });

  describe('When there is an invalid hashed job_id in the parameter', () => {
    beforeEach(() => {
      (
        transcriptSummaryService.getDropdownOptions as jest.Mock
      ).mockResolvedValue(mockSummaryOptions);
      (transcriptSummaryService.getSummary as jest.Mock).mockResolvedValue(
        mockTranscriptSummary,
      );
      render(
        <MemoryRouter initialEntries={[`/summary/asdfasdfasdf`]}>
          <Routes>
            <Route path="/summary/:id" element={<SummaryPage />} />
          </Routes>
        </MemoryRouter>,
      );
    });
    it('if an invalid transcript is uploaded it does not make an http call and gives a proper message', async () => {
      await waitFor(() => {
        expect(
          screen.getByText('Please select a transcript from the menu above'),
        ).toBeInTheDocument();
      });
      expect(transcriptSummaryService.getSummary).not.toHaveBeenCalled();
    });
  });
});
