import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import MicIcon from '../../shared/icons/MicIcon';
import {
  StyledWrapper,
  StyledMicButton
} from './styles';

const MicButton = ({
  className,
  ...props
}) => {
  const ref = useRef(null);

  /**
   * [ARTOO-2573] Disable iOS magnifier on mic-button.
   * As of Safari 15 there is an bug where `-webkit-user-select: none;` is ignored
   * when deciding when to show the magnifier on long tap.
   * When the bug is solved (https://bugs.webkit.org/show_bug.cgi?id=231161) this workaround
   * should no longer be needed as we should be able to rely on `user-select: none;`.
   *
   * The temporary solution is to preventDefault on touch start. Regular React events will not work
   * work in this case due to this issue https://github.com/facebook/react/issues/9809#issuecomment-414072263.
   * So we need to attach the touchstart listener directly to the element.
   */
  useEffect(() => {
    const preventDefault = (event) => {
      event.preventDefault();
    };
    let element = ref.current;
    if (element) {
      element.addEventListener('touchstart', preventDefault);
      return () => {
        element.removeEventListener('touchstart', preventDefault);
      };
    }
  }, [ref]);

  return (
    <StyledWrapper
      ref={ref}
      className={className}
    >
      <StyledMicButton
        {...props}
      >
        <MicIcon size="2em" color="currentColor" />
      </StyledMicButton>
    </StyledWrapper>
  );
};

MicButton.propTypes = {
  className: PropTypes.string,
  isListening: PropTypes.bool,
  isUserSpeaking: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default MicButton;
