import camelize from 'camelize';

// current experiments targets
export const ACTIVE_EXPERIMENTS = {};

export const getExperimentBucket = (target, state) => {
  return state[camelize(target)];
};

