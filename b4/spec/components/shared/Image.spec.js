import React from 'react';
import Image from '../../../src/components/shared/Image';
import { shallow } from 'enzyme';

const imageUrl = 'http://someurl.com';

const defaultProps = {
  imageId: '100afffb3',
  imageUrl: imageUrl
};

describe('<Image />', () => {
  let component;

  test('it renders', () => {
    component = shallow(
      <Image {...defaultProps} />
    );

    expect(component).toMatchSnapshot();
  });

  test('it renders without image-frame and image-frame-bubble', () => {
    component = shallow(
      <Image {...defaultProps} noFrame noBubble />
    );

    expect(component).toMatchSnapshot();
  });
});
