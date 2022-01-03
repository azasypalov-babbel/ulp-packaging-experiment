import React from 'react';
import ProgressCircle from '../../../../src/components/shared/icons/ProgressCircle';
import { mountWithTheme, omitThemeFromSnapshot } from '../themeMock';

describe('ProgressCircle', () => {
  let wrapper;

  describe('with progress 0', () => {
    test('renders', () => {
      wrapper = mountWithTheme(<ProgressCircle size="jumbo" progress={0} />);
      expect(omitThemeFromSnapshot(wrapper)).toMatchSnapshot();
    });
  });

  describe('with progress 1', () => {
    test('renders', () => {
      wrapper = mountWithTheme(<ProgressCircle size={{ small: 'regular', large: 'jumbo' }} progress={1} />);
      expect(omitThemeFromSnapshot(wrapper)).toMatchSnapshot();
    });
  });
});
