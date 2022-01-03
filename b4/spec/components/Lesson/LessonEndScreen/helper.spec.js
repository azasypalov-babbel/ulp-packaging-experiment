import { getMessage } from '../../../../src/components/Lesson/LessonEndScreen/helper';

describe('LessonEndScreen components helper', () => {
  describe('#getMessage', () => {
    describe('when translation includes a displayName interpolation', () => {
      test('it adds a new line before displayName', () => {
        const message = getMessage({
          displayName: 'John',
          feedbackMessageText: 'Fantastique, %{display_name} !'
        });

        expect(message).toMatchSnapshot();
      });
    });

    describe('without displayName interpolation', () => {
      test('it returns the message as is', () => {
        const message = getMessage({
          displayName: 'John',
          feedbackMessageText: 'Encore un petit effort !'
        });

        expect(message).toEqual('Encore un petit effort !');
      });
    });
  });
});
