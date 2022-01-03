import React from 'react';
import { stripUnit } from 'polished';
import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../../providers/theme';

const toMediaQuery = (size) => window.matchMedia(`(min-width: ${size}px)`);

const defaultBreakpoints = [
  'xxxsmall',
  'xxsmall',
  'xsmall',
  'small',
  'medium',
  'large'
];

const useBreakpoint = (breakpoints = defaultBreakpoints) => {
  const theme = useTheme();

  const breakpointMap = useMemo(() =>
    Object.entries(theme.viewports.breakpoints)
      .filter(([name]) => breakpoints.includes(name))
      .map(([name, size]) => [name, stripUnit(size)])
      .sort(([, sizeA], [, sizeB]) => sizeB - sizeA)
      .map(([name, size]) => [name, toMediaQuery(size)])
  , [breakpoints, theme.viewports.breakpoints]);

  const [state, setState] = useState(
    breakpointMap.reduce((state, [name, mediaQuery]) => ({
      ...state,
      [name]: mediaQuery.matches
    }), {})
  );

  const onChange = (name, matches) => {
    setState((state) => ({
      ...state,
      [name]: matches
    }));
  };

  useEffect(() => {
    const cleanup = breakpointMap.map(([name, mediaQuery]) => {
      const handleChange = (event) => { onChange(name, event.matches); };

      try {
        mediaQuery.addEventListener('change', handleChange);
        return () => {
          mediaQuery.removeEventListener('change', handleChange);
        };
      } catch (error) {
        // Use deprecated API for older browsers
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/addListener
        mediaQuery.addListener(handleChange);
        return () => {
          mediaQuery.removeListener(handleChange);
        };
      }
    });

    return () => {
      cleanup.forEach((cleanupFn) => { cleanupFn(); });
    };
  }, [breakpointMap]);

  const activeBreakpoint = useMemo(() => {
    const [active] = breakpointMap
      .filter(([name]) => state[name]);

    if (active) {
      const [name] = active;
      return name;
    }
    return defaultBreakpoints[0];
  }, [breakpointMap, state]);

  return activeBreakpoint;
};

export const withBreakpoints = (breakpoints = defaultBreakpoints) => (WrappedComponent) => {
  const WithBreakpoints = (props) => {
    const activeBreakpoint = useBreakpoint(breakpoints);
    return <WrappedComponent
      {...props}
      activeBreakpoint={activeBreakpoint}
    />;
  };

  return WithBreakpoints;
};

export default useBreakpoint;
