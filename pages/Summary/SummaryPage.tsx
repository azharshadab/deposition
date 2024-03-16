import SummaryCard from './SummaryCard';
import SideCard from './SideCard';
import styled from 'styled-components';
import Dropdown from '@common/Dropdown';
import HomeLink from '@common/HomeLink';
import { StyledH1, StyledH3 } from '@styles/header';
import { colors } from '@styles/colors';
import {
  useSpecificSummaryHttp,
  useSummaryDropdown,
  useSummaryHttp,
} from './Hooks';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '@styles/spinner';
import useTitle from '@hooks/useTitle';
import SearchBarOnEnter from '@common/SearchBarOnEnter';
import config from '@config';
import DropdownSingle from '@common/DropdownSingle';

const StyledMessage = styled.div`
  border: solid 1px ${colors.grey[12]};
  text-align: center;
  padding: 20px;
  font-weight: 700;
  font-size: 30px;
  line-height: 30px;
`;

const StyledSummaryPage = styled.div`
  .bordered-bottom {
    color: #545454;
    padding-bottom: 10px;
    margin-bottom: 30px;
    border-bottom: 1px solid ${colors.grey[12]};
  }
  .dropdown-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 32px;
  }
  .content {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 20px;
    margin-bottom: 10px;
  }
`;

const sizeOptions = [
  { value: 'Small', label: 'Small' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Full', label: 'Full' },
];

type Size = 'Small' | 'Medium' | 'Full';

const getInitialLength = (): Size | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const summaryLength = urlParams.get('summaryLength');
  return summaryLength as Size;
};

export default function SummaryPage() {
  useTitle('Deposition Insight TM - Summary');
  const { options, optionsAreLoading, optionsError } = useSummaryDropdown();

  const [useSpecificSummary, setUseSpecificSummary] = useState(false);

  const { id: paramId } = useParams<{ id: string }>();
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!initialized && options.length === 1) {
      const [onlyTranscript] = options;
      setSelectedTranscript(onlyTranscript.value.toString());
      setInitialized(true);
    }
    if (!initialized && options.length > 0 && paramId) {
      const matchingOption = options.find(option => option.value === paramId);
      if (matchingOption) {
        setSelectedTranscript(matchingOption.value);
        setInitialized(true);
      }
    }
  }, [options, paramId, initialized]);

  const areValidOptions = useMemo(
    () => !optionsAreLoading && options?.length > 0,
    [optionsAreLoading, options],
  );

  const [selectedSummaryLength, setSelectedSummaryLength] = useState<Size>(
    getInitialLength() || 'Medium',
  );

  const [selectedTranscript, setSelectedTranscript] = useState<string>('');
  const { summary, getSummary, summaryIsLoading, summaryError } =
    useSummaryHttp();

  useEffect(() => {
    if (!selectedTranscript) {
      window.history.replaceState(null, '', '/summary');
      return;
    }
    window.history.replaceState(null, '', `/summary/${selectedTranscript}`);
    setUseSpecificSummary(false);
    getSummary(selectedTranscript);
    return () => abortRef.current?.abort();
  }, [selectedTranscript, window.history]);

  const {
    specificSummary,
    getSpecificSummary,
    specificSummaryIsLoading,
    specificSummaryError,
  } = useSpecificSummaryHttp();

  const [query, setQuery] = useState('');
  const abortRef = useRef<AbortController>();

  const handleSpecificSearch = async (value: string) => {
    if (!selectedTranscript) return;
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    getSpecificSummary(
      selectedTranscript,
      value,
      abortRef.current.signal,
    ).finally(() => setUseSpecificSummary(true));
  };

  useEffect(() => {
    if (query !== '' || !useSpecificSummary) return;
    setSelectedSummaryLength('Medium');
    setUseSpecificSummary(false);
  }, [query]);

  const selectedSummary = useMemo(() => {
    setUseSpecificSummary(false);
    const url = new URL(window.location.href);
    url.searchParams.set('summaryLength', selectedSummaryLength);
    window.history.pushState({}, '', url);
    return selectedSummaryLength === 'Full'
      ? summary?.FullSummary
      : selectedSummaryLength === 'Medium'
      ? summary?.MidSummary
      : summary?.SmallSummary;
  }, [summary, selectedSummaryLength]);

  const isLoading = summaryIsLoading || specificSummaryIsLoading;
  const textContent = useSpecificSummary ? specificSummary : selectedSummary;
  const isError = summaryError || (useSpecificSummary && specificSummaryError);
  const isSummaryReady = areValidOptions && selectedTranscript && !isError;
  const isAwaitingSummaryCompletion =
    areValidOptions && selectedTranscript && summary && !selectedSummary;
  const hasValidOptionsNoTranscript = areValidOptions && !selectedTranscript;

  return (
    <StyledSummaryPage>
      <HomeLink />
      <StyledH1>Summary</StyledH1>
      <p className="bordered-bottom small-txt">
        Get an instant summary of the entire transcript or specific
        topics/issues selected by the user.
      </p>
      <div className="dropdown-container">
        <Dropdown
          id="summary-length-input"
          label="Summary Length"
          placeholder=""
          options={sizeOptions}
          secondary={true}
          selectedOption={selectedSummaryLength}
          setSelectedOption={(value: string) =>
            setSelectedSummaryLength(value as Size)
          }
        />
        <div style={{ color: colors.grey[300] }}>
          Topical Search
          <SearchBarOnEnter
            id="summary-search-input"
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            secondary={true}
            placeholder="Search..."
            onSearch={handleSpecificSearch}
          />
        </div>
        {optionsAreLoading ? (
          <Spinner id="transcript-summary-dropdown-spinner" />
        ) : optionsError ? (
          <span id="summary-options-error-msg">
            We've encountered an error. Our staff has been notified.
          </span>
        ) : (
          <DropdownSingle
            style={{ margin: '0px' }}
            id="summary-transcript-dropdown"
            data-testid="summary-transcript-dropdown"
            selectedOption={selectedTranscript}
            setSelectedOption={setSelectedTranscript}
            placeholder="Transcripts"
            options={options}
          />
        )}
      </div>
      <div className="content">
        {' '}
        {hasValidOptionsNoTranscript && (
          <StyledMessage id="summary-select-msg">
            Please select a transcript from the menu above
          </StyledMessage>
        )}
        {isSummaryReady &&
          (isLoading ? (
            <StyledMessage>
              <Spinner id="transcript-summary-text-spinner" />
            </StyledMessage>
          ) : (
            <SummaryCard
              attorneyName={summary?.AttorneyName || ''}
              textContent={textContent}
              date={summary?.Date || ''}
            />
          ))}
        {isError && (
          <StyledMessage id="summary-error-msg">
            We've encountered an error. Our staff has been notified.
          </StyledMessage>
        )}
        {isAwaitingSummaryCompletion && (
          <StyledMessage id="summary-uncomplete-msg">
            We have not completed the summary of that length yet. Please try
            again later.
          </StyledMessage>
        )}
        {!areValidOptions && !optionsError && (
          <StyledMessage id="summary-upload-msg">
            <StyledH3>
              To summarize transcripts, please
              <br /> upload them from the Home page{' '}
            </StyledH3>
          </StyledMessage>
        )}
        {optionsError && (
          <StyledMessage id="summary-big-options-error-msg">
            There was an error getting your summary options. Please try again
            later.
          </StyledMessage>
        )}
        {config.TranscriptAnalysis.FeatureFlags.SideBar && (
          <SideCard clusteringId={summary?.ClusteringId || 0} />
        )}
      </div>
    </StyledSummaryPage>
  );
}
