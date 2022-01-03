import React from 'react';
import PropTypes from 'prop-types';
import cx from '../../../lib/cxHelper';

const ProgressCounter = ({
  current,
  total
}) => (
  <div className={`${cx('progress-counter')} hide-for-small`}>
    {current}/{total}
  </div>
);

export const progressCounterPropTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
};

ProgressCounter.propTypes = progressCounterPropTypes;

export default ProgressCounter;
