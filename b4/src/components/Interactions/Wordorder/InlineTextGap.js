import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const COLORS = {
  active: {
    border: (props) => props.theme.cascada.brandOrange,
    background: 'transparent'
  },
  mistaken: {
    border: (props) => props.theme.color.semantic.feedback.negative.border,
    background: (props) => props.theme.color.semantic.feedback.negative.background
  },
  solved: {
    border: (props) => props.theme.color.semantic.feedback.positive.border,
    background: (props) => props.theme.color.semantic.feedback.positive.background
  },
  typo: {
    border: (props) => props.theme.color.pastel.canary,
    background: (props) => props.theme.color.canary
  },
  inactive: {
    border: (props) => props.theme.cascada.spaceGrayW15,
    background: 'transparent'
  }
};

const StyledInlineTextGap = styled.span`
  font-family: ${(props) => props.theme.cascada.fontMilliardBook};
  display: inline;

  border-bottom: 2px solid ${(props) => COLORS[props.color].border};
  background-color: ${(props) => COLORS[props.color].background};

  line-height: 1.5;

  & > span {
    z-index: 1;
    position: absolute;
  }

  &:focus {
    outline: 0;
  }

  &::after {
    content: "${({ targetText }) => CSS.escape(targetText)}";
    opacity: 0;
  }
`;

const StyledInlineTextGapWrapper = styled.div`
  display: inline-block;
  position: relative;
`;

const refocus = (event) => {
  // event.persist() should be called when using React synthetic events inside an asynchronous callback function
  event.persist()
  // Firefox Fix: a timer to make sure that your code runs in an event loop separate from the one triggering the "blur" event. https://bugzilla.mozilla.org/show_bug.cgi?id=120995
  setTimeout(() => {
    if (event.relatedTarget === null) event.target.focus({ preventScroll: true });
  }, 1);
};

const InlineTextGap = ({ children, active, ...props }) => {
  const ref = useRef();
  const isZendeskWidgetOpen = useSelector(state => state.zendeskWidget.isOpen);
  useEffect(() => {
    if (active && !isZendeskWidgetOpen) ref.current.focus({ preventScroll: true });
  }, [active, isZendeskWidgetOpen]);

  return (
    <StyledInlineTextGapWrapper>
      <StyledInlineTextGap
        {...props}
        ref={ref}
        color={active ? 'active' : 'inactive'}
        role="textbox"
        data-solution={props.targetText}
        data-selector={active ? 'active-gap' : undefined}
        tabIndex={0}
        onBlur={!isZendeskWidgetOpen ? refocus : undefined}
      >
        <span>
          {children}
        </span>
      </StyledInlineTextGap>
    </StyledInlineTextGapWrapper>
  );
};

InlineTextGap.propTypes = {
  children: PropTypes.node,
  active: PropTypes.bool,
  targetText: PropTypes.string.isRequired
};

export default InlineTextGap;
