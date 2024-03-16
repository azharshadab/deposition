import {
  ContradictionOptions,
  transcriptContradictionsService,
} from '@services/http/transcriptContradiction';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ContradictionsPage from './ContradictionsPage';
import { Wrapper } from 'wrapper';
import { Contradiction } from '@interfaces/contradiction';
import userEvent from '@testing-library/user-event';

jest.mock('@services/http/transcriptContradiction');
jest.mock('@services/http/transcriptGroups');

const mockTransctiptOptions = [
  { label: 'transcript 1', value: '0' },
  { label: 'transcript 2', value: '1' },
];
const mockGroupOptions = [
  { label: 'group 1', value: '0:0,1' },
  { label: 'group 2', value: '1:0,1' },
];

const mockOptions: ContradictionOptions = {
  transcripts: mockTransctiptOptions,
  groups: mockGroupOptions,
};

const mockContradictions: Contradiction[] = [
  {
    que1: 'Question 1',
    ans1: 'Answer 1',
    page1: '7',
    line1: '10',
    que2: 'Question 2',
    ans2: 'Answer 2',
    page2: '2',
    line2: '20',
    score: '50.00',
    id: 1,
    contradictionStatus: 'Pending',
    str: 'Sample string 1',
    witness1: 'Witness 1',
    witness2: 'Witness 2',
  },
  {
    que1: 'Question 3',
    ans1: 'Answer 3',
    page1: '3',
    line1: '30',
    que2: 'Question 4',
    ans2: 'Answer 4',
    page2: '4',
    line2: '40',
    score: '70.00',
    id: 2,
    contradictionStatus: 'Resolved',
    str: 'Sample string 2',
    witness1: 'Witness 1',
    witness2: 'Witness 2',
  },
  {
    que1: 'Question 5',
    ans1: 'Answer 5',
    page1: '5',
    line1: '50',
    que2: 'Question 6',
    ans2: 'Answer 6',
    page2: '6',
    line2: '60',
    score: '90.00',
    id: 3,
    contradictionStatus: 'Unresolved',
    str: 'Sample string 3',
    witness1: 'Witness 1',
    witness2: 'Witness 2',
  },
];

