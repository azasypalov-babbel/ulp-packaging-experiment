import { bindActionCreators } from 'redux';
import bindSelectors from '../bindSelectors';
import store from '../../store';
import * as actions from './actions';
import * as selectors from './selectors';

export default () => {
  return {
    actions: bindActionCreators(actions, store.dispatch),
    selectors: bindSelectors(selectors, () => store.getState().sequence)
  };
};
