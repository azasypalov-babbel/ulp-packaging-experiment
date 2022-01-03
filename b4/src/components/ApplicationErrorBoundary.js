import React from 'react';
import PropTypes from 'prop-types';
import rollbar from '../services/rollbarService';
import GenericMessage from './shared/Messages/GenericMessage';
import CenterContent from './shared/CenterContent';

class ApplicationErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const {
      name
    } = this.props;

    const message = `ApplicationException@${name}: ${error.message}`;

    rollbar.error(message, {
      ...errorInfo,
      message: error.message,
      stack: error.stack
    });
  }

  render() {
    if (this.state.hasError) return (
      <main>
        <CenterContent>
          <div>
            <GenericMessage isReload />
          </div>
        </CenterContent>
      </main>
    );
    return this.props.children;
  }
}

ApplicationErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired
};

export default ApplicationErrorBoundary;
