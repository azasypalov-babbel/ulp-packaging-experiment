import React from 'react';
import PropTypes from 'prop-types';
import cx from '../../../lib/cxHelper';

import ReviewItem from './ReviewItem';

const delay = 400;

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0
    };
    this.timers = [];
  }

  componentDidMount() {
    this.timers = this.props.itemsList.map((item, index, array) =>
      setTimeout(() => {
        this.setState({ currentIndex: index + 1 }, this.updateItemListScroll);
        if (index === array.length - 1) {
          this.props.onAnimationComplete();
        }
      }, delay + (delay * index), index));
  }

  updateItemListScroll() {
    this.reviewItemListRef.scrollTop = this.reviewItemListRef.scrollHeight;
  }

  componentWillUnmount() {
    this.timers.map(clearTimeout);
  }

  render() {
    const { type, itemsList, onItemClick, title } = this.props;
    const cardType = type  === 'correct' ? 'card--correct' : 'card--incorrect';
    const dataReviewType = type  === 'correct' ? 'item-correct' : 'item-incorrect';

    return (
      <div className={cx('card', cardType)}>
        <h2 className={cx('card__title')}>{title}</h2>
        <div className={cx('card__body')}>
          <ul ref={(el) => { this.reviewItemListRef = el; }} className={cx('review-item-list')}>
            {itemsList.slice(0, this.state.currentIndex).map((item, i) => (
              <li key={i}>
                <ReviewItem data-review={dataReviewType} item={item} onItemClick={onItemClick} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  type: PropTypes.string.isRequired,
  itemsList: PropTypes.arrayOf(PropTypes.shape({
    learnLanguageText: PropTypes.string.isRequired,
    sound: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  })).isRequired,
  onItemClick: PropTypes.func.isRequired,
  onAnimationComplete: PropTypes.func,
  title: PropTypes.string.isRequired
};

Card.defaultProps = {
  onAnimationComplete: () => {}
};

export default Card;
