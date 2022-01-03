import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import configureStore from 'redux-mock-store';

export default (state) => {
  const middlewares = [
    promiseMiddleware,
    thunkMiddleware
  ];

  return configureStore(middlewares)(state);
};
