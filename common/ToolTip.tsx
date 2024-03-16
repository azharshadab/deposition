import { ReactNode, useEffect, useRef } from 'react';
import styled from 'styled-components';

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;

  &:hover .tooltip {
    visibility: visible;
    opacity: 1;
  }
`;

const TooltipText = styled.div`
  visibility: hidden;
  position: absolute;
  white-space: nowrap;
  width: min-content;
  min-width: min-content;
  right: 100%;
  transform: translate(-10%, -20%);
  background-color: #333;
  color: white;
  padding: 8px;
  border-radius: 4px;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s;
`;

interface TooltipProps {
  tooltipContent: ReactNode;
  children: ReactNode;
}

const Tooltip = ({ tooltipContent, children }: TooltipProps) => {
  return (
    <TooltipContainer>
      <TooltipText className="tooltip" data-testid = "tooltip-text">{tooltipContent}</TooltipText>
      {children}
    </TooltipContainer>
  );
};

export default Tooltip;
