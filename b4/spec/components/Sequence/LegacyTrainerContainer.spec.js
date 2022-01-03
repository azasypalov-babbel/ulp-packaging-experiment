import React from 'react';
import { LegacyTrainerContainer } from '../../../src/components/Sequence/LegacyTrainerContainer';
import { shallow } from 'enzyme';
import { parseTrainer } from '../../../src/lib/parser/trainers';
import rollbar from '../../../src/services/rollbarService';

jest.mock('../../../src/providers/b3', () => () => {});
jest.mock('../../../src/lib/parser/trainers');
jest.mock('../../../src/components/shared/SpeechRecognition/InteractionToggleToolbar',
  () => 'InteractionToggleToolbar');
jest.mock('../../../src/lib/legacyStyleLoader');

parseTrainer.mockImplementation((trainer) => ({
  component: trainer.name,
  traineritems: []
}));

const pageLegacyTrainer = {
  prepare: jest.fn(),
  start: jest.fn()
};

const pageLegacyTrainerWithCallback = {
  prepare: jest.fn((cb) => cb()),
  start: jest.fn()
};

const b3 = {
  stage: {
    initialize: jest.fn()
  },
  keyboardEvents: {
    reset: jest.fn()
  },
  keyboardShortcuts: {
    init: jest.fn()
  },
  settings: {
    pageComponents: {
      legacytrainer: jest.fn(() => pageLegacyTrainer),
      legacytrainerwithpreparecallback: jest.fn(() => pageLegacyTrainerWithCallback)
    }
  }
};

const defaultProps = {
  isMicEnabled: false,
  b3,
  onStart: jest.fn(),
  onFinish: jest.fn(),
  onItemAttempt: jest.fn(),
  onItemSkip: jest.fn(),
  displayInfoText: jest.fn(),
  clearInfoTextUI: jest.fn(),
  speechEngineName: undefined,
  trainer: { name: 'LegacyTrainer' }
};

