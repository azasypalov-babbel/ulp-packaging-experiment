import React from 'react';
import PropTypes from 'prop-types';
import cx from '../../../lib/cxHelper';
import zendeskWidget from '../../../lib/zendeskWidget';
import ProgressBar, { progressBarPropTypes } from './ProgressBar';
import ProgressCounter, { progressCounterPropTypes } from './ProgressCounter';
import SkipTrainerControls from '../../Sequence/SkipTrainerControls';
import CrossIcon from '../icons/CrossIcon';
import withTranslations from '../withTranslations';

const CSS_NAME = cx('cascada-navbar');

export const Navbar = ({
  onClickClose,
  progressCounter,
  progressBar,
  translations,
  showFeedbackButton,
  showProgressBar
}) => {
  const renderCloseBtn = () => (
    <a
      tabIndex="0"
      onClick={onClickClose}
      data-selector="navbar-close-link"
    >
      { translations.closeButtonTitle }
    </a>
  );

  const renderFeedbackBtn = () => showFeedbackButton && (
    <a
      tabIndex="0"
      className={`${CSS_NAME}__feedback`}
      onClick={() => {
        zendeskWidget.toggle();
      }}
    >
      { translations.feedbackButtonTitle }
    </a>
  );

  const renderCloseIcon = () => (
    <a
      tabIndex="0"
      className={`${CSS_NAME}__close-icon`}
      onClick={onClickClose}
      data-selector="navbar-close-icon"
    >
      <CrossIcon size={'1.8rem'} fillColor={'currentColor'}/>
    </a>
  );

  return  (
    <header className={CSS_NAME}>
      <div className={`${CSS_NAME}__gate`}>
        <div className={`${CSS_NAME}__item ${CSS_NAME}__item--medium-only`}>
          <span className={`${CSS_NAME}__brand`}>+B</span>
        </div>
        <SkipTrainerControls renderSkipAreas={showProgressBar}>
          <div className={`${CSS_NAME}__item ${CSS_NAME}__item--progress`}>
            {showProgressBar && <ProgressBar
              {...progressBar}
            />}
            {showProgressBar && <ProgressCounter
              {...progressCounter}
            />}
          </div>
        </SkipTrainerControls>
        <div className={`${CSS_NAME}__item ${CSS_NAME}__item--medium-only ${CSS_NAME}__item--align-right`}>
          {renderFeedbackBtn()}
          {renderCloseBtn()}
        </div>
        <div className={`${CSS_NAME}__item ${CSS_NAME}__item--small-only ${CSS_NAME}__item--align-left`}>
          {renderCloseIcon()}
        </div>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  onClickClose: PropTypes.func.isRequired,
  progressBar: PropTypes.shape(progressBarPropTypes).isRequired,
  progressCounter: PropTypes.shape(progressCounterPropTypes).isRequired,
  showFeedbackButton: PropTypes.bool.isRequired,
  showProgressBar: PropTypes.bool,
  translations: PropTypes.shape({
    closeButtonTitle: PropTypes.string.isRequired,
    feedbackButtonTitle: PropTypes.string.isRequired
  }).isRequired
};

const getTranslations = (translate) => ({
  closeButtonTitle: translate('navbar.close'),
  feedbackButtonTitle: translate('navbar.contact')
});

export default withTranslations(getTranslations)(Navbar);
