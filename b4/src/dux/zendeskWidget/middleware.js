import { FETCH_ACCOUNT } from '../account/types';
import * as zendeskWidgetActions from './actions';

const zendeskWidget = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type === `${FETCH_ACCOUNT}_FULFILLED`) {
    store.dispatch(zendeskWidgetActions.init());
  }

  return result;
};

export default zendeskWidget;
