import * as features from '../../../src/lib/features';
jest.mock('../../../src/services');
jest.unmock('../../../src/services');

/**
 * mocks lib/features::get() to return true for values in {features}
 * @param {string[]} featureList flags to mock as enabled
 */
export const mockFeatures = (featureList) => {
  jest.spyOn(features, 'get').mockImplementation((flag) => featureList.includes(flag));
};

/**
 * @param {'web'|'webview'} [platform] when set, 'src/services/index' is mocked to
 * 'src/services/index.${platform}', otherwise it is unmocked
 */
export const mockPlatformServices = (platform) => {
  switch (platform) {
    case 'web':
      jest.mock('../../../src/services', () => jest.requireActual('../../../src/services/index.web'));
      break;

    case 'webview':
      jest.mock('../../../src/services', () => jest.requireActual('../../../src/services/index.webview'));
      break;

    default:
      jest.unmock('../../../src/services');
      break;
  }
};

/**
 * mocks features.isWebview() to return {isWebview} and mocks
 * platform specific services for require('src/services')
 * @param {boolean} isWebview
 */
export const mockIsWebview = (isWebview = true) => {
  jest.spyOn(features, 'isWebview').mockReturnValue(isWebview);
  jest.resetModules();
  mockPlatformServices(isWebview ? 'webview' : 'web');
};

export const unmockIsWebview = () => {
  jest.unmock('../../../src/services');
  features.isWebview.mockRestore();
  mockPlatformServices();
};

