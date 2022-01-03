import parseItem from './item';
import { titleItem } from './helpers/itemBuilder';

export default function parseSpokenReview(spokenReview) {
  const parsedItems = spokenReview.item_groups[0].items.map(parseItem);

  return {
    component: spokenReview.type,
    traineritems: [titleItem(spokenReview.title), ...parsedItems]
  };
}
