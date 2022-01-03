import bridgedService from './engines/bridged';
import webApiService from './engines/webApi';
import legacyService from './engines/legacy';
import mockedService from './engines/mocked';

/**
 * @template {{
   isSupported():boolean
 }} T
 * @param  {...T} services
 */
export function detectSupportedSpeechService(...services) {
  return services.find((e) => e.isSupported());
}

export default () => detectSupportedSpeechService(bridgedService, webApiService, legacyService, mockedService);
