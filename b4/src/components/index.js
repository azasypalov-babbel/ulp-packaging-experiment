import React from 'react';
import ReactDOM from 'react-dom';

import { compose } from 'redux';

import Image from './shared/Image';
import ReviewApp from './Review/ReviewApp';
import LessonApp from './Lesson/LessonApp';

import TextBox from '../b3_glue/components/TextBox';

import withThemeProvider from '../providers/theme';
import withServicesProvider from '../providers/services';
import withStoreProvider from '../providers/store';
import TranslationToggle from './shared/TranslationToggle';
import withOfflineQueue from '../providers/offlineQueue';
import * as features from '../lib/features';
import ContinueSheet from './ContinueSheet';

const components = {
  Image,
  ReviewApp,
  LessonApp,
  TextBox,
  ContinueSheet,
  TranslationToggle
};

const get = (componentName) => {
  const component = components[componentName];
  if (!component) {
    throw new Error(`Component "${componentName}" does not exist or registered.`);
  }

  return component;
};

const mount = (componentName, props, node) => {
  const component = get(componentName);
  const children = props.children;

  const providerFactories = [
    withStoreProvider,
    withThemeProvider,
    withServicesProvider
  ];

  if (features.isWebview() === false) {
    providerFactories.push(withOfflineQueue);
  }


  const wrappedComponent = compose(
    ...providerFactories
  )(component);

  ReactDOM.render(React.createElement(wrappedComponent, props, children), node, null);
};

const unmount = (node) => (
  ReactDOM.unmountComponentAtNode(node)
);

export default { get, mount, unmount };
