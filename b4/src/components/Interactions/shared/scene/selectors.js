export const getItem = (state) => state.item;

export const isGap = (node) => node.type === 'gap';

export const getGaps = (item) => item.nodes.filter(isGap);


export const getActiveNode = (state) => {
  const item = getItem(state);

  if (!item || state.completed) {
    return null;
  }

  const { activeNodeIndex } = state;
  const activeNode = item.nodes[activeNodeIndex];
  if (activeNode && isGap(activeNode)) {
    return activeNode;
  }
  return null;
};

export const nextGapNodeIndex = (item, minIndex = 0) => {
  return item.nodes.findIndex((node, index) => {
    return isGap(node) && index >= minIndex;
  });
};

export const hasGaps = (item) => {
  return nextGapNodeIndex(item, 0) !== -1;
};

export const hasGapAfter = (item, minIndex = 0) => {
  return nextGapNodeIndex(item, minIndex) !== -1;
};

export const getMistakeCount = (state) => {
  const activeItem = getItem(state);
  return activeItem.nodes
    .filter(isGap)
    .filter((node) => !node.attempt.pending)
    .reduce((acc, { attempt: { number, solved } }) => {
      return solved ? acc + (number - 1) : acc + number;
    }, 0);
};
