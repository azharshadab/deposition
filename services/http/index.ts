import { authenticationService } from '@services/authentication';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface AxiosRequestConfigWithAuth extends AxiosRequestConfig {
  useAuthToken?: boolean;
  useUsername?: boolean;
}

class HttpService {
  private async createAxiosInstance(
    config?: AxiosRequestConfigWithAuth,
  ): Promise<AxiosInstance> {
    const instance = axios.create();
    const [token, payload] = await Promise.all([
      authenticationService.getJwtToken(),
      authenticationService.getUserPayload(),
    ]);

    if (config?.useAuthToken) {
      instance.defaults.headers.common['Authorization'] = token;
    }

    if (config?.useUsername) {
      instance.defaults.headers.common['username'] = payload
        ? (payload['cognito:username'] as string)
        : undefined;
    }

    return instance;
  }

  async get<T = any>(
    url: string,
    config?: AxiosRequestConfigWithAuth,
  ): Promise<AxiosResponse<T>> {
    const instance = await this.createAxiosInstance(config);
    delete config?.useAuthToken;
    delete config?.useUsername;
    return instance.get<T>(url, config);
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfigWithAuth,
  ): Promise<AxiosResponse<T>> {
    const instance = await this.createAxiosInstance(config);
    return instance.post<T>(url, data, config);
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfigWithAuth,
  ): Promise<AxiosResponse<T>> {
    const instance = await this.createAxiosInstance(config);
    return instance.put<T>(url, data, config);
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfigWithAuth,
  ): Promise<AxiosResponse<T>> {
    const instance = await this.createAxiosInstance(config);
    return instance.delete<T>(url, config);
  }
}

export const httpService = new HttpService();
