import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { navigateToReturnUrl } from '../../../dux/session/actions';

import ErrorOverlay from '../ErrorOverlay';
import Button from '../Button/Button';
import { GenericErrorIcon } from '../icons';
import withTranslations from '../withTranslations';
import { withServices } from '../withServices';

export const GenericMessage = ({
  isReload,
  translations,
  navigateToReturnUrl,
  navigationService
}) => {
  const { title, body, cta } = isReload ?
    translations.reload :
    translations.return;

  const reloadPage = () => navigationService.reload();
  const redirectUser = () => navigateToReturnUrl();

  return <ErrorOverlay
    key="generic-error"
    dataSelector="error-overlay-generic-error"
    title={title}
    body={body}
    icon={<GenericErrorIcon size={'3.5rem'} />}
  >
    <Button
      data-selector="cta-button"
      onClick={isReload ? reloadPage : redirectUser}
    >
      {cta}
    </Button>
  </ErrorOverlay>;
};

const mapDispatchToProps = {
  navigateToReturnUrl
};

GenericMessage.propTypes = {
  navigationService: PropTypes.shape({
    reload: PropTypes.func
  }).isRequired,
  translations: PropTypes.shape({
    reload: PropTypes.shape({
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      cta: PropTypes.string.isRequired
    }).isRequired,
    return: PropTypes.shape({
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      cta: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  navigateToReturnUrl: PropTypes.func.isRequired,
  isReload: PropTypes.bool
};

const getTranslations = (translate) => ({
  reload: {
    title: translate('generic_error_screen.reload.title'),
    body: translate('generic_error_screen.reload.body'),
    cta: translate('generic_error_screen.reload.cta')
  },
  return: {
    title: translate('generic_error_screen.return.title'),
    body: translate('generic_error_screen.return.body'),
    cta: translate('generic_error_screen.return.cta')
  }
});

export default compose(
  connect(null, mapDispatchToProps),
  withTranslations(getTranslations),
  withServices(['navigationService'])
)(GenericMessage);
