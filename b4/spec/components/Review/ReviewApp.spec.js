import React from 'react';
import { shallow } from 'enzyme';
import ReviewMenuScreenContainer from '../../../src/components/Review/ReviewMenuScreen/ReviewMenuScreenContainer';
import ReviewEndScreenContainer from '../../../src/components/Review/ReviewEndScreen/ReviewEndScreenContainer';
import TrainersSequence from '../../../src/components/Sequence/TrainersSequence';
import { ReviewApp, mapDispatchToProps } from '../../../src/components/Review/ReviewApp';
import mockSpeechRecognitionService from '../../../src/services/speechRecognition/service';

jest.mock('../../../src/dux/tracker/events/vocabularyReview', () => ({
  vocabReviewEndedAbortEvent: () => ({ event: 'vocabulary_review:ended:abort' })
}));

jest.mock('../../../src/providers/b3', () => (Component) => (props) => <Component {...props} />);

describe('<ReviewApp />', () => {
  const defaultProps = {
    completed: false,
    fetchAccount: jest.fn(() => Promise.resolve()),
    fetchInteractionTypes: jest.fn(() => Promise.resolve()),
    fetchTrainerItemsStatistics: jest.fn(() => Promise.resolve()),
    initMicPermissions: jest.fn(() => Promise.resolve()),
    isLoading: false,
    isLoadingFonts: false,
    learnLanguageAlpha3: 'FRA',
    locale: 'en',
    speechRecognitionService: mockSpeechRecognitionService,
    started: true,
    track: jest.fn().mockResolvedValue({})
  };

  test('#mapDispatchToProps', () => {
    expect(mapDispatchToProps).toMatchSnapshot();
  });

  describe('loading state', () => {
    describe('when loading', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = shallow(<ReviewApp {...defaultProps} isLoading={true} />);
      });

      it('renders loader', () => {
        expect(wrapper.find('Loader')).toHaveLength(1);
      });
    });

    describe('when is not loading and fonts loaded', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = shallow(<ReviewApp {...defaultProps} isLoading={false} />);
      });

      it('does not render loader', () => {
        expect(wrapper.find('Loader')).toHaveLength(0);
      });
    });

    describe('when is not loading but fonts are loading', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = shallow(<ReviewApp {...defaultProps} isLoading={false} isLoadingFonts={true} />);
      });

      it('does not render loader', () => {
        expect(wrapper.find('Loader')).toHaveLength(1);
      });
    });
  });

  describe('component did mount', () => {
    beforeEach(() => {
      shallow(<ReviewApp {...defaultProps} />);
    });

    test('fetches interaction types', () => {
      expect(defaultProps.fetchInteractionTypes).toHaveBeenCalled();
    });

    test('fetches trainer items statistics', () => {
      expect(defaultProps.fetchTrainerItemsStatistics).toHaveBeenCalled();
    });

    test('fetches account information', () => {
      expect(defaultProps.fetchAccount).toHaveBeenCalled();
    });

    test('initialises mic permissions', () => {
      expect(defaultProps.initMicPermissions).toHaveBeenCalled();
    });

    test('should track product:view_shown', () => {
      expect(defaultProps.track).toHaveBeenCalledWith({
        event: 'product:view_shown',
        version: 1,
        payload: {
          view_name: 'review',
          locale: 'en',
          learn_language_alpha3: 'FRA'
        }
      });
    });
  });

  describe('when interaction is not selected', () => {
    test('renders ReviewMenu', () => {
      const component = shallow(<ReviewApp
        {...defaultProps}
        selectedInteraction={null}
      />);

      expect(component.find(ReviewMenuScreenContainer)).toHaveLength(1);
    });
  });

  describe('when interaction is selected', () => {
    test('renders TrainersSequence', () => {
      const component = shallow(<ReviewApp
        {...defaultProps}
        selectedInteraction="write"
      />);

      expect(component.find(TrainersSequence)).toHaveLength(1);
    });

    describe('when the sequence is completed', () => {
      test('renders ReviewEndScreenContainer', () => {
        const component = shallow(<ReviewApp
          {...defaultProps}
          completed={true}
          selectedInteraction="write"
        />);

        expect(component.find(ReviewEndScreenContainer)).toHaveLength(1);
      });
    });
  });
});
