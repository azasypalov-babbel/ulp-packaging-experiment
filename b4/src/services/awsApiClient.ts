import ApiClient from '@lessonnine/api-client.js';
import { getMyEnv } from '@lessonnine/my.js';

let apiClient: ApiClient;

export default () => {
  if (!apiClient) {
    const {
      apigatewayBaseUrl,
      awsSessionEndpoint,
      awsSessionMethod
    } = getMyEnv();

    if (process.env.NODE_ENV === 'development') {
      apiClient = new ApiClient({
        baseUrl: 'https://api.babbel-staging.io/gamma'
      });
    } else {
      apiClient = new ApiClient({
        baseUrl: apigatewayBaseUrl,
        awsSessionEndpoint,
        awsSessionMethod
      });
    }
  }
  return apiClient;
};
