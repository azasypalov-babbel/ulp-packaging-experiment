import {
  formatParentheses,
  createSentenceParts,
  createChoiceSentences,
  markupStringToHTML
} from '@lessonnine/babbel-markup-helper.js';

const nodeFromSentencePart = (sentencePart) => {
  // has gap?
  if (sentencePart.indexOf('((') === 0) {
    const initialAttempt = {
      number: null,
      text: null,
      pending: false,
      solved: false,
      mistaken: false,
      feedbackType: null,
      selection: null
    };
    return {
      active: false,
      type: 'gap',
      text: null,
      attempt: initialAttempt,
      isLastInteractiveNode: false,
      targetChoices: createChoiceSentences(sentencePart)
    };
  } else {
    return {
      type: 'text',
      text: markupStringToHTML(sentencePart)
    };
  }
};

export function parseNodesFromMarkup(text) {
  const formattedSentence = formatParentheses(text);
  const sentenceParts = createSentenceParts(formattedSentence);
  return sentenceParts.map(nodeFromSentencePart);
}

export function nodeToAttemptString(node) {
  return node.attempt ? (
    node.attempt.text
  ) : node.text;
}

export function nodeToTargetString(node) {
  return node.targetChoices ? (
    node.targetChoices
      .map(({ sentence }) => sentence)
      .join(' ')
  ) : node.text;
}

export function filterNodeSelection(nodes = []) {
  const nodeSelection = [];

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];

    if ('attempt' in node && node.attempt.solved !== true) {
      return nodeSelection;
    }

    nodeSelection.push(node);
  }

  return nodeSelection;
}
