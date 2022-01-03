import parseItem from './item';
import { titleItem } from './helpers/itemBuilder';
import translationFromTranslationVisibility from './helpers/translationVisibility';

export default function parseVocabulary({
  title,
  interaction,
  type,
  item_groups: itemGroups,
  translation_visibility: translationVisibility,
  askOnlyFirstItem,
  puzzle_helper: puzzleHelper
}) {
  const parsedItems = itemGroups[0].items.map(parseItem);

  return {
    interaction,
    puzzleHelper,
    component: type,
    traineritems: [titleItem(title), ...parsedItems],
    translation: translationFromTranslationVisibility(translationVisibility),
    askOnlyFirstItem: askOnlyFirstItem
  };
}
