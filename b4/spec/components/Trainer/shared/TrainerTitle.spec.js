import React from 'react';
import { shallow } from 'enzyme';

import TrainerTitle from '../../../../src/components/Trainer/shared/TrainerTitle';

import { markupStringToHTML } from '@lessonnine/babbel-markup-helper.js';
jest.mock('@lessonnine/babbel-markup-helper.js', () => ({
  markupStringToHTML: jest.fn((a) => a)
}));

const defaultProps = {
  text: 'formatt{ed}'
};

describe('<TrainerTitle />', () => {
  let component;

  beforeEach(() => {
    component = shallow(
      <TrainerTitle {...defaultProps} />
    );
  });

  test('it renders', () => {
    expect(component).toMatchSnapshot();
  });

  test('calls babbel markup helper method', () => {
    expect(markupStringToHTML).toHaveBeenCalled();
  });
});
