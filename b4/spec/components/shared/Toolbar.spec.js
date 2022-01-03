import React from 'react';
import Toolbar from '../../../src/components/shared/Toolbar';
import { shallow } from 'enzyme';

describe('<Toolbar />', () => {
  test('it renders', () => {
    const wrapper = shallow(<Toolbar onToggleShortcuts={() => {}}>foo</Toolbar>);
    expect(wrapper).toMatchSnapshot();
  });
});
