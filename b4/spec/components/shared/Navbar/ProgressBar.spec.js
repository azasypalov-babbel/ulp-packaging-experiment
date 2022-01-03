import React from 'react';
import ProgressBar from '../../../../src/components/shared/Navbar/ProgressBar';
import { shallow } from 'enzyme';

describe('<ProgressBar />', () => {
  let component;

  const onTrainerClickMock = jest.fn();

  const props = {
    trainerCount: 4,
    sequenceHeadIndex: 2,
    currentTrainerIndex: 2,
    sequenceHeadProgress: 0.33,
    onTrainerClick: onTrainerClickMock
  };

  beforeEach(() => {
    component = shallow(<ProgressBar {...props} />);
  });

  test('it renders', () => {
    expect(component).toMatchSnapshot();
  });

  test('it calls `onTrainerClick` when clicking on progressbar', () => {
    const component = shallow(<ProgressBar {...props} />);
    const progressBarSegment = component.findWhere((node) => node.key() === 'trainer-0').first();

    progressBarSegment.simulate('click');
    expect(onTrainerClickMock).toHaveBeenCalled();
  });
});
