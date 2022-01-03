import deepFreeze from '../../../../../lib/deepFreeze';

const initialAttempt = {
  number: null,
  text: null,
  pending: false,
  solved: false,
  mistaken: false,
  feedbackType: null,
  selection: null
};

const initialState = {
  item: {
    text: '((Schöner|*Guten)) Morgen, lieber Cousin',
    nodes: [
      {
        type: 'text',
        text: ' ',
        isLastInteractiveNode: false
      },
      {
        type: 'gap',
        text: null,
        targetChoices: [
          {
            sentence: 'Schöner',
            correct: false,
            oddSolution: false
          },
          {
            sentence: 'Guten',
            correct: true,
            oddSolution: false
          }
        ],
        attempt: initialAttempt,
        isLastInteractiveNode: true
      }
    ]
  },
  activeNodeIndex: -1,
  completed: false
};

export default deepFreeze(initialState);
