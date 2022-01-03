import camelize from 'camelize';
import { log } from '../../lib/logging';

const fetchSubscriptions = () => {
  return import(/* webpackChunkName: "demo" */ '../data/subscriptions/subscriptions.json').then((module) => {
    const response = camelize(module.default.subscriptions);
    log('subscriptionsServiceMock#fetchSubscriptions', response);
    return response;
  });
};

export default {
  fetchSubscriptions
};
