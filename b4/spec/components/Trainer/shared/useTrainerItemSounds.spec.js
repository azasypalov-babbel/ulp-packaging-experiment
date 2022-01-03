import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { ServiceContext } from '../../../../src/components/shared/withServices';

import useTrainerItemSounds from '../../../../src/components/Trainer/shared/useTrainerItemSounds';
import mockSoundService from '../../../../src/services/soundService';

jest.mock('../../../../src/services/soundService');


const Consumer = () => null;

// eslint-disable-next-line react/prop-types
const TestFeedback = ({ items }) => {
  const [play, isPlaying] = useTrainerItemSounds(items);
  return <Consumer
    play={play}
    isPlaying={isPlaying}
  />;
};

const mockServiceContext = {
  soundService: mockSoundService,
  mediaUrlService: {
    soundURL: (id) => `${id}.mp3`
  }
};

const mockItem = {
  id: 'f',
  type: 'phrase',
  sound: { id: 'aa' },
  learnLanguageText: '"Eine" ((Woche)) besteht aus ((sieben Tagen)), **oder?**',
  displayLanguageText: '"One" week consists of seven days, **or not?**'
};

describe('trainer item sounds', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <ServiceContext.Provider value={mockServiceContext}>
        <TestFeedback/>
      </ServiceContext.Provider>
    );
  });
  describe('the play method', () => {
    it('should play item sound', () => {
      const { play } = wrapper.find(Consumer).props();
      const instance = mockServiceContext.soundService.getInstance('aa.mp3');

      act(() => {
        play(mockItem);
      });
      expect(instance.play).toHaveBeenCalledWith();
    });
  });

  describe('sound preloading', () => {
    const items = [
      { sound: { id: 'aa' } },
      { sound: { id: 'bb' } },
      { /* no sound */      }
    ];
    it('should preload sounds immediately when provided with items', () => {
      mount(
        <ServiceContext.Provider value={mockServiceContext}>
          <TestFeedback
            items={items}
          />
        </ServiceContext.Provider>
      );

      expect(mockServiceContext.soundService.preload).toHaveBeenNthCalledWith(1, 'aa.mp3');
      expect(mockServiceContext.soundService.preload).toHaveBeenNthCalledWith(2, 'bb.mp3');
    });
  });


  describe('an item with no sound', () => {
    it('should reject with error', async () => {
      const { play } = wrapper.find(Consumer).props();
      await act(() =>
        expect(play({ sound: null }))
          .rejects
          .toThrow('No item sound for this item')
      );
    });
  });

  describe('is playing selector', () => {
    it('should initially be false', () => {
      const { isPlaying } = wrapper.find(Consumer).props();
      expect(isPlaying(mockItem)).toBe(false);
    });

    it('should be true while playing a sound', () => {
      const { play } = wrapper.find(Consumer).props();
      act(() => {
        play(mockItem);
      });

      wrapper.update();

      const { isPlaying } = wrapper.find(Consumer).props();
      expect(isPlaying(mockItem)).toBe(true);
    });
  });

  describe('a sound that ends succesfully', () => {
    it('should resolve once the sound finishes', async () => {
      const { play } = wrapper.find(Consumer).props();

      await act(async () => {
        let promise = play(mockItem);

        const instance = mockServiceContext.soundService.getInstance('aa.mp3');
        instance.simulate('end');

        await expect(promise).resolves.toEqual(true);
      });
    });

    it('should reset the is playing state', async () => {
      const { play } = wrapper.find(Consumer).props();

      await act(async () => {
        let promise = play(mockItem);

        const instance = mockServiceContext.soundService.getInstance('aa.mp3');
        instance.simulate('end');

        await promise;
      });

      wrapper.update();

      const { isPlaying: isStillPlaying } = wrapper.find(Consumer).props();
      expect(isStillPlaying(mockItem)).toBe(false);
    });
  });

  describe('playing a sound that fails before finishing', () => {
    it('should reject with an error', async () => {
      const { play } = wrapper.find(Consumer).props();

      await act(async () => {
        let promise = play(mockItem);

        const instance = mockServiceContext.soundService.getInstance('aa.mp3');
        instance.simulate('playerror', new Error('Could not play'));

        await expect(promise).rejects.toEqual(new Error('Could not play'));
      });
    });

    it('should reset the is playing state', async () => {
      const { play } = wrapper.find(Consumer).props();

      await act(async () => {
        let promise = play(mockItem).catch(() => {});

        const instance = mockServiceContext.soundService.getInstance('aa.mp3');
        instance.simulate('playerror');

        await promise;
      });

      wrapper.update();

      const { isPlaying: isStillPlaying } = wrapper.find(Consumer).props();
      expect(isStillPlaying(mockItem)).toBe(false);
    });
  });

  describe('playing a sound that is interrupted while playing', () => {
    it('should resolve when paused', async () => {
      const { play } = wrapper.find(Consumer).props();

      await act(async () => {
        let promise = play(mockItem);

        const instance = mockServiceContext.soundService.getInstance('aa.mp3');
        instance.simulate('pause');

        await expect(promise).resolves.toEqual(false);
      });
    });

    it('should reset the is playing state', async () => {
      const { play } = wrapper.find(Consumer).props();

      await act(async () => {
        let promise = play(mockItem);

        const instance = mockServiceContext.soundService.getInstance('aa.mp3');
        instance.simulate('pause');

        await promise;
      });

      wrapper.update();

      const { isPlaying: isStillPlaying } = wrapper.find(Consumer).props();
      expect(isStillPlaying(mockItem)).toBe(false);
    });
  });

  describe('sound playback is interupted by another call to play', () => {
    const secondMockItem = {
      id: 'g',
      type: 'phrase',
      sound: { id: 'gg' },
      learnLanguageText: '"Eine" ((Woche)) besteht aus ((sieben Tagen)), **oder?**',
      displayLanguageText: '"One" week consists of seven days, **or not?**'
    };
    it('should ignore the ending of the first sound', async () => {
      const { play } = wrapper.find(Consumer).props();

      const firstCall = act(() =>
        play(mockItem)
      );

      wrapper.update();

      const { isPlaying } = wrapper.find(Consumer).props();
      expect(isPlaying(mockItem)).toBe(true);

      // Another sound is played before the first finishes
      act(() => {
        play(secondMockItem);
      });

      wrapper.update();

      const { isPlaying: isPlaying1 } = wrapper.find(Consumer).props();
      expect(isPlaying1(secondMockItem)).toBe(true);

      const instance = mockServiceContext.soundService.getInstance('aa.mp3');

      act(() => {
        instance.simulate('end');
      });

      await firstCall;

      wrapper.update();

      // isPlaying should represent the state of the second call
      const { isPlaying: isPlaying2 } = wrapper.find(Consumer).props();
      expect(isPlaying2(secondMockItem)).toBe(true);
    });
  });
});

