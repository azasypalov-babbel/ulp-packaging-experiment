const speechRecognitionServiceMock = {
  getEngineName: jest.fn(() => 'analyserLib.js'),
  isSupported: jest.fn(() => true),
  start: jest.fn(),
  stop: jest.fn(),
  cleanup: jest.fn()
};

export default speechRecognitionServiceMock;
