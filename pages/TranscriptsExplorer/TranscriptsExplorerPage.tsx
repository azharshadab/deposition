import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Table from '@common/Table';
import HomeLink from '@common/HomeLink';
import Pagination from '@common/Pagination/Pagination';
import { StyledPrimaryButton } from '@styles/buttons';
import SemanticSearch from './SemanticSearch';
import QuestionsTableRow from './QuestionsTableRow';
import CircleGraphCard from './CircleGraphCard';
import { StyledCircleGraphCard, StyledExplorerPage } from './Styles';
import { useDropdownOptions, useQuestionsHttp, useTopicsHttp } from './Hooks';
import { StyledH1, StyledH2, StyledH3, StyledH4 } from '@styles/header';
import { Spinner } from '@styles/spinner';
import XLSXService from '@services/files/xlsxService';
import useTitle from '@hooks/useTitle';
import DropdownMultiple from '@common/DropdownMultiple';
import useTranscriptsWithGroupsDropdown from '@hooks/useTranscriptsWithGroupsDropdown';
import {
  GetQuestionsParams,
  transcriptSearchService,
} from '@services/http/transcriptSearch';
import { useAbortRef } from '@hooks/useAbortRef';
import usePagination from '@common/Pagination/Hooks';

const TranscriptsExplorerPage = () => {
  useTitle('Deposition Insight TM - Transcript Explorer');

  const abortRef = useAbortRef();

  const { transcriptOptions, dropdownLoading, groupOptions, dropdownError } =
    useDropdownOptions();

  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const { selectedTranscripts, setSelectedTranscripts } =
    useTranscriptsWithGroupsDropdown(selectedGroups, 'explorer');

  useEffect(() => {
    if (!selectedGroups.length) {
      window.history.replaceState(null, '', '/explorer');
      return;
    }
    window.history.replaceState(
      null,
      '',
      `/explorer/g/${selectedGroups.map(g => g.split(':')[0]).join(',')}`,
    );
  }, [selectedGroups]);

  const { id: paramId, type: paramType } = useParams<{
    id: string;
    type: 't' | 'g';
  }>();

  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (!initialized && transcriptOptions.length === 1) {
      const [onlyTranscript] = transcriptOptions;
      setSelectedTranscripts([onlyTranscript.value.toString()]);
      setInitialized(true);
    }
    if (!initialized && transcriptOptions.length > 0 && paramId) {
      const matchingOptions = (
        paramType === 't' ? transcriptOptions : groupOptions
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
  }, [transcriptOptions, paramId, initialized, groupOptions]);

  const { topics, refreshTopics, topicsLoading, topicalError } =
    useTopicsHttp();
  const {
    questions,
    totalQuestions,
    refreshQuestions,
    questionsLoading,
    questionsError,
  } = useQuestionsHttp();

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const refreshQuestionsLastParameters = useRef<GetQuestionsParams>();

  useEffect(() => {
    abortRef.current?.abort();
    const job_ids = selectedTranscripts.map(id => parseInt(id));
    refreshTopics(job_ids, selectedTopics);
    setPage(1);
    refreshQuestionsLastParameters.current = {
      job_ids: job_ids,
      topics: selectedTopics,
      pagination: { count: rowCount, page: page },
    };
    refreshQuestions(refreshQuestionsLastParameters.current);
  }, [selectedTopics]);

  useEffect(() => {
    setSelectedTopics([]);
  }, [selectedTranscripts]);

  const { page, setPage, setRowCount, rowCount } = usePagination(questions);
  useEffect(() => {
    const job_ids = selectedTranscripts.map(t => parseInt(t));
    refreshQuestionsLastParameters.current = {
      job_ids,
      topics: selectedTopics,
      query: refreshQuestionsLastParameters.current?.query,
      pagination: { count: rowCount, page: page },
    };
    refreshQuestions(refreshQuestionsLastParameters.current);
  }, [page, rowCount]);

  return (
    <StyledExplorerPage>
      <HomeLink />
      <StyledH1>Transcripts Explorer</StyledH1>
      <div className="sub-header">
        <p className="small-txt">
          Gain a deeper understanding of the deposition testimony and the facts
          of the case.
        </p>
      </div>
      <div className="header-with-dropdowns">
        <div className="header-content">
          <StyledH2>Select the Topic</StyledH2>
          <p className="small-txt">
            Search transcripts by concepts and semantic searching, not just text
            searches.
          </p>
        </div>

        <div className="dropdown-section">
          {dropdownLoading ? (
            <Spinner id="transcript-explorer-dropdown-spinner" />
          ) : dropdownError ? (
            <p>We've encountered an error. Our staff has been notified.</p>
          ) : (
            <div
              className="dropdown-container"
              data-testid="dropdown-container"
            >
              <DropdownMultiple
                id="transcript-explorer-dropdown"
                selectedOption={selectedTranscripts}
                setSelectedOption={setSelectedTranscripts}
                placeholder="Transcripts"
                options={transcriptOptions}
              />
              <DropdownMultiple
                id="transcript-groups-explorer-dropdown"
                selectedOption={selectedGroups}
                setSelectedOption={setSelectedGroups}
                placeholder="Groups"
                options={groupOptions}
              />
            </div>
          )}
        </div>
      </div>
      <section>
        <StyledCircleGraphCard>
          <StyledH4>Explore by Topic</StyledH4>
          <p className="small-txt">
            Explore major topics found throughout the transcript and select
            topic bubbles to drill down into subtopics.
          </p>
          {topicsLoading ? (
            <Spinner id="transcript-explorer-topics-spinner" />
          ) : topicalError ? (
            <StyledH4
              id="transcript-explorer-error-msg"
              style={{
                textAlign: 'center',
                paddingTop: '20%',
              }}
            >
              We've encountered an error. Our staff has been notified.
            </StyledH4>
          ) : transcriptOptions.length > 0 ? (
            selectedTranscripts.length > 0 ? (
              <CircleGraphCard
                data-testid="topical-graph"
                selectedTopics={selectedTopics}
                setTopics={setSelectedTopics}
                topics={topics}
              />
            ) : (
              <StyledH3
                id="transcript-explorer-select-msg"
                style={{
                  width: '100%',
                  height: '100%',
                  paddingTop: '80px',
                }}
              >
                Please select a transcript above.
              </StyledH3>
            )
          ) : (
            <StyledH3
              id="transcript-explorer-upload-msg"
              style={{ paddingTop: '80px' }}
            >
              To explore transcripts, please upload them from the Home page.
            </StyledH3>
          )}
        </StyledCircleGraphCard>
        <SemanticSearch
          search={(question: string) => {
            if (!selectedTranscripts.length) return;
            abortRef.current = new AbortController();
            const job_ids = selectedTranscripts.map(t => parseInt(t));
            refreshQuestionsLastParameters.current = {
              job_ids,
              query: question,
              pagination: { count: rowCount, page: 1 },
              abortSignal: abortRef.current.signal,
            };
            if (page === 1) {
              refreshQuestions(refreshQuestionsLastParameters.current);
              return;
            }
            setPage(1);
          }}
        />
      </section>
      <div className="sub-header ">
        <div className="text-content">
          <StyledH4>Responsive Questions</StyledH4>
          <p className="small-txt">
            Review the questions that are responsive to your concept and the
            semantic searches.
          </p>
        </div>
        <div className="btns-container">
          <StyledPrimaryButton
            id="transcript-explorer-export-questions-btn"
            disabled={questions?.length === 0}
            onClick={() =>
              transcriptSearchService
                .getQuestions({
                  ...refreshQuestionsLastParameters.current!,
                  pagination: {
                    page: 1,
                    count: 1000000,
                  },
                })
                .then(res => {
                  XLSXService.exportToExcel(
                    res.data.map(q => ({
                      Question: q.question,
                      Answer: q.answer,
                      Witness: q.answer_speaker,
                      'Page/Line': q.page_line,
                      ...(q.score !== undefined && { Score: q.score }),
                    })),
                  );
                })
            }
          >
            Export Results
          </StyledPrimaryButton>
        </div>
      </div>
      {questions.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(totalQuestions / rowCount)}
          handlePageChange={setPage}
          setRowCount={setRowCount}
          rowCount={rowCount}
        />
      )}
      {questionsLoading ? (
        <Spinner id="transcript-explorer-questions-spinner" />
      ) : (
        <Table
          headers={[
            <th style={{ gridColumn: '1 / 6' }}>Question/Answer Text</th>,
            <th>Attorney</th>,
            <th>Witness</th>,
            <th>Page: Line</th>,
            questions?.at(0)?.score ? <th>Score</th> : null,
          ]}
          rows={
            questionsError
              ? [
                  <span id="transcript-explorer-questions-error-msg">
                    We've encountered an error. Our staff has been notified.
                  </span>,
                ]
              : selectedTranscripts.length === 0
              ? []
              : questions.map(q => (
                  <QuestionsTableRow question={q} key={q.id} />
                ))
          }
        />
      )}
    </StyledExplorerPage>
  );
};

export default TranscriptsExplorerPage;
