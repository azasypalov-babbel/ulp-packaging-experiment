import React from 'react';
import { NavbarContainer, mapStateToProps } from '../../../../src/components/shared/Navbar/NavbarContainer';
import * as sequenceSelectors from '../../../../src/dux/sequence/selectors';
import * as sessionSelectors from '../../../../src/dux/session/selectors';
import { shallow } from 'enzyme';


jest.mock('../../../../src/dux/sequence/selectors');
jest.mock('../../../../src/dux/session/selectors', () => ({
  isLesson: jest.fn(),
  isLessonLandingScreenShown: jest.fn()
}));

const defaultProps = {
  isLessonLandingScreenShown: false,
  progressBar: {
    trainerCount: 4,
    sequenceHeadIndex: 2,
    currentTrainerIndex: 2,
    sequenceHeadProgress: 0.33,
    onTrainerClick: jest.fn()
  },
  showFeedbackButton: true,
  showProgressBar: true,
  progressCounter: {
    current: 2,
    total: 3
  },
  itemProgressCounter: {
    current: 5,
    total: 12
  },
  isLesson: true,
  closeLesson: jest.fn(),
  closeReview: jest.fn(),
  track: jest.fn()
};

describe('<NavbarContainer />', () => {
  describe('mapStateToProps', () => {
    beforeEach(() => {
      sequenceSelectors.trainersInSequence.mockImplementation(() => []);
    });

    const state = {
      zendeskWidget: {},
      sequence: {},
      session: {
        lessonLandingScreenSettings: {}
      }
    };

    test('selects data from the state', () => {
      mapStateToProps(state);

      expect(sequenceSelectors.trainersInSequence).toHaveBeenCalled();
      expect(sequenceSelectors.sequenceHeadProgress).toHaveBeenCalled();
      expect(sequenceSelectors.sequenceHeadIndex).toHaveBeenCalled();
      expect(sessionSelectors.isLesson).toHaveBeenCalled();
      expect(sessionSelectors.isLessonLandingScreenShown).toHaveBeenCalled();
    });

    describe('in lesson', () => {
      beforeEach(() => {
        sessionSelectors.isLesson.mockImplementation(() => true);
      });

      afterEach(() => {
        sessionSelectors.isLesson.mockClear();
      });

      test('progressCounter is based on trainers', () => {
        mapStateToProps(state);

        expect(sequenceSelectors.sequenceProgressCounter).toHaveBeenCalled();
        expect(sequenceSelectors.itemProgressCounter).not.toHaveBeenCalled();
      });
    });

    describe('in review', () => {
      beforeEach(() => {
        sessionSelectors.isLesson.mockImplementation(() => false);
      });

      afterEach(() => {
        sessionSelectors.isLesson.mockClear();
      });

      test('progressCounter is based on items', () => {
        mapStateToProps(state);

        expect(sequenceSelectors.sequenceProgressCounter).not.toHaveBeenCalled();
        expect(sequenceSelectors.itemProgressCounter).toHaveBeenCalled();
      });
    });
  });

  describe('wraps Navbar component with all necessary data', () => {
    test('in lesson mode', () => {
      const component = shallow(<NavbarContainer isLesson={true} {...defaultProps} />);

      expect(component).toMatchSnapshot();
    });

    test('in review mode', () => {
      const component = shallow(<NavbarContainer isLesson={false} {...defaultProps} />);

      expect(component).toMatchSnapshot();
    });
  });

  describe('handleCloseClick', () => {
    test('calls closeLesson in lesson mode', () => {
      const closeLessonMock = jest.fn();
      const component = shallow(<NavbarContainer
        {...defaultProps}
        isLesson={true}
        closeLesson={closeLessonMock}
      />);
      component
        .instance()
        .handleCloseClick();

      expect(closeLessonMock).toHaveBeenCalled();
    });

    test('calls closeReview in review mode', () => {
      const closeReviewMock = jest.fn();
      const component = shallow(<NavbarContainer
        {...defaultProps}
        isLesson={false}
        closeReview={closeReviewMock}
      />);
      component
        .instance()
        .handleCloseClick();

      expect(closeReviewMock).toHaveBeenCalled();
    });
  });

  describe('handleProgressBarTrainerClick', () => {
    beforeEach(() => {
      defaultProps.track.mockClear();
    });

    test('it calls track with required payload for lessons', () => {
      const component = shallow(<NavbarContainer {...defaultProps} isLesson={true}/>);
      component
        .instance()
        .handleProgressBarTrainerClick(0);

      expect(defaultProps.track).toHaveBeenCalled();
      expect(defaultProps.track.mock.calls[0][0]).toMatchSnapshot();
    });
  });
});
