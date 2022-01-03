import React from 'react';
import { mountWithTheme } from '../shared/themeMock';
import { LegacyTrainerSettingsContainer } from '../../../src/components/Lesson/LegacyTrainerSettingsContainer';

jest.mock('../../../src/providers/b3', () => (component) => component);
jest.mock('../../../src/lib/legacyStyleLoader');

const b3 = {
  stage: {
    initialize: jest.fn()
  },
  pageTrainerSettings: jest.fn()
};

const defaultProps = {
  b3,
  onFinish: jest.fn(),
  speechEngineName: 'analyserLib.js',
  isMicEnabled: true
};

describe('LegacyTrainerSettingsContainer', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mountWithTheme(<LegacyTrainerSettingsContainer {...defaultProps} />);
  });

  describe('#mountLegacyTrainerPage', () => {
    it('instantiates the legacy page trainer settings', () => {
      const currentRef = wrapper.instance().containerRef.current;
      expect(defaultProps.b3.pageTrainerSettings).toHaveBeenCalledWith(
        defaultProps.onFinish,
        {
          mountPoint: currentRef,
          speechEngineName: 'analyserLib.js',
          defaultValue: true
        }
      );
    });
  });
});
