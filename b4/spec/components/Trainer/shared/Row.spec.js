import React from 'react';
import Text from '../../../../src/components/shared/Text';
import { shallow } from 'enzyme';
import { Row } from '../../../../src/components/Trainer/shared/Row';

const children = <Text>A cold day in L.A</Text>;

const props = {
  children,
  translation: 'Un dia frio en Los Angeles'
};

describe('<Row />', () => {
  describe('task row', () => {
    test('it renders', () => {
      const wrapper = shallow(<Row type="task" {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('phrase row', () => {
    test('it renders', () => {
      const wrapper = shallow(<Row type="phrase" {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
