import React from 'react';
import { shallow } from 'enzyme';

import CardTrainerLayout from '../../../../src/components/Trainer/shared/CardTrainerLayout';

const defaultProps = {
  dataSelector: 'card-data-selector',
  titleText: 'card title',
  imageId: 'image-id'
};

describe('<CardTrainerLayout />', () => {
  test('it renders', () => {
    const component = shallow(
      <CardTrainerLayout {...defaultProps}>
        <h1>A card row</h1>
      </CardTrainerLayout>
    );

    expect(component).toMatchSnapshot();
  });
});
