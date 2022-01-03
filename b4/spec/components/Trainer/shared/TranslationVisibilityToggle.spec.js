import React from 'react';
import { shallow } from 'enzyme';

import TranslationVisibilityToggle from '../../../../src/components/Trainer/shared/TranslationVisibilityToggle';
import TranslationToggle from '../../../../src/components/shared/TranslationToggle';

const defaultProps = {
  onClick: jest.fn()
};

describe('<TranslationVisibilityToggle />', () => {
  let component;

  describe('when the translation visibility is `partial`', () => {
    beforeEach(() => {
      const props = {
        ...defaultProps,
        translationVisibility: 'partial'
      };
      component = shallow(<TranslationVisibilityToggle {...props} />);
    });

    it('should render the toggle', () => {
      expect(component.find(TranslationToggle).exists()).toBe(true);
    });

    it('should execute toggle function when clicking on the toggle button', () => {
      component.find(TranslationToggle).simulate('click');
      expect(defaultProps.onClick).toHaveBeenCalled();
    });
  });

  describe('when the translation visibility is `full`', () => {
    test('should not render the toggle', () => {
      const props = {
        ...defaultProps,
        translationVisibility: 'full'
      };

      component = shallow(
        <TranslationVisibilityToggle {...props} />
      );

      expect(component.find(TranslationToggle).exists()).toBe(false);
    });
  });

  describe('when the translation visibility is `none`', () => {
    test('should not render the toggle', () => {
      const props = {
        ...defaultProps,
        translationVisibility: 'none'
      };

      component = shallow(
        <TranslationVisibilityToggle {...props} />
      );

      expect(component.find(TranslationToggle).exists()).toBe(false);
    });
  });
});
