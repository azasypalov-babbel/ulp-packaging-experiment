import React, { useState, useEffect, useMemo, createRef } from 'react';
import PropTypes from 'prop-types';
import { removeLeadingAndTrailingPunctuation } from '@lessonnine/babbel-markup-helper.js';
import { compose } from 'redux';
import Button from '../../shared/Button/Button';
import Sheet from '../../shared/Sheet';
import { renderInBottomLayout } from '../../shared/BottomLayout';
import shuffle from '../../../lib/shuffle';
import { Shake } from './animations';
import { StyledWordorder, StyledWordorderWrapper } from './styles';

const Wordorder = ({
  allChoices,
  onAttempt,
  mistakenIndex
}) => {
  const [seed] = useState(Math.random() * 10000);

  const animationRefs = useMemo(() =>
    Array(allChoices.length).fill().map(() => createRef()), [allChoices]
  );

  useEffect(() => {
    if (mistakenIndex >= 0) {
      animationRefs[mistakenIndex].current.animate();
    }
  }, [mistakenIndex, animationRefs]);

  const targetButtonLabels = useMemo(() =>
    allChoices.map((choice) => {
      const strippedToken = removeLeadingAndTrailingPunctuation(choice.token);
      return ({
        ...choice,
        // targetText can sometimes contain punctuation only
        token: !strippedToken.trim() ? choice.token : strippedToken
      });
    }), [allChoices]);

  const usedWords = shuffle({ array: targetButtonLabels, seed, notOriginalOrder: true });

  return (
    <Sheet onClick={(event) => event.stopPropagation()}>
      <StyledWordorderWrapper>
        <StyledWordorder>
          {usedWords.map(({ token, used, id }) => (
            <Shake ref={animationRefs[id]} key={id}>
              {({ isAnimating }) =>
                <Button
                  pressed={isAnimating}
                  negative={isAnimating}
                  data-position={id}
                  onClick={() => onAttempt(id)}
                  onMouseDown={e => e.preventDefault()} // Prevents focus change
                  disabled={used}
                  data-choice={token.toLowerCase()}
                >
                  {token}
                </Button>
              }
            </Shake>
          ))}
        </StyledWordorder>
      </StyledWordorderWrapper>
    </Sheet>
  );
};

Wordorder.propTypes = {
  onAttempt: PropTypes.func.isRequired,
  allChoices: PropTypes.arrayOf(PropTypes.shape({
    token: PropTypes.string.isRequired,
    used: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired
  })).isRequired,
  mistakenIndex: PropTypes.number.isRequired
};

export default compose(
  renderInBottomLayout,
)(Wordorder);
