import React from 'react';
import Tooltip from '@common/ToolTip';
import { Link } from 'react-router-dom';
import Image from '@common/Image';

interface ButtonContentProps {
  hasError: boolean;
  jobType: string;
  jobId: string | number;
  pathType?: string;
  imageUrl: string;
  altText: string;
}

const ButtonContent: React.FC<ButtonContentProps> = ({
  hasError,
  jobType,
  jobId,
  pathType,
  imageUrl,
  altText,
}) => (
  <Link
    to={
      hasError
        ? 'mailto:depoinsight@lexitaslegal.com'
        : `/${jobType}${!!pathType ? `/${pathType}` : ''}/${jobId}`
    }
  >
    <Image src={imageUrl} alt={altText} />
    <span>{hasError ? 'Error' : jobType}</span>
  </Link>
);

interface JobButtonProps {
  jobType: string;
  jobId: string | number;
  pathType?: 't' | 'g';
  altText: string;
  normalImageUrl: string;
  errorImageUrl: string;
}

const JobButton: React.FC<JobButtonProps> = ({
  jobType,
  jobId,
  pathType,
  altText,
  normalImageUrl,
  errorImageUrl,
}) => {
  const hasError = jobId === 'Error';
  const imageUrl = hasError ? errorImageUrl : normalImageUrl;

  const content = (
    <ButtonContent
      {...{ hasError, jobType, jobId, pathType, imageUrl, altText }}
    />
  );

  return (
    <React.Fragment>
      {hasError ? (
        <Tooltip tooltipContent={<ErrorMessage />}>{content}</Tooltip>
      ) : (
        content
      )}
    </React.Fragment>
  );
};

const ErrorMessage = () => (
  <div>
    There was an error importing this job. Please try again or contact support.
  </div>
);

export default JobButton;
