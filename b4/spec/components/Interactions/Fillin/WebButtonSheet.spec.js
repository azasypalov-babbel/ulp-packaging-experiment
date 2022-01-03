import React from 'react';
import { WebButtonSheet } from '../../../../src/components/Interactions/Fillin/WebButtonSheet';
import { shallow } from 'enzyme';

describe('<WebButtonSheet />', () => {
  const props = {
    onTransliterationToggled: () => {},
    track: () => {},
    isTransliterationTableSupported: true,
    nextHintLevel: 'HINT',
    onHint: () => {},
    translations: {
      typingTips: 'typing tips',
      solution: 'solution',
      hint: 'hint'
    }
  };

  const wrapper = shallow(<WebButtonSheet {...props}/>);

  test('it renders', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
