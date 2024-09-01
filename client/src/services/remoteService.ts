import axios, { AxiosRequestConfig } from 'axios';
import { csvArrays } from '../common/helpers';
import config from '../config';

export class BadResponseError extends Error {
  constructor(public message: string, public statusCode: number, public data?: any) {     
    super(message); 
  }
}
  
export class NetworkError extends Error {
  constructor(public _error: Error) {     
    super(_error.message); 
  }
}

export interface Failure {
  status_code: number;
  message?: string;
  [key: string]: any;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export abstract class RemoteService {
  protected abstract baseUri: string;
  protected signal?: AbortSignal; 

  protected axiosCfg = { ...config.axiosDefaults };
  public withConfig(cfg: AxiosRequestConfig) {
    this.axiosCfg = { ...this.axiosCfg, ...cfg };
    return this;
  }

  protected async callService<S, F>(
    method: 'GET',
    path: string,
    qs?: {}
  ): Promise<S | F>;
  protected async callService<S, F>(
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    body?: {},
    qs?: {}
  ): Promise<S | F>;
  protected async callService<S, F>(
    method: HttpMethod,
    path: string,
    bodyOrQs?: {},
    qs?: {}
  ): Promise<S | F> {
    let body;
    if (method === 'GET' && bodyOrQs && !qs) {
      qs = csvArrays(bodyOrQs);
    } else {
      body = bodyOrQs;
    }

    let fullUri = this.baseUri.concat(path);
    const token = localStorage.getItem('token');

    return axios({
      url: fullUri,
      method,
      params: qs && csvArrays(qs),
      data: body,
      headers: token ? {
        Authorization: `Bearer ${token}`
      } : undefined,
      signal: this.signal,
      ...this.axiosCfg
    }).then((response) => {
      let result = response.data;

      if (result.status?.status_code)
        throw new BadResponseError(`${fullUri} error response`, response.status, result);

      if (result.status === 'error') {
        throw new BadResponseError(`${fullUri} error response`, response.status, result);
      }

      return result;
    }).catch((error) => {
      if (!!error.request && !error.response) {
        throw new NetworkError(error);
      }
      throw error;
    });
  }
}
