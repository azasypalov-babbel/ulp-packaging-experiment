import React from 'react';
import ReviewItem from '../../../../src/components/Review/ReviewEndScreen/ReviewItem';
import { shallow } from 'enzyme';

const defaultProps = {
  item: {
    learnLanguageText: 'die Straße',
    sound: { id: '100afffb3' }
  },
  onItemClick: () => {}
};

describe('<ReviewItem />', () => {
  test('it renders', () => {
    const component = shallow(
      <ReviewItem {...defaultProps} />
    );
    expect(component).toMatchSnapshot();
  });

  test('it renders with item containing html tags', () => {
    const props = {
      item: {
        learnLanguageText: '<i>die Straße</i>',
        sound: { id: '100afffb3' }
      },
      onItemClick: () => {}
    };
    const component = shallow(
      <ReviewItem {...props} />
    );

    expect(component.html()).toMatch('<i>die Straße</i>');
  });
});
