import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import createB3 from '../b3_glue';
import createB3Proxy from '../b3_glue/proxy';
import { loadLegacyStyles } from '../lib/legacyStyleLoader';

const mapStateToProps = ({ session }) => ({
  locale: session.locale,
  learnLanguageAlpha3: session.learnLanguageAlpha3
});

const shouldDisableBootstrap = ({ type, interaction }) =>
  (type === 'vocabulary' && interaction === 'click') ||
    (type === 'dialog' && interaction === 'show');

const withB3 = (WrappedComponent) => {
  class WithB3 extends React.Component {
    constructor(props) {
      const { locale, learnLanguageAlpha3 } = props;
      super(props);
      this.cleanupLegacyStyles = null;

      if (!window.b3) {
        createB3();
        createB3Proxy();
      }

      window.b3.settings.set({
        locale,
        learnLanguageAlpha3
      });
    }

    UNSAFE_componentWillMount() {
      const { trainer } = this.props;

      if (trainer) {
        this.cleanupLegacyStyles = loadLegacyStyles({
          bootstrapDisabled: shouldDisableBootstrap(this.props.trainer)
        });
      } else {
        this.cleanupLegacyStyles = loadLegacyStyles();
      }
    }
    componentWillUnmount() {
      this.cleanupLegacyStyles();
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          b3={window.b3}
        />
      );
    }
  }

  WithB3.propTypes = {
    trainer: PropTypes.object,
    locale: PropTypes.string.isRequired,
    learnLanguageAlpha3: PropTypes.string.isRequired
  };

  return connect(mapStateToProps)(WithB3);
};

export default withB3;
