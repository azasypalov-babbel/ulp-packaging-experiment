import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { MatchingItem, MATCHING_ITEM_WRAPPER_ID } from '../../../../src/components/Trainer/MatchingTrainer/MatchingItem/MatchingItem';
import { matchingBaseDefaultProps, matchingOptionDefaultProps, MOCK_OPTION_ID, MOCK_SOUND_ID } from './defaultProps';
import { withServicesProvider } from '../../../../src/components/shared/withServices';
import withThemeProvider from '../../../../src/providers/theme';
import mockSoundService from '../../../../src/services/soundService';

jest.mock('../../../../src/services/soundService');

const services = {
  soundService: mockSoundService,
  mediaUrlService: { soundURL: jest.fn((arg) => `${arg}`) }
}

const Component = withServicesProvider(() => services)(withThemeProvider(MatchingItem));

const simulateClickItem = wrapper => act(() => {
  wrapper.find(`div[data-selector="${MATCHING_ITEM_WRAPPER_ID}"]`).first().simulate('click')
});

describe('match item clicking', () => {
  let onOptionClickMock;
  let soundServiceMock;

  beforeEach(() => {
    onOptionClickMock = jest.fn();
    soundServiceMock = services.soundService.getInstance(MOCK_SOUND_ID);
  })

  describe('option', () => {
    describe('when option is not clickable', () => {
      beforeEach(() => {
        const wrapper = mount(<Component {...matchingOptionDefaultProps} isMatched isClickable={false} onOptionClick={onOptionClickMock} />)
        simulateClickItem(wrapper);
      });

      it('should not call onOptionClick even if isMatched', () => {
        expect(onOptionClickMock).not.toHaveBeenCalled();
      });

      it('should not play item sound even if isMatched', () => {
        expect(soundServiceMock.play).not.toHaveBeenCalled();
      });
    });

    describe('when option is clickable', () => {
      describe('after click when isMatched && soundId', () => {
        beforeEach(() => {
          const wrapper = mount(<Component {...matchingOptionDefaultProps} isMatched onOptionClick={onOptionClickMock} />)
          simulateClickItem(wrapper);
        });

        it('should not call onOptionClick even if isMatched', () => {
          expect(onOptionClickMock).not.toHaveBeenCalled();
        });

        it('should play item sound', () => {
          expect(soundServiceMock.play).toHaveBeenCalled();
        });
      });

      describe('after click when not isMatched and no soundId', () => {
        beforeEach(() => {
          const wrapper = mount(<Component {...matchingOptionDefaultProps} onOptionClick={onOptionClickMock} soundId={null} />)
          simulateClickItem(wrapper);
        });

        it('should not play item sound', () => {
          expect(soundServiceMock.play).not.toHaveBeenCalled();
        })
        it('should call onOptionClick with correct id', () => {
          expect(onOptionClickMock).toHaveBeenCalledWith(MOCK_OPTION_ID);
        });
      });

      describe('after click when isMatched and no soundId', () => {
        beforeEach(() => {
          const wrapper = mount(<Component {...matchingOptionDefaultProps} isMatched onOptionClick={onOptionClickMock} soundId={null} />)
          simulateClickItem(wrapper);
        });

        it('should not play item sound', () => {
          expect(soundServiceMock.play).not.toHaveBeenCalled();
        })

        it('should not call onOptionClick', () => {
          expect(onOptionClickMock).not.toHaveBeenCalled();
        });
      });
    })
  });

  describe('base', () => {
    describe('when base is not clickable', () => {
      beforeEach(() => {
        const wrapper = mount(<Component {...matchingBaseDefaultProps} isMatched clickable={false} onOptionClick={onOptionClickMock} />)
        simulateClickItem(wrapper);
      });

      it('should not call onOptionClick even if isMatched', () => {
        expect(onOptionClickMock).not.toHaveBeenCalled();
      });

      it('should not play item sound even if isMatched', () => {
        expect(soundServiceMock.play).not.toHaveBeenCalled();
      });
    });

    describe('when base is clickable', () => {
      describe('after click when isMatched && soundId', () => {
        beforeEach(() => {
          const wrapper = mount(<Component {...matchingBaseDefaultProps} isClickable isMatched onOptionClick={onOptionClickMock} />)
          simulateClickItem(wrapper);
        });

        it('should not call onOptionClick', () => {
          expect(onOptionClickMock).not.toHaveBeenCalled();
        });

        it('should play item sound', () => {
          expect(soundServiceMock.play).toHaveBeenCalled();
        });
      });

      describe('after click when not isMatched and no soundId', () => {
        beforeEach(() => {
          const wrapper = mount(<Component {...matchingBaseDefaultProps} isClickable onOptionClick={onOptionClickMock} soundId={null} />)
          simulateClickItem(wrapper);
        });

        it('should not play item sound', () => {
          expect(soundServiceMock.play).not.toHaveBeenCalled();
        });

        it('should not call onOptionClick with correct id', () => {
          expect(onOptionClickMock).not.toHaveBeenCalled();
        });
      });

      describe('after click when isMatched and no soundId', () => {
        beforeEach(() => {
          const wrapper = mount(<Component {...matchingBaseDefaultProps} isClickable isMatched onOptionClick={onOptionClickMock} soundId={null} />)
          simulateClickItem(wrapper);
        });

        it('should not play item sound', () => {
          expect(soundServiceMock.play).not.toHaveBeenCalled();
        });

        it('should not call onOptionClick', () => {
          expect(onOptionClickMock).not.toHaveBeenCalled();
        });
      });
    });
  });
});
