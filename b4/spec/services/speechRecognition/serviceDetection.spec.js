import { detectSupportedSpeechService } from '../../../src/services/speechRecognition/serviceDetection';

jest.mock('../../../src/services/speechRecognition/engines/legacy');
jest.mock('../../../src/services/speechRecognition/engines/bridged');
jest.mock('../../../src/services/speechRecognition/engines/webApi');
jest.mock('../../../src/services/speechRecognition/engines/mocked');

const mockService = (supported = true) => {
  return {
    isSupported: jest.fn(() => supported)
  };
};

describe('Speech Recognition Detection', function() {
  test(`returns first supported service`, () => {
    const mockedServices = [mockService(false), mockService(true), mockService(true)];
    expect(detectSupportedSpeechService(...mockedServices)).toEqual(mockedServices[1]);
  });
});
