import React from 'react';
import Loader from '../../../src/components/shared/Loader';
import { shallow } from 'enzyme';

describe('<Loader />', () => {
  test('it renders', () => {
    const wrapper = shallow(<Loader />);
    expect(wrapper).toMatchSnapshot();
  });
});
