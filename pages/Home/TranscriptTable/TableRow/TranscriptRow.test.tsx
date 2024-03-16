import { fireEvent, render, screen } from '@testing-library/react';
import { TableRow } from './TranscriptRow';
import { Transcript } from '@interfaces/transcript';
import { Wrapper } from 'wrapper';

const mockTranscript: Partial<Transcript> = {
  id: 1,
  job_ids: {
    summary: 'asd',
    contradiction: 123,
    explorer: 123,
  },
  FirstName: 'Test',
  MiddleName: 'Witness',
  LastName: 'Name',
  DepositionDate: '2023-05-29',
};

const renderComponent = () =>
  render(
    <Wrapper>
      <table>
        <tbody>
          <TableRow checked={false} transcript={mockTranscript as Transcript} />
        </tbody>
      </table>
    </Wrapper>,
  );

describe('<TableRow />', () => {
  it('renders the witness name and deposition date properly', () => {
    renderComponent();

    const witnessNameElement = screen.getByText('Name, Test Witness');
    const depositionDateElement = screen.getByText('2023-05-29');

    expect(witnessNameElement).toBeInTheDocument();
    expect(depositionDateElement).toBeInTheDocument();
  });

  it('displays the form when the edit button is clicked', () => {
    renderComponent();

    const editButton = screen.getByText('Edit');

    fireEvent.click(editButton);

    expect(screen.getByTestId('update-transcript-form')).toBeInTheDocument();
  });

  it('does not render a comma if LastName is undefined', () => {
    const mockTranscriptWithoutLastName = {
      ...mockTranscript,
      LastName: '',
    } as Transcript;

    render(
      <Wrapper>
        <table>
          <tbody>
            <TableRow
              checked={false}
              transcript={mockTranscriptWithoutLastName}
            />
          </tbody>
        </table>
      </Wrapper>,
    );

    const witnessNameElement = screen.getByTestId(
      'transcript-row-witness-name',
    );
    expect(witnessNameElement.textContent).not.toContain(',');
  });
});
