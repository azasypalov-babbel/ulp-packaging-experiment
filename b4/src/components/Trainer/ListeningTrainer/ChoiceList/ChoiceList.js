import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ChoiceItem from '../../../shared/ChoiceItem/ChoiceItem';
import { PoseGroup } from 'react-pose';

/*
  This placeholder component reserves space in the stage before
  the items are rendered so that the vertical centering is calculated correctly.
*/
const StyledPlaceholderList = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
  min-height: ${(props) => `${props.choiceItemCount * 3.75}rem`};

  & > * + * {
    margin-top: 0.75rem;
  }
`;

const ChoiceList = ({ items, showChoiceItems, onClick, attemptedText, correctText }) => (
  <StyledPlaceholderList
    data-selector="choicelist-container"
    data-has-attempt={Boolean(attemptedText)}
    choiceItemCount={items.length}
  >
    <PoseGroup flipMove={false} animateOnMount>
      {items.map((choiceItemText, index) => {
        const hasAttempt = Boolean(attemptedText);

        const isCorrectItem = choiceItemText === correctText;
        const dataSelector = isCorrectItem ? 'correct-item' : 'distractor';
        const isMistakenItem = choiceItemText === attemptedText && attemptedText !== correctText;

        return (
          showChoiceItems
            ? <ChoiceItem
              animationDelayOffset={index}
              key={`${correctText}_${choiceItemText}`}
              onClick={(evt) => onClick(choiceItemText, evt)}
              dataSelector={dataSelector}
              data-selector="display-language-text"
              listenToKey={`${index + 1}`}
              correctFeedback={hasAttempt && isCorrectItem}
              mistakeFeedback={hasAttempt && isMistakenItem}
              disabled={hasAttempt}
            >
              {choiceItemText}
            </ChoiceItem>
            : null
        );
      })}
    </PoseGroup>
  </StyledPlaceholderList>
);

ChoiceList.propTypes = {
  correctText: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  attemptedText: PropTypes.string,
  showChoiceItems: PropTypes.bool.isRequired
};

export default ChoiceList;
