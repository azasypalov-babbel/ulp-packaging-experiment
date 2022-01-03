import abTesterService from '../../src/services/abTesterService';
import getAwsApiClient from '../../src/services/awsApiClient';
jest.mock('../../src/services/awsApiClient');
jest.mock('../../src/services/abTesterService');

const locale = 'en';
const target = 'experiment_target';
const mockFetch = jest.fn(() => Promise.resolve());

getAwsApiClient.mockImplementation(() => {
  return {
    fetch: mockFetch
  };
});

describe('AB Tester Service', () => {
  describe('#getExperimentBucket', () => {
    test('returns a Promise', () => {
      abTesterService.getExperimentBucket.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve({ data: [] }));
      });
      const result = abTesterService.getExperimentBucket({ locale, target });

      expect(typeof result.then).toEqual('function');
    });

    test('rejects with an error', () => {
      const errorMsg = 'Error';
      abTesterService.getExperimentBucket.mockImplementationOnce(() => {
        return new Promise((resolve, reject) => reject(errorMsg));
      });

      return expect(abTesterService.getExperimentBucket({ locale, target })).rejects.toEqual(errorMsg);
    });

    test('resolves with a string representing the experiment destination', () => {
      var experimentData = {
        data: {
          'ab-tester': {
            destination_label: 'control', // or variationA
            destination_value: 'control', // or variationA
            experiment_name: 'name',
            experiment_percentage: 50,
            experiment_series: 'series',
            experiment_target: 'target'
          }
        }
      };
      abTesterService.getExperimentBucket.mockImplementationOnce(() => {
        return new Promise((resolve) => resolve(experimentData.data['ab-tester'].destination_value));
      });

      expect.assertions(1);
      return abTesterService.getExperimentBucket({ locale, target })
        .then((data) => {
          expect(data).toEqual(experimentData.data['ab-tester'].destination_value);
        });
    });
  });
});
