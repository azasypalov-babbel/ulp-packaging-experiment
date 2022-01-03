import surveyService from '../../src/services/surveyService';
import setupGlobalLightningScript from '../../src/lib/globalLightningScript';

jest.mock('../../src/lib/globalLightningScript', () => jest.fn());

describe('Survey Service', () => {
  const usabillaFactory = jest.fn();

  beforeEach(() => {
    window.lightningjs = {};
    window.lightningjs.require = () => usabillaFactory;
  });

  afterAll(() => {
    delete window.lightningjs;
  });

  describe('loadSurvey', () => {
    describe('for supported locale', () => {
      const options = {
        locale: 'en'
      };

      beforeEach(() => {
        surveyService.loadSurvey(options);
      });

      afterEach(() => {
        delete window.usabilla_live;
      });

      test('creates global ligningjs context', () => {
        expect(setupGlobalLightningScript).toHaveBeenCalledWith();
      });

      test('creates survey function', () => {
        expect(window.usabilla_live).toEqual(usabillaFactory);
      });

      test('sends data to survey', () => {
        expect(window.usabilla_live).toHaveBeenCalledWith('data', { custom: options });
      });
    });

    describe('for unsupported locale', () => {
      const options = {
        locale: 'unsupported-locale'
      };

      beforeEach(() => {
        surveyService.loadSurvey(options);
      });

      test('does not create global ligningjs context', () => {
        expect(setupGlobalLightningScript).not.toHaveBeenCalled();
      });

      test('does not create survey function', () => {
        expect(window.usabilla_live).toEqual(undefined);
      });
    });
  });
});
