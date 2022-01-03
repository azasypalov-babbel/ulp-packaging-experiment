import React from 'react';
import PropTypes from 'prop-types';
import cx from '../../../lib/cxHelper';
import { getFirstCorrectSolution } from '@lessonnine/babbel-markup-helper.js';

const ReviewItem = ({ item, onItemClick, ...props }) => (
  <div
    className={cx('review-item')}
    onClick={() => onItemClick(item)}
    {...props}
  >
    <div className={cx('review-item__icon')} />
    <div
      className={cx('review-item__text')}
      dangerouslySetInnerHTML={{ __html: getFirstCorrectSolution(item.learnLanguageText) }}
    />
  </div>
);

ReviewItem.propTypes = {
  item: PropTypes.shape({
    learnLanguageText: PropTypes.string.isRequired
  }).isRequired,
  onItemClick: PropTypes.func.isRequired
};

export default ReviewItem;
