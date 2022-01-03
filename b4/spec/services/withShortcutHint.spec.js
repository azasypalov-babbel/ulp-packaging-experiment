import React from 'react';
import { mount  } from 'enzyme';
import withShortcutHint from '../../src/components/shared/withShortcutHint';
import mockStore from '../dux/mockStore';
import { Provider } from 'react-redux';


const Component = () => <div/>;

describe('withShortcutHint', () => {
  describe('when hints are shown', () => {
    let wrapper;
    const store = mockStore(() => ({
      keyboard: {
        showHints: true
      }
    }));

    beforeEach(() => {
      const EnhancedComponent = withShortcutHint(Component);

      wrapper = mount(
        <Provider store={store}>
          <EnhancedComponent listenToKey="Enter" />
        </Provider>
      );
    });

    test('keyboardHintComponent should render KeyboardShortcutHint component with keyName provided', () => {
      const Comp = wrapper.find(Component).first();
      expect(Comp.props().keyboardHintComponent).toMatchSnapshot();
    });
  });

  describe('when hints are hidden', () => {
    let wrapper;
    const store = mockStore(() => ({
      keyboard: {
        showHints: false
      }
    }));

    beforeEach(() => {
      const EnhancedComponent = withShortcutHint(Component);

      wrapper = mount(
        <Provider store={store}>
          <EnhancedComponent listenToKey="Enter" />
        </Provider>
      );
    });

    test('keyboardHintComponent should render no component', () => {
      const Comp = wrapper.find(Component).first();
      expect(Comp.props().keyboardHintComponent).toEqual(null);
    });
  });
});
