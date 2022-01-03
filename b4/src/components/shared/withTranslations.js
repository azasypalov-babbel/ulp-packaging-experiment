import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { getDisplayName } from '../getDisplayName';
import { withServices } from './withServices';

let id = 0;
const uuid = () => id += 1;

const withTranslations = (getTranslations = () => ({})) => (WrappedComponent) => {
  const WithTranslations = ({ translationService, ...props }) => {
    const [instanceId] = useState(uuid());
    const translations = getTranslations(
      translationService.translate,
      props,
      /**
       * getTranslations should be a pure function
       * sometimes (shuffle) we want randomness in translations
       * instanceId can be used to ensure the same result per instance
       */
      instanceId
    );
    return (
      <WrappedComponent
        {...props}
        translations={{
          ...props.translations,
          ...translations
        }} />
    );
  };

  WithTranslations.propTypes = {
    translations: PropTypes.object,
    translationService: PropTypes.object.isRequired
  };

  WithTranslations.defaultProps = {
    translations: {}
  };

  WithTranslations.displayName = `WithTranslations(${getDisplayName(WrappedComponent)})`;

  return withServices(['translationService'])(WithTranslations);
};

export default withTranslations;
