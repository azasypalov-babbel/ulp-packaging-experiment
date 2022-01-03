import { bindActionCreators } from 'redux';
import store from '../../store';
import * as actions from './actions';

export default () => {
  return {
    actions: bindActionCreators(actions, store.dispatch)
  };
};
