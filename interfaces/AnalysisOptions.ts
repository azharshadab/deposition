export interface GroupOption {
  job_ids: number[];
  id: number;
  name: string;
}

interface TranscriptOption {
  id: number;
  DeponentName: string;
}

export interface AnalysisOptions {
  groups: GroupOption[];
  transcripts: TranscriptOption[];
}
