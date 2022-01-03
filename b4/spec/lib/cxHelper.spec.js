import cx from '../../src/lib/cxHelper';

const PREFIX = 'loy';

describe('CX Helper', () => {
  describe('#cx', () => {
    test(
      'concatenates all arguments into a string of classnames prefixed with `PREFIX`',
      () => {
        expect(cx('one', 'two', 'three')).toEqual(`${PREFIX}-one ${PREFIX}-two ${PREFIX}-three`);

        expect(cx('one', { two: 2 > 1, three: true, nope: typeof 2 === 'string' }))
          .toEqual(`${PREFIX}-one ${PREFIX}-two ${PREFIX}-three`);
      }
    );
  });
});
