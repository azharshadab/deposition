import { httpService } from '.';
import config from '@config';
import { authenticationService } from '@services/authentication';
import { Group } from '@interfaces/group';

class TranscriptGroupService {
  async getTranscriptGroups(): Promise<Group[]> {
    const res = await httpService.get<{ body: string }>(
      config.TranscriptAnalysis.AWSApiGateway.GetUserGroupsTable,
      {
        useUsername: true,
        useAuthToken: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const parsed = JSON.parse(res.data.body) as Group[];
    return parsed;
  }

  async createTranscriptGroup(
    transcriptIds: number[],
    groupName: string,
  ): Promise<{
    error?: 'duplicate';
  } | void> {
    const id = await authenticationService.getUserId();

    const body = {
      transcripts: transcriptIds,
      group_name: groupName,
      UserId: id,
    };

    const requestOptions = {
      useAuthToken: true,
      useUsername: true,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await httpService.post<{ body: string; statusCode: number }>(
      config.TranscriptAnalysis.AWSApiGateway.QueueClusteringJobs,
      body,
      requestOptions,
    );
    if (res.data.statusCode === 200) return;

    const parsed = JSON.parse(res.data.body) as {
      error: string;
    };
    if (
      parsed.error ===
      'A group with the same name already exists for this user.'
    )
      return { error: 'duplicate' };
  }

  async deleteManyTranscriptGroups(ids: number[]): Promise<any> {
    const res = await httpService.delete<{ statusCode: number; body: string }>(
      config.TranscriptAnalysis.AWSApiGateway.DeleteTranscriptGroup,
      {
        useAuthToken: true,
        useUsername: true,
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          transcriptGroupIds: ids.join(','),
        },
      },
    );
    if (res.data.statusCode >= 200 && res.data.statusCode < 300) return;
    throw new Error(res.data.body);
  }

  async getTranscriptsInGroup(groupId: number): Promise<number[]> {
    const res = await httpService.get<{ body: number[] }>(
      config.TranscriptAnalysis.AWSApiGateway.GetTranscriptsInGroup,
      {
        useAuthToken: true,
        useUsername: true,
        params: {
          transcriptGroupId: groupId,
        },
      },
    );
    return res.data.body;
  }

  async updateGroup(id: number, name: string) {
    const res = await httpService.put<{
      'body-json': {
        body:
          | 'A group with the same name already exists for this user.'
          | 'Group Successfully updated';
        statusCode: number;
      };
    }>(
      config.TranscriptAnalysis.AWSApiGateway.UpdateGroup,
      {
        transcriptGroupId: id,
        transcriptGroupName: name,
      },
      {
        useAuthToken: true,
        useUsername: true,
      },
    );

    return res.data['body-json'].body;
  }
}

export const transcriptGroupService = new TranscriptGroupService();
