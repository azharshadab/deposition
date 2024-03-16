import useFile from '@hooks/useFile';
import { StyledPrimaryButton, StyledSecondaryButton } from '@styles/buttons';
import { Dropzone, OrDivider, StyledFileForm } from './Styles';
import { transcriptService } from '@services/http/transcripts';
import { FormEvent, useState } from 'react';
import styled from 'styled-components';
import { Spinner } from '@styles/spinner';
import { StyledH3 } from '@styles/header';
import { colors } from '@styles/colors';
import config from '@config';
import { useDialogContext } from '@common/Dialog';
import Image from '@common/Image';

interface Props {
  onSubmit: () => void;
}

const StyledList = styled.ul`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  li {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 10px;
    border: ${colors.grey[150]} solid 1px;
    border-bottom: none;
    width: 100%;
    &:last-of-type {
      border: ${colors.grey[150]} solid 1px;
    }
    button {
      color: ${colors.secondary.text};
      font-size: 14px;
      margin: 5px 10px;
    }
    span {
      font-size: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export const SUCCESS_MESSAGE = `
  Transcripts uploaded successfully, It takes a few seconds for each transcript to appear on the site. 
  Please refresh the screen if your transcript does not appear.
`;
export const ERROR_MESSAGE = `
  There was an error uploading those transcripts. Please try again later.
`;

export const UploadTranscriptForm = ({ onSubmit }: Props) => {
  const {
    selectedFiles,
    handleFileUpload,
    handleDragOver,
    handleDrop,
    removeFile,
    reset,
  } = useFile(['application/zip', 'text/plain']);

  const { closeDialog, sendMessage } = useDialogContext();

  const [isLoading, setIsLoading] = useState(false);

  const successfulSubmit = () => {
    closeDialog();
    sendMessage(SUCCESS_MESSAGE);
    onSubmit();
  };

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const res = await transcriptService.uploadManyTranscripts(selectedFiles);
      if (!Array.isArray(res)) {
        reset();
        successfulSubmit();
      } else {
        setDuplicateTranscripts(res);
      }
    } catch (e) {
      sendMessage(ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  };

  const addDuplicates = async () => {
    try {
      setIsLoading(true);
      await transcriptService.addWithIncrementedSuffix(duplicateTranscripts);
      setDuplicateTranscripts([]);
      successfulSubmit();
    } catch (e) {
      sendMessage(ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  };

  const replaceDuplicates = async () => {
    try {
      setIsLoading(true);
      await transcriptService.uploadManyTranscripts(duplicateTranscripts, true);
      setDuplicateTranscripts([]);
      successfulSubmit();
    } catch (e) {
      sendMessage(ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  };

  const [duplicateTranscripts, setDuplicateTranscripts] = useState<File[]>([]);

  if (isLoading) return <Spinner data-testid="spinner" />;

  if (duplicateTranscripts.length > 0)
    return (
      <DuplicateTranscriptForm
        duplicateTranscripts={duplicateTranscripts.map(t => t.name)}
        onResolveDuplicates={res => {
          switch (res) {
            case 'add':
              addDuplicates();
              break;
            case 'replace':
              replaceDuplicates();
              break;
            case 'cancel':
              setDuplicateTranscripts([]);
              break;
          }
        }}
      />
    );
  const isWithinLimit =
    selectedFiles &&
    selectedFiles.length <= config.TranscriptAnalysis.FeatureFlags.UploadLimit;
  return (
    <StyledFileForm>
      <Dropzone
        data-testid="file-dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        Drag and drop files (.zip or .txt) here
      </Dropzone>
      <OrDivider>Or</OrDivider>

      <div className="bottom-card">
        <StyledPrimaryButton
          as={'label'}
          htmlFor="transcripts"
          data-testid="file-upload-label"
        >
          Select Transcript
          <input
            type="file"
            id="transcripts"
            multiple
            onChange={e => {
              const success = handleFileUpload(e);
              e.target.value = '';
              if (success) return;
              sendMessage(
                'You are not allowed to upload this unsupported file format',
              );
            }}
            data-testid="file-upload-input"
            style={{ display: 'none' }}
          />
        </StyledPrimaryButton>
        <br />

        {isWithinLimit ? (
          <p className="small-txt">{selectedFiles.length} files selected</p>
        ) : (
          <p
            className="small-txt"
            style={{ color: 'red' }}
            data-testid="file-limit-error"
          >
            Please upload only{' '}
            {config.TranscriptAnalysis.FeatureFlags.UploadLimit} transcripts at
            a time
          </p>
        )}

        <StyledList data-testid="file-list">
          {selectedFiles.map((file, index) => (
            <li key={file.name + index} data-testid={`file-name-${file.name}`}>
              <span>{file.name}</span>
              <button
                className="remove-btn"
                data-testid={`remove-button-${file.name}`}
                onClick={() => removeFile(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </StyledList>

        {isWithinLimit && selectedFiles.length !== 0 && (
          <StyledSecondaryButton
            onClick={handleSubmit}
            data-testid="submit-button"
          >
            Upload
            <Image
              style={{ width: '16px', height: '16px' }}
              src="/upload.svg"
            />
          </StyledSecondaryButton>
        )}
      </div>
    </StyledFileForm>
  );
};

interface DuplicateTranscriptFormProps {
  duplicateTranscripts: string[];
  onResolveDuplicates: (action: 'replace' | 'add' | 'cancel') => void;
}

const DuplicateTranscriptForm = ({
  duplicateTranscripts,
  onResolveDuplicates,
}: DuplicateTranscriptFormProps) => {
  return (
    <StyledFileForm>
      <StyledH3>Following transcripts already exist:</StyledH3>
      <ul>
        {duplicateTranscripts.map(name => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <p>Do you want to replace them or add them again?</p>
      <StyledPrimaryButton
        id="replace-transcripts-btn"
        data-testid="replace-transcripts-btn"
        onClick={() => onResolveDuplicates('replace')}
      >
        Replace
      </StyledPrimaryButton>
      <StyledPrimaryButton
        id="add-again-transcripts-btn"
        data-testid="add-again-transcripts-btn"
        onClick={() => onResolveDuplicates('add')}
      >
        Add Again
      </StyledPrimaryButton>
      <StyledSecondaryButton
        id="cancel-transcripts-btn"
        data-testid="cancel-transcripts-btn"
        onClick={() => onResolveDuplicates('cancel')}
      >
        Cancel
      </StyledSecondaryButton>
    </StyledFileForm>
  );
};
