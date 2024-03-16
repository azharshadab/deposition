import styled from 'styled-components';
import { StyledPrimaryButton } from '@styles/buttons';
import { StyledH4 } from '@styles/header';
import Image from '@common/Image';
import { colors } from '@styles/colors';
import QAPair from './QAPair';
import { Contradiction } from '@interfaces/contradiction';

const StyledContradictionCard = styled.div`
  border: 1px solid ${colors.grey[12]};
  margin-bottom: 20px;

  h4 {
    font-weight: 500;
    margin-top: 12px;
  }
  .card-header {
    height: 69px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid ${colors.grey[12]};
    position: relative;
    .score {
      font-size: 16px;
      padding: 10px;
      border: 1px solid ${colors.grey[12]};
      span {
        color: #2e2e2e;
        font-weight: 600;
        font-size: 20px;
      }
    }
    button {
      font-size: 14px;
      padding: 10px;
    }
    .img {
      width: 15px;
      height: 15px;
    }
  }
  max-height: min-content;
  .content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    height: 100%;
    min-height: min-content;
    .qa-pair:first-of-type {
      border-right: 1px solid ${colors.grey[12]};
    }
  }
`;

const StyledContradictionHeader = styled(StyledH4)`
  width: 35%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface Props {
  contradiction: Contradiction;
  handleDelete: () => void;
}

const ContradictionCard = ({ contradiction, handleDelete }: Props) => {
  return (
    <StyledContradictionCard>
      <div className="card-header">
        <div className="score">
          Contradiction Score:{' '}
          <span data-testid={`transcript-contradictions-score-${contradiction.id}`}
          >
          {contradiction.score}%
          </span>
        </div>
        <StyledPrimaryButton
          onClick={handleDelete}
          data-testid={`transcript-contradictions-delete-btn`}
        >
          <Image src="/trash_can.svg" /> Not a contradiction? &nbsp;&nbsp;
          Remove from Results
        </StyledPrimaryButton>
      </div>
      <div className="content">
        <QAPair
          first={true}
          id={contradiction.id}
          witness={contradiction.witness1}
          question={contradiction.que1}
          answer={contradiction.ans1}
          line={contradiction.line1}
          page={contradiction.page1}
        />
        <QAPair
          first={false}
          id={contradiction.id}
          witness={contradiction.witness2}
          question={contradiction.que2}
          answer={contradiction.ans2}
          line={contradiction.line2}
          page={contradiction.page2}
        />
        
      </div>
    </StyledContradictionCard>
  );
};

export default ContradictionCard;
