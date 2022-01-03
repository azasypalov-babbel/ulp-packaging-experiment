import React from 'react';
import { mount } from 'enzyme';
import withThemeProvider from '../../../../src/providers/theme';
import { ServiceContext } from '../../../../src/components/shared/withServices';
import mockSoundService from '../../../../src/services/soundService';

import { props as defaultProps } from './defaultProps';

import ComprehensionTrainer from '../../../../src/components/Trainer/ComprehensionTrainer/ComprehensionTrainer';
import TrainerTitle from '../../../../src/components/Trainer/shared/TrainerTitle';
import { Player } from '../../../../src/components/Player/Player';
import { TextContent } from '../../../../src/components/Trainer/ComprehensionTrainer/TextContent';
import { StyledText } from '../../../../src/components/Trainer/ComprehensionTrainer/styles';

jest.mock('../../../../src/services/soundService');

const Component = withThemeProvider(ComprehensionTrainer);
const getWrapper = (props) => mount(
  <Component {...defaultProps} {...props} />,
  {
    wrappingComponent: ServiceContext.Provider,
    wrappingComponentProps: {
      value: {
        translationService: { translate: jest.fn((key) => key) },
        mediaUrlService: { soundURL: jest.fn((arg) =>  arg + '.mp3') },
        soundService: mockSoundService
      }
    }
  });

describe('<ComprehensionTrainer />', () => {
  afterEach(() => {
    defaultProps.onAllItemsComplete.mockClear();
  });

  describe('audio', () => {
    it('renders with dictate flag', () => {
      const wrapper = getWrapper({ dictate: true });
      expect(wrapper.find(Player).exists()).toBeTruthy();
    });

    it('passes the correct audio urls to Player', () => {
      const wrapper = getWrapper({ dictate: true });
      expect(wrapper.find(Player).prop('audioUrls')).toEqual(['123.mp3', '456.mp3', '789.mp3']);

      wrapper.setProps({ items: [{ sound: { id: '321' } }, { sound: { id: '654' } }, { sound: { id: '987' } }] });
      expect(wrapper.find(Player).prop('audioUrls')).toEqual(['321.mp3', '654.mp3', '987.mp3']);
    });

    it('displays the correct trainer title', () => {
      const wrapper = getWrapper();
      expect(wrapper.find(TrainerTitle).prop('text')).toEqual('Comprehension Test');

      wrapper.setProps({ title: '' });
      expect(wrapper.find(TrainerTitle).prop('text')).toMatchSnapshot();

      wrapper.setProps({ dictate: true });
      expect(wrapper.find(TrainerTitle).prop('text')).toMatchSnapshot();
    });
  });

  describe('text', () => {
    it('renders without dictate flag', () => {
      const wrapper = getWrapper();
      expect(wrapper.find(Player).exists()).toBeFalsy();
    });

    it('handles translation visibility correctly', () => {
      const wrapper = getWrapper();
      expect(wrapper.find(TextContent).find(StyledText)).toHaveLength(3);
      expect(wrapper.find(TextContent).find(StyledText).at(0).text()).toMatchSnapshot();
      expect(wrapper.find(TextContent).find(StyledText).at(1).text()).toMatchSnapshot();

      wrapper.setProps({ translationsVisible: true });
      expect(wrapper.find(TextContent).find(StyledText)).toHaveLength(6);
      expect(wrapper.find(TextContent).find(StyledText).at(0).text()).toMatchSnapshot();
      expect(wrapper.find(TextContent).find(StyledText).at(1).text()).toMatchSnapshot();
    });

    it('calls onAllItemsComplete on scroll to bottom', () => {
      const map = {};
      document.addEventListener = jest.fn((event, cb) => {
        map[event] = cb;
      });

      const wrapper = getWrapper();
      map.scroll({ target: { scrollingElement: { scrollTop: 10, scrollHeight: 9 } } });

      expect(wrapper.prop('onAllItemsComplete')).toHaveBeenCalled();
    });
  });
});
