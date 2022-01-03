import parseItem from './item';
import { titleItem } from './helpers/itemBuilder';

function normalMatching(item) {
  return !item.learn_language_text.includes('_');
}

function formatLearnLanguageText(item) {
  if (normalMatching(item)) return item;

  const formattedText = item.learn_language_text
    .replace(/(.+)_(.+)/, '(($1))(($2))');

  return {
    ...item,
    learn_language_text: formattedText
  };
}

export default function parseMatching(matching) {
  const parsedItems = matching.item_groups[0].items.map((item) => {
    return parseItem(formatLearnLanguageText(item));
  });

  return {
    component: matching.type,
    traineritems: [titleItem(matching.title), ...parsedItems]
  };
}
