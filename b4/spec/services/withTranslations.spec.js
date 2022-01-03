import React from 'react';
import { withServicesProvider } from '../../src/components/shared/withServices';
import { mount } from 'enzyme';
import withTranslations from '../../src/components/shared/withTranslations';

const translateMock = jest.fn((key) => key);

const mockServices = () => ({ translationService: { translate: translateMock } });
const Component = () => <div/>;

describe('withTranslations', () => {
  test('should pass translations as prop', () => {
    const getTranslations = (translate) => ({
      key1: translate('key.1'),
      key2: translate('key.2')
    });

    const EnhancedComponent = withTranslations(getTranslations)(Component);

    const App = withServicesProvider(mockServices)(EnhancedComponent);
    const wrapper = mount(<App/>);

    const Comp = wrapper.find(Component).first();
    expect(Comp.props().translations).toEqual({
      key1: 'key.1',
      key2: 'key.2'
    });
  });

  describe('when translations are already passed to component', () => {
    test('should merge translations', () => {
      const getTranslations = (translate) => ({
        key1: translate('key.1'),
        key2: translate('key.2')
      });

      const EnhancedComponent = withTranslations(getTranslations)(Component);

      const App = withServicesProvider(mockServices)(EnhancedComponent);
      const wrapper = mount(<App translations={{
        key3: 'key.3'
      }}/>);

      const Comp = wrapper.find(Component).first();
      expect(Comp.props().translations).toEqual({
        key1: 'key.1',
        key2: 'key.2',
        key3: 'key.3'
      });
    });
  });
});
