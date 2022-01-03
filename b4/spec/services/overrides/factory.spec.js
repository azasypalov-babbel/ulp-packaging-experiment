import * as features from '../../../src/lib/features';
import { createServicesOverride, applyOverrides } from '../../../src/services/overrides/factory';

describe(`createServicesOverride`, () => {
  describe(`when guard is flag`, () => {
    const FLAG_FIXTURE = 'test_flag';

    const override = createServicesOverride({
      name: 'Override'
    }, FLAG_FIXTURE);

    test('is override type', () => {
      expect(override).toHaveProperty('services', expect.any(Object));
      expect(override).toHaveProperty('guard', expect.any(Function));
      expect(override).toHaveProperty('name', FLAG_FIXTURE);
    });

    describe('when flag is enabled', () => {
      beforeEach(() => {
        jest.spyOn(features, 'get').mockImplementation((flag) => flag === FLAG_FIXTURE);
      });

      test('guard returns true', () => {
        expect(override.guard()).toEqual(true);
      });
    });

    describe('when flag is disabled', () => {
      beforeEach(() => {
        jest.spyOn(features, 'get').mockImplementation((flag) => flag !== FLAG_FIXTURE);
      });

      test('guard returns false', () => {
        expect(override.guard()).toEqual(false);
      });
    });
  });
});


describe('applyOverrides', () => {
  test(`only applies enabled overrides`, () => {
    const target = {};
    const overrides = [
      createServicesOverride({
        name: 'Override A'
      }, 'feature_a'),
      createServicesOverride({
        name: 'Override B'
      }, 'feature_b'),
      createServicesOverride({
        name: 'Override C'
      }, 'feature_c')
    ];

    const enabled = ['feature_a', 'feature_c'];
    jest.spyOn(features, 'get').mockImplementation((flag) => enabled.includes(flag));

    expect(applyOverrides(target, ...overrides)).toEqual({
      ...overrides[0].services,
      ...overrides[2].services
    });
  });
});
