import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';
import { rem } from 'polished';
import { scrollIntoSafeArea } from '../../shared/scrollIntoSafeArea';

const enterKeyframes = keyframes`
  to {
    opacity: 0.05;
  }
`;

const RowBase = styled.div`
  position: relative;
  animation: ${enterKeyframes} 0.3s ease-out ${({ delayIndex }) => (delayIndex * 0.1) + 0.5}s reverse backwards;

  padding-bottom: ${rem('6px')};
  scroll-padding: ${rem('12px')};

  & + & {
    margin-top: ${rem('12px')};
    padding-top: ${rem('6px')};
  }
`;

RowBase.propTypes = {
  delayIndex: PropTypes.number
};

const StyledTask = styled(RowBase)`
  & + & {
    margin-top: 0;
  }
`;

const StyledPhrase = styled(RowBase)`
  padding-left: ${rem('12px')};
  border-left: ${rem('4px')} solid ${(props) => props.theme.color.edge.raw.yellow.joyful};

  & + & {
    margin-top: 0;
    padding-top: ${rem('12px')};
  }

  ${({ onClick }) => onClick !== null ? css`&:hover { cursor: pointer; }` : null};
`;

const StyledExample = styled.div`
  display: flex;
  flex-direction: column;

  & > * + * {
    margin-top: ${rem('4px')};
  }
`;

const PhraseRow = React.forwardRef((props, ref) => (
  <StyledPhrase ref={ref} {...props}>
    <StyledExample>
      {props.children}
    </StyledExample>
  </StyledPhrase>
));

PhraseRow.displayName = 'PhraseRow';

PhraseRow.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func
};

export default PhraseRow;


export const Row = ({ type, active, delayIndex = 0, ...props }) =>{
  const ref = useRef();
  useEffect(() => {
    if (active) {
      scrollIntoSafeArea(ref.current);
    }
  }, [ref, active]);

  return (type === 'task'
    ? <StyledTask
      ref={ref}
      delayIndex={delayIndex}
      data-item-type="task"
      {...props}
    />
    : <PhraseRow
      ref={ref}
      delayIndex={delayIndex}
      data-item-type="phrase"
      {...props}
    />);
};

Row.displayName = 'Row';

Row.propTypes = {
  active: PropTypes.bool,
  type: PropTypes.oneOf(['task', 'phrase']),
  delayIndex: PropTypes.number
};
