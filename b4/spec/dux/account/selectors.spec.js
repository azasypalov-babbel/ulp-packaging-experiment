import {
  isBabbelUser,
  displayName,
  email
} from '../../../src/dux/account/selectors';

describe('account selectors', () => {
  const state = {
    data: {
      uuid: '123-foo-bar',
      email: 'foo@bar.com',
      displayname: 'Foo Bar'
    }
  };

  describe('displayName', () => {
    test('returns user display name', () => {
      expect(
        displayName(state)
      ).toEqual('Foo Bar');
    });
  });

  describe('email', () => {
    test('returns user email', () => {
      expect(
        email(state)
      ).toEqual('foo@bar.com');
    });
  });

  describe('#isBabbelUser', () => {
    describe('when user has a babbel.com email address', () => {
      const mockedState = {
        data: {
          email: 'banana@babbel.com'
        }
      };

      it('isBabbelUser() should return true', () => {
        const received = isBabbelUser(mockedState);
        expect(received).toBeTruthy();
      });
    });

    describe('when user has any other email address', () => {
      const mockedState = {
        data: {
          email: 'banana@bananaland.com'
        }
      };

      it('isBabbelUser() should return false', () => {
        const received = isBabbelUser(mockedState);
        expect(received).toBeFalsy();
      });
    });
  });
});
