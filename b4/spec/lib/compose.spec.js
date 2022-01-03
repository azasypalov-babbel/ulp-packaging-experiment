import { compose } from '../../src/lib/compose';

const a = () => 'a';

const b = (arg) => arg + 'b';

const c = (arg) => arg + 'c';

describe('compose', () => {
  test('works', () => {
    expect(compose(c, b, a)()).toEqual('abc');
  });
});
