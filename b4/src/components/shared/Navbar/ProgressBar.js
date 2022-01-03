import React from 'react';
import PropTypes from 'prop-types';
import cx from '../../../lib/cxHelper';

const getTrainerProgressStyles = ({
  hasPassed,
  isHead,
  sequenceHeadProgress
}) => {
  if (hasPassed) return 100;
  if (isHead) return sequenceHeadProgress * 100;
  return 0;
};

const ProgressBar = ({
  trainerCount,
  sequenceHeadIndex,
  sequenceHeadProgress,
  onTrainerClick
}) => (
  <div className={cx('progress-bar')}>
    <div className={cx('progress-bar__base')}>
      {Array(trainerCount).fill().map((trainer, index) => {
        const hasPassed = index < sequenceHeadIndex;
        const isHead = index === sequenceHeadIndex;

        return (
          <div
            key={`trainer-${index}`}
            onClick={() => onTrainerClick(index)}
            style={{ flexGrow: 1 }}
          >
            <span
              className={cx('progress-bar__item')}
              style={{ width: `${getTrainerProgressStyles({ hasPassed, isHead, sequenceHeadProgress })}%` }}
            >
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

export const progressBarPropTypes = {
  trainerCount: PropTypes.number,
  sequenceHeadIndex: PropTypes.number,
  sequenceHeadProgress: PropTypes.number,
  onTrainerClick: PropTypes.func.isRequired
};

ProgressBar.propTypes = progressBarPropTypes;

export default ProgressBar;
