import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { GroupTableRow } from './GroupTableRow';
import { Group } from '@interfaces/group';

jest.mock('@hooks/useBoolean', () => ({
  useBoolean: () => [false, jest.fn()],
}));

jest.mock('@common/Dialog', () => ({
  useDialogContext: () => ({
    openDialog: jest.fn(),
    closeDialog: jest.fn(),
    sendMessage: jest.fn(),
  }),
}));

jest.mock('@hooks/useTranscriptGroups', () => ({
  useTranscriptGroupsContext: () => ({
    refreshGroups: jest.fn(),
  }),
}));

describe('GroupTableRow', () => {
  const mockGroup: Group = {
    groupId: 1,
    groupName: 'Test Group',
    createdOn: '2023-11-16 17:28:42.000',
    transcripts: [],
  };

  beforeEach(() => {
    render(
      <MemoryRouter>
        <GroupTableRow isChecked={false} group={mockGroup} />
      </MemoryRouter>,
    );
  });

  it('renders the group name', () => {
    expect(screen.getByTestId(`transcript-group-name`)).toHaveTextContent(
      mockGroup.groupName,
    );
  });

  it('renders the Explorer JobButton correctly', () => {
    const explorerImage = screen.getByAltText('explorer');
    expect(explorerImage).toBeInTheDocument();
  });

  it('renders the Statistics link correctly', () => {
    const statsLink = screen.getByTestId(`transcript-group-statistics-link`);
    expect(statsLink).toHaveAttribute(
      'href',
      `/statistics/g/${mockGroup.groupId}`,
    );
  });

  it('renders the Contradictions JobButton correctly', () => {
    const contradictionsImage = screen.getByAltText('contradictions');
    expect(contradictionsImage).toBeInTheDocument();
  });

  it('opens edit dialog on Edit button click', () => {
    const editButton = screen.getByTestId(`transcript-group-edit-btn`);
    fireEvent.click(editButton);
  });
});
