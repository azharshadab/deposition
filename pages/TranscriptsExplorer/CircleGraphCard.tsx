import { useElementDimensions } from '@hooks/useElementDimensions';
import { GraphCircle } from '@interfaces/GraphCircle';
import { TopicSize } from '@interfaces/TopicSize';
import { bubbleSizingService } from '@services/bubbleSizingService';
import {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
} from 'react';

function getBackgroundColor() {
  const num = Math.floor(Math.random() * 3) + 1;
  switch (num) {
    case 1:
      return '#087579';
    case 2:
      return '#009EA8';
    case 3:
      return '#25B9C1';
  }
}

interface Props {
  selectedTopics: string[];
  topics: TopicSize[];
  setTopics: Dispatch<SetStateAction<string[]>>;
}

export default function CircleGraphCard({
  topics,
  setTopics,
  selectedTopics,
}: Props) {
  const [size, ref] = useElementDimensions();

  const graphedTopics = useMemo(() => {
    if (!size) return [];
    return bubbleSizingService.getGraphedTopics(topics, size);
  }, [size, topics]);
  return (
    <>
      <div className="breadcrumbs">
        <button
          id="transcript-explorer-breadcrumbs-reset-btn"
          data-testid="all-topics-button"
          disabled={selectedTopics.length === 0}
          onClick={() => setTopics([])}
        >
          All Topics {selectedTopics.length >= 1 && '>'}
        </button>
        {selectedTopics.map((t, index) => (
          <button
            data-testid={`transcript-explorer-breadcrumbs-reset-${t}`}
            disabled={index === selectedTopics.length - 1}
            onClick={() =>
              setTopics(prevTopics => prevTopics.slice(0, index + 1))
            }
          >
            {t} {index !== selectedTopics.length - 1 && '>'}
          </button>
        ))}
      </div>
      <ul className="graph" ref={ref as any}>
        {topics.length === 0 ? (
          <span id="transcript-explorer-no-topics-msg">
            The topic you selected has no relevant subtopics
          </span>
        ) : (
          graphedTopics.map(t => (
            <TopicalBubble
              key={t.topic}
              topic={t}
              handleClick={() =>
                setTopics(prevTopics => [...prevTopics, t.topic])
              }
            />
          ))
        )}
      </ul>
    </>
  );
}

interface BubbleProps {
  topic: GraphCircle;
  handleClick: () => void;
}

const TopicalBubble = ({ topic, handleClick }: BubbleProps) => {
  const bgColor = useMemo(getBackgroundColor, []);
  const ref = useRef<HTMLElement>();

  useEffect(() => {
    function updateSize() {
      if (ref.current) {
        const width = ref.current.offsetWidth;
        ref.current.style.height = `${width}px`;
      }
    }

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <li
      ref={ref as RefObject<HTMLLIElement>}
      style={{
        backgroundColor: bgColor,
        left: `${topic.posX - 50}px`,
        bottom: `${topic.posY - 50}px`,
        width: `${topic.radius}px`,
        height: `${topic.radius}px`,
      }}
      onClick={handleClick}
    >
      <span data-testid={`transcript-explorer-topical-bubble-${topic.topic}`}>
        {topic.topic}
      </span>
    </li>
  );
};
