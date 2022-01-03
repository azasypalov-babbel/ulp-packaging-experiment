import React from 'react';
import PropTypes from 'prop-types';

import LearningTipScreen from './LearningTipScreen';

const LearningTipScreenContainer = (props) => {
  return (
    <LearningTipScreen {...props} />
  );
};

LearningTipScreenContainer.propTypes = {
  onContinueButtonClick: PropTypes.func.isRequired
};

export default LearningTipScreenContainer;
