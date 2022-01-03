import React from 'react';
import PropTypes from 'prop-types';
import cx from '../../../lib/cxHelper';
import Counter from './Counter';

const AnswersCounter = ({
  correctItemsCount,
  totalItemsCount,
  onCounterEnd,
  correctAnswersText
}) => {
  return (
    <div
      className={cx('lesson-end-screen-feedback-answers-counter')}
      data-lesson-score={`${correctItemsCount}/${totalItemsCount}`}
    >
      <span className={cx('lesson-end-screen-feedback-answers-counter__caption')}>
        {correctAnswersText}
      </span>
      <h2 className={cx('lesson-end-screen-feedback-answers-counter__counter')}>
        <Counter value={correctItemsCount} />
        <span>/</span>
        <Counter value={totalItemsCount} onCounterEnd={onCounterEnd} />
      </h2>
    </div>
  );
};

AnswersCounter.propTypes = {
  correctItemsCount: PropTypes.number.isRequired,
  totalItemsCount: PropTypes.number.isRequired,
  onCounterEnd: PropTypes.func,
  correctAnswersText: PropTypes.string.isRequired
};

AnswersCounter.defaultProps = {
  onCounterEnd: () => {}
};

export default AnswersCounter;
