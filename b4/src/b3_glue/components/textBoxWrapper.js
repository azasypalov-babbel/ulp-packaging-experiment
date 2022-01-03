/* global b3 */
/* global jQuery */

import components from '../../components';
import { log } from '../../lib/logging';

export const isMobileTextBoxSupported = (item) =>
  ['fillin', 'puzzlehelper', 'dictatefillin'].includes(item.interaction.toLowerCase());

export const createTextBoxWrapper = (info) => {
  var el = document.createElement('div');
  var menuEl = document.createElement('div');

  let itemMistakes = 0;

  const onAttempt = ({ attempt }) => {
    const { text, solved, number } = attempt;

    // only solved if solved in first attempt
    const actuallySolved = solved && number === 1;

    // this is for b3… counting attempts: b3 trainers use 0 for solved
    const actualAttemptNumber = actuallySolved ? number - 1 : number;

    // notify listeners for each attempt
    b3.topic('gap.attempted').publish({
      solved: actuallySolved,
      attemptNumber: actualAttemptNumber,
      attemptedText: text,
      targetText: info.text
    });

    // keep track of mistakes on whole item
    // see exposed mistakes() function below
    if (!actuallySolved) {
      itemMistakes += 1;
    }
  };

  const onProceed = () => {
    // Using timeout in order to mitigate conflicting Key listeners for Enter
    // 1) implicit Enter shortcut for focussed Proceed button from TextBox
    // 2) next element of the trainer (info text)
    window.setTimeout(info.onComplete, 100);
  };

  log('TEXTBOX INITIAL', info.text);
  components.mount('TextBox', {
    active: false,
    text: info.text,
    interaction: info.interaction,
    onAttempt: () => {}, // not used when inactive
    onProceed: () => {} // not used when inactive
  }, el);

  return {
    el: jQuery(el),
    menuEl: jQuery(menuEl),
    start: () => {
      log('TEXTBOX START');

      /*
       * Cancel any jQuery scrolling animation for fillin
       * Safari will take care of scrolling the input into view
       */
      if (info.interaction === 'Fillin') {
        jQuery('html, body').stop(true, false);
      }

      components.mount('TextBox', {
        active: true,
        text: info.text,
        interaction: info.interaction,
        onAttempt: onAttempt,
        onProceed: onProceed
      }, el);
    },
    cleanup: () => {
      components.unmount(el);
    },
    mistakes: () => {
      // total mistakes on the item
      return itemMistakes;
    }
  };
};
