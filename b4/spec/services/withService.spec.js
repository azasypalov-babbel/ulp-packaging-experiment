import React from 'react';
import { withServices, withServicesProvider } from '../../src/components/shared/withServices';
import { mount } from 'enzyme';

const playMock = jest.fn();

const mockServices = () => ({ soundService: { play: playMock } });

describe('withServices', () => {
  test('it exposes props for soundService', () => {
    const Component = () => <div/>;
    const EnhancedComponent = withServices(['soundService'])(Component);
    const App = withServicesProvider(mockServices)(EnhancedComponent);
    const wrapper = mount(<App/>);
    const Comp = wrapper.find(Component).first();
    expect(Comp.props().soundService.play).toBe(playMock);
  });
});
