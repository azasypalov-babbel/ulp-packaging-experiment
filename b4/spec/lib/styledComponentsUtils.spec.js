import * as utils from '../../src/lib/styledComponentsUtils';

describe('Utils for styled-components', () => {
  describe('responsiveStyles', () => {
    const sizes = {
      regular: '12px',
      jumbo: '18px'
    };
    const theme = {
      viewports: {
        breakpoints: {
          xxsmall: '360px',
          xsmall: '600px',
          small: '900px',
          medium: '1200px',
          large: '1600px'
        }
      }
    };
    it('should generate correct styles with responsive values', () => {
      const styles = utils.responsiveStyles(
        'size',
        ({ size }) => `p { font-size: ${sizes[size]}; }`
      );
      expect(styles({ size: { small: 'regular', large: 'jumbo' }, theme })).toEqual([
        `@media (min-width: 900px) { p { font-size: 12px; } }`,
        `@media (min-width: 1600px) { p { font-size: 18px; } }`
      ].join('\n'));
    });

    it('should generate correct styles with non-responsive value', () => {
      const createResponsiveStyles = utils.responsiveStyles(
        'size',
        ({ size }) => `p { font-size: ${sizes[size]}; }`
      );
      expect(createResponsiveStyles({ size: 'jumbo', theme })).toEqual('p { font-size: 18px; }');
    });
  });
});
