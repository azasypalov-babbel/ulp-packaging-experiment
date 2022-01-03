import React from 'react';
import { withInfoText } from '../../../src/components/shared/withInfoText';
import { shallow } from 'enzyme';
// eslint-disable-next-line max-len
import InfoTextNotificationContainer from '../../../src/components/shared/InfoText/InfoTextNotification/InfoTextNotificationContainer';

describe('withInfoText HOC', () => {
  const Component = () => <div/>;
  const WrappedComponent = withInfoText(Component);

  const defaultProps = {
    foo: 'bar',
    baz: 'foo'
  };

  it('renders an infotext container', () => {
    const wrapper = shallow(<WrappedComponent {...defaultProps} />);
    expect(wrapper.exists(InfoTextNotificationContainer)).toBe(true);
  });

  describe('The wrapped Component', () => {
    const wrapper = shallow(<WrappedComponent {...defaultProps} />);
    it('receives the original props through HOC', () => {
      expect(wrapper.find('Component').props()).toMatchObject({
        foo: 'bar',
        baz: 'foo'
      });
    });

    it('receives a callback prop to trigger info text render', () => {
      expect(wrapper.find('Component').props()).toMatchObject({
        displayInfoText: expect.any(Function)
      });
    });
  });
});
