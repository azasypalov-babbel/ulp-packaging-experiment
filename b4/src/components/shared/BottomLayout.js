import React, { useEffect, useLayoutEffect, useState } from 'react';
import { getDisplayName } from '../getDisplayName';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { createPortal } from 'react-dom';
import useResizeObserver from './hooks/useResizeObserver';
import { getBottomInset, scrollIntoSafeArea, setBottomInset } from './scrollIntoSafeArea';
import { connect } from 'react-redux';

/**
 * This area is for any elements that are fixed to the bottom of the page
 * Give components `order` css property to organise them.
 */

const mountPointId = 'bottom-layout-mount-point';

export const StyledBottomLayout = styled.div`
  position: relative;

  @supports (position: sticky) {
    position: sticky;
    height: ${(props) => props.internalHeight}px;
  }

  bottom: 0;
  left: 0;
  right: 0;

  flex: 0 0 auto;
  z-index: 99;

  pointer-events: none;

  & > * {
    @supports (position: sticky) {
      position: absolute;
    }

    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;

    pointer-events: all;
  }
`;

export const bottomLayoutConfig = {
  enableScrollAdjustment: true,
  enableShrinking: false
};

const BottomLayoutComponent = ({ children, id }) => {
  const [internalHeight, setInternalHeight] = useState(0);

  const onResize = ({ height }) => {
    const isGrowing = height > internalHeight;

    if (isGrowing) {
      /**
       * InternalHeight is used to reserve space in the DOM.
       * It can only increase in height, to avoid making the page jump.
       */
      setInternalHeight(height);
    } else if (height !== 0 && bottomLayoutConfig.enableShrinking) {
      setInternalHeight(height);
    }

    const shouldAdjustScroll = height > getBottomInset();

    /**
     * Height of this element is used to calculate a safe area for scrolling
     * ie. so that content is not covered by anything in BottomLayout
     */
    setBottomInset(height);

    if (shouldAdjustScroll && bottomLayoutConfig.enableScrollAdjustment) {
      /**
       * Delay scroll until after next paint so that elements are in their final place
       */
      requestAnimationFrame(() => scrollIntoSafeArea());
    }
  };

  useEffect(() => {
    /**
     * Reset internal height when a the trainer changes or sequence starts or ends
     */
    setInternalHeight(0);
  }, [id]);

  const elementRef = useResizeObserver(onResize);

  return (
    <StyledBottomLayout internalHeight={internalHeight}>
      <div
        ref={elementRef}
        id={mountPointId}
      >
        {children}
      </div>
    </StyledBottomLayout>
  );
};

BottomLayoutComponent.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string
};

const mapStateToProps = ({ sequence }) => ({
  id: [sequence.currentTrainerIndex, sequence.started, sequence.completed].join()
});

export const BottomLayout = connect(mapStateToProps)(BottomLayoutComponent);

export const renderInBottomLayout = (WrappedComponent) => {
  const RenderInBottomLayout = (props) => {
    const [element, setElement] = useState(document.getElementById(mountPointId));

    useLayoutEffect(() => {
      const domNode = document.getElementById(mountPointId);
      if (!domNode) {
        // eslint-disable-next-line max-len
        console.warn(`DOM element with id ${mountPointId} not found. This is a requirement for a bottom layout to be properly rendered.`);
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

  RenderInBottomLayout.displayName = `RenderInBottomLayout(${getDisplayName(WrappedComponent)})`;

  return RenderInBottomLayout;
};
