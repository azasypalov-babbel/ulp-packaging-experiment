import * as types from './types';
import zendeskWidget from '../../lib/zendeskWidget';

export const init = () => (dispatch, getState) => {
  const {
    session: {
      locale
    },
  } = getState();

  zendeskWidget.init({
    locale
  });

  dispatch({
    type: types.INIT
  });
};

export const setIsOpen = (isOpen) => ({
  type: types.SET_IS_OPEN,
  payload: { isOpen }
});
