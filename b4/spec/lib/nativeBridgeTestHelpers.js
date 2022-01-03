export const setupMethodMock = () => {
  const postMessageMock = jest.fn();
  beforeEach(() => {
    global.webkit = {
      messageHandlers: {
        iosListener: {
          postMessage: postMessageMock
        }
      }
    };
  });
  afterEach(() => {
    postMessageMock.mockReset();
  });

  return () => JSON.parse(postMessageMock.mock.calls[0][0]);
};

export const setupEventMock = (bridge, event) => {
  const handlerMock = jest.fn();
  beforeEach(() => {
    bridge.addEventListener(event, handlerMock);
  });
  afterEach(() => {
    bridge.removeEventListener(event, handlerMock);
    handlerMock.mockReset();
  });

  return () => handlerMock.mock.calls[0][0];
};
