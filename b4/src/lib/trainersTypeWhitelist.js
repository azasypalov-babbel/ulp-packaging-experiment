const isEqualTrainerSignature = (trainerA) => (trainerB) => (
  trainerA.type === trainerB.type &&
  trainerA.interaction === trainerB.interaction &&
  trainerA.dictate === trainerB.dictate &&
  trainerA.puzzle_helper === trainerB.puzzle_helper
);

export const createWhitelistTrainersFilter = (whitelistedTrainers) => (loggingCallback) => (trainers) => {
  return trainers.reduce(
    (passingTrainers, trainer) => {
      if (!whitelistedTrainers.some(isEqualTrainerSignature(trainer))) {
        loggingCallback(trainer);
        return passingTrainers;
      }
      return [...passingTrainers, trainer];
    },
    []
  );
};

export const filterWhitelistedTrainers = createWhitelistTrainersFilter([
  // Vocabulary Show
  {
    type: 'vocabulary',
    interaction: 'show',
    dictate: false,
    puzzle_helper: false
  },

  // Vocabulary Speak
  {
    type: 'vocabulary',
    interaction: 'speak',
    dictate: false,
    puzzle_helper: false
  },

  // Vocabulary Fillin
  {
    type: 'vocabulary',
    interaction: 'write',
    dictate: false,
    puzzle_helper: false
  },

  // Vocabulary Puzzlehelper
  {
    type: 'vocabulary',
    interaction: 'write',
    dictate: false,
    puzzle_helper: true
  },

  // Vocabulary Wordorder
  {
    type: 'vocabulary',
    interaction: 'wordorder',
    dictate: false,
    puzzle_helper: false
  },

  // Vocabulary Click
  {
    type: 'vocabulary',
    interaction: 'click',
    dictate: false,
    puzzle_helper: false
  },

  // Vocabulary Choicebutton
  {
    type: 'vocabulary',
    interaction: 'choose',
    dictate: false,
    puzzle_helper: false
  },

  // Dialog Speak
  {
    type: 'dialog',
    interaction: 'speak',
    dictate: false,
    puzzle_helper: false
  },

  // Dialog Fillin
  {
    type: 'dialog',
    interaction: 'write',
    dictate: false,
    puzzle_helper: false
  },

  // Dialog Puzzlehelper
  {
    type: 'dialog',
    interaction: 'write',
    dictate: false,
    puzzle_helper: true
  },

  // Dialog Choicebutton
  {
    type: 'dialog',
    interaction: 'choose',
    dictate: false,
    puzzle_helper: false
  },

  // Dialog Dictatechoicebutton
  {
    type: 'dialog',
    interaction: 'choose',
    dictate: true,
    puzzle_helper: false
  },

  // Dialog Dictatefillin
  {
    type: 'dialog',
    interaction: 'write',
    dictate: true,
    puzzle_helper: false
  },

  // Card Fillin
  {
    type: 'card',
    interaction: 'write',
    dictate: false,
    puzzle_helper: false
  },

  // Card Puzzlehelper
  {
    type: 'card',
    interaction: 'write',
    dictate: false,
    puzzle_helper: true
  },

  // Card Choicebutton
  {
    type: 'card',
    interaction: 'choose',
    dictate: false,
    puzzle_helper: false
  },

  // Comprehension Audio
  {
    type: 'comprehension',
    interaction: 'choose',
    dictate: true,
    puzzle_helper: false
  },

  // Comprehension Text
  {
    type: 'comprehension',
    interaction: 'choose',
    dictate: false,
    puzzle_helper: false
  },

  // Matching',
  {
    type: 'matching',
    interaction: 'choose',
    dictate: false,
    puzzle_helper: false
  },

  // Keyboard',
  {
    type: 'keyboard',
    interaction: 'write',
    dictate: false,
    puzzle_helper: false
  },

  // Dictate Fillin
  {
    type: 'dictate',
    interaction: 'write',
    dictate: true,
    puzzle_helper: false
  },

  // Dictate Puzzlehelper
  {
    type: 'dictate',
    interaction: 'write',
    dictate: true,
    puzzle_helper: true
  },

  // Dictate Choicebutton
  {
    type: 'dictate',
    interaction: 'choose',
    dictate: true,
    puzzle_helper: false
  },

  // Dictate Wordorder
  {
    type: 'dictate',
    interaction: 'wordorder',
    dictate: true,
    puzzle_helper: false
  }
]);