describe('no id in url', () => {
  beforeEach(() => {
    (
      transcriptContradictionsService.getDropdownOptions as jest.Mock
    ).mockResolvedValue(mockOptions);
    (
      transcriptContradictionsService.getAnomalies as jest.Mock
    ).mockResolvedValue({ total_count: 0, data: [] });
    render(
      <Wrapper>
        <ContradictionsPage />
      </Wrapper>,
    );
  });
  it(`
    Scenario: Successfully redirected to the contradiction page with transcripts associated with the user
    Given I successfully logged in as a client
    And I navigated to the contradiction page
    When the contradiction page renders
    Then the dropdown filter options will load for transcripts uploaded by the current user
    And the dropdown filter options will load for transcript groups uploaded by the current user
  `, async () => {
    const dropdownSpinner = screen.getByTestId('dropdown-spinner');
    expect(dropdownSpinner).toBeInTheDocument();

    await waitFor(() => {
      expect(
        transcriptContradictionsService.getDropdownOptions,
      ).toHaveBeenCalled();
    });
    let selectMsg = screen.queryByText(
      'Please select a transcript from the menu above',
    );
    expect(selectMsg).not.toBeInTheDocument();
    const transcriptDropdown = await screen.findByText('Transcripts');
    expect(transcriptDropdown).toBeInTheDocument();

    selectMsg = screen.getByText(
      'Please select a transcript from the menu above',
    );
    expect(selectMsg).toBeInTheDocument();

    userEvent.click(transcriptDropdown);
    mockTransctiptOptions.forEach(async o =>
      expect(await screen.findByText(o.label)).toBeInTheDocument(),
    );
  });

  const selectTranscript = async () => {
    const transcriptDropdown = await screen.findByText('Transcripts');
    userEvent.click(transcriptDropdown);
    const option = await screen.findByText(mockTransctiptOptions[0].label);

    (
      transcriptContradictionsService.getAnomalies as jest.Mock
    ).mockResolvedValue({ data: [...mockContradictions], total_count: 2 });

    userEvent.click(option);
    userEvent.click(transcriptDropdown);
    await waitFor(() =>
      expect(transcriptContradictionsService.getAnomalies).toHaveBeenCalledWith(
        [mockTransctiptOptions[0].value.toString()],
        expect.anything(),
        expect.anything(),
      ),
    );
    mockContradictions.forEach(async c =>
      expect(await screen.findByText(c.score + '%')).toBeInTheDocument(),
    );
  };

  const selectTranscriptGroup = async () => {
    const groupsDropdown = await screen.findByText('Groups');
    userEvent.click(groupsDropdown);
    const option = await screen.findByText(mockGroupOptions[0].label);

    (
      transcriptContradictionsService.getAnomalies as jest.Mock
    ).mockResolvedValue({ data: [...mockContradictions], total_count: 2 });

    userEvent.click(option);
    userEvent.click(groupsDropdown);
    await waitFor(() =>
      expect(transcriptContradictionsService.getAnomalies).toHaveBeenCalledWith(
        mockGroupOptions[0].value.split(':')[1].split(','),
        expect.anything(),
        expect.anything(),
      ),
    );
    mockContradictions.forEach(async c =>
      expect(await screen.findByText(c.score + '%')).toBeInTheDocument(),
    );
  };
  const deSelectTranscriptGroup = async () => {
    const groupsDropdown = await screen.findByText('Groups');
    userEvent.click(groupsDropdown);
    const option = await screen.findByText(mockGroupOptions[0].label);

    (
      transcriptContradictionsService.getAnomalies as jest.Mock
    ).mockResolvedValue({ data: [...mockContradictions], total_count: 2 });

    userEvent.click(option);
    userEvent.click(groupsDropdown);
    mockContradictions.forEach(async c =>
      expect(await screen.findByText(c.score + '%')).toBeInTheDocument(),
    );
  };

  it(`
    Scenario: I have selected a transcript for contradiction analysis
    Given I successfully redirected to the contradiction page with no contradiction job id parameter
    When I select a transcript from the transcript dropdown options
    Then the contradictions related to that transcript are rendered
  `, async () => {
    await selectTranscript();
  });
  it(`
    Scenario: I have selected a transcript group for contradiction analysis
    Given I successfully redirected to the contradiction page with no contradiction job id parameter
    When I select a transcript group from the transcript dropdown options
    Then the transcripts associated with that group are selected
  `, async () => {
    await selectTranscriptGroup();
  });
  it(`
    Scenario: I have de-selected a transcript group for contradiction analysis
    Given I have selected a transcript group for contradiction analysis
    When I de-select th transcript group from the transcript dropdown options
    Then the transcripts associated with that group are de-selected
  `, async () => {
    await selectTranscriptGroup();
    await deSelectTranscriptGroup();
  });

  it(`
    Scenario: I delete a contradiction
    Given I have selected a transcript for contradiction analysis
    When I click the delete button for that transcript
    Then a call is made to delete that transcript
    And a call is made to refresh the transcripts
  `, async () => {
    await selectTranscript();
    (
      transcriptContradictionsService.deleteAnomaly as jest.Mock
    ).mockResolvedValue({});

    const [deleteBtn] = await screen.findAllByTestId(
      'transcript-contradictions-delete-btn',
    );

    const initialCallCount = (
      transcriptContradictionsService.getAnomalies as jest.Mock
    ).mock.calls.length;

    fireEvent.click(deleteBtn);

    expect(screen.getByTestId('contradiction-spinner')).toBeInTheDocument();

    expect(transcriptContradictionsService.deleteAnomaly).toHaveBeenCalledWith(
      mockContradictions[0].id,
    );
    await waitFor(() => {
      const newCallCount = (
        transcriptContradictionsService.getAnomalies as jest.Mock
      ).mock.calls.length;
      expect(newCallCount).toBe(initialCallCount + 1);
    });
  });
  it(`
    Scenario: I unsucessfully delete a contradiction
    Given I have selected a transcript for contradiction analysis
    When I click the delete button for that transcript 
    Then a call is made to delete that transcript
    And I see an error message telling me that the deletion was a failure
  `, async () => {
    await selectTranscript();
    (
      transcriptContradictionsService.deleteAnomaly as jest.Mock
    ).mockRejectedValue({});

    const [deleteBtn] = await screen.findAllByTestId(
      'transcript-contradictions-delete-btn',
    );

    fireEvent.click(deleteBtn);

    expect(transcriptContradictionsService.deleteAnomaly).toHaveBeenCalledWith(
      mockContradictions[0].id,
    );

    const msg = await screen.findByText(
      'It seems there was an error deleting your anomaly. Our Team has been informed.',
    );
    expect(msg).toBeInTheDocument();
  });

  it(`
    Scenario: I have selected to sort by chronological order for my contradictions
    Given I have selected a transcript for contradiction analysis
    When I select “Chronological” for my sort by option
    Then the contradictions are sorted by the order they occur in the transcript
  `, async () => {
    await selectTranscript();
    const sortDropdown = screen.getByLabelText('Sort By');
    fireEvent.change(sortDropdown, { target: { value: 'chronological' } });
    await waitFor(() => {
      expect(transcriptContradictionsService.getAnomalies).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        'chronological',
      );
    });
  });
  it(`
    Scenario: I have selected to sort by contradiction score for my contradictions
    Given I have selected to sort by chronological order for my contradictions
    When I select contradiction score for my sort by option
    Then the contradictions are sorted by their contradiction score
  `, async () => {
    await selectTranscript();
    const sortDropdown = screen.getByLabelText('Sort By');
    fireEvent.change(sortDropdown, {
      target: { value: 'score' },
    });
    await waitFor(() => {
      expect(transcriptContradictionsService.getAnomalies).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        'score',
      );
    });
  });
});

describe('There are no valid options', () => {
  beforeEach(() => {
    (
      transcriptContradictionsService.getDropdownOptions as jest.Mock
    ).mockResolvedValue({
      transcripts: [],
      groups: [],
    } as ContradictionOptions);
    (
      transcriptContradictionsService.getAnomalies as jest.Mock
    ).mockResolvedValue({ total_count: 0, data: [] });
    render(
      <Wrapper>
        <ContradictionsPage />
      </Wrapper>,
    );
  });

  it(`
    Scenario: I navigate tot he contradiction page with no transcript uploaded
    Given I navigate to the contradiction page
    When the dropdown loads
    Then I will see a message telling me to go uplaod transcripts from the home page.
  `, async () => {
    let uplaodMsg = screen.queryByText(
      'To view contradictions, please upload transcripts from the Home page.',
    );
    expect(uplaodMsg).not.toBeInTheDocument();
    await waitFor(() =>
      expect(
        transcriptContradictionsService.getDropdownOptions,
      ).toHaveBeenCalled(),
    );
    expect(transcriptContradictionsService.getAnomalies).not.toHaveBeenCalled();
    uplaodMsg = await screen.findByText(
      'To view contradictions, please upload transcripts from the Home page.',
    );
    expect(uplaodMsg).toBeInTheDocument();
  });
});
