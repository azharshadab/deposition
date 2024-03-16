import { authenticationService } from '@services/authentication';
import { httpService } from '.';
import config from '@config';
import { TranscriptSummary } from '@interfaces/summary';

export interface SummaryOption {
  job_id: string;
  transcript: string;
}

export interface TranscriptSpecificSummary {
  Transcript: string;
  SearchData: string;
  status: string;
}

interface SummarySearchRes {
  Transcript: string;
  SearchData: string;
  status: 'done' | 'pending' | 'failed';
}
class TranscriptSummaryService {
  async getSummary(job_id: string) {
    const res = await httpService.get<{ body: TranscriptSummary }>(
      config.TranscriptAnalysis.AWSApiGateway.GetSummary,
      {
        useAuthToken: true,
        params: {
          job_id,
        },
      },
    );
    return res.data.body;
  }

  async getDropdownOptions() {
    const payload = await authenticationService.getUserPayload();
    const res = await httpService.post<{
      errorMessage?: string;
      body?: string;
    }>(
      config.TranscriptAnalysis.AWSApiGateway.GetSummarizationFilterData,
      JSON.stringify({
        username: payload?.['cognito:username'],
      }),
      {
        maxBodyLength: Infinity,
        useAuthToken: false,
        useUsername: false,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    if (res.data.errorMessage) throw res.data.errorMessage;
    return JSON.parse(res.data.body!) as SummaryOption[];
  }

  async getSpecificSummary(
    id: string,
    query: string,
    abortSignal: AbortSignal,
    retryCount = 0,
  ): Promise<string> {
    if (abortSignal.aborted) throw 'aborted';
    const res = await httpService.post<SummarySearchRes>(
      config.TranscriptAnalysis.AWSApiGateway.SearchSummary,
      JSON.stringify({
        job_id: id,
        query,
      }),
      {
        useAuthToken: true,
        useUsername: false,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (res.data.status === 'done') {
      return res.data.SearchData;
    }

    if (res.data.status === 'pending') {
      if (retryCount === config.TranscriptAnalysis.FeatureFlags.RetryLimit)
        throw 'exceeded the retry limit';
      await new Promise(resolve =>
        setTimeout(
          resolve,
          config.TranscriptAnalysis.FeatureFlags.RetryRateSeconds * 1000,
        ),
      );
      return this.getSpecificSummary(id, query, abortSignal, retryCount + 1);
    }

    throw 'there seems to have been an error getting your search. Please try again later.';
  }
}

export const transcriptSummaryService = new TranscriptSummaryService();
