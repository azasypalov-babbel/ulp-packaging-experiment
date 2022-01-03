import React from 'react';

export function getModifier(prefix, grade) {
  const modifiers = {
    high: `${prefix}--high`,
    medium: `${prefix}--medium`,
    low: `${prefix}--low`
  };

  return modifiers[grade];
}

export function getMessage({ displayName, feedbackMessageText }) {
  const splitMessage = feedbackMessageText.split('%{display_name}');

  // Sometimes the translated message might not contain a displayName interpolation,
  // if this is the case just return the message
  if (splitMessage.length < 2) {
    return splitMessage.join('');
  }

  // Design needs to have a line break between parts of the message
  // therefor we had to return an array of components
  return [
    <span key={1}>{splitMessage[0]}</span>,
    <br key={2} />,
    <span key={3}>{displayName}{splitMessage[1]}</span>
  ];
}
