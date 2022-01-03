import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import camelise from 'camelize';
import { getDisplayName } from '../getDisplayName';

/**
 * This HOC is for wrapping trainers so that trainer data is normalised within the trainer.
 * We aim to use normalised data through the entirity of b4. Once lesson data is normalised
 * at the source (service layer) this is no longer required.
 */
const withNormalisedTrainerData = (WrappedComponent) => {
  const WithNormalisedTrainerData = (props) => {
    const trainer = useMemo(() => camelise(props.trainer), [props.trainer]);
    return (
      <WrappedComponent
        {...props}
        trainer={trainer}
      />
    );
  };

  WithNormalisedTrainerData.propTypes = {
    trainer: PropTypes.object.isRequired
  };

  WithNormalisedTrainerData.displayName = `WithNormalisedTrainerData(${getDisplayName(WrappedComponent)})`;

  return WithNormalisedTrainerData;
};

export default withNormalisedTrainerData;
