import styled from 'styled-components';
import { colors } from '@styles/colors';
import { StyledH4 } from '@styles/header';
import SearchBarOnEnter from '@common/SearchBarOnEnter';
import { ChangeEvent, useState } from 'react';
import Image from '@common/Image';
import Tooltip from '@common/ToolTip';

const StyledSemanticSearch = styled.div`
  .radio-options {
    margin-top: 20px;
  }
  .search-bar {
    margin-top: 20px;
  }
  .search-header {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
  }
`;

const StyledRadio = styled.label`
  font-size: 14px;
  line-height: 22px;
  border: #d1d1d3 solid 1px;
  width: 100%;
  display: flex;
  padding: 10px;
  margin: 4px 0px;
  input {
    accent-color: ${colors.secondary.border};
    margin-right: 10px;
  }
`;

interface Props {
  search: (value: string) => any;
}

export default function SemanticSearch({ search }: Props) {
  const [query, setQuery] = useState('');

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    search(e.target.value);
    setQuery(e.target.value);
  };

  return (
    <StyledSemanticSearch>
      <StyledH4>Explore by Similar Question</StyledH4>
      <p className="small-txt">
        Semantic search pulls similar questions to a searched concept or topic.
      </p>
      <div className="search-header">
        <SearchBarOnEnter
          secondary={true}
          id="transcript-explorer-semantic-search-input"
          style={{
            width: '98%',
          }}
          placeholder="Semantic Search"
          onSearch={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
          value={query}
        />
        <Tooltip
          tooltipContent={
            <>
              Enter the kind of question you want to find.
              <br /> This search will look for questions with
              <br /> a similar meaning even if it doesn't
              <br /> have the same keywords.
            </>
          }
        >
          <Image
            src="/question-mark-circle.svg"
            style={{ width: '33px', height: '33px' }}
          />
        </Tooltip>
      </div>
      <div className="radio-options">
        <StyledRadio htmlFor="transcript-explorer-semantic-search-option1">
          <input
            type="radio"
            id="transcript-explorer-semantic-search-option1"
            name="option"
            value="Who signed the contract?"
            onChange={handleRadioChange}
          />
          Who signed the contract?
        </StyledRadio>
        <StyledRadio htmlFor="transcript-explorer-semantic-search-option2">
          <input
            type="radio"
            id="transcript-explorer-semantic-search-option2"
            name="option"
            value="Which factors contributed to this situation?"
            onChange={handleRadioChange}
          />
          Which factors contributed to this situation?
        </StyledRadio>
        <StyledRadio htmlFor="transcript-explorer-semantic-search-option3">
          <input
            type="radio"
            id="transcript-explorer-semantic-search-option3"
            name="option"
            value="Which employee was most involved in this?"
            onChange={handleRadioChange}
          />
          Which employee was most involved in this?
        </StyledRadio>
        <StyledRadio htmlFor="transcript-explorer-semantic-search-option4">
          <input
            type="radio"
            id="transcript-explorer-semantic-search-option4"
            name="option"
            value="Were you surprised by the outcome?"
            onChange={handleRadioChange}
          />
          Were you surprised by the outcome?
        </StyledRadio>
        <StyledRadio htmlFor="transcript-explorer-semantic-search-option5">
          <input
            type="radio"
            id="transcript-explorer-semantic-search-option5"
            name="option"
            value="What did you learn from your colleague?"
            onChange={handleRadioChange}
          />
          What did you learn from your colleague?
        </StyledRadio>
      </div>
    </StyledSemanticSearch>
  );
}
