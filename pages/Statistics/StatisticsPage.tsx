import { useEffect, useState } from 'react';
import { DummyCard } from './GraphCard';
import HomeLink, { StyledHomeLink } from '@common/HomeLink';
import { useSelectedLawyers, useStatisticsDropdown, useStats } from './Hook';
import { StyledH1 } from '@styles/header';
import DropdownMultiple from '@common/DropdownMultiple';
import Image from '@common/Image';
import { StyledStatisticsPage } from './Styles';
import { GraphList } from './GraphList';
import { useParams } from 'react-router-dom';
import { Spinner } from '@styles/spinner';
import useTitle from '@hooks/useTitle';
import useTranscriptsWithGroupsDropdown from '@hooks/useTranscriptsWithGroupsDropdown';
import { StyledLinkAsButton } from '@styles/link';
import styled from 'styled-components';

const StyledReturnLink = styled(StyledLinkAsButton)`
  margin-bottom: 11px;
  align-items: center;
  display: flex;
  font-size: 16px;
  .img {
    width: 16px;
    height: 16px;
    margin-right: 10px;
  }
`;

const StatisticsPage = () => {
  useTitle('Deposition Insight TM - Statistics');

  const { dropdownOptions, dropdownLoading, dropdownError } =
    useStatisticsDropdown();

  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const { id: paramId, type: paramType } = useParams<{
    id: string;
    type: 't' | 'g';
  }>();
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!initialized && dropdownOptions.transcriptOptions.length === 1) {
      const [onlyTranscript] = dropdownOptions.transcriptOptions;
      setSelectedTranscripts([onlyTranscript.value.toString()]);
      setInitialized(true);
    }
    if (
      !initialized &&
      dropdownOptions.transcriptOptions.length > 0 &&
      paramId
    ) {
      const matchingOptions = (
        paramType === 't'
          ? dropdownOptions.transcriptOptions
          : dropdownOptions.groupOptions
      ).filter(option =>
        paramId.split(',').includes(option.value.split(':')[0]),
      );

      if (matchingOptions) {
        const defaultValue = matchingOptions.map(o => o.value.toString());
        paramType === 't'
          ? setSelectedTranscripts(defaultValue)
          : setSelectedGroups(defaultValue);
        setInitialized(true);
      }
    }
  }, [dropdownOptions, paramId, initialized]);

  const { selectedTranscripts, setSelectedTranscripts } =
    useTranscriptsWithGroupsDropdown(selectedGroups, 'statistics');
  useEffect(() => {
    if (!selectedGroups.length) {
      window.history.replaceState(null, '', '/statistics');
      return;
    }
    window.history.replaceState(
      null,
      '',
      `/statistics/g/${selectedGroups.map(g => g.split(':')[0]).join(',')}`,
    );
  }, [selectedGroups]);

  const { selectedLawyers, setSelectedLawyers, lawyerOptions } =
    useSelectedLawyers(dropdownOptions, selectedTranscripts, selectedGroups);

  const { currentStats, statsError, statsLoading } = useStats(selectedLawyers);

  const [mainCard, setMainCard] = useState<string>('');

  useEffect(() => {
    if (!selectedTranscripts.length) setMainCard('');
  }, [selectedTranscripts]);

  return (
    <StyledStatisticsPage>
      {mainCard ? (
        <StyledReturnLink
          id="statisitcs-home-link"
          onClick={() => setMainCard('')}
        >
          <Image src="/grey_arrow.svg" /> Back to Statistics Home
        </StyledReturnLink>
      ) : (
        <HomeLink />
      )}
      <StyledH1>Statistics</StyledH1>
      <p className="bordered-bottom small-txt">
        Gain instant insight into key metrics of your deposition.
      </p>
      <div className="dropdown-container">
        {dropdownLoading ? (
          <Spinner id="transcript-statistics-dropdown-spinner" />
        ) : (
          <>
            {dropdownError ? (
              <>There seems to have been an error getting your dropdowns.</>
            ) : (
              <>
                <DropdownMultiple
                  id="statistics-transcript-lawyer-dropdown"
                  selectedOption={selectedLawyers}
                  setSelectedOption={setSelectedLawyers}
                  placeholder="Search Lawyers"
                  options={lawyerOptions}
                />
                <DropdownMultiple
                  id="statistics-transcript-dropdown"
                  selectedOption={selectedTranscripts}
                  setSelectedOption={setSelectedTranscripts}
                  placeholder="Transcripts"
                  options={dropdownOptions.transcriptOptions}
                />
                <DropdownMultiple
                  id="statistics-transcript-groups-dropdown"
                  selectedOption={selectedGroups}
                  setSelectedOption={setSelectedGroups}
                  placeholder="Groups"
                  options={dropdownOptions.groupOptions}
                />
              </>
            )}
          </>
        )}
      </div>
      <div
        data-testid="stats-card-container"
        className={mainCard ? 'single-card-container' : 'card-container'}
      >
        {!dropdownLoading && dropdownOptions.transcriptOptions.length === 0 && (
          <DummyCard id="statistics-transcript-upload-msg">
            To view statistics, please upload transcripts from the Home page.
          </DummyCard>
        )}
        {!dropdownLoading &&
          !statsLoading &&
          dropdownOptions.transcriptOptions.length !== 0 &&
          (!currentStats || currentStats.length === 0) && (
            <>
              <DummyCard data-testid="statistics-select-msg">
                Select lawyers transcripts or groups to analyze
              </DummyCard>
              <DummyCard data-testid="statistics-select-msg">
                Select lawyers transcripts or groups to analyze
              </DummyCard>
              <DummyCard data-testid="statistics-select-msg">
                Select lawyers transcripts or groups to analyze
              </DummyCard>
              <DummyCard data-testid="statistics-select-msg">
                Select lawyers transcripts or groups to analyze
              </DummyCard>
            </>
          )}
        {statsLoading ? (
          <Spinner id="transcript-statistics-graph-spinner" />
        ) : statsError ? (
          <DummyCard id="statistics-error-msg">
            There seems to have been an error. Please try again later. Our team
            has been informed of the issue.
          </DummyCard>
        ) : (
          currentStats?.length > 0 && (
            <GraphList
              mainCard={mainCard}
              setMainCard={setMainCard}
              currentStats={currentStats}
            />
          )
        )}
      </div>
    </StyledStatisticsPage>
  );
};

export default StatisticsPage;
