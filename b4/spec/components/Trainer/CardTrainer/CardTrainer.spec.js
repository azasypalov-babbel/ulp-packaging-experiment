import React from 'react';
import { shallow } from 'enzyme';
import { mountWithTheme } from '../../shared/themeMock';
import { defaultPropsCard as defaultProps } from './defaultProps';

import { CardTrainer } from '../../../../src/components/Trainer/CardTrainer/CardTrainer';
import CardTrainerLayout from '../../../../src/components/Trainer/shared/CardTrainerLayout';

import getComponentFromInteractionType from '../../../../src/lib/getComponentFromInteractionType';

jest.mock('../../../../src/lib/matchingUtils/normalise');
jest.mock('../../../../src/lib/getComponentFromInteractionType', () => jest.fn());
jest.mock('../../../../src/components/Trainer/shared/CardTrainerLayout', () => 'CardTrainerLayout');

const MockInteraction = () => null;
getComponentFromInteractionType.mockImplementation(() => MockInteraction);

describe('<CardTrainer />', () => {
  describe('renders', () => {
    it('with full props a list of items', ()=> {
      const wrapper = shallow(<CardTrainer {...defaultProps} />);
      expect(wrapper.find('[type="task"] [data-selector="non-interactive"]').exists()).toBeTruthy();
      expect(wrapper.find('[type="phrase"] [data-selector="non-interactive"]').exists()).toBeTruthy();
      expect(wrapper.find('[type="task"] [data-selector="interactive"]').exists()).toBeTruthy();
      expect(wrapper.find('[type="phrase"] [data-selector="interactive"]').exists()).toBeTruthy();
      expect(wrapper).toMatchSnapshot();
    });

    describe('interactive phrase row', () => {
      it('passes the babbel markup to the MockInteraction', () => {
        const wrapper = shallow(<CardTrainer {...defaultProps} />);
        const firstRow = wrapper.find('Row').at(0);
        const { learnLanguageText } = firstRow
          .find(MockInteraction)
          .prop('item');

        expect(learnLanguageText).toEqual('((Schöner|*Guten)) "Morgen", lieber **Cousin**');
      });
    });

    describe('interactive task row', () => {
      it('passes the babbel markup to the MockInteraction', () => {
        const wrapper = shallow(<CardTrainer {...defaultProps} />);
        const firstRow = wrapper.find('Row').at(1);
        const { displayLanguageText } = firstRow
          .find(MockInteraction)
          .prop('item');

        expect(displayLanguageText).toEqual('Ein Tag, ((zwei Tage)), **drei** "Tage"');
      });
    });

    describe('non interactive phrase row', () => {
      it('formats the item text', () => {
        const wrapper = shallow(<CardTrainer {...defaultProps} />);
        const firstRow = wrapper.find('Row').at(2);
        const text = firstRow
          .find('[data-selector="non-interactive"]')
          .prop('dangerouslySetInnerHTML')['__html'];

        expect(text).toEqual('Argentina <i>became</i> <b>world champion</b>!');
      });
    });

    describe('non interactive task row', () => {
      it('formats the item text', () => {
        const wrapper = shallow(<CardTrainer {...defaultProps} />);
        const firstRow = wrapper.find('Row').at(3);
        const text = firstRow
          .find('[data-selector="non-interactive"]')
          .prop('dangerouslySetInnerHTML')['__html'];

        expect(text).toEqual('<i>Y sho era</i> el <b>mejor</b>');
      });
    });

    describe('empty row', () => {
      it('returns null', () => {
        const wrapper = shallow(<CardTrainer {...defaultProps} />);
        const emptyRow = wrapper.find('Row').at(7);

        expect(emptyRow.children().exists()).toEqual(false);
      });
    });

    it('without an image', () => {
      const wrapper = shallow(<CardTrainer {...defaultProps} image={null} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('item sounds', () => {
    it('assigns onClick handler to solved items', () => {
      const wrapper = shallow(<CardTrainer {...defaultProps} currentItemIndex={2} />);
      // first item is completed and it has sound
      expect((wrapper.find('Row').at(0).props().onClick)).toBeTruthy();
      // second item is completed but it does not have sound
      expect((wrapper.find('Row').at(1).props().onClick)).toBeFalsy();
      // all other items not completed
      expect((wrapper.find('Row').at(2).props().onClick)).toBeFalsy();
      expect((wrapper.find('Row').at(3).props().onClick)).toBeFalsy();
      expect((wrapper.find('Row').at(4).props().onClick)).toBeFalsy();
      expect((wrapper.find('Row').at(5).props().onClick)).toBeFalsy();
      expect((wrapper.find('Row').at(6).props().onClick)).toBeFalsy();
    });

    describe('trainer is complete', () => {
      it('assigns onClick handler to all phrase items with sound', () => {
        const wrapper = shallow(<CardTrainer {...defaultProps} currentItemIndex={null} />);
        // first item is completed and it has sound
        expect((wrapper.find('Row').at(0).props().onClick)).toBeTruthy();
        // second item is completed but it does not have sound
        expect((wrapper.find('Row').at(1).props().onClick)).toBeFalsy();
        // all other items not completed
        expect((wrapper.find('Row').at(2).props().onClick)).toBeFalsy();
        expect((wrapper.find('Row').at(3).props().onClick)).toBeFalsy();
        expect((wrapper.find('Row').at(4).props().onClick)).toBeTruthy();
        expect((wrapper.find('Row').at(5).props().onClick)).toBeTruthy();
        // last item is an empty one
        expect((wrapper.find('Row').at(6).props().onClick)).toBeFalsy();
      });
    });

    it('calls playItemSound', () => {
      const wrapper = shallow(<CardTrainer {...defaultProps} currentItemIndex={2} />);
      wrapper.find('[type="phrase"] [data-selector="interactive"]').first().parent().simulate('click');

      const expectedItem = defaultProps.visibleItems[0];
      expect(defaultProps.playItemSound).toBeCalledWith(expectedItem);
    });
  });

  describe('title', () => {
    describe('when prop title is defined', () => {
      it('should render title from props', () => {
        const titleText = 'test title';
        const wrapper = mountWithTheme(<CardTrainer {...defaultProps} title={titleText} />);
        expect(wrapper.find(CardTrainerLayout).props().titleText)
          .toEqual(titleText);
      });
    });

    describe('when prop title is not defined', () => {
      it('should render title from translations based on the trainer interaction', () => {
        const wrapper = mountWithTheme(<CardTrainer {...defaultProps} />);
        expect(wrapper.find(CardTrainerLayout).props().titleText)
          .toEqual(defaultProps.translations.trainerTitle[defaultProps.interaction]);
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
        wrapper = shallow(<CardTrainer {...props} />);
      });
      it('should render item translation text', () => {
        const translation = wrapper.find('[data-selector="item-translation"]');
        expect(translation.exists()).toBe(true);
        const translationText = translation.at(0).prop('dangerouslySetInnerHTML')['__html'];
        expect(translationText).toEqual('<i>Good morning</i>, <b>dear</b> cousin.');
      });
    });

    describe('with translations set to not visible', () => {
      let wrapper;
      beforeEach(() => {
        const props = {
          ...defaultProps,
          translationVisible: false
        };
        wrapper = shallow(<CardTrainer {...props} />);
      });
      it('should not render item translation text', () => {
        expect(wrapper.find('[data-selector="item-translation"]').exists()).toBe(false);
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
        wrapper = shallow(<CardTrainer {...props} />);
      });
      it('renders the phrase as non interactive', () => {
        const firstRow = wrapper.find('Row').at(0);
        expect(firstRow.find(MockInteraction).exists()).toBeFalsy();
        expect(firstRow.find('[data-selector="non-interactive"]').exists()).toBeTruthy();
      });
      it('formats the phrase text and removes gaps', () => {
        const firstRow = wrapper.find('Row').at(0);
        const text = firstRow
          .find('[data-selector="non-interactive"]')
          .prop('dangerouslySetInnerHTML')['__html'];

        expect(text).toEqual('Guten <i>Morgen</i>, lieber <b>Cousin</b>');
      });
      it('keeps three interactive rows', () => {
        const countInteractive = wrapper.find('[data-selector="interactive"]').length;
        const countNonInteractive = wrapper.find('[data-selector="non-interactive"]').length;
        expect(countInteractive).toEqual(3);
        expect(countNonInteractive).toEqual(4);
      });
    });
    describe('when an interactive item (task) was solved correctly in the lesson', () => {
      let wrapper;
      beforeEach(() => {
        const props = {
          ...defaultProps,
          visibleItems: defaultProps.visibleItems.map((item, index) => ({
            ...item,
            nonInteractive: index === 6
          }))
        };
        wrapper = shallow(<CardTrainer {...props} />);
      });
      it('renders the task as non interactive', () => {
        const firstRow = wrapper.find('Row').at(6);
        expect(firstRow.find(MockInteraction).exists()).toBeFalsy();
        expect(firstRow.find('[data-selector="non-interactive"]').exists()).toBeTruthy();
      });
      it('formats the task text and removes gaps', () => {
        const firstRow = wrapper.find('Row').at(6);
        const text = firstRow
          .find('[data-selector="non-interactive"]')
          .prop('dangerouslySetInnerHTML')['__html'];

        expect(text).toEqual('Vier Tage, <b>fünf</b> <i>Tage</i>, sechs Tage');
      });
      it('keeps three interactive rows', () => {
        const countInteractive = wrapper.find('[data-selector="interactive"]').length;
        const countNonInteractive = wrapper.find('[data-selector="non-interactive"]').length;
        expect(countInteractive).toEqual(3);
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
        wrapper = shallow(<CardTrainer {...props} />);
      });
      it('formats the item text and removes gaps', () => {
        const firstRow = wrapper.find('Row').at(5);
        const text = firstRow
          .find('[data-selector="non-interactive"]')
          .prop('dangerouslySetInnerHTML')['__html'];

        expect(text).toEqual('<i>Eine</i> Woche besteht aus sieben Tagen, <b>oder?</b>');
      });
    });
  });
});
