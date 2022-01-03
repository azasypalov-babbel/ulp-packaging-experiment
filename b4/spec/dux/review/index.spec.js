import review from '../../../src/dux/review';


describe('Review DUX', () => {
  test('exposes selectors', () => {
    expect(typeof review.selectors).toBeDefined();
  });

  test('exposes actions', () => {
    expect(typeof review.actions).toBeDefined();
  });
});
