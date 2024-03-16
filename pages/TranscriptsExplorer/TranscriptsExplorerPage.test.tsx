import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TranscriptsExplorerPage from './TranscriptsExplorerPage';
import { Wrapper } from 'wrapper';
import { AnalysisOptions } from '@interfaces/AnalysisOptions';
import {
  QuestionsResponse,
  transcriptSearchService,
} from '@services/http/transcriptSearch';
import XLSXService from '@services/files/xlsxService';
import { useElementDimensions } from '@hooks/useElementDimensions';
import userEvent from '@testing-library/user-event';
import { TopicSize } from '@interfaces/TopicSize';

jest.mock('@services/http/transcriptGroups');
jest.mock('@services/http/transcriptSearch');
jest.mock('@services/files/xlsxService');
jest.mock('@hooks/useElementDimensions');

const mockOptions: AnalysisOptions = {
  groups: [
    { job_ids: [1], id: 0, name: 'Group 1' },
    { job_ids: [2], id: 1, name: 'Group 2' },
  ],
  transcripts: [
    { id: 3, DeponentName: 'Witness 1' },
    { id: 4, DeponentName: 'Witness 2' },
  ],
};

const mockTopics: TopicSize[] = [
  {
    topic: 'Weather',
    radius: 1,
  },
];

const mockTopics2: TopicSize[] = [
  {
    topic: 'Rain',
    radius: 1,
  },
  {
    topic: 'Sun',
    radius: 1,
  },
  {
    topic: 'Heat',
    radius: 1,
  },
];

const mockQuestions1: QuestionsResponse = { data: [], total: 25 };
for (let i = 0; i < 25; i++) {
  mockQuestions1.data.push({
    question: `What is your occupation? ${i}`,
    answer: `I'm a software developer ${i}.`,
    question_speaker: `MR. SMITH ${i}`,
    answer_speaker: 'THE WITNESS',
    page_line: `21 : ${32 + i}`,
    id: i, // if 'id' is some unique identifier, you could use 'i' or any other appropriate value
  });
}

const mockQuestions2: QuestionsResponse = {
  data: [
    {
      question: 'Could you please confirm your date of birth?',
      answer: 'January 15, 1980.',
      question_speaker: 'MR. JOHNSON',
      answer_speaker: 'THE WITNESS',
      page_line: '22 : 45',
      id: 26, // continue from the last id of 'mockQuestions1'
    },
    {
      question: 'Where do you reside currently?',
      answer: 'I live in Dallas, Texas.',
      question_speaker: 'MR. WILLIAMS',
      answer_speaker: 'THE WITNESS',
      page_line: '23 : 56',
      id: 27, // continue from the last id
    },
  ],
  total: 25,
};

const renderComponent = (data: AnalysisOptions) => {
  (transcriptSearchService.getDropdownOptions as jest.Mock).mockResolvedValue(
    data,
  );
  (useElementDimensions as jest.Mock).mockReturnValue([
    { width: 1000, height: 1000 },
    null,
  ]);
  render(
    <Wrapper>
      <TranscriptsExplorerPage />
    </Wrapper>,
  );
};

const selectTranscript = async (value: string) => {
  const transcriptsDropdown = await screen.findByText('Transcripts');
  userEvent.click(transcriptsDropdown);
  await waitFor(() => {
    expect(screen.getByText(value)).toBeInTheDocument();
  });
  userEvent.click(screen.getByText(value));
  userEvent.click(transcriptsDropdown);
};

