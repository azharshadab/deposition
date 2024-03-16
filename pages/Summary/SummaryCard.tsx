import styled from 'styled-components';
import { colors } from '@styles/colors';

const StyledSummaryCard = styled.div`
  border: solid 1px ${colors.grey[12]};
  padding: 20px;
  h4 {
    font-weight: 500;
    font-size: 20px;
  }
  .sub-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    color: ${colors.grey[300]};
    b {
      color: black;
    }
    .date {
      font-size: 16px;
    }
  }
  .txt {
    margin-top: 35px;
    padding-top: 13px;
    border-top: solid 1px ${colors.grey[12]};
    font-size: 14px;
    line-height: 21px;
    p {
      padding-bottom: 30px;
    }
  }
`;

interface SummaryCardProps {
  textContent: string;
  attorneyName: string;
  date?: string;
}

export default function SummaryCard({
  textContent,
  attorneyName,
  date,
}: SummaryCardProps) {
  return (
    <StyledSummaryCard>
      <div>
        <div className="sub-header">
          <span>
            Attorney Name: <b>{attorneyName}</b>{' '}
          </span>
          {date && (
            <span data-testid="deposition-date" className="date">
              Date: <span id="summary-transcript-date">{date}</span>
            </span>
          )}
        </div>
      </div>
      <div className="txt">
        Details:
        <p id="summary-transcript-content">{textContent}</p>
      </div>
    </StyledSummaryCard>
  );
}
