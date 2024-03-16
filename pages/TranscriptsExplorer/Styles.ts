import { colors } from '@styles/colors';
import styled from 'styled-components';

export const StyledExplorerPage = styled.div`
  .sub-header {
    display: flex;
    margin-top: 20px;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 10px;
    &:first-of-type {
      border-bottom: 1px solid ${colors.grey[12]};
    }
    margin-bottom: 20px;
    .btns-container {
      display: flex;
      align-items: baseline;
    }

    &:nth-of-type(2) {
      margin-top: 45px;
    }
  }

  h3 {
    margin-top: 32px;
  }

  .header-with-dropdowns {
    display: flex;
    justify-content: space-between;
    align-items: center; // Aligns items vertically at the same height
    padding-right: 20px; 
    margin-top: 40px;// Adjust as necessary
    }

  .dropdown-section {
    display: flex;
    justify-content: flex-end; // Aligns content to the right
    padding-right: 20px; // Adjusts padding for alignment, can be changed as needed
    margin-top: 20px; // Space below the sub-header
  }

  .dropdown-container {
    display: flex;
    gap: 10px; // Adds some space between the dropdowns
  }

  section {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StyledCircleGraphCard = styled.div`
  border-right: 1px solid ${colors.grey[12]};
  margin-right: 10px;
  .graph {
    border: 1px solid ${colors.grey[12]};
    width: 98%;
    height: 280px;
    background-color: #fffbf4;
    margin-top: 20px;
    margin-right: 12px;
    position: relative;
    li {
      @keyframes grow {
        0% {
          transform: scale(1);
        }
        100% {
          transform: scale(1.5);
          color: black;
          font-weight: 500;
        }
      }
      cursor: pointer;
      border-radius: 50%;
      position: absolute;
      background-color: ${colors.secondary.background};
      color: white;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px;
      height: auto;
      min-width: min-content;
      &:hover {
        animation: grow 300ms forwards;
        overflow: visible;
        z-index: 3;
      }
    }
  }
  .breadcrumbs {
    margin-top: 10px;
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
    button {
      margin-right: 10px;
    }
  }
`;
