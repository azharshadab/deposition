import { colors } from '@styles/colors';
import styled from 'styled-components';

export const StyledPagination = styled.div`
  font-size: 13px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: baseline;
  position: relative;
  .page-btn {
    width: 32px;
    height: 32px;
    margin: 8px;
    border: 1px solid ${colors.grey[400]};
    border-radius: 2px;
    &.current {
      background-color: ${colors.secondary.border};
      color: ${colors.grey[0]};
    }
  }

  button:disabled {
    color: ${colors.grey[80]};
  }
  .trailing-dots {
    padding: 8px;
    margin: 8px;
  }

  .vl {
    border-left: 1px solid ${colors.grey[400]};
    height: 30px;
    margin: 0 20px;
    align-self: center;
  }

  button {
    margin: 10px;
  }

  .box-input {
    width: 49px;
    height: 33px;
    text-align: center;
    margin-left: 10px;
  }

  .row-label {
    position: absolute;
    right: 0;
    bottom: 10px;
  }
`;
