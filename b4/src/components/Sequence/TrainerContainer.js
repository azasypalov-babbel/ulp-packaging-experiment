import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import getComponentFromTrainerType from '../../lib/getComponentFromTrainerType';

import * as Engines from '../../services/speechRecognition/engines';

const TrainerContainer = (props) => {
  const { speechEngineName } = props;
  /**
   * We do not want updates to the trainer object once a trainer is mounted.
   * Due to scorable items being updated after mount, the trainer object is changed.
   * Without memoising, the trainer reference will have unintended updates.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const trainer = useMemo(() => props.trainer, []);

  const TrainerComponent = getComponentFromTrainerType({ trainer, speechEngineName });

  return <TrainerComponent
    {...props}
    trainer={trainer}
  />;
};

TrainerContainer.propTypes = {
  isMicEnabled: PropTypes.bool,
  onStart: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  trainer: PropTypes.object.isRequired,
  speechEngineName: PropTypes.oneOf([
    Engines.types.LEGACY_SPEECH,
    Engines.types.NATIVE_SPEECH,
    Engines.types.WEB_SPEECH
  ])
};

export default TrainerContainer;
