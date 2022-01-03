import React from 'react';
import { shallow } from 'enzyme';

import { TrainerImage } from '../../../../src/components/Trainer/shared/TrainerImage';

const mockMediaUrlService = {
  imageURL: jest.fn(() => (`mock-image-url.jpg`))
};

describe('<TrainerImage />', () => {
  let component;

  describe('when image exists', () => {
    const props = {
      imageId: 'image-id',
      mediaUrlService: mockMediaUrlService
    };

    beforeEach(() => {
      component = shallow(
        <TrainerImage {...props} />
      );
    });

    test('it calls media service', () => {
      expect(props.mediaUrlService.imageURL).toHaveBeenCalledWith(props.imageId, '200x200');
    });

    test('it renders', () => {
      expect(component).toMatchSnapshot();
    });
  });

  describe('when image does not exists', () => {
    const props = {
      imageId: null,
      mediaUrlService: mockMediaUrlService
    };

    beforeEach(() => {
      component = shallow(
        <TrainerImage {...props} />
      );
    });

    test('it deos not call media service', () => {
      expect(props.mediaUrlService.imageURL).not.toHaveBeenCalled();
    });

    test('it renders', () => {
      const component = shallow(
        <TrainerImage {...props} />
      );

      expect(component).toMatchSnapshot();
    });
  });
});
