import React from 'react';
import { shallow } from 'enzyme';
import { mapStateToProps, LessonSequence } from '../../../src/components/Lesson/LessonSequence';

// eslint-disable-next-line max-len
jest.mock('../../../src/components/Screen/LearningTipScreen/LearningTipScreenContainer', () => 'LearningTipScreenContainer');
jest.mock('../../../src/components/Sequence/TrainersSequence', () => 'TrainersSequence');
jest.mock('../../../src/components/Lesson/LegacyTrainerSettingsContainer', () => 'LegacyTrainerSettingsContainer');
jest.mock('../../../src/components/Lesson/LessonEndScreen/LessonEndScreenContainer', () => 'LessonEndScreenContainer');
// eslint-disable-next-line max-len
jest.mock('../../../src/components/Lesson/LessonLandingScreen/LessonLandingScreenContainer', () => 'LessonLandingScreen');
jest.mock('../../../src/components/shared/InternetExplorerMessage', () => 'InternetExplorerMessage');
jest.mock('../../../src/components/shared/Loader', () => 'Loader');
jest.mock('../../../src/dux/sequence/selectors');

const mockTrack = jest.fn();

const defaultProps = {
  isLoading: false,
  isLoadingFonts: false,
  isMicEnabled: null,
  started: false,
  completed: false,
  learningTipConfirmed: false,
  trainers: [{ interaction: '' }],
  confirmLearningTip: jest.fn(),
  setMicSettings: jest.fn(),
  startSequence: jest.fn(),
  navigate: jest.fn(),
  showMicSetupPage: true,
  speechEngineName: undefined,
  speechRecognitionService: undefined,
  initMicPermissions: jest.fn(),
  initMicSettings: jest.fn(),
  track: mockTrack,
  locale: 'en',
  learnLanguageAlpha3: 'DEU',
  lessonUuid: '',
  isUnsupportedBrowser: false,
  isUnsupportedBrowserWarningDismissed: false,
  dismissUnsupportedBrowserWarning: jest.fn(),
  lessonLandingScreenSettings: {
    shouldShow: false
  },
  confirmLessonLandingScreen: jest.fn(),
  isLessonLandingScreenShown: false
};

describe('LessonSequence#mapStateToProps', () => {
  const defaultState = {
    content: { loading: false },
    lesson: { loading: false },
    sequence: { trainers: [{}] },
    session: {
      client: {},
      micSettings: {
        isMicEnabled: false
      },
      lessonLandingScreenSettings: {
        shouldShow: false
      }
    },
    micOnboarding: {},
    speechRecognition: { loading: false },
    isUnsupportedBrowser: false,
    isUnsupportedBrowserWarningDismissed: false
  };

  describe('when web speech recognizer is supported', () => {
    it('should set speechEngineName to WebAPISpeechRecognition', () => {
      const props = mapStateToProps(defaultState, {
        ...defaultProps,
        speechRecognitionService: {
          isSupported: () => true,
          getEngineName: () => 'WebAPISpeechRecognition'
        }
      });
      expect(props.speechEngineName).toEqual('WebAPISpeechRecognition');
    });
  });

  describe('when only analyzer lib is supported', () => {
    it('should set speechEngineName to analyserLib.js', () => {
      const props = mapStateToProps(defaultState, {
        ...defaultProps,
        speechRecognitionService: {
          isSupported: () => true,
          getEngineName: () => 'analyserLib.js'
        }
      });
      expect(props.speechEngineName).toEqual('analyserLib.js');
    });
  });

  describe('when everything is loaded', () => {
    it('should set isLoading to false', () => {
      expect(mapStateToProps(defaultState, defaultProps).isLoading).toEqual(false);
    });
  });

  describe('when content is loading', () => {
    const state = { ...defaultState, content: { loading: true } };

    it('should set isLoading to true', () => {
      expect(mapStateToProps(state, defaultProps).isLoading).toEqual(true);
    });
  });

  describe('when trainers list is empty', () => {
    const state = { ...defaultState, sequence: { trainers: [] } };

    it('should set isLoading to true', () => {
      expect(mapStateToProps(state, defaultProps).isLoading).toEqual(true);
    });
  });

  describe('when lesson is loading', () => {
    const state = { ...defaultState, lesson: { loading: true } };

    it('should set isLoading to true', () => {
      expect(mapStateToProps(state, defaultProps).isLoading).toEqual(true);
    });
  });
});

