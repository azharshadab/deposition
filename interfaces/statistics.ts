import { LawyerOption } from '@services/http/transcriptStatistics';

export interface StatTranscriptOption {
  label: string;
  value: string;
  lawyers: LawyerOption[];
}
