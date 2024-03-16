import { httpService } from '@services/http';
import config from '@config';
export interface LawyerOption {
  id: number;
  name: string;
}
interface TranscriptStatOption {
  id: number;
  name: string;
  lawyers: LawyerOption[];
}
interface GroupStatOption {
  id: number;
  name: string;
  job_ids: string[];
  questioners: LawyerOption[];
}

export interface StatisticsOptions {
  transcripts: TranscriptStatOption[];
  groups: GroupStatOption[];
}

export interface LawyerStatistic {
  lawyer_name: string;
  num_que: number;
  avg_words: number;
  obj_ratio: number;
  strike_ratio: number;
}

class TranscriptStatisticsService {
  async getDropdownOptions(): Promise<StatisticsOptions> {
    const res = await httpService.get<{ body: string }>(
      config.TranscriptAnalysis.AWSApiGateway.GetStatsFilterDataDev,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        useAuthToken: true,
        useUsername: true,
      },
    );
    const parsed = JSON.parse(res.data.body) as StatisticsOptions;
    return parsed;
  }

  async getStatistics(lawyer_ids: number[] = []) {
    if (lawyer_ids.length === 0) return [];

    const res = await httpService.get<{ body: string }>(
      config.TranscriptAnalysis.AWSApiGateway.GetStatsDev,
      {
        useAuthToken: true,
        useUsername: true,
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          lawyer_ids: `"${lawyer_ids.join(',')}"`,
        },
      },
    );
    const parsed = JSON.parse(res.data.body) as LawyerStatistic[];

    return parsed;
  }
}

export const transcriptStatisticsService = new TranscriptStatisticsService();
