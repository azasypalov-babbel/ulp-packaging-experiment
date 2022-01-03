import parseItem from './item';
import { titleItem, descriptionItem } from './helpers/itemBuilder';
import interactionForTrainerWithRules from './helpers/interaction';
import translationFromTranslationVisibility from './helpers/translationVisibility';

const interactionParsingRules = [
  { dictate: true, parsedInteraction: 'AudioDialog' },
  { dictate: false, parsedInteraction: 'Text' }
];

export default function parseComprehension(comprehension) {
  const toSingleArray = (result, items) => result.concat(items);

  const parsedItems = comprehension.item_groups
    .map((group) => group.items)
    .reduce(toSingleArray, [])
    .map(parseItem);

  // This trainer expects 'mode' instead of 'interaction'.
  return {
    component: comprehension.type,
    mode: interactionForTrainerWithRules(comprehension, interactionParsingRules),
    translation: translationFromTranslationVisibility(comprehension.translation_visibility),
    traineritems: [
      titleItem(comprehension.title),
      descriptionItem(comprehension.description),
      ...parsedItems
    ]
  };
}
