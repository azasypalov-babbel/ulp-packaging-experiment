import React from 'react';
import KeyboardShortcutHint from '../../../src/components/shared/KeyboardShortcutHint';
import { shallow } from 'enzyme';

describe('<KeyboardShortcutHint />', () => {
  test('it renders', () => {
    const wrapper = shallow(<KeyboardShortcutHint keyName="1" />);
    expect(wrapper).toMatchSnapshot();
  });
});
