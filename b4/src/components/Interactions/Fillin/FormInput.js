import React, { useState, useEffect, useRef, useImperativeHandle, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { log } from '../../../lib/logging';
import { isInteractionKey } from '../../../lib/keyboardEvents';

import useGapWidth from '../shared/Write/useGapWidth';
import { insertText } from '../shared/Write/helpers';

import performAfterScroll from '../../../lib/performAfterScroll';
import { ServiceContext } from '../../shared/withServices';
import { useFocusTracking } from '../../shared/hooks/useFocusTracking';
import { isiOS } from '../../../lib/features';
import { useSelector } from 'react-redux';

export const KEYCODES = {
  ENTER: 'Enter',
  ESC: 'Escape'
};

const shouldAutoCapitalize = (targetText = '') =>
  targetText.toUpperCase()[0] === targetText[0];

const ensureFocus = (el) => {
  if (document.activeElement !== el) {
    log('FormInput: Focussing');
    el.focus({ preventScroll: true });
  } else {
    log('FormInput: Already has focus');
  }
};

const sanitizedValue = (text) => {
  // removes leading white-space
  // trailing white-space is kept (it may be a correct word boundary)
  let sanitized = text.replace(/^\s+/g, '');

  // replaces different white-spaces with a white-space ' '
  // removes duplicates
  sanitized = sanitized.replace(/\s+/g, ' ');

  return sanitized;
};

const StyledInput = styled.input`
  width: ${({ gapWidth }) => gapWidth};
`;

const FormInput = React.forwardRef(
  (
    {
      attempt,
      controlled,
      onReturn,
      onLatestTextChange = () => {},
      onKeyPress = () => {},
      targetText,
      alternativeText,
      onBlur = () => {},
      ...props
    },
    ref
  ) => {
    const { number, pending } = attempt;

    const inputRef = useRef();
    const { onBlur: trackFocus } = useFocusTracking(inputRef);
    const isZendeskWidgetOpen = useSelector(state => state.zendeskWidget.isOpen);

    const refocus = () => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 1)
    }

    const handleBlur = useCallback((...args) => {
      onBlur(...args);
      trackFocus(...args);
      if (!isBlurredWithEnter && !isZendeskWidgetOpen) {
        refocus();
      } else {
        setIsBlurredWithEnter(false);
      }
    }, [onBlur, trackFocus, isBlurredWithEnter, isZendeskWidgetOpen]);

    useEffect(() => {
      if (!isZendeskWidgetOpen) {
        refocus();
      }
    }, [isZendeskWidgetOpen])

    const [editable, setEditable] = useState(true);
    const [isBlurredWithEnter, setIsBlurredWithEnter] = useState(false);
    const isFocused = () => document.activeElement === inputRef?.current;

    const handleChange = (event) => {
      onLatestTextChange(event.target.value);
    };

    const triggerReturn = () => {
      const text = sanitizedValue(inputRef.current.value);
      onReturn(text);
    };

    const triggerSolve = () => {
      onReturn(targetText);
    };

    const handleKeyDown = (event) => {
      if (isInteractionKey(event, ['Shift+Escape'])) {
        event.preventDefault();
        triggerSolve();
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === KEYCODES.ENTER && !event.repeat) {
        event.preventDefault();
        setIsBlurredWithEnter(true);
        setTimeout(() => {
          inputRef.current?.blur();
        }, 1);
        triggerReturn();
        return;
      }
      onKeyPress(event);
    };

    useImperativeHandle(ref, () => ({
      focus: () => {
        ensureFocus(inputRef.current);
      },
      retry: () => {
        log('FormInput: retry');
        ensureFocus(inputRef.current);
      },
      insert: (text) => {
        log('FormInput: insert');
        if (!editable) {
          console.warn('Gap is not editable');
          return;
        }

        ensureFocus(inputRef.current);
        insertText(text);
      },
      delete: () => {
        log('FormInput: delete');
        if (!editable) {
          console.warn('Gap is not editable');
          return;
        }

        ensureFocus(inputRef.current);

        const caretIndex = inputRef.current.selectionStart;
        const hasSelection = caretIndex !== inputRef.current.selectionEnd;

        // Disable selection so it's not visible to the user while deletion is made

        inputRef.current.classList.add('no-select');

        if (hasSelection) {
          inputRef.current.setSelectionRange(
            caretIndex,
            inputRef.current.selectionEnd
          );
        } else {
          inputRef.current.setSelectionRange(caretIndex - 1, caretIndex);
        }

        insertText('');
        inputRef.current.classList.remove('no-select');
      },
      deleteAll: () => {
        log('FormInput: deleteAll');

        if (!editable) {
          console.warn('Gap is not editable');
          return;
        }

        ensureFocus(inputRef.current);

        inputRef.current.setSelectionRange(0, inputRef.current.value.length);

        insertText('');
      },
      return: () => {
        log('FormInput: return');
        if (!editable) {
          console.warn('Gap is not editable');
          return;
        }
        triggerReturn();
      },
      addEventListener: (...args) => {
        return inputRef?.current?.addEventListener.apply(null, args);
      },
      removeEventListener: (...args) => {
        return inputRef?.current?.removeEventListener.apply(null, args);
      },
      isFocused,
      getValue: () => inputRef?.current?.value
    }));

    const { focusService } = useContext(ServiceContext);
    // Initial focus
    useEffect(() => {
      inputRef.current.blur();

      const cleanup = performAfterScroll(() => {
        inputRef.current.focus({ preventScroll: true });
      });

      return () => {
        cleanup();
      };
    }, [focusService]);

    // iOS caret increases the required gap width
    const adjustForCaret = isiOS() && (!number || isFocused());

    // Set width
    const gapWidth = useGapWidth({ ref: inputRef, targetText, adjustForCaret });

    // Block editing when pending
    useEffect(() => {
      setEditable(!pending);
    }, [pending]);

    return (
      // Having form[action] gives the blue Return button on iPad (however blue lablled "Open" button on iPhone)
      <form action={''} onSubmit={(e) => e.preventDefault()}>
        <StyledInput
          {...props}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          data-focus-on-key="Shift+Escape"
          onKeyPress={handleKeyPress}
          autoCapitalize={shouldAutoCapitalize(targetText) ? 'on' : 'off'}
          autoComplete={'off'}
          autoCorrect={'off'}
          spellCheck={'false'}
          readOnly={controlled}
          ref={inputRef}
          role={'textbox'}
          data-solution={targetText}
          data-solution-alternative={alternativeText}
          data-textbox-type={'input'}
          data-selector={'active-gap'}
          gapWidth={gapWidth}
        />
      </form>
    );
  }
);

FormInput.displayName = 'FormInput';

FormInput.propTypes = {
  attempt: PropTypes.object.isRequired,
  controlled: PropTypes.bool.isRequired,
  onReturn: PropTypes.func.isRequired,
  onLatestTextChange: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyPress: PropTypes.func,
  targetText: PropTypes.string.isRequired,
  alternativeText: PropTypes.string
};

export default FormInput;
