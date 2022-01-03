import React from 'react';
import PropTypes from 'prop-types';

export const animateValue = (value, onValueChange, onCompleted) => {
  if (value == 0) {
    onCompleted();
    onValueChange(0);
    return;
  }

  let current = 0;
  const stepTime = Math.floor(900 / value);
  const timer = setInterval(() => {
    current += 1;
    onValueChange(current);
    if (current == value) {
      onCompleted();
      clearInterval(timer);
    }
  }, stepTime);

  return timer;
};

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };

    this.updateState = this.updateState.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidMount() {
    this.timer = animateValue(this.props.value, this.updateState, this.props.onCounterEnd);
  }

  updateState(newValue) {
    this.setState({ value: newValue });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    clearInterval(this.timer);
    this.timer = animateValue(nextProps.value, this.updateState, this.props.onCounterEnd);
  }

  render() {
    return (
      <span>{this.state.value}</span>
    );
  }
}

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  onCounterEnd: PropTypes.func
};

Counter.defaultProps = {
  onCounterEnd: () => {}
};

export default Counter;
