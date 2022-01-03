import React from 'react';
import PropTypes from 'prop-types';
import rollbar from '../../services/rollbarService';

class TrainerErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const {
      trainerType,
      trainerInteraction
    } = this.props;

    const message = `TrainerException@${trainerType}-${trainerInteraction}: ${error.message}`;

    rollbar.error(message, {
      ...errorInfo,
      message: error.message,
      stack: error.stack
    });

    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

TrainerErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  trainerInteraction: PropTypes.string.isRequired,
  trainerType: PropTypes.string.isRequired,
  onError: PropTypes.func.isRequired
};

export default TrainerErrorBoundary;
