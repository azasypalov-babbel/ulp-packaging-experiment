const flattenItems = (trainer) => {
  return trainer.itemGroups.reduce((acc, group) => {
    return acc.concat(group.items);
  }, []);
};

export default flattenItems;
