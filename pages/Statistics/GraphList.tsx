import { LawyerStatistic } from '@services/http/transcriptStatistics';
import GraphCard from './GraphCard';

interface Props {
  mainCard: string;
  setMainCard: (value: string) => void;
  currentStats: LawyerStatistic[];
}

export function GraphList({ mainCard, setMainCard, currentStats }: Props) {
  return (
    <>
      {(!mainCard || mainCard === 'No. of Questions') && (
        <GraphCard
          id="statistics-questions-card"
          setMainCard={setMainCard}
          isMainCard={mainCard === 'No. of Questions'}
          mainCardIdentifier="No. of Questions"
          title="No. of Questions"
          stats={currentStats.map(s => ({
            label: s.lawyer_name,
            quantity: s.num_que,
          }))}
        />
      )}
      {(!mainCard || mainCard === 'Average Words Per Question') && (
        <GraphCard
          id="statistics-words-card"
          setMainCard={setMainCard}
          isMainCard={mainCard === 'Average Words Per Question'}
          mainCardIdentifier="Average Words Per Question"
          title={
            <>
              <span>Average Words </span>
              <br />
              <span>Per Question</span>
            </>
          }
          stats={currentStats.map(s => ({
            label: s.lawyer_name,
            quantity: s.avg_words,
          }))}
        />
      )}
      {(!mainCard || mainCard === 'Objection Ratio') && (
        <GraphCard
          id="statistics-objection-card"
          setMainCard={setMainCard}
          isMainCard={mainCard === 'Objection Ratio'}
          mainCardIdentifier="Objection Ratio"
          title="Objection Ratio"
          stats={currentStats.map(s => ({
            label: s.lawyer_name,
            quantity: s.obj_ratio,
          }))}
        />
      )}
      {(!mainCard || mainCard === 'Strike Ratio') && (
        <GraphCard
          id="statistics-strike-card"
          setMainCard={setMainCard}
          isMainCard={mainCard === 'Strike Ratio'}
          mainCardIdentifier="Strike Ratio"
          title="Strike Ratio"
          stats={currentStats.map(s => ({
            label: s.lawyer_name,
            quantity: s.strike_ratio,
          }))}
        />
      )}
    </>
  );
}
