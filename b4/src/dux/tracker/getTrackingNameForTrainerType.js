const getDialogTrackingName = (trainer, isMicEnabled) => {
  const { interaction, dictate } = trainer;
  const puzzlehelper = trainer.puzzle_helper;

  if (interaction === 'choose') {
    return dictate ? 'Dialog_DictateChoice' : 'Dialog_Choicebuttons';
  }

  if (interaction === 'write') {
    if (dictate) {
      return 'Dialog_DictateFillin';
    } else {
      return puzzlehelper ? 'Dialog_Puzzlehelper' : 'Dialog_Fillin';
    }
  }

  if (interaction === 'speak') {
    return isMicEnabled ? 'Dialog_Speak' : 'Dialog_Show';
  }
};

const getVocabularyTrackingName = (trainer, isMicEnabled) => {
  const { interaction, puzzle_helper: puzzlehelper, dictate } = trainer;

  if (interaction === 'choose') {
    return dictate ? 'Vocabulary_DictateChoice' : 'Vocabulary_Choicebuttons';
  }

  if (interaction === 'click') {
    return 'Vocabulary_Click';
  }

  if (interaction === 'write') {
    if (dictate) {
      return puzzlehelper ? 'Vocabulary_DictatePuzzlehelper' : 'Vocabulary_DictateFillin';
    }
    return puzzlehelper ? 'Vocabulary_Puzzlehelper' : 'Vocabulary_Fillin';
  }

  if (interaction === 'wordorder') {
    return dictate ? 'Vocabulary_DictateWordorder' : 'Vocabulary_Wordorder';
  }

  if (interaction === 'speak') {
    return isMicEnabled ? 'Vocabulary_Speak' : 'Vocabulary_Show';
  }

  if (interaction === 'show') {
    return 'Vocabulary_Show';
  }
};

const getCardTrackingName = (trainer) => {
  const { interaction, puzzle_helper: puzzlehelper } = trainer;

  if (interaction === 'choose') {
    return 'Card_Choicebuttons';
  }

  if (interaction === 'write') {
    return puzzlehelper ? 'Card_Puzzlehelper' : 'Card_Fillin';
  }
};

export const getTrackingNameForTrainerType = (trainer, isMicEnabled) => {
  const map = {
    card: getCardTrackingName(trainer),
    comprehension: trainer.dictate ? 'Comprehension_Audio' : 'Comprehension_Text',
    dialog: getDialogTrackingName(trainer, isMicEnabled),
    dictate: getVocabularyTrackingName(trainer, isMicEnabled),
    keyboard: 'Keyboard',
    matching: 'Matching',
    vocabulary: getVocabularyTrackingName(trainer, isMicEnabled)
  };

  return map[trainer.type];
};
