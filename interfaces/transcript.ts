export interface Transcript {
  id: number;
  transcript_name: string;
  job_ids: {
    contradiction: number | 'Error';
    explorer: number | 'Error';
    summary: string | 'Error';
  };
  DepositionDate: string;
  MiddleName: string | null;
  FirstName: string;
  LastName: string;
}
