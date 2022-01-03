import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Delayed = ({ delay, children, onFinish }) => {
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setFinished(true);
      onFinish && onFinish();
    }, delay);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [onFinish, delay]);

  return finished && children ? children : null;
};

Delayed.propTypes = {
  delay: PropTypes.number.isRequired,
  children: PropTypes.node,
  onFinish: PropTypes.func
};

export default Delayed;
