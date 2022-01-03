import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getDisplayName } from '../getDisplayName';
import { ignoreKeyboardEvents, isInteractionKey, INTERACTION_KEYS } from '../../lib/keyboardEvents';

const withKeypress = (WrappedComponent) => {
  const WithKeyPress = ({
    listenToKey,
    onClick = () => {},
    onKeyDown = () => {},
    onKeyUp = () => {},
    onBlur = () => {},
    ...props
  }) => {
    const [pressed, setPressed] = useState(false);

    const handleKeyUp = (event) => {
      if (isInteractionKey(event, [...INTERACTION_KEYS, listenToKey])) {
        setPressed(false);
        onClick(event);
      }
      onKeyUp(event);
    };

    const handleKeyDown = (event) => {
      if (isInteractionKey(event, [...INTERACTION_KEYS, listenToKey])) {
        setPressed(true);
      }
      onKeyDown(event);
    };

    const handleBlur = (event) => {
      setPressed(false);
      onBlur(event);
    };

    return <WrappedComponent
      {...props}
      listenToKey={listenToKey}
      tabIndex={0}
      data-focus-on-key={listenToKey ? encodeURIComponent(listenToKey) : undefined}
      pressed={props.pressed || pressed}
      onClick={ignoreKeyboardEvents(onClick)}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
    />;
  };

  WithKeyPress.displayName = `WithKeypress(${getDisplayName(WrappedComponent)})`;

  WithKeyPress.propTypes = {
    listenToKey: PropTypes.string,
    onClick: PropTypes.func,
    onKeyDown: PropTypes.func,
    onKeyUp: PropTypes.func,
    onBlur: PropTypes.func,
    pressed: PropTypes.bool
  };
  return WithKeyPress;
};

export default withKeypress;

