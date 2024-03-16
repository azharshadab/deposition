import { StyledRow } from '@styles/table';
import { useBoolean } from '@hooks/useBoolean';
import Checkbox from '@common/CheckBox';
import styled from 'styled-components';
import { TranscriptQuestion } from '@interfaces/TranscriptQuestion';

interface Props {
  question: TranscriptQuestion;
}

const StyledQARow = styled(StyledRow)`
  &:hover .answer {
    display: flex;
  }
  .answer {
    display: none;
  }
  .qa-pair {
    display: flex;
    flex-direction: column;
  }

  td:first-of-type {
    grid-column: 1 / 6;
  }
`;

export default function QuestionsTableRow({ question }: Props) {
  const [checked, toggleChecked] = useBoolean(false);
  return (
    <StyledQARow
      data-testid="transcript-explorer-question-row"
      className={checked ? 'checked' : ''}
    >
      <td>
        <Checkbox
          data-testid={`transcript-explorer-question-checkbox-${question.id}`}
          onChange={toggleChecked}
          checked={checked}
        />
        <div className="qa-pair">
          <span
            data-testid={`transcript-explorer-question-${question.id}`}
            className="question"
          >
            Q: {question.question}
          </span>
          <span
            data-testid={`transcript-explorer-question-answer-${question.id}`}
            className="answer"
          >
            A: {question.answer}
          </span>
        </div>
      </td>
      <td data-testid={`transcript-explorer-question-speaker-${question.id}`}>
        {question.question_speaker}
      </td>
      <td
        data-testid={`transcript-explorer-question-answerer-speaker-${question.id}`}
      >
        {question.answer_speaker}
      </td>
      <td data-testid={`transcript-explorer-question-page-line-${question.id}`}>
        {question.page_line}
      </td>
      {question.score && (
        <td data-testid={`transcript-explorer-question-score-${question.id}`}>
          {question.score}%
        </td>
      )}
    </StyledQARow>
  );
}
