import React from 'react';
import { shallow } from 'enzyme';
import { mountWithTheme } from '../../shared/themeMock';
import { defaultPropsKeyboard as defaultProps } from './defaultProps';

import { KeyboardTrainer } from '../../../../src/components/Trainer/KeyboardTrainer/KeyboardTrainer';
import KeyboardTrainerLayout from '../../../../src/components/Trainer/shared/CardTrainerLayout';
import FillinInteraction from '../../../../src/components/Interactions/Fillin/FillinInteraction';
import { isWebview } from '../../../../src/lib/features';

jest.mock('../../../../src/lib/features');
jest.mock('../../../../src/lib/matchingUtils/normalise');
jest.mock('../../../../src/components/Trainer/shared/CardTrainerLayout', () => 'CardTrainerLayout');
jest.mock('../../../../src/components/Interactions/Fillin/FillinInteraction', () => 'FillinInteraction');
jest.mock('../../../../src/components/Interactions/shared/Transliteration/TransliterationInstructions',
  () => 'TransliterationInstructions');

describe('<KeyboardTrainer />', () => {
  describe('renders', () => {
    it('with full props a list of items', ()=> {
      const wrapper = shallow(<KeyboardTrainer {...defaultProps} />);
      expect(wrapper).toMatchSnapshot();
    });

    describe('interactive phrase row', () => {
      it('passes the babbel markup to the FillinInteraction', () => {
        const wrapper = shallow(<KeyboardTrainer {...defaultProps} />);
        const row = wrapper.find('Row').at(3);
        const { learnLanguageText } = row
          .find(FillinInteraction)
          .prop('item');

        expect(learnLanguageText).toEqual('**л** - **ль**: полка - пол((ь))ка');
      });
    });

    describe('empty row', () => {
      it('returns null', () => {
        const wrapper = shallow(<KeyboardTrainer {...defaultProps} />);
        const emptyRow = wrapper.find('Row').at(4);
        expect(emptyRow.exists()).toBeTruthy();
        expect(emptyRow.children().exists()).toEqual(false);
      });
    });
  });

  describe('description', () => {
    it('renders the description', () => {
      const wrapper = shallow(<KeyboardTrainer {...defaultProps} />);

      const description = wrapper.find('[data-selector="description"]');
      expect(description.exists()).toBe(true);

      const descriptionText = description.at(0).prop('dangerouslySetInnerHTML')['__html'];
      expect(descriptionText).toEqual(
        'For the English letter combination \'sh\' Russian uses a single letter: <b>ш</b>.');
    });
  });

  describe('transliteration instructions', () => {
    describe('when in Webview', () => {
      beforeEach(() => {
        isWebview.mockImplementationOnce(() => true);
      });

      it('does not render the transliteration instructions', () => {
        const wrapper = shallow(<KeyboardTrainer {...defaultProps} />);
        const transliterationInstructions = wrapper.find('TransliterationInstructions');
        expect(transliterationInstructions.exists()).toBeFalsy();
      });
    });

    describe('when not in Webview', () => {
      beforeEach(() => {
        isWebview.mockImplementationOnce(() => false);
      });

      it('renders the transliteration instructions', () => {
        const wrapper = shallow(<KeyboardTrainer {...defaultProps} />);
        const transliterationInstructions = wrapper.find('TransliterationInstructions');
        expect(transliterationInstructions.exists()).toBeTruthy();
      });
    });
  });

  describe('item sounds', () => {
    it('assigns onClick handler to solved items having sound', () => {
      const wrapper = shallow(<KeyboardTrainer {...defaultProps} currentItemIndex={2} />);
      // first item is completed and it has sound
      expect((wrapper.find('Row').at(0).props().onClick)).toBeTruthy();
      // second item is completed but it does not have sound
      expect((wrapper.find('Row').at(1).props().onClick)).toBeFalsy();
      // all other items not completed
      expect((wrapper.find('Row').at(2).props().onClick)).toBeFalsy();
      expect((wrapper.find('Row').at(3).props().onClick)).toBeFalsy();
      expect((wrapper.find('Row').at(4).props().onClick)).toBeFalsy();
    });

    describe('trainer is complete', () => {
      it('assigns onClick handler to all phrase items with sound', () => {
        const wrapper = shallow(<KeyboardTrainer {...defaultProps} currentItemIndex={null} />);

        expect((wrapper.find('Row').at(0).props().onClick)).toBeTruthy();
        expect((wrapper.find('Row').at(1).props().onClick)).toBeFalsy();
        expect((wrapper.find('Row').at(2).props().onClick)).toBeTruthy();
        expect((wrapper.find('Row').at(3).props().onClick)).toBeTruthy();
        expect((wrapper.find('Row').at(4).props().onClick)).toBeTruthy();
      });
    });

    it('calls playItemSound', () => {
      const wrapper = shallow(<KeyboardTrainer {...defaultProps} currentItemIndex={2} />);
      wrapper.find('[type="phrase"] [data-selector="interactive"]').first().parent().simulate('click');

      const expectedItem = defaultProps.visibleItems[0];
      expect(defaultProps.playItemSound).toBeCalledWith(expectedItem);
    });
  });

  describe('title', () => {
    describe('when prop title is defined', () => {
      it('should render title from props', () => {
        const titleText = 'test title';
        const wrapper = mountWithTheme(<KeyboardTrainer {...defaultProps} title={titleText} />);
        expect(wrapper.find(KeyboardTrainerLayout).props().titleText)
          .toEqual(titleText);
      });
    });

    describe('when prop title is not defined', () => {
      it('should render title from translations based on the trainer interaction', () => {
        const wrapper = mountWithTheme(<KeyboardTrainer {...defaultProps} />);
        expect(wrapper.find(KeyboardTrainerLayout).props().titleText)
          .toEqual(defaultProps.translations.title);
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
        wrapper = shallow(<KeyboardTrainer {...props} />);
      });

      it('should render item translation text', () => {
        const translation = wrapper.find('[data-selector="item-translation"]');
        expect(translation.exists()).toBe(true);
        const translationText = translation.at(0).prop('dangerouslySetInnerHTML')['__html'];
        expect(translationText).toEqual('good');
      });
    });

    describe('with translations set to not visible', () => {
      let wrapper;
      beforeEach(() => {
        const props = {
          ...defaultProps,
          translationVisible: false
        };
        wrapper = shallow(<KeyboardTrainer {...props} />);
      });

      it('should not render item translation text', () => {
        expect(wrapper.find('[data-selector="item-translation"]').exists()).toBe(false);
      });
    });
  });
});
