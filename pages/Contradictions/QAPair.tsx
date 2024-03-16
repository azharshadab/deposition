import styled from 'styled-components';

const StyledQAPair = styled.div`
  margin: 10px;
  padding: 10px;
  position: relative;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-evenly;
  b {
    font-size: 16px;
    line-height: 19px;
    color: #000;
  }
  p {
    margin: 10px 0px;
  }
  .page-line {
    position: absolute;
    bottom: 10px;
    right: 40px;
    color: #909090;
    font-size: 14px;
  }
`;

interface Props {
  first: boolean;
  id: number;
  question: string;
  answer: string;
  page: string;
  line: string;
  witness: string;
}

function QAPair({ question, answer, page, line, witness, id, first }: Props) {
  return (
    <StyledQAPair className="qa-pair">
      <div className="segment">
        <b>Witness:</b>
        <br />
        <p
          data-testid={`transcript-contradictions-${
            first ? 'first' : 'second'
          }-witnes-${id}`}
          className="small-txt"
        >
          {witness}
        </p>
      </div>
      <div className="segment">
        <b>Question:</b>
        <br />
        <p
          data-testid={`transcript-contradictions-${
            first ? 'first' : 'second'
          }-question-${id}`}
          className="small-txt"
        >
          {question}
        </p>
      </div>
      <div className="segment">
        <b>Answer:</b>
        <br />
        <p
          data-testid={`transcript-contradictions-${
            first ? 'first' : 'second'
          }-answer-${id}`}
          className="small-txt"
        >
          {answer}
        </p>
      </div>
      <span className="small-txt page-line">
        Page: Line{' '}
        <span
          data-testid={`transcript-contradictions-${
            first ? 'first' : 'second'
          }-page-line-${id}`}
        >
          {page}:{line}
        </span>
      </span>
    </StyledQAPair>
  );
}

export default QAPair;
