import React from 'react';
import { Button, IconTranslate } from '@lessonnine/design-system.lib';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useOnClickOutside } from './useOnClickOutside';

const StyledToggle = styled(Button)`
  background: transparent;
  color: ${(props) => props.theme.cascada.spaceGray};
  width: 100%;
  height: 100%;
  z-index: 1; // needed for events to function on Firefox

  &:active {
    background-color: transparent;
  }

  &:hover {
    color: ${(props) => props.theme.cascada.spaceGray};
  }

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    width: auto;
    height: 100%;
  }
`;

export const TranslationToggleInline = ({ onClick, translationVisible }) => {
  const ref = React.useRef(null);

  const toggleTranslation = (value) => onClick(value);

  useOnClickOutside(ref, () => toggleTranslation(false));

  return (
    // span is only needed to get a good ref - currently the design-system button does not forward the ref.
    <span ref={ref}>
      <StyledToggle
        color="tertiary"
        size="micro"
        icon={<IconTranslate />}
        onClick={() => toggleTranslation(!translationVisible)}
        onMouseEnter={() => toggleTranslation(true)}
        onMouseLeave={() => toggleTranslation(false)}
        onTouchStart={() => toggleTranslation(!translationVisible)}
        onTouchEnd={event => event.cancelable && event.preventDefault()} // Prevent onClick & mouse events
        data-selector="translation-toggle-inline"
      />
    </span>
  );
};

TranslationToggleInline.propTypes = {
  onClick: PropTypes.func.isRequired,
  translationVisible: PropTypes.bool.isRequired
};

export default TranslationToggleInline;
