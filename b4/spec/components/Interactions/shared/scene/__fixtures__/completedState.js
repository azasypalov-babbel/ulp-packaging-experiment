import deepFreeze from '../../../../../lib/deepFreeze';

const completedState = {
  item: {
    text: '((*Ich)) ((*bin)) ((*aus)) ((*Zürich.))',
    nodes: [
      {
        active: false,
        type: 'gap',
        text: null,
        targetChoices: [
          {
            sentence: 'Ich',
            correct: true,
            oddSolution: false
          }
        ],
        attempt: {
          number: 2,
          text: 'Ich',
          pending: false,
          solved: true,
          mistaken: false,
          feedbackType: 'CORRECT',
          selection: null,
          inputText: 'Ich'
        },
        isLastInteractiveNode: false
      },
      {
        type: 'text',
        text: ' ',
        active: false,
        isLastInteractiveNode: false
      },
      {
        active: false,
        type: 'gap',
        text: null,
        targetChoices: [
          {
            sentence: 'bin',
            correct: true,
            oddSolution: false
          }
        ],
        attempt: {
          number: 1,
          text: 'bin',
          pending: false,
          solved: true,
          mistaken: false,
          feedbackType: 'CORRECT',
          selection: null,
          inputText: 'bin'
        },
        isLastInteractiveNode: false
      },
      {
        type: 'text',
        text: ' ',
        active: false,
        isLastInteractiveNode: false
      },
      {
        active: false,
        type: 'gap',
        text: null,
        targetChoices: [
          {
            sentence: 'aus',
            correct: true,
            oddSolution: false
          }
        ],
        attempt: {
          number: 2,
          text: 'aus',
          pending: false,
          solved: true,
          mistaken: false,
          feedbackType: 'CORRECT',
          selection: null,
          inputText: 'aus'
        },
        isLastInteractiveNode: false
      },
      {
        type: 'text',
        text: ' ',
        active: false,
        isLastInteractiveNode: false
      },
      {
        active: true,
        type: 'gap',
        text: null,
        targetChoices: [
          {
            sentence: 'Zürich.',
            correct: true,
            oddSolution: false
          }
        ],
        attempt: {
          number: 1,
          text: 'Zürich.',
          pending: false,
          solved: true,
          mistaken: false,
          feedbackType: 'CORRECT',
          selection: null,
          inputText: 'Zürich.'
        },
        isLastInteractiveNode: true
      }
    ],
    solved: true
  },
  activeNodeIndex: 6,
  completed: true
};

export default deepFreeze(completedState);
