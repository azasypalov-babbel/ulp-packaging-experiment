import permissionsService from '../../../src/services/permissions/service';

describe('permissions service', () => {
  describe('initialisation', () => {
    describe('when Permissions API is supported', () => {
      const permissionStatusMock = {
        state: 'prompt',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      };
      let triggerMicPermissionsChange;

      beforeEach(() => {
        global.navigator.permissions = {
          query: jest.fn(() => Promise.resolve(permissionStatusMock))
        };
        permissionStatusMock.addEventListener.mockImplementation((event, cb) => {
          triggerMicPermissionsChange = cb;
        });
      });

      afterEach(() => {
        triggerMicPermissionsChange = undefined;
      });

      it('should resolve with initial mic permission status', () => {
        expect.assertions(1);
        return expect(permissionsService.init()).resolves.toEqual(
          expect.objectContaining({ status: 'prompt' })
        );
      });

      test('sould resolve with change subscription register', () => {
        expect.assertions(1);
        const changeHandlerMock = jest.fn();
        return permissionsService.init().then(({ subscribe }) => {
          subscribe(changeHandlerMock);
          triggerMicPermissionsChange({ target: { state: 'granted' } });
          expect(changeHandlerMock).toHaveBeenCalledWith('granted');
        });
      });
    });
    describe('when Navigator Permissions API is not supported', () => {
      beforeEach(() => {
        global.navigator.permissions = undefined;
      });

      it('should resolve without error', () => {
        expect.assertions(1);
        return expect(permissionsService.init()).resolves.toEqual(undefined);
      });
    });
    describe('when Mic Permissions API is not supported', () => {
      const errorMock = new Error('Mock Error: not supported');

      beforeEach(() => {
        global.navigator.permissions = {
          query: jest.fn(() => Promise.reject(errorMock))
        };
      });

      it('should resolve without error', () => {
        expect.assertions(1);
        return expect(permissionsService.init()).resolves.toEqual(undefined);
      });
    });
  });

  describe('prompting for mic permisions', () => {
    const mockMediaRecorderTrack = {
      stop: jest.fn()
    };

    const getUserMediaSuccess = () => Promise.resolve({ getTracks: jest.fn(() => [mockMediaRecorderTrack]) });

    Object.defineProperty(global.navigator, 'mediaDevices', {
      value: {
        getUserMedia: jest.fn(getUserMediaSuccess)
      }
    });

    it('should prompt the user for permissions', () => {
      expect.assertions(1);
      return permissionsService.prompt().then(() => {
        expect(global.navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
      });
    });

    it('should cleanup media streams', () => {
      expect.assertions(1);
      return permissionsService.prompt().then(() => {
        expect(mockMediaRecorderTrack.stop).toHaveBeenCalled();
      });
    });

    describe('when user clicks accept on dialogue', () => {
      it('resolves with granted permissions', () => {
        expect.assertions(1);
        return expect(permissionsService.prompt()).resolves.toEqual('granted');
      });
    });

    describe('when user clicks block on dialogue', () => {
      it('resolves with denied permissions', () => {
        global.navigator.mediaDevices.getUserMedia.mockImplementationOnce(() => {
          const error = new DOMException('Permission denied', 'NotAllowedError');
          return Promise.reject(error);
        });
        expect.assertions(1);
        return expect(permissionsService.prompt()).resolves.toEqual('denied');
      });
    });

    describe('when user dismisses dialogue', () => {
      it('resolves with dismissed permissions', () => {
        global.navigator.mediaDevices.getUserMedia.mockImplementationOnce(() => {
          const error = new DOMException('Permission dismissed', 'NotAllowedError');
          return Promise.reject(error);
        });
        expect.assertions(1);
        return expect(permissionsService.prompt()).resolves.toEqual('dismissed');
      });
    });
  });
});
