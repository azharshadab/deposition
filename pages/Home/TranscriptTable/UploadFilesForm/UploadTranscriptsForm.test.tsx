import {
  render,
  fireEvent,
  RenderResult,
  waitFor,
  screen,
} from '@testing-library/react';
import {
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  UploadTranscriptForm,
} from './UploadTranscriptsForm';
import { transcriptService } from '@services/http/transcripts';
import { act } from 'react-dom/test-utils';
import config from '@config';

jest.mock('@services/http/transcripts');
const mockRefresh = jest.fn();

jest.mock('@hooks/useTranscripts', () => ({
  useTranscriptsContext: () => ({ refreshTranscripts: mockRefresh }),
}));

const mockMessage = jest.fn();
jest.mock('@common/Dialog', () => ({
  useDialogContext: () => ({ sendMessage: mockMessage, closeDialog: () => {} }),
}));

describe('<UploadTranscriptForm />', () => {
  let file: File;
  let utils: RenderResult;
  let fileTestId: string;
  let submitSpy: jest.Mock<void>;

  beforeEach(() => {
    file = new File(['(⌐□_□)'], 'file.zip', {
      type: 'application/zip',
    });
    fileTestId = `file-name-${file.name}`;
    submitSpy = jest.fn((msg: string): void => {});
    utils = render(<UploadTranscriptForm onSubmit={submitSpy} />);
  });

  it('hides the upload button if selectedFiles exceed the limit', () => {
    const FILE_LIMIT = config.TranscriptAnalysis.FeatureFlags.UploadLimit;
    const files = Array.from(
      { length: FILE_LIMIT + 1 },
      (_, index) =>
        new File(['(⌐□_□)'], `file${index + 1}.txt`, {
          type: 'text/plain',
        }),
    );

    const fileInput = utils.getByTestId('file-upload-input');

    fireEvent.change(fileInput, {
      target: { files: files },
    });
    expect(fileInput).toHaveStyle('display: none');
  });

  it('displays an error message when exceeding the file limit', () => {
    const FILE_LIMIT = config.TranscriptAnalysis.FeatureFlags.UploadLimit;
    const filesOverLimit = Array.from(
      { length: FILE_LIMIT + 1 },
      (_, index) =>
        new File(['(⌐□_□)'], `file${index + 1}.txt`, {
          type: 'text/plain',
        }),
    );

    const fileInput = utils.getByTestId('file-upload-input');

    fireEvent.change(fileInput, {
      target: { files: filesOverLimit },
    });

    const errorMessage = utils.getByTestId('file-limit-error');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.textContent).toBe(
      'Please upload only 5 transcripts at a time',
    );
  });

  it('allows the user to upload a file and see the name of the file on the screen', () => {
    const fileInput = utils.getByTestId('file-upload-input');

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    expect(utils.getByTestId(fileTestId)).toBeInTheDocument();
  });

  it('allows the user to remove an uploaded file', () => {
    const fileInput = utils.getByTestId('file-upload-input');

    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    const removeButton = utils.getByTestId(`remove-button-${file.name}`);

    fireEvent.click(removeButton);

    expect(utils.queryByTestId(fileTestId)).toBeNull();
  });

  it('allows the user to drag and drop a file and see the name of the file on the screen', () => {
    const dataTransfer = {
      items: [
        {
          kind: 'file',
          type: 'application/zip',
          getAsFile: () => file,
        },
      ],
    };
    const dropzone = utils.getByTestId('file-dropzone');

    fireEvent.drop(dropzone, { dataTransfer });

    expect(utils.getByTestId(fileTestId)).toBeInTheDocument();
  });

  it('renders submit button only when a file is uploaded', () => {
    const fileInput = utils.getByTestId('file-upload-input');

    expect(utils.queryByTestId('submit-button')).toBeNull();
    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    expect(utils.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('calls uploadFile function for each file when submit button is clicked', () => {
    const file1 = new File(['(⌐□_□)'], 'file1.zip', {
      type: 'application/zip',
    });
    const file2 = new File(['(⌐□_□)'], 'file2.zip', {
      type: 'application/zip',
    });
    const fileInput = utils.getByTestId('file-upload-input');

    fireEvent.change(fileInput, {
      target: { files: [file1, file2] },
    });

    const submitButton = utils.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(transcriptService.uploadManyTranscripts).toHaveBeenCalledTimes(1);
    expect(transcriptService.uploadManyTranscripts).toHaveBeenCalledWith([
      file1,
      file2,
    ]);
  });

  it('only accepts .zip and .txt files', () => {
    const fileInput = utils.getByTestId('file-upload-input');

    const zipFile = new File(['(⌐□_□)'], 'file.zip', {
      type: 'application/zip',
    });
    const txtFile = new File(['(⌐□_□)'], 'file.txt', { type: 'text/plain' });
    const pngFile = new File(['(⌐□_□)'], 'file.png', { type: 'image/png' });

    fireEvent.change(fileInput, {
      target: { files: [zipFile] },
    });
    expect(utils.getByTestId('file-name-file.zip')).toBeInTheDocument();

    fireEvent.change(fileInput, {
      target: { files: [txtFile] },
    });
    expect(utils.getByTestId('file-name-file.txt')).toBeInTheDocument();

    fireEvent.change(fileInput, {
      target: { files: [pngFile] },
    });
    expect(utils.queryByTestId('file-name-file.png')).toBeNull();
    expect(mockMessage).toHaveBeenCalledWith(
      'You are not allowed to upload this unsupported file format',
    );
  });
  it('renders all uploaded files to the screen', () => {
    const file1 = new File(['(⌐□_□)'], 'file1.zip', {
      type: 'application/zip',
    });
    const file2 = new File(['(⌐□_□)'], 'file2.zip', {
      type: 'application/zip',
    });

    const fileInput = utils.getByTestId('file-upload-input');

    fireEvent.change(fileInput, {
      target: { files: [file1, file2] },
    });

    expect(utils.getByTestId(`file-name-${file1.name}`)).toBeInTheDocument();
    expect(utils.getByTestId(`file-name-${file2.name}`)).toBeInTheDocument();
  });

  it('renders all sequentially uploaded files to the screen', async () => {
    const file1 = new File(['(⌐□_□)'], 'file1.zip', {
      type: 'application/zip',
    });
    const file2 = new File(['(⌐□_□)'], 'file2.zip', {
      type: 'application/zip',
    });

    const fileInput = utils.getByTestId('file-upload-input');

    fireEvent.change(fileInput, {
      target: { files: [file1] },
    });

    expect(utils.getByTestId(`file-name-${file1.name}`)).toBeInTheDocument();

    fireEvent.change(fileInput, {
      target: { files: [file2] },
    });

    expect(utils.getByTestId(`file-name-${file1.name}`)).toBeInTheDocument();
    expect(utils.getByTestId(`file-name-${file2.name}`)).toBeInTheDocument();
  });

  it('shows a spinner while upload is in progress', async () => {
    jest.useFakeTimers();

    (transcriptService.uploadManyTranscripts as jest.Mock).mockReturnValue(
      new Promise(resolve => setTimeout(resolve, 2000)),
    );

    const file1 = new File(['(⌐□_□)'], 'file1.zip', {
      type: 'application/zip',
    });

    const file2 = new File(['(⌐□_□)'], 'file2.zip', {
      type: 'application/zip',
    });

    const fileInput = utils.getByTestId('file-upload-input');

    fireEvent.change(fileInput, {
      target: { files: [file1, file2] },
    });

    const submitButton = utils.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(utils.getByTestId('spinner')).toBeInTheDocument();

    jest.advanceTimersByTime(2000);

    await waitFor(() => expect(utils.queryByTestId('spinner')).toBeNull());

    jest.useRealTimers();
  });

  it('shows an alert when an error occurs during upload', async () => {
    const error = new Error('test error');
    (transcriptService.uploadManyTranscripts as jest.Mock).mockImplementation(
      () => {
        throw error;
      },
    );

    const file1 = new File(['(⌐□_□)'], 'file1.zip', {
      type: 'application/zip',
    });

    const file2 = new File(['(⌐□_□)'], 'file2.zip', {
      type: 'application/zip',
    });

    const fileInput = utils.getByTestId('file-upload-input');

    fireEvent.change(fileInput, {
      target: { files: [file1, file2] },
    });

    const submitButton = utils.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMessage).toHaveBeenCalledWith(ERROR_MESSAGE);
    });
  });

  it('shows an alert affirming that the upload of transcripts was successful', async () => {
    (transcriptService.uploadManyTranscripts as jest.Mock).mockImplementation(
      () => Promise.resolve(),
    );

    const file1 = new File(['(⌐□_□)'], 'file1.zip', {
      type: 'application/zip',
    });

    const file2 = new File(['(⌐□_□)'], 'file2.zip', {
      type: 'application/zip',
    });

    const fileInput = utils.getByTestId('file-upload-input');

    fireEvent.change(fileInput, {
      target: { files: [file1, file2] },
    });

    const submitButton = utils.getByTestId('submit-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMessage).toHaveBeenCalledWith(SUCCESS_MESSAGE);
    });
  });

  it('calls the refreshTranscripts method after successful upload', async () => {
    (transcriptService.uploadManyTranscripts as jest.Mock).mockImplementation(
      () => Promise.resolve(),
    );

    const file1 = new File(['(⌐□_□)'], 'file1.zip', {
      type: 'application/zip',
    });

    const file2 = new File(['(⌐□_□)'], 'file2.zip', {
      type: 'application/zip',
    });

    const fileInput = utils.getByTestId('file-upload-input');

    fireEvent.change(fileInput, {
      target: { files: [file1, file2] },
    });

    const submitButton = utils.getByTestId('submit-button');

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(submitSpy).toHaveBeenCalled();
  });

  const thereAreDuplicates = async () => {
    const file1 = new File(['(⌐□_□)'], 'file1.zip', {
      type: 'application/zip',
    });

    const file2 = new File(['(⌐□_□)'], 'file2.zip', {
      type: 'application/zip',
    });

    const fileInput = utils.getByTestId('file-upload-input');

    fireEvent.change(fileInput, {
      target: { files: [file1, file2] },
    });

    const submitButton = utils.getByTestId('submit-button');

    (
      transcriptService.uploadManyTranscripts as jest.Mock
    ).mockResolvedValueOnce([file1]);
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(screen.getByTestId('replace-transcripts-btn')).toBeInTheDocument();
    expect(screen.getByTestId('add-again-transcripts-btn')).toBeInTheDocument();
  };

  it(`
    Scenario: I upload the same transcript again
    Given I uploaded a transcript
    When I upload it again
    Then I will be prompted to either add it again or replace it
  `, async () => {
    await thereAreDuplicates();
  });
  it(`
    Scenario: I replace a transcript
    Given  I upload the same transcript again
    When I choose to replace it
    Then a call will be made to replace that transcript
    And the onsubmit function is called
  `, async () => {
    const file1 = new File(['(⌐□_□)'], 'file1.zip', {
      type: 'application/zip',
    });
    await thereAreDuplicates();
    fireEvent.click(screen.getByTestId('replace-transcripts-btn'));
    expect(transcriptService.uploadManyTranscripts).toBeCalledWith(
      [file1],
      true,
    );
    await waitFor(() => expect(submitSpy).toHaveBeenCalledTimes(1));
  });
  it(`
    Scenario: I add that transcript again
    Given  I upload the same transcript again
    When I choose to add it again
    Then a call will be made to add it again
    And the onsubmit function is called
  `, async () => {
    const file1 = new File(['(⌐□_□)'], 'file1.zip', {
      type: 'application/zip',
    });
    await thereAreDuplicates();
    fireEvent.click(screen.getByTestId('add-again-transcripts-btn'));
    expect(transcriptService.addWithIncrementedSuffix).toBeCalledWith([file1]);
    await waitFor(() => expect(submitSpy).toHaveBeenCalledTimes(1));
  });
});
