declare module '@lessonnine/api-client.js' {

  export interface ClientRequest {
    path: string
    verb: string
    headers?: Record<string, string>
    query?: Record<string, string>
    body?: any
  }

  export interface ClientResponse <T=any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: any; // AxiosRequestConfig
    request?: any;
  }

  export interface ClientOptions {
    baseUrl: string
    awsSessionEndpoint?: string
    awsSessionMethod?: string
  }

  export type uuid = string;

  export default class ApiClient {
    constructor(clientOptions:ClientOptions)
    authenticate(locale: string): Promise<uuid>
    fetch<T=any>(options: ClientRequest): Promise<ClientResponse<T>>
  }
}
