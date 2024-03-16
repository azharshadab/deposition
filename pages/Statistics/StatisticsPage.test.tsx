import { render, screen, waitFor } from '@testing-library/react';
import StatisticsPage from './StatisticsPage';
import {
  LawyerStatistic,
  StatisticsOptions,
  transcriptStatisticsService,
} from '@services/http/transcriptStatistics';
import { Wrapper } from 'wrapper';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('@services/http/transcriptStatistics');

export const mockStatisticsOptions: StatisticsOptions = {
  transcripts: [
    {
      id: 1,
      name: 'Transcript 1',
      lawyers: [
        { id: 101, name: 'Lawyer A' },
        { id: 102, name: 'Lawyer B' },
      ],
    },
    {
      id: 2,
      name: 'Transcript 2',
      lawyers: [
        { id: 103, name: 'Lawyer C' },
        { id: 104, name: 'Lawyer D' },
      ],
    },
    {
      id: 3,
      name: 'Transcript 3',
      lawyers: [
        { id: 105, name: 'Lawyer E' },
        { id: 106, name: 'Lawyer F' },
      ],
    },
  ],
  groups: [
    {
      id: 1,
      name: 'Group 1',
      job_ids: ['1', '2'],
      questioners: [{ id: 107, name: 'Lawyer G' }],
    },
    {
      id: 2,
      name: 'Group 2',
      job_ids: ['1', '3'],
      questioners: [{ id: 108, name: 'Lawyer H' }],
    },
  ],
};

