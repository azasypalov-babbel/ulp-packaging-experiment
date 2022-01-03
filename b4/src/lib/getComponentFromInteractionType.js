import Fillin from '../components/Interactions/Fillin/FillinInteraction';
import Puzzlehelper from '../components/Interactions/Puzzlehelper/PuzzlehelperInteraction';
import Wordorder from '../components/Interactions/Wordorder/WordorderInteraction';
import ChoiceButtons from '../components/Interactions/Choicebuttons/ChoicebuttonsInteraction';
import Speak from '../components/Interactions/Speak/SpeakInteraction';

const interactionMap = {
  speak: Speak,
  fillin: Fillin,
  puzzlehelper: Puzzlehelper,
  wordorder: Wordorder,
  choose: ChoiceButtons
};

const getComponentFromInteractionType = (interactionType) => interactionMap[interactionType];

export default getComponentFromInteractionType;

