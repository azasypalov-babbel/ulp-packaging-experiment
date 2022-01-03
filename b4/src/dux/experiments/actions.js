import * as types from './types';
import services from '../../services';
import camelize from 'camelize';

export const fetchExperimentBucket = (target) => (dispatch, getState) => {
  const { abTesterService } = services;
  const { locale, learnLanguageAlpha3 } = getState().session;

  return dispatch({
    type: types.FETCH_EXPERIMENT_BUCKET,
    payload: abTesterService.getExperimentBucket({ locale, learnLanguageAlpha3, target })
      .then((variation) => ({
        target: camelize(target),
        variation
      }))
      .catch((err) => {
        throw { ...err, target: camelize(target) };
      })
  });
};
