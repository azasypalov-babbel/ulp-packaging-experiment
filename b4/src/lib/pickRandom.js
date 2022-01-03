import shuffle from '../lib/shuffle';

export default (list, seed) => shuffle({ array: list, seed })[parseInt(list.length / 2, 10)];
