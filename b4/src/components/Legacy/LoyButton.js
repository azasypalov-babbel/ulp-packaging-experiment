import React from 'react';
import PropTypes from 'prop-types';
import withKeypress from '../shared/withKeypress';
import cx from '../../lib/cxHelper';

const LoyButton = ({
  primary,
  pressed,
  // eslint-disable-next-line no-unused-vars, react/prop-types
  listenToKey,
  ...props
}) =>
  <button
    {...props}
    type="button"
    className={cx(
      'btn',
      primary ? 'btn--primary' : 'btn--secondary',
      pressed ? 'is-active' : ''
    )}
  />;

LoyButton.propTypes = {
  primary: PropTypes.bool,
  pressed: PropTypes.bool
};

export default withKeypress(LoyButton);
