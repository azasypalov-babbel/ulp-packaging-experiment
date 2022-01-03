import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { track } from '../../../dux/tracker/actions';
import IconButton from '../../shared/IconButton/IconButton';
import withTranslations from '../../shared/withTranslations';
import { renderInBottomLayout } from '../../shared/BottomLayout';
import { HINT_LEVEL } from './useInputHint';

const StyledWebButtonSheet = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.75rem;
  justify-content: space-between;

  order: 100;

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    padding: 1.5rem;
  }
`;

const StyledIconButton = styled(IconButton)`
  height: 2.5rem;

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    height: 3rem;
  }
`;

export const WebButtonSheet = ({
  onTransliterationToggled,
  isTransliterationTableSupported,
  nextHintLevel,
  translations,
  onHint,
  track
}) => {
  const handleTransliterationToggleClick = () => {
    /* eslint-disable camelcase */
    track({
      event: 'gui:interacted',
      version: 1,
      payload: {
        gui_element: 'transliterations_toggle',
        interaction: 'clicked',
        origin: 'lesson_player'
      }
    });
    /* eslint-enable camelcase */

    onTransliterationToggled();
  };

  const handleHintClick = () => {
    /* eslint-disable camelcase */
    track({
      event: 'gui:interacted',
      version: 1,
      payload: {
        gui_container: 'web_hint_button',
        gui_element: nextHintLevel === 'HINT' ? 'see_hint_button' : 'see_solution_button',
        interaction: 'clicked',
        origin: 'lesson_player'
      }
    });
    /* eslint-enable camelcase */

    onHint();
  };

  const showTypingTips = isTransliterationTableSupported;
  const showHintButton = nextHintLevel !== HINT_LEVEL.NONE;

  return (
    <StyledWebButtonSheet onClick={(event) => event.stopPropagation()}>
      <div>
        {showTypingTips && <StyledIconButton
          data-selector="transliteration-toggle"
          onClick={handleTransliterationToggleClick}
          iconName="KeyboardIcon">
          {translations.typingTips}
        </StyledIconButton>}
      </div>
      <div>
        {showHintButton && <StyledIconButton
          onClick={handleHintClick}
          iconName={nextHintLevel === 'HINT' ? 'LightBulbIcon' : 'CheckIcon'}
          data-selector={nextHintLevel === 'HINT' ? 'show-hint' : 'show-solution'}>
          {nextHintLevel === 'HINT' ? translations.hint : translations.solution}
        </StyledIconButton>}
      </div>
    </StyledWebButtonSheet>
  );
};

WebButtonSheet.propTypes = {
  onTransliterationToggled: PropTypes.func.isRequired,
  track: PropTypes.func.isRequired,
  isTransliterationTableSupported: PropTypes.bool.isRequired,
  nextHintLevel: PropTypes.string.isRequired,
  onHint: PropTypes.func.isRequired,
  translations: PropTypes.shape({
    typingTips: PropTypes.string.isRequired,
    solution: PropTypes.string.isRequired,
    hint: PropTypes.string.isRequired
  }).isRequired
};

const mapDispatchToProps = {
  track
};

const getTranslations = (translate) => ({
  hint: translate('button.see_hint'),
  solution: translate('button.see_solution'),
  typingTips: translate('button.typing_tips')
});

export default compose(
  connect(null, mapDispatchToProps),
  withTranslations(getTranslations),
  renderInBottomLayout
)(WebButtonSheet);
