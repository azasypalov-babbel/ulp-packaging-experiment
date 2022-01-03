import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import Sheet, { PreserveSize, FillAvailableSpace, ActionsWrapper } from '../../shared/Sheet';
import withTranslations from '../../shared/withTranslations';
import Button from '../../shared/Button/Button';
import IconButton from '../../shared/IconButton/IconButton';
import { renderInBottomLayout } from '../../shared/BottomLayout';


export const PuzzlehelperSheet = ({
  children,
  onDelete,
  onDone,
  translations
}) => (
  <Sheet onClick={(event) => event.stopPropagation()} data-selector="puzzle-helper-sheet">
    <FillAvailableSpace>
      {children}
    </FillAvailableSpace>
    <PreserveSize>
      <ActionsWrapper>
        <IconButton
          iconName="BackspaceIcon"
          data-selector="delete-button"
          onClick={onDelete}
          onMouseDown={e => e.preventDefault()} // Prevents focus change
          style={{ minWidth: '5rem' }}
        />
        <Button
          listenToKey="Enter"
          data-selector="done-button"
          onClick={onDone}
          primary
        >
          {translations.done}
        </Button>
      </ActionsWrapper>
    </PreserveSize>
  </Sheet>
);

PuzzlehelperSheet.propTypes = {
  children: PropTypes.node,
  onDelete: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
  translations: PropTypes.shape({
    done: PropTypes.string.isRequired
  }).isRequired
};

const getTranslations = (translate) => ({
  done: translate('b3.text_box_puzzle_helper.done')
});

export default compose(
  withTranslations(getTranslations),
  renderInBottomLayout,
)(PuzzlehelperSheet);
