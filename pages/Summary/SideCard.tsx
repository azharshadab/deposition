import { StyledLink } from '@styles/link';
import styled from 'styled-components';
import { colors } from '@styles/colors';

const StyledSideCard = styled.div`
  border: solid 1px ${colors.grey[12]};
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
  & > div {
    border: solid 1px ${colors.grey[12]};
    padding: 12px;
    height: 150px;
    width: 100%;
  }
  .header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    h5 {
      font-size: 16px;
      color: ${colors.grey[350]};
    }
  }
  ul {
    width: 100%;
    margin: 0 auto;
    padding: 20px 0px;
  }
  li {
    display: inline;
    font-size: 14px;
    line-height: 21px;
    font-weight: 400;
    color: ${colors.grey[350]};
  }
`;

type SideCardProps = {
  clusteringId: number;
  keywords?: string[];
  numberOfWords?: number;
  averageWords?: number;
  objectionRatio?: number;
  strikeRatio?: number;
  contradiction?: number;
  average?: number;
};

export default function SideCard({
  keywords = [],
  numberOfWords,
  averageWords,
  objectionRatio,
  strikeRatio,
  contradiction,
  average,
  clusteringId,
}: SideCardProps) {
  return (
    <StyledSideCard>
      <div>
        <div className="header">
          <h5>KeyWords:</h5>
          <StyledLink to={`/explorer/t/${clusteringId}`}>
            View Explorer
          </StyledLink>
        </div>
        <ul>
          {keywords.map((keyword, index) => (
            <li key={index}>
              {keyword}
              {index < keywords.length - 1 ? ',' : ''}
            </li>
          ))}
        </ul>
      </div>

      <StyledMiniCard>
        <div>
          <span>No of words</span>
          <b data-testid="number-of-words">{numberOfWords || ''}</b>
        </div>
        <div>
          <span>Average Words Per Question</span>
          <b data-testid="average-words">{averageWords || ''}</b>
        </div>
      </StyledMiniCard>

      <StyledMiniCard>
        <div>
          <span>Objection Ratio</span>
          <b data-testid="objection-ratio">{objectionRatio || ''}</b>
        </div>
        <div>
          <span>Strike Ratio</span>
          <b data-testid="strike-ratio">{strikeRatio || ''}</b>
        </div>
      </StyledMiniCard>

      <StyledMiniCard>
        <div>
          <span>Contradiction</span>
          <b data-testid="contradiction">{contradiction || ''}</b>
        </div>
        <div>
          <span>Average %</span>
          <b data-testid="average-percentage">{average || ''}</b>
        </div>
      </StyledMiniCard>
    </StyledSideCard>
  );
}

const StyledMiniCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    height: 100%;
    padding: 20px 20px;
    border-left: solid 1px ${colors.grey[12]};
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-direction: column;
    text-align: left;
    span {
      font-size: 14px;
      line-height: 21px;
      font-weight: 400;
      color: ${colors.grey[350]};
    }
    b {
      font-weight: 600;
      font-size: 32px;
    }
  }
`;
