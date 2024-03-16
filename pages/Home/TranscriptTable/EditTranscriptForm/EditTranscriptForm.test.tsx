import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditTranscriptForm } from './EditTranscriptForm';
import { transcriptService } from '@services/http/transcripts';
import { Wrapper } from 'wrapper';

jest.mock('@services/http/transcripts');

const mockTranscript = {
  id: 1,
  transcript_name: 'test transcript',
  size: '1MB',
  mod_on: '2023-05-31',
  ClusteringStatus: 'completed',
  ContradictionStatus: 'completed',
  no_of_que: '10',
  anomalies_stat: '10',
  job_ids: {
    summary: 'asd',
    contradiction: 123,
    explorer: 123,
  },
  start_date: '2023-05-31',
  end_date: '2023-05-31',
  DepositionDate: '2023-05-31',
  MiddleName: 'middle',
  FirstName: 'first',
  LastName: 'last',
};

describe('EditTranscriptForm', () => {
  let setMsg: jest.Mock;
  let onSubmit: jest.Mock;
  beforeEach(() => {
    jest.clearAllMocks();
    setMsg = jest.fn();
    onSubmit = jest.fn();

    (transcriptService.updateTranscript as jest.Mock).mockResolvedValue({});
    (transcriptService.getUserTranscripts as jest.Mock).mockResolvedValue({});

    render(
      <Wrapper>
        <EditTranscriptForm
          onSubmit={onSubmit}
          transcript={mockTranscript}
          setMessage={setMsg}
        />
      </Wrapper>,
    );
  });

  it('sets initial values based on the provided transcript', () => {
    expect(screen.getByLabelText('First Name:')).toHaveValue(
      mockTranscript.FirstName,
    );
    expect(screen.getByLabelText('Middle Name:')).toHaveValue(
      mockTranscript.MiddleName,
    );
    expect(screen.getByLabelText('Last Name:')).toHaveValue(
      mockTranscript.LastName,
    );
  });
  it('calls updateTranscript and onSubmit on form submission', async () => {
    fireEvent.click(screen.getByText('Submit'));

    const depositionDate = new Date(mockTranscript.DepositionDate);

    expect(transcriptService.updateTranscript).toHaveBeenCalledWith({
      FirstName: mockTranscript.FirstName,
      LastName: mockTranscript.LastName,
      MiddleName: mockTranscript.MiddleName,
      depositiondate: depositionDate,
      TranscriptId: mockTranscript.id,
    });
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });

  it('does not call updateTranscript and alerts when deposition date is undefined', () => {
    fireEvent.change(screen.getByLabelText('Deposition Date:'), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByText('Submit'));
    expect(transcriptService.updateTranscript).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(setMsg).toHaveBeenCalledWith('Deposition date is required!');
  });
  it('does not call updateTranscript and alerts when first name is undefined', () => {
    fireEvent.change(screen.getByLabelText('First Name:'), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByText('Submit'));
    expect(transcriptService.updateTranscript).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(setMsg).toHaveBeenCalledWith('First name is required!');
  });

  it('does not call updateTranscript and alerts when last name is undefined', () => {
    fireEvent.change(screen.getByLabelText('Last Name:'), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByText('Submit'));
    expect(transcriptService.updateTranscript).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(setMsg).toHaveBeenCalledWith('Last name is required!');
  });
});
