import { pick, isMatch } from 'underscore';

export default function interactionForTrainerWithRules(trainerData, rules) {
  const ruleKeys = Object.keys(rules[0]);
  const trainerKeys = pick(trainerData, ...ruleKeys);
  const matchesTheRule = (rule) => {
    return isMatch(rule, trainerKeys);
  };

  const matchIndex = rules.findIndex(matchesTheRule);
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.substring(1);
  return matchIndex < 0 ?
    capitalize(trainerData.interaction) :
    rules[matchIndex].parsedInteraction;
}
