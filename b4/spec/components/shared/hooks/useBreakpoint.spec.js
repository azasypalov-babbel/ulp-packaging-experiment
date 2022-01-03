import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import useBreakpoint from '../../../../src/components/shared/hooks/useBreakpoint';
import { ThemeContext } from 'styled-components';

jest.unmock('polished');

const Consumer = () => null;

const TestFeedback = () => {
  const activeBreakpoint = useBreakpoint();
  return <Consumer activeBreakpoint={activeBreakpoint} />;
};

const mockTheme = {
  viewports: {
    breakpoints: {
      xxxsmall: '0',
      xxsmall: '360px',
      xsmall: '600px',
      small: '900px',
      medium: '1200px',
      large: '1600px'
    }
  }
};

describe('feedback sounds', () => {
  beforeEach(() => {
    global.matchMedia = jest.fn(() => ({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }));
  });

  const mountHook = () => mount(
    <ThemeContext.Provider value={mockTheme}>
      <TestFeedback/>
    </ThemeContext.Provider>
  );

  it('should construct media query lists', () => {
    mountHook();
    expect(global.matchMedia).toHaveBeenCalledWith('(min-width: 1600px)');
    expect(global.matchMedia).toHaveBeenCalledWith('(min-width: 1200px)');
    expect(global.matchMedia).toHaveBeenCalledWith('(min-width: 900px)');
    expect(global.matchMedia).toHaveBeenCalledWith('(min-width: 600px)');
    expect(global.matchMedia).toHaveBeenCalledWith('(min-width: 360px)');
    expect(global.matchMedia).toHaveBeenCalledWith('(min-width: 0px)');
  });

  describe('initial state', () => {
    it('should be xxxsmall by default', () => {
      const wrapper = mountHook();
      const { activeBreakpoint } = wrapper.find(Consumer).props();
      expect(activeBreakpoint).toBe('xxxsmall');
    });

    it('should initialise from matches value', () => {
      global.matchMedia.mockImplementation((value) => {
        const matches = ['(min-width: 0px)', '(min-width: 360px)'];
        return ({
          matches: matches.includes(value),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn()
        });
      });

      const wrapper = mountHook();
      const { activeBreakpoint } = wrapper.find(Consumer).props();
      expect(activeBreakpoint).toBe('xxsmall');
    });
  });

  describe('breakpoints changing during runtime', () => {
    it('should register change event listeners', () => {
      mountHook();
      global.matchMedia.mock.results.forEach(({ value }) => {
        expect(value.addEventListener).toHaveBeenCalledWith(
          'change',
          expect.anything()
        );
      });
    });

    it('should update state when breakpoints match', () => {
      const wrapper = mountHook();

      act(() => {
        // Simulate change for 'large' breakpoint
        const { value } = global.matchMedia.mock.results[0];
        const callback = value.addEventListener.mock.calls[0][1];
        callback({ matches: true });
      });

      wrapper.update();

      const { activeBreakpoint } = wrapper.find(Consumer).props();

      expect(activeBreakpoint).toBe('large');
    });
  });
});

