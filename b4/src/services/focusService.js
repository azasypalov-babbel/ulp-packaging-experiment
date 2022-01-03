export const createFocusService = () => {
  const service = {
    activeFocus: false,
    leavingFocus: false,
    lastFocusedRef: null,
    returnFocus() {
      if (!service.activeFocus && service.lastFocusedRef !== null) {
        service.lastFocusedRef.current?.focus({ preventScroll: true });
      }
    }
  };
  return service;
};