const mockLawyerStatistics: LawyerStatistic[] = [
  {
    lawyer_name: 'John Doe',
    num_que: 120,
    avg_words: 350,
    obj_ratio: 0.5,
    strike_ratio: 0.3,
  },
  {
    lawyer_name: 'Jane Smith',
    num_que: 90,
    avg_words: 300,
    obj_ratio: 0.4,
    strike_ratio: 0.25,
  },
  {
    lawyer_name: 'Alex Johnson',
    num_que: 150,
    avg_words: 400,
    obj_ratio: 0.6,
    strike_ratio: 0.35,
  },
];
describe('StatisticsPage', () => {
  describe('there are valid dropdown options', () => {
    beforeEach(async () => {
      (
        transcriptStatisticsService.getDropdownOptions as jest.Mock
      ).mockResolvedValueOnce(mockStatisticsOptions);

      render(
        <MemoryRouter>
          <StatisticsPage />
        </MemoryRouter>,
      );
      await waitFor(() =>
        expect(
          transcriptStatisticsService.getDropdownOptions,
        ).toHaveBeenCalled(),
      );
    });

    const selectTranscriptMessageIsShowing = async () => {
      const messages = await screen.findAllByText(
        'Select lawyers transcripts or groups to analyze',
      );
      expect(messages).toHaveLength(4);
    };

    it(`
      Scenario: I go to the statistics page
      Given I go ot the statistics page
      When the page is rendered
      Then the dropdowns are populated based on my transcripts and groups
      And there is a message prompting me to select trnascripts
    `, async () => {
      const dropdown = await screen.findByText('Transcripts');
      userEvent.click(dropdown);
      await waitFor(() => {
        screen.getByText('Transcript 1');
        screen.getByText('Transcript 2');
      });
      await selectTranscriptMessageIsShowing();
      userEvent.click(dropdown);
      const groupDropdown = screen.getByText('Groups');
      userEvent.click(groupDropdown);
      await waitFor(() => {
        screen.getByText('Group 1');
        screen.getByText('Group 2');
      });
      userEvent.click(groupDropdown);
    });

    const selectTranscript = async (value: string) => {
      const transcriptsDropdown = await screen.findByText('Transcripts');
      userEvent.click(transcriptsDropdown);
      await waitFor(() => {
        expect(screen.getByText(value)).toBeInTheDocument();
      });
      userEvent.click(screen.getByText(value));
      userEvent.click(transcriptsDropdown);
    };

    const selectTranscriptGroup = async (value: string) => {
      const transcriptsDropdown = await screen.findByText('Groups');
      userEvent.click(transcriptsDropdown);
      await waitFor(() => {
        expect(screen.getByText(value)).toBeInTheDocument();
      });
      userEvent.click(await screen.findByText(value));
      userEvent.click(transcriptsDropdown);
    };

    const selectATranscriptForStatisticalAnalysis = async () => {
      const selectedTranscript = mockStatisticsOptions.transcripts[0];
      await selectTranscript(selectedTranscript.name);
      const lawyerDropdown = await screen.findByText('Search Lawyers');
      (
        transcriptStatisticsService.getStatistics as jest.Mock
      ).mockResolvedValue(mockLawyerStatistics);
      userEvent.click(lawyerDropdown);
      for (const lawyer of selectedTranscript.lawyers) {
        expect(await screen.findByText(lawyer.name)).toBeInTheDocument();
      }
      await waitFor(() => {
        expect(transcriptStatisticsService.getStatistics).toHaveBeenCalledWith(
          selectedTranscript.lawyers.map(o => o.id),
        );
      });
    };

    it(`
      Scenario: I select a transcript
      Given I go to the page with valid transcript option
      When I select a transcript
      Then the lawyers associated with it should be added to the dropdwon 
      And the stats associated with them should be rendered
    `, async () => {
      await selectATranscriptForStatisticalAnalysis();
    });

    const selectSpecificStats = async () => {
      const viewDetailBtn = await screen.findByTestId(
        'statistics-card-No. of Questions-details-btn',
      );
      userEvent.click(viewDetailBtn);

      await waitFor(() => {
        expect(screen.getByTestId('stats-card-container')).toHaveClass(
          'single-card-container',
        );
        expect(screen.queryByText('No. of Questions')).toBeInTheDocument();
        expect(screen.queryByText('Average Words')).not.toBeInTheDocument();
        expect(screen.queryByText('Objection Ratio')).not.toBeInTheDocument();
        expect(screen.queryByText('Strike Ratio')).not.toBeInTheDocument();
      });
    };

    it(`
      Scenario: I select view details to see only on set of statistics
      Given I select a transcript
      When I click on of the view details buttons
      Then only those stats are rendered
    `, async () => {
      await selectATranscriptForStatisticalAnalysis();
      await selectSpecificStats();
    });

    it(`
      Scenario: I deselect a transcript after viewing details
      Given I select view details to see only on set of statistics
      When I deselect the transcript
      Then the main card is deselected
    `, async () => {
      await selectATranscriptForStatisticalAnalysis();
      await selectSpecificStats();
      const selectedTranscript = mockStatisticsOptions.transcripts[0];
      await selectTranscript(selectedTranscript.name);
      await waitFor(() => {
        expect(screen.getByTestId('stats-card-container')).toHaveClass(
          'card-container',
        );
      });
    });

    const selectGroup = async () => {
      const selectedTranscriptGroup = mockStatisticsOptions.groups[0];
      await selectTranscriptGroup(selectedTranscriptGroup.name);
      const transcriptDropdown = await screen.findByText('Transcripts');
      userEvent.click(transcriptDropdown);
      await waitFor(async () => {
        const option1 = await screen.findByText('Transcript 1');
        expect(option1).toHaveClass('selected');
        const option2 = await screen.findByText('Transcript 2');
        expect(option2).toHaveClass('selected');
      });
      userEvent.click(transcriptDropdown);
      await waitFor(() => {
        expect(transcriptStatisticsService.getStatistics).toHaveBeenCalledWith(
          mockStatisticsOptions.transcripts[0].lawyers
            .concat(mockStatisticsOptions.transcripts[1].lawyers)
            .concat(selectedTranscriptGroup.questioners)
            .map(o => o.id),
        );
      });
    };
    it(`
      Scenario: I select a transcript group
      Given I go to the page with valid transcript group options
      When I select a transcript group
      Then the transcripts associted with that group are selected
      And the stats associated with them should be rendered
      And the lawyers associated with it should be added to the dropdwon 
    `, async () => {
      selectGroup();
    });
    it(`
      Scenario: I deselect a transcript group
      Given I select a transcript group
      When I deselect a transcript group
      Then the transcripts associated with that group are deselected
      And there is a message prompting me to select transcripts
    `, async () => {
      await selectGroup();
      await selectTranscriptGroup(mockStatisticsOptions.groups[0].name);
      await selectTranscriptMessageIsShowing();

      const transcriptDropdown = await screen.findByText('Transcripts');
      userEvent.click(transcriptDropdown);
      await waitFor(async () => {
        const option1 = await screen.findByText('Transcript 1');
        expect(option1).not.toHaveClass('selected');
        const option2 = await screen.findByText('Transcript 2');
        expect(option2).not.toHaveClass('selected');
      });
      userEvent.click(transcriptDropdown);
    });
  });

  describe('there are no valid dropdown options', () => {
    beforeEach(() => {
      (
        transcriptStatisticsService.getDropdownOptions as jest.Mock
      ).mockResolvedValue({
        groups: [],
        transcripts: [],
      });

      render(
        <Wrapper>
          <StatisticsPage />
        </Wrapper>,
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('will give the user a message saying to uplaod trasncripts from the home page', async () => {
      expect(
        await screen.findByText(
          'To view statistics, please upload transcripts from the Home page.',
        ),
      ).toBeInTheDocument();
    });
  });

  describe('there is an id in the url', () => {
    const renderWithParams = (type: string, id: string) => {
      (
        transcriptStatisticsService.getDropdownOptions as jest.Mock
      ).mockResolvedValueOnce(mockStatisticsOptions);
      render(
        <MemoryRouter initialEntries={[`/statistics/${type}/${id}`]}>
          <Routes>
            <Route path="/statistics/:type/:id" element={<StatisticsPage />} />
          </Routes>
        </MemoryRouter>,
      );
    };

    it(`
      Scenario: I go to the statistics page with a invalid transcript or group id in the URL
      Given I have redirected to the statistics page
      And there is a invalid id in the URL
      When the page loads 
      Then no unnecessary calls will be made to the backend
    `, async () => {
      renderWithParams('g', 'invalid');
      expect(transcriptStatisticsService.getStatistics).not.toHaveBeenCalled();
    });
  });
});
