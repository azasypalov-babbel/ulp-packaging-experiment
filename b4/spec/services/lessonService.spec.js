describe('Lesson Service', () => {
  let lessonService;
  const params = {
    learnLanguageAlpha3: 'FRA',
    locale: 'en',
    lessonUuid: '12345',
    learningActivityId: '09876',
    contentReleaseId: 'fake-content-release-id'
  };
  const uuid = 'account_uuid';
  const authenticateMock = jest.fn(() => Promise.resolve(uuid));
  const fetchMock = jest.fn(() => Promise.resolve({
    data: { one: 1 },
    headers: {}
  }));

  beforeEach(() => {
    jest.doMock('../../src/services/awsApiClient', () => () => ({
      fetch: fetchMock,
      authenticate: authenticateMock
    }));

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    lessonService = require('../../src/services/lesson/default').default;
  });

  afterEach(() => {
    authenticateMock.mockClear();
    fetchMock.mockClear();
    jest.resetModules();
  });

  describe('#getLessonData', () => {
    test('returns a Promise', () => {
      const result = lessonService.getLessonData(params);
      expect(typeof result.then).toEqual('function');
    });

    test('calls authenticate with locale', () => {
      expect.assertions(1);
      return lessonService.getLessonData(params).then(() => {
        expect(authenticateMock).toHaveBeenCalledWith(params.locale);
      });
    });

    test('calls fetch with valid params', () => {
      expect.assertions(1);
      return lessonService.getLessonData(params).then(() => {
        expect(fetchMock).toHaveBeenCalledWith({
          path: 'v3/en/accounts/account_uuid/' +
            'content_releases/fake-content-release-id/learn_languages/FRA/lessons/12345',
          query: {
            context_id: '09876'
          },
          verb: 'GET'
        });
      });
    });
  });

  describe('#postLessonCompleted', () => {
    test('returns a Promise', () => {
      const result = lessonService.postLessonCompleted(params);
      expect(typeof result.then).toEqual('function');
    });

    test('calls authenticate with locale', () => {
      expect.assertions(1);
      return lessonService.postLessonCompleted(params).then(() => {
        expect(authenticateMock).toHaveBeenCalledWith(params.locale);
      });
    });

    test('calls fetch with valid params', () => {
      const path = 'v2/en/accounts/account_uuid/' +
        'content_releases/fake-content-release-id/learn_languages/FRA/lessons/12345/finishes';
      expect.assertions(2);
      return lessonService.postLessonCompleted(params).then(() => {
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock.mock.calls[0][0].path).toEqual(path);
      });
    });
  });
});
