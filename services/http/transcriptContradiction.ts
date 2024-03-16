import { httpService } from '.';
import config from '@config';
import { Contradiction } from '@interfaces/contradiction';
import { Pagination } from '@interfaces/pagination';

interface OptionsResponse {
  transcripts: { id: number; name: string }[];
  groups: { id: number; job_ids: number[]; name: string }[];
}

export interface ContradictionOptions {
  transcripts: { value: string; label: string }[];
  groups: { value: string; label: string }[];
}

export type SortOrder = 'score' | 'chronological';

export interface ContradictionsResponse {
  data: Contradiction[];
  total_count: number;
}

class TranscriptContradictionsService {
  async getDropdownOptions(): Promise<ContradictionOptions> {
    const res = await httpService.get<{ body: string }>(
      config.TranscriptAnalysis.AWSApiGateway.GetAnomaliesFilter,
      {
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
        useAuthToken: true,
        useUsername: true,
      },
    );
    const parsed = JSON.parse(res.data.body) as OptionsResponse;

    const options = {
      transcripts: parsed.transcripts.map(t => ({
        label: t.name,
        value: t.id.toString(),
      })),
      groups: parsed.groups.map(g => ({
        label: g.name,
        value: g.id + ':' + g.job_ids.join(','),
      })),
    };

    return options;
  }

  async getAnomalies(
    trasncriptIds: string[],
    pagination: Pagination,
    sortOrder: SortOrder,
  ): Promise<ContradictionsResponse> {
    const res = await httpService.get<{ body: string }>(
      config.TranscriptAnalysis.AWSApiGateway.GetAnomalies,
      {
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
        useAuthToken: true,
        useUsername: true,
        params: {
          t_ids: trasncriptIds.join(','),
          page: pagination.page,
          count: pagination.count,
          sort_order: sortOrder,
        },
      },
    );

    const parsed = JSON.parse(res.data.body) as ContradictionsResponse;

    return parsed;
  }

  async deleteAnomaly(anomalyId: number) {
    return httpService.delete(
      config.TranscriptAnalysis.AWSApiGateway.DeleteAnomaly,
      {
        useUsername: false,
        useAuthToken: true,
        params: {
          anomalyId,
        },
      },
    );
  }
}

export const transcriptContradictionsService =
  new TranscriptContradictionsService();
