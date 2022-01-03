import React from 'react';
import { Button } from '../../../../src/components/shared/Button/Button';
import { mountWithTheme } from '../themeMock';

describe('<Button />', () => {
  const clickSpy = jest.fn();
  beforeEach(() => {
    clickSpy.mockClear();
  });

  test('it renders', () => {
    const wrapper = mountWithTheme(<Button />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('when button is pressed', () => {
    test('it renders with is-active class', () => {
      const wrapper = mountWithTheme(<Button pressed />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('<Button disabled />', () => {
    test('it renders', () => {
      const wrapper = mountWithTheme(<Button disabled />);
      expect(wrapper).toMatchSnapshot();
    });

    test('it does not trigger onClick', () => {
      const wrapper = mountWithTheme(<Button disabled onClick={clickSpy} />);
      wrapper.simulate('click');

      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  describe('<Button primary />', () => {
    test('it renders', () => {
      const wrapper = mountWithTheme(<Button primary />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('<Button positive />', () => {
    test('it renders', () => {
      const wrapper = mountWithTheme(<Button positive />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('<Button negative />', () => {
    test('it renders', () => {
      const wrapper = mountWithTheme(<Button negative />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('<Button positiveSolid />', () => {
    test('it renders', () => {
      const wrapper = mountWithTheme(<Button positiveSolid />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('<Button negativeSolid />', () => {
    test('it renders', () => {
      const wrapper = mountWithTheme(<Button negativeSolid />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