describe('LegacyTrainerContainer', () => {
  describe('#mountLegacyTrainerPage', () => {
    let instance;

    beforeEach(() => {
      const wrapper = shallow(<LegacyTrainerContainer {...defaultProps} />);
      instance = wrapper.instance();
      instance.startLegacyTrainerPage = jest.fn();

      instance.mountLegacyTrainerPage();
    });

    it('parses the trainer data', () => {
      expect(parseTrainer).toHaveBeenCalledWith(defaultProps.trainer);
    });

    it('resets the events', () => {
      expect(b3.keyboardEvents.reset).toHaveBeenCalled();
    });

    it('calls the constructor of the legacy trainer page', () => {
      const currentRef = instance.containerRef.current;
      expect(b3.settings.pageComponents.legacytrainer).toHaveBeenCalledWith(
        [],
        { component: 'LegacyTrainer', traineritems: [] },
        {
          mountPoint: currentRef,
          clearInfoTextUI: defaultProps.clearInfoTextUI,
          displayInfoText: defaultProps.displayInfoText,
          onFinish: defaultProps.onFinish,
          onItemSkip: instance.handleItemSkip,
          speak: defaultProps.isMicEnabled,
          services: { rollbar }
        }
      );
    });

    it('creates an instance of the legacy trainer passing options', () => {
      expect(instance.legacyTrainerPage).toEqual(pageLegacyTrainer);
    });

    describe('when #prepare does not have a callback', () => {
      it('prepares the legacy trainer', () => {
        expect(pageLegacyTrainer.prepare).toHaveBeenCalledWith();
      });

      it('calls internal method to start the legacy trainer page', () => {
        expect(instance.startLegacyTrainerPage).toHaveBeenCalled();
      });
    });

    describe('when #prepare has a callback', () => {
      let instance;

      beforeEach(() => {
        const wrapper = shallow(<LegacyTrainerContainer
          {...defaultProps}
          trainer={{ name: 'LegacyTrainerWithPrepareCallback' }} />);
        instance = wrapper.instance();
        instance.startLegacyTrainerPage = jest.fn();

        instance.mountLegacyTrainerPage();
      });

      it('prepares the legacy trainer', () => {
        expect(pageLegacyTrainerWithCallback.prepare).toHaveBeenCalledWith(instance.startLegacyTrainerPage);
      });

      it('calls internal method to start the legacy trainer page', () => {
        expect(instance.startLegacyTrainerPage).toHaveBeenCalled();
      });
    });
  });

  describe('#startLegacyTrainerPage', () => {
    describe('when legacy trainer page has #totalScoreEvents method', () => {
      const legacyTrainerPageMock = {
        start: jest.fn(),
        totalScoreEvents: jest.fn(() => 5)
      };

      beforeEach(() => {
        const wrapper = shallow(<LegacyTrainerContainer {...defaultProps} />);
        wrapper.instance().legacyTrainerPage = legacyTrainerPageMock;

        wrapper.instance().startLegacyTrainerPage();
      });

      it('calls onStart prop with scorableItemsCount', () => {
        expect(legacyTrainerPageMock.totalScoreEvents).toHaveBeenCalled();
        expect(defaultProps.onStart).toHaveBeenCalledWith({
          scorableItemsCount: 5
        });
      });

      it('starts the legacy trainer', () => {
        expect(legacyTrainerPageMock.start).toHaveBeenCalled();
      });
    });

    describe('when legacy trainer page does not have #totalScoreEvents method', () => {
      const legacyTrainerPageMock = {
        start: jest.fn()
      };

      beforeEach(() => {
        const wrapper = shallow(<LegacyTrainerContainer {...defaultProps} />);
        wrapper.instance().legacyTrainerPage = legacyTrainerPageMock;

        wrapper.instance().startLegacyTrainerPage();
      });

      it('calls onStart', () => {
        expect(defaultProps.onStart).toHaveBeenCalledWith({});
      });

      it('starts the legacy trainer', () => {
        expect(legacyTrainerPageMock.start).toHaveBeenCalled();
      });
    });
  });

  describe('on unmount', () => {
    const legacyTrainerPageMock = {
      cleanup: jest.fn()
    };

    beforeEach(() => {
      const wrapper = shallow(<LegacyTrainerContainer {...defaultProps} />);
      wrapper.instance().legacyTrainerPage = legacyTrainerPageMock;

      wrapper.unmount();
    });

    it('cleans up legacy trainer', () => {
      expect(legacyTrainerPageMock.cleanup).toHaveBeenCalled();
    });
  });

  describe('Toolbar', () => {
    describe('when shouldShowToolbar prop is false', () => {
      const props = {
        ...defaultProps,
        shouldShowToolbar: false
      };
      const wrapper = shallow(<LegacyTrainerContainer {...props} />);
      const toolbar = wrapper.find('Toolbar');

      test('does not render toolbar', () => {
        expect(toolbar).toHaveLength(0);
      });
    });

    describe('when shouldShowToolbar prop is true', () => {
      describe('when speech is not supported', () => {
        const props = {
          ...defaultProps,
          shouldShowToolbar: true,
          speechEngineName: undefined
        };
        const wrapper = shallow(<LegacyTrainerContainer {...props} />);
        const toolbar = wrapper.find('Toolbar');

        test('does not render toolbar', () => {
          expect(toolbar).toHaveLength(0);
        });
      });

      describe('when current trainer is not speak interaction', () => {
        const props = {
          ...defaultProps,
          shouldShowToolbar: true
        };
        const wrapper = shallow(<LegacyTrainerContainer {...props} />);
        const toolbar = wrapper.find('Toolbar');

        test('does not render toolbar', () => {
          expect(toolbar).toHaveLength(0);
        });
      });

      describe('when web speech supported', () => {
        describe('when current trainer is speak interaction', () => {
          const speakProps = {
            ...defaultProps,
            shouldShowToolbar: true,
            speechEngineName: 'WebAPISpeechRecognition',
            trainer: { name: 'LegacyTrainer', interaction: 'speak' }
          };

          describe('when trainer is in progress', () => {
            const props = {
              ...speakProps,
              trainerProgress: 0.5
            };

            test('renders toolbar', () => {
              const wrapper = shallow(<LegacyTrainerContainer {...props} />);
              const toolbar = wrapper.find('InteractionToggleToolbar');

              expect(toolbar).toHaveLength(1);
            });
          });

          describe('when all trainer items are completed', () => {
            const props = {
              ...speakProps,
              trainerProgress: 1
            };
            const wrapper = shallow(<LegacyTrainerContainer {...props} />);
            const toolbar = wrapper.find('InteractionToggleToolbar');

            test('does not renders toolbar', () => {
              expect(toolbar).toHaveLength(0);
            });
          });
        });
      });
    });
  });
});
