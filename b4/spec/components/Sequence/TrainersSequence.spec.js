import React from 'react';
import { shallow } from 'enzyme';
import { TrainersSequence } from '../../../src/components/Sequence/TrainersSequence';

jest.mock('../../../src/components/shared/SpeechRecognition/MicPermissionContainer', () => 'MicPermissionContainer');
jest.mock('../../../src/components/Sequence/LegacyTrainerContainer', () => 'LegacyTrainerContainer');

const defaultProps = {
  isMicEnabled: true,
  allocateItems: jest.fn(),
  completeTrainer: jest.fn(),
  abortSequence: jest.fn(),
  skipItem: jest.fn(),
  trainers: [{
    id: 'test',
    interaction: 'mock-interaction',
    type: 'mock-type'
  }],
  currentTrainerIndex: 0,
  speechEngineName: 'WebAPISpeechRecognition',
  isPermissionCompleted: true,
  setMicSettings: jest.fn(),
  shouldShowToolbar: true
};

describe('TrainersSequence', () => {
  describe('when current trainer doesnt exists', () => {
    const props = {
      ...defaultProps,
      trainers: []
    };

    test('renders null', () => {
      const wrapper = shallow(<TrainersSequence {...props} />);
      expect(wrapper.html()).toBeNull();
    });
  });

  describe('MicPermission', () => {
    describe('when uses WebSpeechRecognizer', () => {
      describe('when should render MicPermission', () => {
        const props = {
          ...defaultProps,
          trainers: [{ id: 'test', interaction: 'speak', type: 'vocabulary' }],
          isPermissionCompleted: false
        };

        test('renders MicPermission', () => {
          const wrapper = shallow(<TrainersSequence {...props} />);
          const received = wrapper.find('MicPermissionContainer');
          expect(received).toHaveLength(1);
        });
      });

      describe('when should not render MicPermission', () => {
        const props = {
          ...defaultProps,
          trainers: [{ id: 'test', interaction: 'click', type: 'vocabulary' }],
          isPermissionCompleted: false
        };

        test('does not render MicPermission', () => {
          const wrapper = shallow(<TrainersSequence {...props} />);
          const received = wrapper.find('MicPermissionContainer');
          expect(received).toHaveLength(0);
        });
      });
    });

    describe('when does not use WebSpeechRecognizer', () => {
      test('does not render MicPermission', () => {
        const props = {
          ...defaultProps,
          speechEngineName: undefined
        };

        const wrapper = shallow(<TrainersSequence {...props} />);
        const received = wrapper.find('MicPermissionContainer');
        expect(received).toHaveLength(0);
      });
    });
  });

  describe('when current trainer exists', () => {
    test('renders TrainerContainer', () => {
      const wrapper = shallow(<TrainersSequence {...defaultProps} />);
      const received = wrapper.find('TrainerContainer');
      expect(received).toHaveLength(1);
    });
  });
});
