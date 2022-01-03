import React from 'react';
import Title from '../../../src/components/shared/Title';
import { mountWithTheme } from './themeMock';

describe('<Title />', () => {
  test('it renders', () => {
    const wrapper = mountWithTheme(<Title />);
    expect(wrapper).toMatchSnapshot();
  });
});
