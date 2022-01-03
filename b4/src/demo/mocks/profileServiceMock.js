import camelize from 'camelize';
import { log } from '../../lib/logging';

const fetchProfile = () => {
  return import(/* webpackChunkName: "demo" */ '../data/profile/profile.json').then((module) => {
    const response = camelize(module.default.profile);
    log('profileServiceMock#fetchProfile', response);
    return response;
  });
};

export default {
  fetchProfile
};
