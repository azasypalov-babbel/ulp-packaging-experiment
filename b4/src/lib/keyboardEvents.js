const INTERACTIVE_ELEMENTS = ['INPUT', 'BUTTON', 'A'];
export const INTERACTION_KEYS = ['Enter', ' '];

const FOCUS_ON_KEY = 'data-focus-on-key';

const toKeyString = ({ shiftKey, key = '' }) =>
  [shiftKey && 'Shift', encodeURIComponent(key)].filter(Boolean).join('+');

export const handleKeyDown = (event) => {
  /**
   * For some browsers, the backspace key triggers browser back navigation.
   * This would be frustrating in the lesson-player since the user looses all progress.
   * The only time we want the default behaviour for backspace is for input elements.
   */
  if (event.key === 'Backspace' && event.target.nodeName !== 'INPUT') {
    event.preventDefault();
  }

  /**
   * Rather than registering document level event listener, we mark add an element attribute:
   * eg. data-focus-on-key="Enter"
   * This code will check the DOM on every keydown for the corresponding key, and focus it.
   * That means key events can be listened for locally on the element.
   */
  const element = document.querySelector(`[${FOCUS_ON_KEY}="${toKeyString(event)}"]`);
  if (!element || event.repeat) return;

  if ((
      /**
       * Enter & Space keys are normally used for interaction in the browser,
       * so we are careful here not to change the focus when one of those is pressed.
       */
    !INTERACTION_KEYS.includes(event.key) ||
      /**
       * If the event comes from an interactive element we also don't want to move the focus,
       * That element should handle it's key events locally.
       */
      !INTERACTIVE_ELEMENTS.includes(event.target.nodeName)
  ) && event.target !== element
  ) {
    element.focus({ preventScroll: true });
      /**
       * This will make sure keydown happens locally on that element after focus.
       */
    element.dispatchEvent(new KeyboardEvent(event.type, event));
  }
};

export const isInteractionKey = (event, keys = INTERACTION_KEYS) =>
  keys.includes(toKeyString(event));

const isKeyboardEvent = (event) => event.detail === 0;

export const ignoreKeyboardEvents = (fn) => (event) => {
  if (!isKeyboardEvent(event)) { fn(event); }
};
