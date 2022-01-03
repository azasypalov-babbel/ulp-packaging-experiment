import { createSelector } from 'reselect';

const itemsInTrainer = ({ item_groups: itemGroups }) => itemGroups.reduce((items, itemGroup) => {
  return items.concat(itemGroup.items);
}, []);

const itemsInTrainers = (trainers = []) => {
  return trainers.reduce((items, trainer) => {
    return items.concat(itemsInTrainer(trainer));
  }, []);
};

export const remainingItemCount = createSelector(
  (state) => state.reviewItems,
  (reviewItems) => reviewItems.remainingItemCount
);

export const reviewItemsCount = createSelector(
  (state) => state.reviewItems,
  (reviewItems) => itemsInTrainers(reviewItems.reviewSession.trainers).length
);
