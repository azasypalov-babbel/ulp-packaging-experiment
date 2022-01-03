import * as zendeskActions from '../../../src/dux/zendeskWidget/actions';
import zendeskWidget from '../../../src/lib/zendeskWidget';

jest.mock('../../../src/lib/zendeskWidget');

const getStateMock = jest.fn();
const mockDispatch = jest.fn();

describe('zendeskWidget actions', () => {
  const state = {
    session: {
      locale: 'en'
    }
  };

  getStateMock.mockImplementation(() => state);

  describe('init', () => {
    it('should init zendesk widget', () => {
      zendeskActions.init()(mockDispatch, getStateMock);
      expect(zendeskWidget.init).toHaveBeenCalledWith({
        locale: 'en',
      });
    });
  });
});
