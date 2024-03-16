import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import JobButton from './JobButton'; 

jest.mock('@common/ToolTip', () => {
    return {
      __esModule: true,
      default: ({ children, tooltipContent }: { children: React.ReactNode; tooltipContent: React.ReactNode }) => (
        <div>
          {children}
          <div>{tooltipContent}</div>
        </div>
      ),
    };
  });
  

jest.mock('@common/Image', () => {
  return {
    __esModule: true,
    default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
  };
});

describe('JobButton', () => {
  const jobType = 'transcript';
  const normalImageUrl = '/images/normal.png';
  const errorImageUrl = '/images/error.png';
  const altText = 'Job'; 

  it('renders the button content correctly without error', () => {
    const jobId = '123';
    render(
      <MemoryRouter>
        <JobButton
          jobType={jobType}
          jobId={jobId}
          normalImageUrl={normalImageUrl}
          errorImageUrl={errorImageUrl}
          altText={altText}
        />
      </MemoryRouter>
    );
    expect(screen.getByRole('link')).toHaveAttribute('href', `/${jobType}/${jobId}`);
    expect(screen.getByText(jobType)).toBeInTheDocument();
    expect(screen.getByAltText(altText)).toBeInTheDocument(); 
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it('renders the button content correctly with error', () => {
    const jobId = 'Error';
    render(
      <MemoryRouter>
        <JobButton
          jobType={jobType}
          jobId={jobId}
          normalImageUrl={normalImageUrl}
          errorImageUrl={errorImageUrl}
          altText={altText}
        />
      </MemoryRouter>
    );
    expect(screen.getByRole('link')).toHaveAttribute('href', 'mailto:depoinsight@lexitaslegal.com');
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByAltText(altText)).toBeInTheDocument(); 
  });

  it('displays tooltip when there is an error', async () => {
    const jobId = 'Error';
    render(
      <MemoryRouter>
        <JobButton
          jobType="transcript"
          jobId={jobId}
          pathType="t"
          altText="Job"
          normalImageUrl="/images/normal.png"
          errorImageUrl="/images/error.png"
        />
      </MemoryRouter>
    );
    const errorMessage = await screen.findByText("There was an error importing this job. Please try again or contact support.");
    expect(errorMessage).toBeInTheDocument();
  });
});
