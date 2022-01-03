import PropTypes from 'prop-types';

export const attemptType = PropTypes.shape({
  text: PropTypes.string,
  solved: PropTypes.bool.isRequired,
  feedbackType: PropTypes.string,
  inputText: PropTypes.string,
  mistaken: PropTypes.bool.isRequired,
  pending: PropTypes.bool.isRequired,
  number: PropTypes.number,
  selection: PropTypes.shape({ start: PropTypes.number.isRequired, end: PropTypes.number.isRequired })
});

export const nodeType = PropTypes.shape({
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
});

export const targetChoice = PropTypes.shape({
  sentence: PropTypes.string.isRequired,
  correct: PropTypes.bool.isRequired,
  oddSolution: PropTypes.bool.isRequired
});

export const interactiveNodeType = PropTypes.shape({
  type: PropTypes.string.isRequired,
  text: PropTypes.string,
  active: PropTypes.bool.isRequired,
  attempt: attemptType.isRequired,
  isLastInteractiveNode: PropTypes.bool.isRequired,
  targetChoices: PropTypes.arrayOf(targetChoice).isRequired
});
