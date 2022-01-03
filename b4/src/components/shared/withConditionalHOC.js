import React from 'react';
import { getDisplayName } from '../getDisplayName';

const withConditionalHOC = (enhance, condition) => (WrappedComponent) => {
  const EnhancedWrappedComponent = enhance(WrappedComponent);
  const ConditionalHOC = (props) => {
    if (condition(props)) {
      return <EnhancedWrappedComponent {...props} />;
    }
    return <WrappedComponent {...props} />;
  };

  ConditionalHOC.displayName = `ConditionalHOC(${getDisplayName(WrappedComponent)})`;

  return ConditionalHOC;
};

export default withConditionalHOC;
