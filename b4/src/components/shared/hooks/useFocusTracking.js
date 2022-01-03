import { useCallback, useContext, useEffect } from 'react';

import { ServiceContext } from '../withServices';

export const useFocusTracking = (ref) => {
  const { focusService } = useContext(ServiceContext);
  useEffect(() => {
    // listens all focus events on the page
    // resets the state if focus isn't returned back to the tracked element
    const focusEventListener = () => {
      if (focusService.leavingFocus) {
        focusService.leavingFocus = false;
      } else {
        focusService.lastFocusedRef = null;
      }
    };
    document.addEventListener('focusin', focusEventListener);
    return () => {
      // reset focus service state on unmount
      // if the element was focused
      if (focusService.lastFocusedRef === ref) {
        focusService.leavingFocus = false;
        focusService.lastFocusedRef = null;
      }
      document.removeEventListener('focusin', focusEventListener);
    };
  }, [focusService]);
  // we return focus related callbacks
  // to trigger/assign to the element to be tracked
  return {
    onFocus: useCallback(() => {
      focusService.activeFocus = true;
    }, [focusService]),
    onBlur: useCallback(() => {
      // update focus service state when tracked element has lost focus
      // to keep its reference for further focus
      // and indicate tracked element is being blurred
      focusService.activeFocus = false;
      focusService.leavingFocus = true;
      focusService.lastFocusedRef = ref;
    }, [focusService, ref])
  };
};
