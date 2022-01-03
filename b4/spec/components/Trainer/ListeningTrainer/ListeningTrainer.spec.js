import React from 'react';
import { shallow } from 'enzyme';
import { ListeningTrainer } from '../../../../src/components/Trainer/ListeningTrainer/ListeningTrainer';

jest.mock('../../../../src/components/shared/FeedbackSheet/FeedbackSheet', () => 'FeedbackSheet');

describe('<ListeningTrainer />', () => {
  const mockOnContinue = jest.fn();
  const mockOnChoiceItemClick = jest.fn();
  const mockAudio = {
    playSound: jest.fn(),
    playSoundWithState: jest.fn(),
    preload: jest.fn(),
    reset: jest.fn(),
    stop: jest.fn()
  };

  const defaultProps = {
    onUserTriggeredSound: jest.fn(),
    showChoiceItems: false,
    item: {
      id: '549f9ecf012e7f3b636ec9e4ac5a0d10',
      learnLanguageText: 'Uno',
      displayLanguageText: 'One',
      sound: {
        id: 'd3572193477785b1bc030cdf61ec777c'
      }
    },
    choiceItemsList: [
      {
        learnLanguageText: 'Dos',
        displayLanguageText: 'Two'
      },
      {
        learnLanguageText: 'Tres',
        displayLanguageText: 'Three'
      }
    ],
    mediaUrlService: {
      soundURL: jest.fn((val) => `http://localhost/${val}.mp3`)
    },
    onContinue: mockOnContinue,
    onChoiceItemClick: mockOnChoiceItemClick,
    translations: {
      attemptFeedback: {
        positiveFeedback: 'good',
        negativeFeedback: 'bad'
      },
      continueBtn: 'Continue',
      instruction: 'Listen to the phrase'
    },
    audio: mockAudio,
    onSoundPlayerEnded: () => {},
    onSoundPlayerError: () => {},
    onToggleShortcuts: jest.fn()
  };

  test('renders', () => {
    const component = shallow(<ListeningTrainer {...defaultProps} />);
    expect(component).toMatchSnapshot();
  });

  test('renders in attempted state', () => {
    const component = shallow(<ListeningTrainer
      {...defaultProps}
      attempt={{ text: 'One', mistakes: 0 }}
    />);

    expect(component).toMatchSnapshot();
  });

  describe('choiceItem click', () => {
    let component;
    let handleChoiceItemClick;

    beforeEach(() => {
      component = shallow(<ListeningTrainer {...defaultProps} />);
      handleChoiceItemClick = component.instance().handleChoiceItemClick;
      mockOnChoiceItemClick.mockClear();
    });

    describe('when correct', () => {
      test('calls onChoiceItemClick callback with expected attempt', () => {
        handleChoiceItemClick('One');

        const expectedAttempt = {
          text: 'One',
          mistakes: 0
        };

        expect(mockOnChoiceItemClick).toHaveBeenCalledWith(expectedAttempt, expect.anything());
      });
    });

    describe('when incorrect', () => {
      test('calls onChoiceItemClick callback with 2 mistakes', () => {
        handleChoiceItemClick('Two');

        const expectedAttempt = {
          text: 'Two',
          mistakes: 2
        };

        expect(mockOnChoiceItemClick).toHaveBeenCalledWith(expectedAttempt, expect.anything());
      });
    });
  });

  describe('continue button click', () => {
    let component;
    let handleContinueClick;

    const mockOnContinue = jest.fn();

    describe('when attempt exist', () => {
      const attempt = {
        mistakes: 1,
        text: 'Two'
      };

      beforeEach(() => {
        component = shallow(<ListeningTrainer
          {...defaultProps}
          attempt={attempt}
          onContinue={mockOnContinue}
        />);
        handleContinueClick = component.instance().handleContinueClick;
      });

      test('calls onContinue callback', () => {
        handleContinueClick();

        expect(mockOnContinue).toHaveBeenCalledTimes(1);
        expect(mockOnContinue).toHaveBeenCalledWith(defaultProps.item, attempt.mistakes);
      });
    });

    describe('when attempt is reset to undefined', () => {
      const attempt = undefined;

      beforeEach(() => {
        component = shallow(<ListeningTrainer
          {...defaultProps}
          attempt={attempt}
          onContinue={mockOnContinue}
        />);
        handleContinueClick = component.instance().handleContinueClick;
      });

      test('does not call onContinue callback', () => {
        handleContinueClick();

        expect(mockOnContinue).not.toHaveBeenCalled();
      });
    });
  });

  describe('Toolbar', () => {
    let component;

    test('renders', () => {
      component = shallow(<ListeningTrainer {...defaultProps} />);

      expect(component.find('Toolbar')).toHaveLength(1);
    });

    test('does not render when attempt', () => {
      component = shallow(<ListeningTrainer
        attempt={{ text: 'One', mistakes: 0 }}
        {...defaultProps}
      />);

      expect(component.find('Toolbar')).toHaveLength(0);
    });
  });

  describe('with attempt', () => {
    let component;

    test('renders FeedbackSheet', () => {
      component = shallow(<ListeningTrainer {...defaultProps} />);
      expect(component.find('FeedbackSheet')).toHaveLength(0);
      component.setProps({ attempt: { text: 'Two', mistakes: 1 } });
      expect(component.find('FeedbackSheet')).toHaveLength(1);
    });
  });
});
