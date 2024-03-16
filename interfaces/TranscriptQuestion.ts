export interface TranscriptQuestion {
  question: string;
  answer: string;
  question_speaker: string;
  answer_speaker: string;
  page_line: string;
  id: number;
  score?: number;
}
