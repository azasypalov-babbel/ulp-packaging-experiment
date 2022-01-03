import React from 'react';
import Card from '../../../src/components/shared/Card';
import { mountWithTheme } from './themeMock';

describe('<Card />', () => {
  test('it renders', () => {
    const wrapper = mountWithTheme(<Card />);
    expect(wrapper).toMatchSnapshot();
  });
});
