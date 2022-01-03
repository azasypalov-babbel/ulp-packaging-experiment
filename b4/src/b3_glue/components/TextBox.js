import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as features from '../../lib/features';
import PuzzlehelperInteraction from '../../components/Interactions/Puzzlehelper/PuzzlehelperInteraction';
import FillinInteraction from '../../components/Interactions/Fillin/FillinInteraction';

const TextBox = ({
  active: initialActive,
  text,
  interaction,
  onAttempt,
  onProceed
}) => {
  const [active, setActive] = useState(initialActive);

  const onItemComplete = useCallback(() => {
    setActive(false);
    onProceed();
  }, [onProceed]);

  const props = {
    item: {
      type: 'phrase',
      learnLanguageText: text
    },
    active,
    onAttempt,
    onFinish: onItemComplete
  };
  const isPuzzleHelper = features.get('is_puzzle_helper') || interaction === 'PuzzleHelper';
  return (isPuzzleHelper
    ? <PuzzlehelperInteraction {...props} />
    : <FillinInteraction {...props} />
  );
};

const mapStateToProps = ({ session }) => ({
  learnLanguageAlpha3: session.learnLanguageAlpha3,
  shouldShowTransliteration: session.transliterationSettings.shouldShow
});

TextBox.propTypes = {
  active: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  interaction: PropTypes.string.isRequired,
  onAttempt: PropTypes.func.isRequired,
  onProceed: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(TextBox);
