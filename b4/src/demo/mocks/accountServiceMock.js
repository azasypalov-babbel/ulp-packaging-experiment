import camelize from 'camelize';
import { log } from '../../lib/logging';

const fetchAccount = () => {
  return import(/* webpackChunkName: "demo" */ '../data/account/account.json').then((module) => {
    const response = camelize(module.default.account);
    log('accountServiceMock#fetchAccount', response);
    return response;
  });
};

export default {
  fetchAccount
};
