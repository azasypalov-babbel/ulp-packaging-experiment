import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import shuffle from '../../../lib/shuffle';
import { splitBefore } from '../shared/Write/helpers';

import Button from '../../shared/Button/Button';
import PuzzlehelperSheet from './PuzzlehelperSheet';
import { StyledPuzzlehelper, StyledPuzzlehelperWrapper } from './styles';

const Puzzlehelper = ({
  tokens,
  inputCommands
}) => {
  const [seed] = useState(Math.random() * 10000);

  const {
    insert: onInsert,
    delete: onDelete,
    return: onReturn
  } = inputCommands;

  const shuffled = splitBefore(tokens, ({ token }) => token === ' ')
    .map(word => {
      const shuffleParams = { seed, notOriginalOrder: true }
      const startsWithSpace = word[0].token === ' ';
      return startsWithSpace ? [word[0], ...shuffle({ array: word.slice(1), ...shuffleParams })] : [...shuffle({ array: word, ...shuffleParams })];
    })
    .flat();

  return (
    <PuzzlehelperSheet
      onDelete={onDelete}
      onDone={onReturn}
    >
      <StyledPuzzlehelperWrapper>
        <StyledPuzzlehelper>
          {shuffled.map(({ token, used, idx }) => {
            return (
              <Button
                key={idx}
                onClick={() => onInsert(idx)}
                onMouseDown={e => e.preventDefault()} // Prevents focus change
                disabled={used}
                data-choice={token.toLowerCase()}
              >
                {token}
              </Button>
            );
          })}
        </StyledPuzzlehelper>
      </StyledPuzzlehelperWrapper>
    </PuzzlehelperSheet>
  );
};

Puzzlehelper.propTypes = {
  tokens: PropTypes.arrayOf(PropTypes.shape({
    token: PropTypes.string.isRequired,
    used: PropTypes.bool.isRequired,
    idx: PropTypes.number.isRequired
  })).isRequired,
  inputCommands: PropTypes.shape({
    insert: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    deleteAll: PropTypes.func.isRequired,
    return: PropTypes.func.isRequired
  })
};

const mapStateToProps = ({ session }) => ({
  learnLanguageAlpha3: session.learnLanguageAlpha3
});

export default connect(mapStateToProps)(Puzzlehelper);