describe('<TranscriptsExplorerPage />', () => {
  describe('thre are valid options', () => {
    beforeEach(() => {
      renderComponent(mockOptions);
    });

    it(`
      Scenario: I go to the transcript explorer page with transcripts uploaded
      Given I have transcripts ready for analysis and I go to the transcript explorer page
      When I navigate to the transcript explorer page
      Then the available transcripts are options in the transcript dropdown
      And the number of rows is set to 10.
    `, async () => {
      await waitFor(() =>
        expect(
          transcriptSearchService.getDropdownOptions,
        ).toHaveBeenCalledTimes(1),
      );

      const groupsDropdown = await screen.findByText('Groups');
      userEvent.click(groupsDropdown);

      for (const group of mockOptions.groups) {
        const groupElement = await screen.findByText(group.name);
        expect(groupElement).toBeInTheDocument();
      }

      const transcriptsDropdown = await screen.findByText('Transcripts');
      userEvent.click(transcriptsDropdown);
      for (const transcript of mockOptions.transcripts) {
        const transcriptElement = await screen.findByText(
          transcript.DeponentName,
        );
        expect(transcriptElement).toBeInTheDocument();
      }
    });

    it(`
      Scenario: I select a transcript for topical analysis and the endpoint that gives the table questions throws an error
      Given I go to the transcript explorer page with transcripts uploaded
      And I select a transcript
      When the questions endpoint throws an error
      Then I receive the message “We've encountered an error. Our staff has been notified.”
      And the questions table is not rendered
    `, async () => {
      (transcriptSearchService.getTopics as jest.Mock).mockRejectedValue(
        new Error('some error'),
      );
      (transcriptSearchService.getQuestions as jest.Mock).mockResolvedValue(
        mockQuestions1,
      );

      const newValue = mockOptions.transcripts[0].DeponentName;
      await selectTranscript(newValue);

      await waitFor(() =>
        expect(transcriptSearchService.getTopics).toHaveBeenCalledWith(
          [mockOptions.transcripts[0].id],
          [],
        ),
      );

      expect(
        await screen.findByText(
          "We've encountered an error. Our staff has been notified.",
        ),
      ).toBeInTheDocument();
      expect(screen.queryByTestId('topical-graph')).not.toBeInTheDocument();
    });

    const selectATranscriptForTopicalAnalysis = async () => {
      (transcriptSearchService.getTopics as jest.Mock).mockResolvedValue(
        mockTopics,
      );
      (transcriptSearchService.getQuestions as jest.Mock).mockResolvedValue(
        mockQuestions1,
      );

      const newValue = mockOptions.transcripts[0].DeponentName.toString();
      await selectTranscript(newValue);

      await waitFor(() =>
        expect(transcriptSearchService.getTopics).toHaveBeenCalledWith(
          [mockOptions.transcripts[0].id],
          [],
        ),
      );

      await waitFor(() =>
        expect(transcriptSearchService.getQuestions).toHaveBeenCalledTimes(1),
      );
      expect(transcriptSearchService.getQuestions).toHaveBeenCalledWith(
        expect.objectContaining({
          job_ids: [mockOptions.transcripts[0].id],
          pagination: expect.anything(),
        }),
      );

      for (const topic of mockTopics) {
        const topicElement = await screen.findByText(topic.topic);
        expect(topicElement).toBeInTheDocument();
      }
      for (const question of mockQuestions1.data.slice(0, 10)) {
        const questionRow = await screen.findByText(`Q: ${question.question}`);
        expect(questionRow).toBeInTheDocument();
      }
    };

    const selectASecondTranscriptForTopicalAnalysis = async () => {
      (transcriptSearchService.getTopics as jest.Mock).mockResolvedValue(
        mockTopics,
      );
      (transcriptSearchService.getQuestions as jest.Mock).mockResolvedValue(
        mockQuestions1,
      );

      const newValue = mockOptions.transcripts[1].DeponentName.toString();
      await selectTranscript(newValue);

      await waitFor(() =>
        expect(transcriptSearchService.getTopics).toHaveBeenCalledWith(
          [mockOptions.transcripts[1].id],
          [],
        ),
      );

      await waitFor(() =>
        expect(transcriptSearchService.getQuestions).toHaveBeenCalledTimes(3),
      );
      expect(transcriptSearchService.getQuestions).toHaveBeenCalledWith(
        expect.objectContaining({
          job_ids: [mockOptions.transcripts[1].id],
          pagination: expect.anything(),
        }),
      );

      for (const topic of mockTopics) {
        const topicElement = await screen.findByText(topic.topic);
        expect(topicElement).toBeInTheDocument();
      }
      for (const question of mockQuestions1.data.slice(0, 10)) {
        const questionRow = await screen.findByText(`Q: ${question.question}`);
        expect(questionRow).toBeInTheDocument();
      }
    };

    it(`
      Scenario: I select a transcript for topical analysis
      Given I go to the transcript explorer page with transcripts uploaded
      When I select a transcript from the transcript dropdown
      Then the topical bubbles associated with that transcript will be rendered to the screen
      And the questions for that particular transcript is shown. These questions will be chronological - from the beginning of the transcript to the end
      And the page is reset to 1
      And when I hover over the questions, the answers will be displayed when I am hovering.
      `, async () => {
      await selectATranscriptForTopicalAnalysis();
    });
    it(`
      Scenario: I deselect all transcripts for topical analysis
      Given I select a transcript for topical analysis
      When I deselect that transcript from the transcript dropdown
      Then I will see the message "Please select a transcript above."
      And no question answer pairs will be rendered to the screen
      `, async () => {
      await selectATranscriptForTopicalAnalysis();

      const newValue = mockOptions.transcripts[0].DeponentName.toString();
      await selectTranscript(newValue);
      const msg = await screen.findByText('Please select a transcript above.');
      expect(msg).toBeInTheDocument();
      await waitFor(() => {
        expect(
          screen.queryAllByTestId('transcript-explorer-question-row'),
        ).toHaveLength(0);
      });
    });

    const selectTranscriptGroup = async () => {
      const groupsDropdown = await screen.findByText('Groups');
      userEvent.click(groupsDropdown);
      const option = await screen.findByText(mockOptions.groups[0].name);

      (transcriptSearchService.getTopics as jest.Mock).mockResolvedValue([]);
      (transcriptSearchService.getQuestions as jest.Mock).mockResolvedValue([]);

      userEvent.click(option);
      userEvent.click(groupsDropdown);
      await waitFor(() => {
        expect(transcriptSearchService.getTopics).toHaveBeenCalledWith(
          mockOptions.groups[0].job_ids,
          [],
        );
        expect(transcriptSearchService.getQuestions).toHaveBeenCalledWith(
          expect.objectContaining({
            job_ids: mockOptions.groups[0].job_ids,
          }),
        );
      });
    };
    const deSelectTranscriptGroup = async () => {
      const groupsDropdown = await screen.findByText('Groups');
      userEvent.click(groupsDropdown);
      const option = await screen.findByText(mockOptions.groups[0].name);

      (transcriptSearchService.getTopics as jest.Mock).mockResolvedValue([]);
      (transcriptSearchService.getQuestions as jest.Mock).mockResolvedValue([]);

      userEvent.click(option);
      userEvent.click(groupsDropdown);
      await waitFor(() =>
        expect(transcriptSearchService.getTopics).toHaveBeenCalledWith(
          mockOptions.groups[0].job_ids,
          [],
        ),
      );
    };

    it(`
    Scenario: I have selected a transcript group for analysis
    Given I successfully redirected to the page with no job id parameter
    When I select a transcript group from the transcript dropdown options
    Then the transcripts associated with that group are selected
  `, async () => {
      await selectTranscriptGroup();
    });

    it(`
    Scenario: I have de-selected a transcript group for analysis
    Given I have selected a transcript group for analysis
    When I de-select the transcript group from the transcript dropdown options
    Then the transcripts associated with that group are de-selected
  `, async () => {
      await selectTranscriptGroup();
      await deSelectTranscriptGroup();
    });

    it(`
      Scenario: I make a semantic search for a specific question in a transcript
      Given I select a transcript for topical analysis
      When I enter a keyword search in the box and hit enter
      Then I will be presented with a list of related questions in the box below
    `, async () => {
      await selectATranscriptForTopicalAnalysis();
      (transcriptSearchService.getQuestions as jest.Mock).mockResolvedValue(
        mockQuestions2,
      );
      const question = 'What would you do for a klondike bar?';
      const semanticSearch = screen.getByPlaceholderText('Semantic Search');
      fireEvent.change(semanticSearch, {
        target: { value: question },
      });
      fireEvent.keyUp(semanticSearch, { key: 'Enter', code: 'Enter' });

      await waitFor(() =>
        expect(transcriptSearchService.getQuestions).toHaveBeenCalledWith(
          expect.objectContaining({
            job_ids: [mockOptions.transcripts[0].id],
            query: question,
            pagination: expect.anything(),
          }),
        ),
      );
      for (const question of mockQuestions2.data) {
        const topicElement = await screen.findByText(`Q: ${question.question}`);
        expect(topicElement).toBeInTheDocument();
      }
    });

    it(`
      Scenario: I make a semantic search without selecting a transcript
      Given I go to the transcript explorer page with transcripts uploaded
      When I enter a keyword search in the box and hit enter
      Then no API call will be made to get questions
      And no change is made to the questions table
    `, async () => {
      const question = 'What would you do for a klondike bar?';
      const semanticSearch = screen.getByPlaceholderText('Semantic Search');
      fireEvent.change(semanticSearch, {
        target: { value: question },
      });
      fireEvent.keyUp(semanticSearch, { key: 'Enter', code: 'Enter' });

      expect(transcriptSearchService.getQuestions).not.toHaveBeenCalledWith(
        expect.objectContaining({
          job_ids: [mockOptions.transcripts[0].id],
          pagination: expect.anything(),
          query: question,
        }),
      );
    });

    it(`
      Scenario: I make a semantic search for a specific question in a transcript and an exceptions is thrown
      Given I select a transcript for topical analysis
      When I enter a keyword search in the box and hit enter
      Then I see the message “We've encountered an error. Our staff has been notified.“ where the questions are normally
    `, async () => {
      await selectATranscriptForTopicalAnalysis();
      (transcriptSearchService.getQuestions as jest.Mock).mockRejectedValue(
        'some error',
      );

      const question = 'What would you do for a klondike bar?';
      const semanticSearch = screen.getByPlaceholderText('Semantic Search');
      fireEvent.change(semanticSearch, {
        target: { value: question },
      });
      fireEvent.keyUp(semanticSearch, { key: 'Enter', code: 'Enter' });

      await waitFor(() =>
        expect(transcriptSearchService.getQuestions).toHaveBeenCalledWith(
          expect.objectContaining({
            job_ids: [mockOptions.transcripts[0].id],
            query: question,
            pagination: expect.anything(),
          }),
        ),
      );

      expect(
        await screen.findByText(
          "We've encountered an error. Our staff has been notified.",
        ),
      ).toBeInTheDocument();
    });

    const preExisitingQuestion = 'Who signed the contract?';
    const selectSemanticSearchPreExisting = async () => {
      const preExisitingQuestionEl = screen.getByText(preExisitingQuestion);
      fireEvent.click(preExisitingQuestionEl);
      await waitFor(() =>
        expect(transcriptSearchService.getQuestions).toHaveBeenCalledWith(
          expect.objectContaining({
            job_ids: [mockOptions.transcripts[0].id],
            query: preExisitingQuestion,
            pagination: {
              page: 1,
              count: 10,
            },
          }),
        ),
      );
      const semanticSearch =
        screen.getByPlaceholderText<HTMLInputElement>('Semantic Search');
      expect(semanticSearch.value).toBe(preExisitingQuestion);
    };

    it(`
      Scenario: I make a semantic search for a specific question in a transcript use a pre-existing query
      Given I select a transcript for topical analysis
      When I click one of the pre-existing questions
      Then that question will be added to the search box
      And I will be presented with a list of related questions in the box below
    `, async () => {
      await selectATranscriptForTopicalAnalysis();
      await selectSemanticSearchPreExisting();
    });
    it(`
      Scenario: I make a semantic search while the page is not 1
      Given I select a transcript for topical analysis
      And The page is 2
      When I click one of the pre-existing questions
      Then that question will be added to the search box
      And I will be presented with a list of related questions in the box below
      And teh page will be set to 1
    `, async () => {
      await selectATranscriptForTopicalAnalysis();
      const nextPageBtn = screen.getByTestId('pagination-next');
      fireEvent.click(nextPageBtn);
      await selectSemanticSearchPreExisting();
    });
    it(`
      Scenario: I select a topical bubble after going to the next page of a semantic search 
      Given I change pages after making a semantic search
      When I click a topical bubble
      Then the questions assoicated with that should be queried for
      And the semantic search will not be included
    `, async () => {
      await selectATranscriptForTopicalAnalysis();
      await selectSemanticSearchPreExisting();
      const nextPageBtn = screen.getByTestId('pagination-next');
      fireEvent.click(nextPageBtn);
      await selectASubBubble();
      expect(transcriptSearchService.getQuestions).not.toHaveBeenLastCalledWith(
        expect.objectContaining({
          query: preExisitingQuestion,
        }),
      );
    });
    it(`
      Scenario: I change pages after making a semantic search
      Given I make a semantic search for a specific question in a transcript use a pre-existing query
      When I click the next page button
      Then an http call will be made with the preexisint semantic search to get the next page
      And that page will be renderd to the sreen
    `, async () => {
      await selectATranscriptForTopicalAnalysis();
      await selectSemanticSearchPreExisting();
      const nextPageBtn = screen.getByTestId('pagination-next');
      fireEvent.click(nextPageBtn);
      await waitFor(() =>
        expect(transcriptSearchService.getQuestions).toHaveBeenCalledWith(
          expect.objectContaining({
            job_ids: [mockOptions.transcripts[0].id],
            query: preExisitingQuestion,
            pagination: {
              count: 10,
              page: 2,
            },
          }),
        ),
      );
    });

    it(`
      Scenario: I choose some questions to be exported as an xlsx file
      Given I select a transcript for topical analysis (with or without selecting a topic or subtopic)
      And I select the questions that are rendered in the questions table
      When I click the export results button
      Then a list of all displayed questions is downloaded to my computer as an xlsx file
    `, async () => {
      await selectATranscriptForTopicalAnalysis();
      const downloadBtn = screen.getByText('Export Results');
      fireEvent.click(downloadBtn);
      await waitFor(() => expect(XLSXService.exportToExcel).toHaveBeenCalled());
    });

    it(`
      Scenario: I select a sub bubble with no relevant topics
      Given I select a transcript for topical analysis
      When I select a topical bubble
      Then I see a message saying that this topic has no relevant sub topics
    `, async () => {
      await selectATranscriptForTopicalAnalysis();
      const [firstTopic] = mockTopics;

      (transcriptSearchService.getTopics as jest.Mock).mockResolvedValue([]);
      (transcriptSearchService.getQuestions as jest.Mock).mockResolvedValue(
        mockQuestions2,
      );

      const topicElement = await screen.findByText(firstTopic.topic);
      fireEvent.click(topicElement);

      await waitFor(() =>
        expect(transcriptSearchService.getTopics).toHaveBeenCalledWith(
          [mockOptions.transcripts[0].id],
          [firstTopic.topic],
        ),
      );
      await waitFor(() =>
        expect(transcriptSearchService.getQuestions).toHaveBeenCalledWith(
          expect.objectContaining({
            job_ids: [mockOptions.transcripts[0].id],
            topics: [firstTopic.topic],
            pagination: expect.anything(),
          }),
        ),
      );

      expect(
        await screen.findByText(
          'The topic you selected has no relevant subtopics',
        ),
      ).toBeInTheDocument();
    });

    const selectASubBubble = async () => {
      const [firstTopic] = mockTopics;

      (transcriptSearchService.getTopics as jest.Mock).mockResolvedValue(
        mockTopics2,
      );
      (transcriptSearchService.getQuestions as jest.Mock).mockResolvedValue(
        mockQuestions2,
      );

      const topicElement = await screen.findByText(firstTopic.topic);
      fireEvent.click(topicElement);

      await waitFor(() =>
        expect(transcriptSearchService.getTopics).toHaveBeenCalledWith(
          [mockOptions.transcripts[0].id],
          [firstTopic.topic],
        ),
      );
      await waitFor(() =>
        expect(transcriptSearchService.getQuestions).toHaveBeenCalledWith(
          expect.objectContaining({
            job_ids: [mockOptions.transcripts[0].id],
            topics: [firstTopic.topic],
            pagination: expect.anything(),
          }),
        ),
      );

      for (const topic of mockTopics2) {
        const topicElement = await screen.findByText(topic.topic);
        expect(topicElement).toBeInTheDocument();
      }
      for (const question of mockQuestions2.data) {
        const topicElement = await screen.findByText(`Q: ${question.question}`);
        expect(topicElement).toBeInTheDocument();
      }

      expect(screen.getByText('All Topics >')).toBeInTheDocument();
    };

    it(`
      Scenario: I select a sub bubble
      Given I select a transcript for topical analysis
      When I select a sub bubble 
      Then the topical bubbles associated with the bubble I selected are rendered
      And a “All Topics >” button is rendered to the screen
      And the related questions table is updated accordingly`, async () => {
      await selectATranscriptForTopicalAnalysis();
      await selectASubBubble();
    });
    it(`
      Scenario: I select a new transcript after selecting a sub bubble 
      Given I select a sub bubble
      When I deselect and select a new transcript
      Then the topics are reset
      And the topics realted with the transcripts I selected are rendered
      And the related questions table is updated accordingly`, async () => {
      await selectATranscriptForTopicalAnalysis();
      await selectASubBubble();
      const newValue = mockOptions.transcripts[0].DeponentName;
      await selectTranscript(newValue);
      await selectASecondTranscriptForTopicalAnalysis();
    });

    it(`
      Scenario: I return to a parent bubble
      Given I select a sub bubble
      When I click the return to parent button 
      Then the previous topical bubbles associated with the bubble I selected are rendered
      And the "All Topics >" button is no longer rendered to the screen
      And the related questions table is updated accordingly`, async () => {
      await selectATranscriptForTopicalAnalysis();
      await selectASubBubble();

      (transcriptSearchService.getTopics as jest.Mock).mockResolvedValue(
        mockTopics,
      );
      (transcriptSearchService.getQuestions as jest.Mock).mockResolvedValue(
        mockQuestions1,
      );

      const goToParent = screen.getByText('All Topics >');
      fireEvent.click(goToParent);

      await waitFor(() =>
        expect(transcriptSearchService.getTopics).toHaveBeenCalledWith(
          [mockOptions.transcripts[0].id],
          [],
        ),
      );

      await waitFor(() =>
        expect(transcriptSearchService.getQuestions).toHaveBeenCalledWith(
          expect.objectContaining({
            job_ids: [mockOptions.transcripts[0].id],
            pagination: expect.anything(),
          }),
        ),
      );

      for (const topic of mockTopics) {
        const topicElement = await screen.findByText(topic.topic);
        expect(topicElement).toBeInTheDocument();
      }
      for (const question of mockQuestions1.data.slice(0, 10)) {
        const questionRow = await screen.findByText(`Q: ${question.question}`);
        expect(questionRow).toBeInTheDocument();
      }

      expect(screen.queryByText('All Topics >')).not.toBeInTheDocument();
    });
  });
  describe('thre are no valid options', () => {
    it(`
      Scenario: I go to the transcript explorer page with no transcripts
      Given I have no transcripts ready for analysis and I go to the transcript explorer page
      When I navigate to the transcript explorer page
      Then there is a message telling me to go upload some transcripts`, async () => {
      renderComponent({
        groups: [],
        transcripts: [],
      });
      await waitFor(() =>
        expect(
          transcriptSearchService.getDropdownOptions,
        ).toHaveBeenCalledTimes(1),
      );

      await screen.findByText(
        'To explore transcripts, please upload them from the Home page.',
      );
    });

    it(`
      Scenario: I go to the transcript explorer page and the endpoint to give me my options throws an error
      Given I go to the transcript explorer page
      When the endpoint that gives me the dropdowns throws an error
      Then I receive the message “We've encountered an error. Our staff has been notified.”
      And the dropdown options should not be rendered
    `, async () => {
      (
        transcriptSearchService.getDropdownOptions as jest.Mock
      ).mockRejectedValue(new Error('it failed'));
      (useElementDimensions as jest.Mock).mockReturnValue([
        { width: 1000, height: 1000 },
        null,
      ]);
      render(
        <Wrapper>
          <TranscriptsExplorerPage />
        </Wrapper>,
      );

      await waitFor(() =>
        expect(
          transcriptSearchService.getDropdownOptions,
        ).toHaveBeenCalledTimes(1),
      );
      expect(
        await screen.findByText(
          "We've encountered an error. Our staff has been notified.",
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('dropdown-container'),
      ).not.toBeInTheDocument();
    });
  });
});
