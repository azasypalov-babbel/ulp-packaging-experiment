import React from 'react';
import TextReveal from '../../../src/components/shared/TextReveal';
import { mountWithTheme } from './themeMock';
import { isWebview } from '../../../src/lib/features';
jest.mock('../../../src/lib/features');

describe('<TextReveal />', () => {
  describe('when NOT in Webview', () => {
    beforeEach(() => {
      isWebview.mockImplementationOnce(() => false);
    });

    test('it renders', () => {
      const wrapper = mountWithTheme(<TextReveal />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when in Webview', () => {
    beforeEach(() => {
      isWebview.mockImplementationOnce(() => true);
    });

    test('it renders', () => {
      const wrapper = mountWithTheme(<TextReveal />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
