import { colors } from '@styles/colors';
import styled from 'styled-components';

export const StyledStatisticsPage = styled.div`
  .bordered-bottom {
    padding-bottom: 10px;
    margin-bottom: 30px;
    border-bottom: 1px solid ${colors.grey[12]};
  }
  .dropdown-container {
    margin-bottom: 30px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    label {
      width: 90%;
    }
  }
  .card-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
`;

export const StyledGraphCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 291px;
  border: solid 1px ${colors.grey[12]};
  position: relative;

  .rv-xy-plot {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    margin: 10px;
    text {
      font-size: 10px;
    }
  }

  .rv-xy-plot__axis--horizontal {
    text {
      transform: rotate(45deg) translateY(10px) translateX(10px);
    }
  }

  h3 {
    font-size: 24px;
    font-weight: 500;
    position: absolute;
    top: 15px;
    left: 15px;
  }

  .text-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    div {
      position: absolute;
      bottom: 30px;
      left: 15px;
    }
  }

  p {
    color: ${colors.grey[350]};
    font-size: 20px;
    line-height: 23.44px;
    margin-bottom: 10px;
  }
`;
