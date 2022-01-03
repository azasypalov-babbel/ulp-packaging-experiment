import posed from 'react-pose';
import { getDisplayName } from '../getDisplayName';

const withAnimations = (poseConfig) => (WrappedComponent) => {
  const WithAnimations = posed(WrappedComponent)(poseConfig);
  WithAnimations.displayName = `WithAnimations(${getDisplayName(WrappedComponent)})`;
  return WithAnimations;
};

export default withAnimations;
