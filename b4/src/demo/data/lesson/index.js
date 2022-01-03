import * as mostImportantTrainers from './most-important-trainers.json';
import * as cardChoicebuttons from './card-choicebuttons.json';
import * as cardFillin from './card-fillin.json';
import * as cardPuzzlehelper from './card-puzzlehelper.json';
import * as cardFillinPurgeEdgeCases from './card-fillin-purge-edge-cases.json';
import * as cardPuzzlehelperPurgeEdgeCases from './card-puzzlehelper-purge-edge-cases.json';
import * as cardChoicebuttonsPurgeEdgeCases from './card-choicebuttons-purge-edge-cases.json';
import * as compositeOne from './composite-lesson-one.json';
import * as comprehensionAudio from './comprehension-audio.json';
import * as comprehensionText from './comprehension-text.json';
import * as dialogDictatefillin from './dialog-dictatefillin.json';
import * as dialogChoicebuttons from './dialog-choicebuttons.json';
import * as dialogDictatechoice from './dialog-dictatechoice.json';
import * as dialogChoicebuttonsShort from './dialog-choicebuttons-short.json';
import * as dialogSpeak from './dialog-speak.json';
import * as dialogFillin from './dialog-fillin.json';
import * as dialogFillinShort from './dialog-fillin-short.json';
import * as dialogPuzzlehelper from './dialog-puzzlehelper.json';
import * as dialogFillinPurgeEdgeCases from './dialog-fillin-purge-edge-cases.json';
import * as dialogPuzzlehelperPurgeEdgeCases from './dialog-puzzlehelper-purge-edge-cases.json';
import * as dialogChoicebuttonsPurgeEdgeCases from './dialog-choicebuttons-purge-edge-cases.json';
import * as dictateChoicebuttons from './dictate-choicebuttons.json';
import * as dictateWordorder from './dictate-wordorder.json';
import * as dictateFillin from './dictate-fillin.json';
import * as dictatePuzzlehelper from './dictate-puzzlehelper.json';
import * as keyboard from './keyboard.json';
import * as matching from './matching.json';
import * as longMatching from './long-matching.json';
import * as vocabularyChoicebuttons from './vocabulary-choicebuttons.json';
import * as vocabularyClick from './vocabulary-click.json';
import * as vocabularySpeak from './vocabulary-speak.json';
import * as vocabularyPuzzlehelper from './vocabulary-puzzlehelper.json';
import * as vocabularyFillin from './vocabulary-fillin.json';
import * as vocabularyWordorder from './vocabulary-wordorder.json';
import * as publishedTrainers from './published-trainers.json';
import * as choicebuttonsEdgeCases from './choicebuttons-edge-cases.json';
import * as choicebuttonsOneItem from './choicebuttons-one-item.json';
import * as fillinOneItem from './fillin-one-item.json';
import * as puzzlehelperOneItem from './puzzlehelper-one-item.json';
import * as wordorderOneItem from './wordorder-one-item.json';
import * as wholeLessonWithWrongSounds from './whole-lesson-with-wrong-sounds.json';

export default {
  // ------------------------ CARD --------------------------- //
  'card-choicebuttons': cardChoicebuttons,
  'card-fillin': cardFillin,
  'card-puzzlehelper': cardPuzzlehelper,
  'card-fillin-purge-edge-cases': cardFillinPurgeEdgeCases,
  'card-puzzlehelper-purge-edge-cases': cardPuzzlehelperPurgeEdgeCases,
  'card-choicebuttons-purge-edge-cases': cardChoicebuttonsPurgeEdgeCases,
  // -------------------- COMPREHENSION ---------------------- //
  'comprehension-audio': comprehensionAudio,
  'comprehension-text': comprehensionText,
  // ------------------------ DIALOG ------------------------- //
  'dialog-choicebuttons': dialogChoicebuttons,
  'dialog-choicebuttons-short': dialogChoicebuttonsShort,
  'dialog-dictatechoice': dialogDictatechoice,
  'dialog-speak': dialogSpeak,
  'dialog-dictatefillin': dialogDictatefillin,
  'dialog-puzzlehelper': dialogPuzzlehelper,
  'dialog-fillin': dialogFillin,
  'dialog-fillin-short': dialogFillinShort,
  'dialog-fillin-purge-edge-cases': dialogFillinPurgeEdgeCases,
  'dialog-puzzlehelper-purge-edge-cases': dialogPuzzlehelperPurgeEdgeCases,
  'dialog-choicebuttons-purge-edge-cases': dialogChoicebuttonsPurgeEdgeCases,
  // ----------------------- DICTATE ------------------------- //
  'dictate-choicebuttons': dictateChoicebuttons,
  'dictate-wordorder': dictateWordorder,
  'dictate-fillin': dictateFillin,
  'dictate-puzzlehelper': dictatePuzzlehelper,
  // ---------------------- VOCABULARY ----------------------- //
  'vocabulary-choicebuttons': vocabularyChoicebuttons,
  'vocabulary-click': vocabularyClick,
  'vocabulary-speak': vocabularySpeak,
  'vocabulary-puzzlehelper': vocabularyPuzzlehelper,
  'vocabulary-fillin': vocabularyFillin,
  'vocabulary-wordorder': vocabularyWordorder,
  // ----------------------- OTHERS ------------------------- //
  keyboard: keyboard,
  matching: matching,
  'long-matching': longMatching,
  'composite-one': compositeOne,
  'most-important-trainers': mostImportantTrainers,
  'published-trainers': publishedTrainers,
  // -------------------- INTERACTIONS ---------------------- //
  'choicebuttons-one-item': choicebuttonsOneItem,
  'choicebuttons-edge-cases': choicebuttonsEdgeCases,
  'fillin-one-item': fillinOneItem,
  'puzzlehelper-one-item': puzzlehelperOneItem,
  'wordorder-one-item': wordorderOneItem,
  // ------------------ INVALID SOUND ID ------------------- //
  'whole-lesson-with-wrong-sounds': wholeLessonWithWrongSounds
};
