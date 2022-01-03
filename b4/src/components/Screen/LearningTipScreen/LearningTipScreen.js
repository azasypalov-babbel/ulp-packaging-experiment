import React from 'react';
import PropTypes from 'prop-types';

import * as features from '../../../lib/features';
import cx from '../../../lib/cxHelper';
import CenterContent from '../../shared/CenterContent';
import withTranslations from '../../shared/withTranslations';
import LoyButton from '../../Legacy/LoyButton';

export class LearningTipScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { translations, onContinueButtonClick } = this.props;
    const { title, tip, action } = translations;

    return (
      <CenterContent>
        <div className="loy">
          <div className={cx('learning-tip-screen',
            features.isWebview() && 'learning-tip-screen__disable-selection')}>
            <div className={cx('learning-tip-screen__icon')} />
            <h2 className={cx('learning-tip-screen__title')}>
              {title}
            </h2>
            <p className={cx('learning-tip-screen__text')}>
              {tip}
            </p>
            <LoyButton
              primary
              onClick={onContinueButtonClick}
              listenToKey="Enter"
            >
              {action}
            </LoyButton>
          </div>
        </div>
      </CenterContent>
    );
  }
}

LearningTipScreen.propTypes = {
  onContinueButtonClick: PropTypes.func.isRequired,
  translations: PropTypes.shape({
    title: PropTypes.string.isRequired,
    tip: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired
  }).isRequired
};

const getTranslations = (translate) => ({
  title: translate('learning_tip.title'),
  tip: translate('learning_tip.tip'),
  action: translate('learning_tip.action')
});

export default withTranslations(getTranslations)(LearningTipScreen);
