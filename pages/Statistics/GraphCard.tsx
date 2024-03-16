import { StyledLinkAsButton } from '@styles/link';
import { StyledH3 } from '@styles/header';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalBarSeries,
  Hint,
  VerticalBarSeriesPoint,
  HorizontalGridLines,
} from 'react-vis';
import useElementSize from '@hooks/useElementSize';
import { HTMLAttributes, PropsWithChildren, useRef, useState } from 'react';
import { StyledGraphCard } from './Styles';
import styled from 'styled-components';

export const DummyCard = ({
  children,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLElement>>) => (
  <StyledGraphCard>
    <StyledH3 {...rest}>{children}</StyledH3>
  </StyledGraphCard>
);

interface GraphData {
  label: string;
  quantity: number;
}

interface Props extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode;
  mainCardIdentifier: string;
  stats: GraphData[];
  setMainCard: (value: string) => void;
  isMainCard: boolean;
}

const StyledToolTip = styled(Hint<{ id: string }>)`
  background-color: black;
  color: white;
  opacity: 0.9;
  width: fit-content;
  padding: 1rem;
`;

const GraphCard = ({
  title,
  mainCardIdentifier,
  stats,
  setMainCard,
  isMainCard,
  ...rest
}: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { width, height } = useElementSize(ref, isMainCard);
  const [hoveredCell, setHoveredCell] = useState<VerticalBarSeriesPoint>();

  return (
    <StyledGraphCard {...rest} ref={ref}>
      <div className="text-content">
        <StyledH3 data-testid={`statistics-card-title`}>{title}</StyledH3>
        <div>
          {!isMainCard && (
            <StyledLinkAsButton
              data-testid={`statistics-card-${title}-details-btn`}
              onClick={() => setMainCard(mainCardIdentifier)}
            >
              View Details
            </StyledLinkAsButton>
          )}
        </div>
      </div>
      <XYPlot xType="ordinal" width={width - 200} height={height}>
        <HorizontalGridLines style={{ stroke: '#AAA' }} />
        <VerticalBarSeries
          onValueMouseOver={datapoint => setHoveredCell(datapoint)}
          onValueMouseOut={() => setHoveredCell(undefined)}
          barWidth={0.25}
          data={stats.map(s => ({ x: s.label, y: s.quantity }))}
        />
        <VerticalBarSeries
          onValueMouseOver={datapoint => setHoveredCell(datapoint)}
          onValueMouseOut={() => setHoveredCell(undefined)}
          barWidth={0.25}
          data={[{ x: '', y: 1 }]}
          style={{
            stroke: 'transparent',
            fill: 'transparent',
          }}
        />
        {hoveredCell && (
          <StyledToolTip
            id="statistics-tooltip"
            value={{ count: hoveredCell.y }}
          />
        )}
        <XAxis />
        <YAxis />
      </XYPlot>
    </StyledGraphCard>
  );
};

export default GraphCard;
