import * as types from './types';
import services from '../../services';

export const fetchTrainerItemsStatistics = () => (dispatch, getState) => {
  const { statisticsService } = services;
  const { locale, learnLanguageAlpha3 } = getState().session;

  return dispatch({
    type: types.FETCH_TRAINER_ITEMS_STATISTICS,
    payload: statisticsService.fetchTrainerItemsStatistics({
      locale,
      learnLanguageAlpha3
    })
  });
};
