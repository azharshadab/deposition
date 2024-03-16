import { AnalysisOptions } from '@interfaces/AnalysisOptions';
import { httpService } from '.';
import config from '@config';
import { TopicSize } from '@interfaces/TopicSize';
import { TranscriptQuestion } from '@interfaces/TranscriptQuestion';
import { Pagination } from '@interfaces/pagination';

export interface QuestionsResponse {
  data: TranscriptQuestion[];
  total: number;
}

interface SearchResponse extends QuestionsResponse {
  done: 0 | 1;
  data: TranscriptQuestion[];
  total: number;
}

export interface GetQuestionsParams {
  job_ids: number[];
  topics?: string[];
  query?: string;
  abortSignal?: AbortSignal;
  pagination: Pagination;
}

const RETRY_RATE_MS =
  config.TranscriptAnalysis.FeatureFlags.RetryRateSeconds * 1000;
const RETRY_LIMIT = config.TranscriptAnalysis.FeatureFlags.RetryLimit;

class TranscriptSearchService {
  async getDropdownOptions(): Promise<AnalysisOptions> {
    const res = await httpService.get<{ body: string }>(
      config.TranscriptAnalysis.AWSApiGateway.GetAnalysisFilterUrl,
      {
        useAuthToken: true,
        useUsername: true,
      },
    );
    const parsed = JSON.parse(res.data.body) as AnalysisOptions;
    return parsed;
  }

  async getTopics(ids: number[], topics: string[] = []) {
    const res = await httpService.get(
      config.TranscriptAnalysis.AWSApiGateway.GetAnalysisBubbles,
      {
        useAuthToken: true,
        useUsername: false,
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          job_ids: ids.join(','),
          topics: topics.join(','),
        },
      },
    );
    const parsed = JSON.parse(res.data.body) as TopicSize[];
    return parsed;
  }

  async getQuestions({
    job_ids,
    topics = [],
    query,
    pagination,
    abortSignal,
  }: GetQuestionsParams) {
    if (query)
      return this.semanticSearch(job_ids, query, pagination, abortSignal);

    const res = await httpService.get<{ body: string }>(
      config.TranscriptAnalysis.AWSApiGateway.GetTopicwiseQuestions,
      {
        useAuthToken: true,
        useUsername: false,
        params: {
          count: pagination.count,
          page: pagination.page,
          job_ids: job_ids.join(','),
          topics: topics.join(','),
        },
      },
    );
    const parsed = JSON.parse(res.data.body) as QuestionsResponse;
    return parsed;
  }

  private async getSearchResults(
    job_ids: number[],
    query: string,
    model: string,
    pagination: Pagination,
    signal?: AbortSignal,
    retryCount = 0,
  ): Promise<QuestionsResponse> {
    if (signal?.aborted) throw 'cancelled the http call';
    const res = await httpService.get<{ body: string }>(
      config.TranscriptAnalysis.AWSApiGateway.GetResults,
      {
        useAuthToken: true,
        useUsername: true,
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          count: pagination.count,
          page: pagination.page,
          job_ids: job_ids.join(','),
          q: query,
          model: model,
        },
      },
    );
    const parsed = JSON.parse(res.data.body) as SearchResponse;
    if (parsed.done === 0) {
      if (retryCount === RETRY_LIMIT)
        throw 'We have hit the maximum number of retries';
      await new Promise(resolve => setTimeout(resolve, RETRY_RATE_MS));
      return this.getSearchResults(
        job_ids,
        query,
        model,
        pagination,
        signal,
        retryCount + 1,
      );
    }
    return parsed;
  }

  private async initiateSearch(
    job_ids: number[],
    query: string,
    model: string,
  ) {
    const res = await httpService.get<{ body: string }>(
      config.TranscriptAnalysis.AWSApiGateway.InitiateSearch,
      {
        useAuthToken: true,
        useUsername: true,
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          job_ids: job_ids.join(','),
          q: query,
          model: model,
        },
      },
    );

    const parsed = JSON.parse(res.data.body) as SearchResponse;

    return parsed;
  }

  async semanticSearch(
    job_ids: number[],
    query: string,
    pagination: Pagination,
    signal?: AbortSignal,
  ): Promise<QuestionsResponse> {
    await this.initiateSearch(job_ids, query, 'qqpd');
    return this.getSearchResults(job_ids, query, 'qqpd', pagination, signal);
  }
}

export const transcriptSearchService = new TranscriptSearchService();
