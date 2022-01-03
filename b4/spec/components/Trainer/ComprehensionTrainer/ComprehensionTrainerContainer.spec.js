import React from 'react';
import { mount } from 'enzyme';

/* eslint-disable max-len */
import { ComprehensionTrainerContainer } from '../../../../src/components/Trainer/ComprehensionTrainer/ComprehensionTrainerContainer';
import { QuestionWithChoicebuttonsInteraction } from '../../../../src/components/Interactions/QuestionWithChoicebuttons';
/* eslint-enable max-len */

import { contentItems, questionsItems } from './defaultProps';
import { withServicesProvider } from '../../../../src/components/shared/withServices';
import withThemeProvider from '../../../../src/providers/theme';
import ContinueSheet from '../../../../src/components/ContinueSheet';
import ComprehensionTrainer from '../../../../src/components/Trainer/ComprehensionTrainer/ComprehensionTrainer';
import soundService from '../../../../src/services/soundService';
import TranslationVisibilityToggle from '../../../../src/components/Trainer/shared/TranslationVisibilityToggle';

jest.mock('../../../../src/components/Trainer/ComprehensionTrainer/ComprehensionTrainer', () => jest.fn(() => null));

jest.mock('../../../../src/services/soundService');
jest.mock('../../../../src/components/ContinueSheet', () => () => null);

jest.mock('../../../../src/components/Interactions/QuestionWithChoicebuttons', () => ({
  __esModule: true,
  QuestionWithChoicebuttonsInteraction: jest.fn(() => null)
}));

const defaultProps = {
  trainer: {
    interaction: 'choice',
    dictate: false,
    itemGroups: [
      { items: contentItems },
      { items: questionsItems }
    ]
  },
  onStart: jest.fn(),
  onFinish: jest.fn(),
  track: jest.fn(),
  learnLanguageAlpha3: 'DEU',
  currentTrainerItemIndex: 0,
  attemptItem: jest.fn(),
  completeItem: jest.fn(),
  clearInfoTextUI: jest.fn(),
  displayInfoText: jest.fn()
};

const Component = withServicesProvider(() => ({
  soundService,
  mediaUrlService: { soundURL: jest.fn((arg) => `${arg}.mp3`) }
}))(withThemeProvider(ComprehensionTrainerContainer));

const getWrapper = (props) => mount(
  <Component {...defaultProps} {...props} />
);

describe('ComprehensionTrainerContainer', () => {
  afterEach(() => {
    defaultProps.onStart.mockClear();
    defaultProps.onFinish.mockClear();
  });

  it('preloads sounds', () => {
    getWrapper();
    expect(soundService.preload.mock.calls).toMatchSnapshot();
  });

  it('triggers onStart on a new trainer', () => {
    const wrapper = getWrapper();
    expect(defaultProps.onStart).toBeCalledWith({ scorableItemsCount: 1 });
    wrapper.setProps({ forceUpdate: 1 });
    expect(defaultProps.onStart).toBeCalledTimes(1);
    wrapper.setProps({ trainer: { ...defaultProps.trainer } });
    expect(defaultProps.onStart).toBeCalledTimes(2);
  });

  it('renders ContinueSheet when all items are completed', () => {
    const wrapper = getWrapper();
    expect(wrapper.find(ContinueSheet).exists()).toBeFalsy();
    wrapper.find(QuestionWithChoicebuttonsInteraction).invoke('onFinish')(0);
    expect(wrapper.find(ContinueSheet).exists()).toBeTruthy();
  });

  it('triggers onFinish when ContinueSheet dismiss button clicked', () => {
    const wrapper = getWrapper();
    wrapper.find(QuestionWithChoicebuttonsInteraction).invoke('onFinish')(0);
    wrapper.find(ContinueSheet).invoke('onClick')();
    expect(defaultProps.onFinish).toBeCalledTimes(1);
  });

  it('highlights QuestionSheet expand button once all items are viewed or played', () => {
    const wrapper = getWrapper();
    expect(wrapper.find(QuestionWithChoicebuttonsInteraction).prop('highlighted')).toBeFalsy();
    wrapper.find(ComprehensionTrainer).invoke('onAllItemsComplete')();
    expect(wrapper.find(QuestionWithChoicebuttonsInteraction).prop('highlighted')).toBeTruthy();
  });

  it('has translation visibility toggle only on dictate flag set to false', () => {
    const wrapper = getWrapper();
    expect(wrapper.find(TranslationVisibilityToggle).exists()).toBeTruthy();
    wrapper.setProps({ trainer: { ...defaultProps.trainer, dictate: true } });
    expect(wrapper.find(TranslationVisibilityToggle).exists()).toBeFalsy();
  });

  it('passes the right visibility flag to ComprehensionTrainer component', () => {
    const wrapper = getWrapper();
    expect(wrapper.find(ComprehensionTrainer).prop('translationsVisible')).toBeFalsy();
    wrapper.find(TranslationVisibilityToggle).invoke('onClick')();
    expect(wrapper.find(ComprehensionTrainer).prop('translationsVisible')).toBeTruthy();
  });
});
