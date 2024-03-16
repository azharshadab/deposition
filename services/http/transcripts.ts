import { httpService } from '@services/http';
import config from '@config';
import { Transcript } from '@interfaces/transcript';
import { TranscriptQueryParams } from '@interfaces/TranscriptQueryParams';

interface DepositionData {
  FirstName: string;
  LastName: string;
  MiddleName: string;
  TranscriptId: number;
  depositiondate: Date;
}

interface GetFileRes {
  statusCode: number;
  body: string;
}

interface GetFile {
  fileUploadURL: string;
  existingUrl: string;
}

class TranscriptService {
  async getUserTranscripts(
    queryParams?: TranscriptQueryParams,
  ): Promise<{ data: Transcript[]; count: number }> {
    const res = await httpService.get<{ body: Transcript[]; count: number }>(
      config.TranscriptAnalysis.AWSApiGateway.GetUserTable,
      {
        useAuthToken: true,
        useUsername: true,
        params: {
          count: queryParams?.count,
          page: queryParams?.page,
          sortField: queryParams?.sortField,
          sortOrder: queryParams?.sortOrder,
          witnessName: queryParams?.witnessName,
        },
      },
    );
    return { data: res.data.body, count: res.data.count };
  }

  async addWithIncrementedSuffix(files: File[]): Promise<any> {
    const uploadPromises = files.map(file =>
      this.uploadWithUniqueName(file, file.name, 0),
    );
    return Promise.all(uploadPromises);
  }

  private async uploadWithUniqueName(
    file: File,
    originalName: string,
    suffix: number,
  ): Promise<any> {
    const newName = this.generateNewName(originalName, suffix);
    const url = await this.getPresignedUrl(newName);

    if (!url || url.preExisting) {
      return this.uploadWithUniqueName(file, originalName, suffix + 1);
    }

    const newFile = new File([file], newName, { type: file.type });
    return this.uploadFile(url.url, newFile);
  }

  private generateNewName(name: string, suffix: number): string {
    const nameParts = name.split('.');
    const extension = nameParts.pop();
    const baseName = nameParts.join('.');
    return `${baseName}(${suffix}).${extension}`;
  }

  async updateTranscript(data: DepositionData): Promise<any> {
    const res = await httpService.post(
      config.TranscriptAnalysis.AWSApiGateway.UpdateDeponentDetails,
      JSON.stringify(data),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        useAuthToken: true,
        useUsername: false,
      },
    );
    return res.data;
  }
  async uploadManyTranscripts(
    files: File[],
    allowUpdate = false,
  ): Promise<File[] | true> {
    const urls = await Promise.all(
      files.map(file => this.getPresignedUrl(file.name)),
    );

    const existingFiles: File[] = [];
    const uploadPromises: Promise<any>[] = [];

    urls.forEach((url, index) => {
      if (!url) return;

      if (url.preExisting && !allowUpdate) {
        existingFiles.push(files[index]);
      } else {
        uploadPromises.push(this.uploadFile(url.url, files[index]));
      }
    });

    await Promise.all(uploadPromises);
    if (existingFiles.length > 0) return existingFiles;

    return true;
  }

  private async getPresignedUrl(
    fileName: string,
  ): Promise<{ url: string; preExisting: boolean } | false> {
    const res = await httpService.get<GetFileRes>(
      config.TranscriptAnalysis.AWSApiGateway.PresignedUrl,
      {
        useAuthToken: true,
        useUsername: true,
        params: {
          fileName,
        },
        maxBodyLength: Infinity,
      },
    );

    const preExisting = res.data.statusCode === 409;
    const parsed = JSON.parse(res.data.body) as GetFile;
    if (preExisting)
      return {
        preExisting,
        url: parsed.existingUrl,
      };

    return {
      preExisting,
      url: parsed.fileUploadURL,
    };
  }

  private async uploadFile(url: string, file: File) {
    return httpService.put(url, file, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  async uploadTranscript(
    file: File,
    allowUpdate: boolean = false,
  ): Promise<any> {
    const url = await this.getPresignedUrl(file.name);

    if (!url || (url.preExisting && !allowUpdate)) return url;

    return this.uploadFile(url.url, file);
  }

  async deleteManyTranscripts(transcriptIds: number[]): Promise<any> {
    const res = await httpService.delete<{ statusCode: number; body: string }>(
      config.TranscriptAnalysis.AWSApiGateway.DeleteTranscript,
      {
        useAuthToken: true,
        useUsername: true,
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          files: transcriptIds.join(','),
        },
      },
    );
    if (res.data.statusCode >= 200 && res.data.statusCode < 300) return;
    throw new Error(res.data.body);
  }
}

export const transcriptService = new TranscriptService();
