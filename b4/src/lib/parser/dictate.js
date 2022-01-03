import parseItem from './item';
import { titleItem } from './helpers/itemBuilder';
import translationFromTranslationVisibility from './helpers/translationVisibility';
import interactionForTrainerWithRules from './helpers/interaction';

const interactionParsingRules = [
  { interaction: 'choose', dictate: true, puzzle_helper: false, parsedInteraction: 'ChoiceButtons' },
  { interaction: 'write', dictate: true, puzzle_helper: false, parsedInteraction: 'Fillin' },
  { interaction: 'write', dictate: true, puzzle_helper: true, parsedInteraction: 'PuzzleHelper' },
  { interaction: 'sort', dictate: true, puzzle_helper: false, parsedInteraction: 'WordOrder' }
];

export default function parseDictate(dictate) {
  const parsedItems = dictate.item_groups[0].items.map(parseItem);

  return {
    component: dictate.type,
    mode: 'Speak',
    translation: translationFromTranslationVisibility(dictate.translation_visibility),
    interaction: interactionForTrainerWithRules(dictate, interactionParsingRules),
    traineritems: [titleItem(dictate.title), ...parsedItems]
  };
}