describe('LessonSequence', () => {
  let wrapper;

  describe('#constructor', () => {
    beforeEach(() => {
      wrapper = shallow(<LessonSequence {...defaultProps} />);
    });

    it('initialize mic permissions', () => {
      expect(defaultProps.initMicPermissions).toHaveBeenCalled();
    });

    it('initialize mic settings', () => {
      expect(defaultProps.initMicSettings).toHaveBeenCalled();
    });
  });

  describe('when loading is true', () => {
    beforeEach(() => {
      wrapper = shallow(<LessonSequence
        {...defaultProps}
        isLoading={true}
      />);
    });

    it('renders loader', () => {
      expect(wrapper.find('Loader')).toHaveLength(1);
    });
  });

  describe('when loading is false', () => {
    describe('and fonts are loaded', () => {
      beforeEach(() => {
        wrapper = shallow(<LessonSequence
          {...defaultProps}
          isLoading={false}
        />);
      });

      it('does not render loader', () => {
        expect(wrapper.find('Loader')).toHaveLength(0);
      });
    });

    describe('and fonts are not loaded', () => {
      beforeEach(() => {
        wrapper = shallow(<LessonSequence
          {...defaultProps}
          isLoading={false}
          isLoadingFonts={true}
        />);
      });

      it('does render loader', () => {
        expect(wrapper.find('Loader')).toHaveLength(1);
      });
    });
  });

  describe('when `isLessonLandingScreenShown` is true', () => {
    beforeEach(() => {
      wrapper = shallow(<LessonSequence
        {...defaultProps}
        isLessonLandingScreenShown={true}
      />);
    });

    it('renders LessonLandingScreen with correct props', () => {
      expect(wrapper.find('LessonLandingScreen')).toHaveLength(1);
      expect(wrapper.props().onConfirm).toEqual(defaultProps.confirmLessonLandingScreen);
    });
  });

  describe('when `isLessonLandingScreenShown` is false', () => {
    beforeEach(() => {
      wrapper = shallow(<LessonSequence
        {...defaultProps}
        isLessonLandingScreenShown={false}
      />);
    });

    it('does not render LessonLandingScreen', () => {
      expect(wrapper.find('LessonLandingScreen')).toHaveLength(0);
    });
  });

  describe('when trainers sequence is not started', () => {
    describe('when browser is not supported', () => {
      beforeEach(() => {
        wrapper = shallow(<LessonSequence
          {...defaultProps}
          isUnsupportedBrowser={true}
        />);
      });

      it('renders a warning about unsupported browser', () => {
        expect(wrapper.find('InternetExplorerMessage')).toHaveLength(1);
      });
    });

    describe('when browser is supported', () => {
      beforeEach(() => {
        wrapper = shallow(<LessonSequence
          {...defaultProps}
          isUnsupportedBrowser={false}
        />);
      });

      it('does not render a warning about unsupported browser', () => {
        expect(wrapper.find('InternetExplorerMessage')).toHaveLength(0);
      });
    });

    describe('when microphone requires setup', () => {
      beforeEach(() => {
        wrapper = shallow(<LessonSequence
          {...defaultProps}
          speechEngineName={'analyserLib.js'}
          showMicSetupPage={true}
        />);
      });

      it('renders microphone settings page', () => {
        expect(wrapper.find('LegacyTrainerSettingsContainer')).toHaveLength(1);
      });
    });

    describe('when microphone does not require setup', () => {
      describe('when there is no trainer with speak interaction', () => {
        beforeEach(() => {
          wrapper = shallow(<LessonSequence
            {...defaultProps}
            speechEngineName={'analyserLib.js'}
            showMicSetupPage={false}
          />);
        });

        it('does not render microphone settings page', () => {
          expect(wrapper.find('LegacyTrainerSettingsContainer')).toHaveLength(0);
        });

        it('renders learning tip page', () => {
          expect(wrapper.find('LearningTipScreenContainer')).toHaveLength(1);
        });
      });

      describe('when speech is not supported', () => {
        beforeEach(() => {
          wrapper = shallow(<LessonSequence
            {...defaultProps}
            speechEngineName={undefined}
            showMicSetupPage={false}
          />);
        });

        it('does not render microphone settings page', () => {
          expect(wrapper.find('LegacyTrainerSettingsContainer')).toHaveLength(0);
        });

        it('renders learning tip page', () => {
          expect(wrapper.find('LearningTipScreenContainer')).toHaveLength(1);
        });
      });
    });
  });

  describe('when trainers sequence is started', () => {
    beforeEach(() => {
      wrapper = shallow(<LessonSequence
        {...defaultProps}
        started={true}
        currentTrainerIndex={0}
      />);
    });

    it('renders the trainers', () => {
      expect(wrapper.find('TrainersSequence')).toHaveLength(1);
    });
  });

  describe('when trainers sequence is completed', () => {
    beforeEach(() => {
      wrapper = shallow(<LessonSequence
        {...defaultProps}
        started={true}
        completed={true}
      />);
    });

    it('does not render the trainers', () => {
      expect(wrapper.find('TrainersSequence')).toHaveLength(0);
    });

    it('renders lesson end page', () => {
      expect(wrapper.find('LessonEndScreenContainer')).toHaveLength(1);
    });
  });

  describe('#handleMicSetupFinish', () => {
    const settings = { speak: false };

    beforeEach(() => {
      wrapper = shallow(<LessonSequence {...defaultProps} />);
      wrapper.instance().handleMicSetupFinish(settings);
    });

    test('tracks gui:interacted', () => {
      expect(mockTrack).toHaveBeenCalledTimes(1);
      expect(mockTrack.mock.calls[0][0]).toMatchSnapshot();
    });

    it('sets the global microphone settings', () => {
      expect(defaultProps.setMicSettings).toHaveBeenCalledWith(settings.speak);
    });

    it('starts the sequence', () => {
      expect(defaultProps.startSequence).toHaveBeenCalled();
    });
  });

  describe('#handleLearningTipConfirmation', () => {
    beforeEach(() => {
      wrapper = shallow(<LessonSequence {...defaultProps} />);
      wrapper.instance().handleLearningTipConfirmation();
    });

    it('sets the flag to confirm the learning tip', () => {
      expect(defaultProps.confirmLearningTip).toHaveBeenCalled();
    });

    it('starts the sequence', () => {
      expect(defaultProps.startSequence).toHaveBeenCalled();
    });
  });

  describe('regression: when in transition from learning tip confirmed before sequence has started', () => {
    beforeEach(() => {
      wrapper = shallow(<LessonSequence
        {...defaultProps}
        isMicEnabled={true}
        learningTipConfirmed={true}
        started={false}
        completed={false}
        showMicSetupPage={false}
      />);
    });

    it('renders nothing', () => {
      expect(wrapper.isEmptyRender()).toEqual(true);
    });
  });
});
