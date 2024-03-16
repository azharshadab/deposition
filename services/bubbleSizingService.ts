import { GraphCircle } from '@interfaces/GraphCircle';
import { TopicSize } from '@interfaces/TopicSize';
import { Size } from '@interfaces/size';

type Position = {
  topic: string;
  radius: number;
  posX: number;
  posY: number;
};

export class BubbleSizingService {
  private scaleBubbles(topics: TopicSize[], h: number, w: number): number {
    const avg = topics.reduce((a, b) => a + b.radius, 0) / topics.length;
    const maxR = Math.min(h, w) / 2;
    const optimumScale = maxR / (avg * 2);
    return optimumScale;
  }

  private findBestFit(
    positions: Position[],
    radius: number,
    h: number,
    w: number,
  ): [number | null, number | null] {
    const roundedRadius = Math.round(radius);
    const roundedH = Math.round(h);
    const roundedW = Math.round(w);

    for (
      let posY = roundedRadius;
      posY <= roundedH - roundedRadius;
      posY += roundedRadius * 2
    ) {
      for (
        let posX = roundedRadius;
        posX <= roundedW - roundedRadius;
        posX += roundedRadius * 2
      ) {
        if (
          positions.every(
            ({ posX: x, posY: y }) =>
              Math.sqrt((posX - x) ** 2 + (posY - y) ** 2) >=
              Math.floor(1.5 * roundedRadius),
          )
        ) {
          return [posX, posY];
        }
      }
    }
    return [null, null];
  }

  private determinePositionsOnGrid(
    topics: TopicSize[],
    h: number,
    w: number,
  ): Position[] {
    const sortedTopics = [...topics].sort((a, b) => b.radius - a.radius);
    const positions: Position[] = [];
    for (const { radius, topic } of sortedTopics) {
      const [posX, posY] = this.findBestFit(positions, radius, h, w);
      if (posX !== null && posY !== null) {
        positions.push({ topic, radius, posX, posY });
      }
    }
    return positions;
  }

  public getGraphedTopics(topics: TopicSize[], size: Size): GraphCircle[] {
    const winHeight = size?.height ?? 0;
    const winWidth = size?.width ?? 0;
    const maxR = Math.min(winHeight, winWidth) / 2;
    const minR = 56;

    const scalingFactor = this.scaleBubbles(topics, winHeight, winWidth);
    const scaledTopics = topics.map(({ radius, topic }) => ({
      radius: Math.max(
        Math.min(Math.round(radius * scalingFactor), maxR),
        minR,
      ),
      topic,
    }));

    const bubblePositions = this.determinePositionsOnGrid(
      scaledTopics,
      winHeight,
      winWidth,
    );

    return bubblePositions;
  }
}

export const bubbleSizingService = new BubbleSizingService();
