import { createStore, combineReducers, applyMiddleware, compose, AnyAction } from 'redux';
import * as features from './lib/features';
import thunkMiddleware, { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { logger } from 'redux-logger'
import promiseMiddleware from 'redux-promise-middleware';
import surveyMiddleware from './dux/survey/middleware';
import zendeskWidgetMiddleware from './dux/zendeskWidget/middleware';
import sequenceMiddleware from './dux/sequence/middleware';
import lessonMiddleware from './dux/lesson/middleware';
import reviewMiddleware from './dux/review/middleware';
import messagesMiddleware from './dux/messages/middleware';
import permissionsMiddleware from './dux/permissions/middleware';
import trackerMiddleware from './dux/tracker/middleware';
import errorMiddleware from './dux/error/middleware';
import sessionMiddleware from './dux/session/middleware';

import account from './dux/account/reducer';
import sequence from './dux/sequence/reducer';
import lesson from './dux/lesson/reducer';
import review from './dux/review/reducer';
import session from './dux/session/reducer';
import content from './dux/content/reducer';
import contentRelease from './dux/contentRelease/reducer';
import keyboard from './dux/keyboard/reducer';
import statistics from './dux/statistics/reducer';
import permissions from './dux/permissions/reducer';
import experiments from './dux/experiments/reducer';
import messages from './dux/messages/reducer';
import zendeskWidget from './dux/zendeskWidget/reducer';
import offlineQueue from './dux/offlineQueue/reducer';
import offlineQueueMiddleware from './dux/offlineQueue/middleware';
import profile from './dux/profile/reducer';
import subscriptions from './dux/subscriptions/reducer';

const middlewares = [
  errorMiddleware,
  // offline queue middleware has to be applied before any async middleware
  ...(!features.isWebview() ? [offlineQueueMiddleware] : []),
  promiseMiddleware,
  thunkMiddleware,
  lessonMiddleware,
  reviewMiddleware,
  messagesMiddleware,
  permissionsMiddleware,
  ...(!features.isWebview() ? [surveyMiddleware] : []),
  sequenceMiddleware,
  trackerMiddleware,
  sessionMiddleware
].filter(Boolean);

// ZENDESK
// do not show the zendesk widget in webview
if (!features.isWebview()) {
  // in dev env, only show zendesk feature if is_zendesk=on is in the URL
  const isDevEnv = process.env.NODE_ENV === 'development';
  const isZendesk = features.get('is_zendesk');
  if (!isDevEnv || isZendesk) {
    middlewares.push(zendeskWidgetMiddleware);
  }
}

if (process.env.NODE_ENV === 'development' && features.get('is_redux_logger')) {
  middlewares.push(logger);
}

const reducers = {
  ...(!features.isWebview() && { offlineQueue }),
  account,
  sequence,
  statistics,
  lesson,
  review,
  session,
  content,
  contentRelease,
  keyboard,
  permissions,
  experiments,
  messages,
  zendeskWidget,
  profile,
  subscriptions
};

const reducer = combineReducers(reducers);

type WindowWithDevTools = Window & {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: (options: unknown) => (<T>(a: T) => T)
}

const reduxDevtoolsExistInWindow = (arg: Window | WindowWithDevTools): arg is WindowWithDevTools => {
  return '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__' in arg;
}

const devtoolsEnabled = (process.env.NODE_ENV !== 'production' || features.get('is_redux_devtools')) as boolean;

const composeEnhancers = devtoolsEnabled && reduxDevtoolsExistInWindow(window) ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    name: 'lesson-player.spa',
    trace: true,
    maxAge: 200,
    shouldCatchErrors: true
  }) : compose

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(...middlewares))
);

export default store;

export type RootState = ReturnType<typeof reducer>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>
export type TDispatch = ThunkDispatch<RootState, undefined, AnyAction>
