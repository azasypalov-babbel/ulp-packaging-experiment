import React from 'react';
import { shallow } from 'enzyme';
import { defaultPropsDialog as defaultProps } from './defaultProps';

import * as ThemeContext from '../../../../src/providers/theme.js';
import { DialogTrainer } from '../../../../src/components/Trainer/DialogTrainer/DialogTrainer';

import getComponentFromInteractionType from '../../../../src/lib/getComponentFromInteractionType';

jest.mock('../../../../src/lib/matchingUtils/normalise');
jest.mock('../../../../src/lib/getComponentFromInteractionType', () => jest.fn());

const MockInteraction = () => null;
getComponentFromInteractionType.mockImplementation(() => MockInteraction);

const mockTheme = { cascada: { iceGrayW50: 'color' } };
jest.spyOn(ThemeContext, 'useTheme').mockImplementation(() => mockTheme);

describe('<DialogTrainer />', () => {
  describe('renders', () => {
    test('with full props a list of items', () => {
      const wrapper = shallow(<DialogTrainer {...defaultProps} />);
      expect(wrapper).toMatchSnapshot();
    });

    describe('task row', () => {
      it('passes the babbel markup to the contextual info', () => {
        const wrapper = shallow(<DialogTrainer {...defaultProps} />);
        const secondTask = wrapper.find('ContextualInfo').at(1);
        const text = secondTask.prop('markupString');

        expect(text).toEqual('"Y sho era" el **mejor**');
      });

      describe('with no data (empty)', () => {
        it('returns null', () => {
          const wrapper = shallow(<DialogTrainer {...defaultProps} />);
          // demo item 7
          const emptyRow = wrapper.find('ContextualInfo').at(2);

          expect(emptyRow.exists()).toEqual(false);
        });
      });
    });

    describe('interactive phrase row', () => {
      it('passes the babbel markup to the MockInteraction', () => {
        const wrapper = shallow(<DialogTrainer {...defaultProps} />);
        const firstRow = wrapper.find('MessageBlock').at(0);
        const { learnLanguageText } = firstRow
          .find(MockInteraction)
          .prop('item');

        // eslint-disable-next-line max-len
        expect(learnLanguageText).toEqual('Ich habe ((*mich|*totally)) auch angemeldet und gehe "noch heute" zu meinem ersten Treffen!');
      });
    });

    describe('non interactive phrase row', () => {
      it('formats the item text', () => {
        const wrapper = shallow(<DialogTrainer {...defaultProps} />);
        const thirdRow = wrapper.find('MessageBlock').at(1);
        const text = thirdRow
          .find('[data-selector="non-interactive"]')
          .prop('dangerouslySetInnerHTML')['__html'];

        expect(text).toEqual('Argentina <i>became</i> <b>world champion</b>!');
      });
    });
  });

  describe('item translation text', () => {
    describe('with translations set to visible', () => {
      let wrapper;
      beforeEach(() => {
        const props = {
          ...defaultProps,
          translationVisible: true
        };
        wrapper = shallow(<DialogTrainer {...props} />);
      });
      it('should render item translation text', () => {
        const translationText = wrapper.find('MessageBlock').at(0).prop('secondaryText');
        // eslint-disable-next-line max-len
        expect(translationText).toEqual('I also signed up and I\'m going on my first date "already today"! **(the solution is: \'mich\' or \'totally\')**');
      });
    });

    describe('with translations set to not visible', () => {
      let wrapper;
      beforeEach(() => {
        const props = {
          ...defaultProps,
          translationVisible: false
        };
        wrapper = shallow(<DialogTrainer {...props} />);
      });
      it('should not render item translation text', () => {
        const translationText = wrapper.find('MessageBlock').at(0).prop('secondaryText');
        // eslint-disable-next-line max-len
        expect(translationText).toEqual(undefined);
      });
    });
  });

  describe('during purge flow', () => {
    describe('when an interactive item (phrase) was solved correctly in the lesson', () => {
      let wrapper;
      beforeEach(() => {
        const props = {
          ...defaultProps,
          visibleItems: defaultProps.visibleItems.map((item, index) => ({
            ...item,
            nonInteractive: index === 0
          }))
        };
        wrapper = shallow(<DialogTrainer {...props} />);
      });
      it('renders the phrase as non interactive', () => {
        const firstRow = wrapper.find('MessageBlock').at(0);
        expect(firstRow.find(MockInteraction).exists()).toBeFalsy();
        expect(firstRow.find('[data-selector="non-interactive"]').exists()).toBeTruthy();
      });
      it('formats the phrase text and removes gaps', () => {
        const firstRow = wrapper.find('MessageBlock').at(0);
        const text = firstRow
          .find('[data-selector="non-interactive"]')
          .prop('dangerouslySetInnerHTML')['__html'];

        expect(text).toEqual('Ich habe mich auch angemeldet und gehe <i>noch heute</i> zu meinem ersten Treffen!');
      });
      it('keeps three interactive rows', () => {
        const countInteractive = wrapper.find('[data-selector="interactive"]').length;
        const countNonInteractive = wrapper.find('[data-selector="non-interactive"]').length;
        expect(countInteractive).toEqual(1);
        expect(countNonInteractive).toEqual(4);
      });
    });
    describe('renders the formatted text correctly when item had two gaps', () => {
      let wrapper;
      beforeEach(() => {
        const props = {
          ...defaultProps,
          visibleItems: defaultProps.visibleItems.map((item, index) => ({
            ...item,
            nonInteractive: index === 5
          }))
        };
        wrapper = shallow(<DialogTrainer {...props} />);
      });
      it('formats the item text and removes gaps', () => {
        const firstRow = wrapper.find('MessageBlock').at(3);
        const text = firstRow
          .find('[data-selector="non-interactive"]')
          .prop('dangerouslySetInnerHTML')['__html'];

        expect(text).toEqual('<i>Eine</i> Woche besteht aus sieben Tagen, <b>oder?</b>');
      });
    });
  });
});
