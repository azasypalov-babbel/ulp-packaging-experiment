import React, { useLayoutEffect, useState } from 'react';
import { getDisplayName } from '../getDisplayName';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { createPortal } from 'react-dom';
import { isWebview } from '../../lib/features';

/**
 * A HOC that places the wrapped component above the current trainer.
 */

const mountPointId = 'trainer-overlay-mount-point';

export const StyledTrainerOverlay = styled.div`
  height: 0;

  position: fixed;

  @supports (position: sticky) {
    & {
      position: sticky;
    }
  }

  top: 0;
  ${isWebview() && css`
    top: calc(${(props) => props.theme.size.navbar.xsmall.height} + env(safe-area-inset-top));
  `}

  z-index: 100;
`;

const TrainerOverlay = ({ children }) => {
  return (
    <StyledTrainerOverlay id={mountPointId}>
      {children}
    </StyledTrainerOverlay>
  );
};

TrainerOverlay.propTypes = {
  children: PropTypes.node
};

export default TrainerOverlay;

export const renderInTrainerOverlay = (WrappedComponent) => {
  const RenderInTrainerOverlay = (props) => {
    const [element, setElement] = useState(document.getElementById(mountPointId));

    useLayoutEffect(() => {
      const domNode = document.getElementById(mountPointId);
      if (!domNode) {
        // eslint-disable-next-line max-len
        console.warn(`DOM element with id ${mountPointId} not found. This is a requirement for a trainer overlay to be properly rendered.`);
      }
      setElement(domNode);
    }, []);

    if (element === null) {
      return null;
    }

    return createPortal(
      <WrappedComponent {...props} />,
      element
    );
  };

  RenderInTrainerOverlay.displayName = `RenderInTrainerOverlay(${getDisplayName(WrappedComponent)})`;

  return RenderInTrainerOverlay;
};
