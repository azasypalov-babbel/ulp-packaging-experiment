import zendeskWidget from '../../src/lib/zendeskWidget';

describe('zendesk widget', () => {
  beforeAll(() => {
    const fakeScript = document.createElement('script');
    document.body.appendChild(fakeScript);

    global.zE = jest.fn();
  });

  test('exports init and toggle', () => {
    expect(zendeskWidget.init).toBeDefined();
    expect(zendeskWidget.toggle).toBeDefined();
  });

  describe('when initialised with required params', () => {
    const locale = 'en';

    beforeEach(() => {
      zendeskWidget.init({ locale });
    });

    test('updates settings', () => {
      expect(global.zE).toHaveBeenCalledWith('messenger:set', 'locale', 'en-US');
    });

    test('starts with closed window', () => {
      expect(global.zE).toHaveBeenCalledWith('messenger', 'close');
    });
  });
});
